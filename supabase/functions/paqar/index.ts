/**
 * Supabase Edge Function: paqar
 *
 * Proxy seguro entre el front-end y la API de Correo Argentino PaqAr v1.
 * Las credenciales NUNCA se exponen al navegador.
 *
 * Variables de entorno requeridas (configurar en Supabase Dashboard > Edge Functions > Secrets):
 *   PAQAR_CLIENT_ID      → client_id otorgado por Correo Argentino
 *   PAQAR_CLIENT_SECRET  → client_secret otorgado por Correo Argentino
 *   PAQAR_BASE_URL       → https://api.correoargentino.com.ar/paqar/v1
 *                          (o https://apitest.correoargentino.com.ar/paqar/v1 para test)
 *
 * Endpoints expuestos:
 *   POST /paqar?action=quote      → cotizar envío
 *   POST /paqar?action=create     → crear envío (genera número de seguimiento)
 *   GET  /paqar?action=label&id=X → obtener etiqueta PDF
 *   GET  /paqar?action=track&id=X → consultar estado del envío
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ─── Token cache (en memoria, vive por el tiempo de la instancia) ─────────────
let cachedToken: string | null = null
let tokenExpiry = 0

async function getToken(baseUrl: string, clientId: string, clientSecret: string): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken

  const res = await fetch(`${baseUrl}/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    }),
  })

  if (!res.ok) {
    const txt = await res.text()
    throw new Error(`PaqAr auth error ${res.status}: ${txt}`)
  }

  const json = await res.json()
  cachedToken = json.access_token as string
  // Renovar 60 s antes de expirar
  tokenExpiry = Date.now() + (json.expires_in ?? 3600) * 1000 - 60_000
  return cachedToken!
}

// ─── Handler ──────────────────────────────────────────────────────────────────
serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

  const url = new URL(req.url)
  const action = url.searchParams.get('action')

  const CLIENT_ID = Deno.env.get('PAQAR_CLIENT_ID')
  const CLIENT_SECRET = Deno.env.get('PAQAR_CLIENT_SECRET')
  const BASE_URL = Deno.env.get('PAQAR_BASE_URL') ?? 'https://apitest.correoargentino.com.ar/paqar/v1'

  if (!CLIENT_ID || !CLIENT_SECRET) {
    return json({ error: 'Credenciales PaqAr no configuradas' }, 500)
  }

  try {
    const token = await getToken(BASE_URL, CLIENT_ID, CLIENT_SECRET)
    const authHeader = { Authorization: `Bearer ${token}` }

    // ── QUOTE ────────────────────────────────────────────────────────────────
    if (action === 'quote') {
      const body = await req.json()
      const res = await fetch(`${BASE_URL}/modules/quote`, {
        method: 'POST',
        headers: { ...authHeader, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      return respondFrom(res)
    }

    // ── CREATE SHIPMENT ──────────────────────────────────────────────────────
    if (action === 'create') {
      const body = await req.json()
      const res = await fetch(`${BASE_URL}/shipments`, {
        method: 'POST',
        headers: { ...authHeader, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      return respondFrom(res)
    }

    // ── LABEL (PDF) ──────────────────────────────────────────────────────────
    if (action === 'label') {
      const id = url.searchParams.get('id')
      if (!id) return json({ error: 'Falta id' }, 400)
      const res = await fetch(`${BASE_URL}/shipments/${id}/label`, {
        headers: authHeader,
      })
      // Devolver el PDF tal como viene
      const buf = await res.arrayBuffer()
      return new Response(buf, {
        headers: {
          ...CORS,
          'Content-Type': 'application/pdf',
          'Content-Disposition': `inline; filename="etiqueta-${id}.pdf"`,
        },
        status: res.status,
      })
    }

    // ── TRACKING ─────────────────────────────────────────────────────────────
    if (action === 'track') {
      const id = url.searchParams.get('id')
      if (!id) return json({ error: 'Falta id' }, 400)
      const res = await fetch(`${BASE_URL}/shipments/${id}/tracking`, {
        headers: authHeader,
      })
      return respondFrom(res)
    }

    return json({ error: `Acción desconocida: ${action}` }, 400)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    return json({ error: msg }, 500)
  }
})

// ─── Helpers ─────────────────────────────────────────────────────────────────
async function respondFrom(res: Response): Promise<Response> {
  const body = await res.text()
  return new Response(body, {
    status: res.status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  })
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  })
}
