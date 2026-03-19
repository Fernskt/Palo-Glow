/**
 * Servicio frontend para la API de Correo Argentino PaqAr
 * Llama a la Supabase Edge Function "paqar" que actúa de proxy.
 */
import { supabase } from '@/lib/supabaseClient'

const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/paqar`

async function authHeaders() {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token
    ? { Authorization: `Bearer ${session.access_token}` }
    : {}
}

async function callEdge(params, options = {}) {
  const url = new URL(FUNCTION_URL)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  const headers = await authHeaders()
  const res = await fetch(url.toString(), { ...options, headers: { ...headers, ...(options.headers ?? {}) } })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error ?? `Error ${res.status}`)
  return data
}

/**
 * Cotiza el costo de envío antes de confirmar.
 *
 * @param {object} params
 * @param {string} params.codigoPostalOrigen   - CP del remitente (tu tienda)
 * @param {string} params.codigoPostalDestino  - CP del cliente
 * @param {number} params.pesoKg               - Peso del paquete en kg
 * @param {number} params.altoCm
 * @param {number} params.anchoCm
 * @param {number} params.largoCm
 * @param {string} [params.modalidad]          - "ESTANDAR" | "EXPRES" (default: ESTANDAR)
 */
export async function quotarEnvio({ codigoPostalOrigen, codigoPostalDestino, pesoKg, altoCm, anchoCm, largoCm, modalidad = 'ESTANDAR' }) {
  return callEdge({ action: 'quote' }, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      codigoPostal: { origen: codigoPostalOrigen, destino: codigoPostalDestino },
      bultos: [{ peso: pesoKg, alto: altoCm, ancho: anchoCm, largo: largoCm }],
      modalidad,
    }),
  })
}

/**
 * Crea el envío en el sistema de Correo Argentino.
 * Devuelve { numeroEnvio, codigoSeguimiento, etiquetaUrl? }
 *
 * @param {object} params
 * @param {object} params.remitente           - Datos de la tienda (origen)
 * @param {object} params.destinatario        - Datos del cliente
 * @param {object[]} params.bultos            - Array de bultos
 * @param {string} [params.modalidad]
 */
export async function crearEnvio({ remitente, destinatario, bultos, modalidad = 'ESTANDAR' }) {
  return callEdge({ action: 'create' }, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ remitente, destinatario, bultos, modalidad }),
  })
}

/**
 * Obtiene la URL de la etiqueta PDF para imprimir.
 * @param {string} numeroEnvio
 */
export function getLabelUrl(numeroEnvio) {
  return `${FUNCTION_URL}?action=label&id=${numeroEnvio}`
}

/**
 * Consulta el estado de un envío.
 * @param {string} numeroEnvio
 */
export async function trackEnvio(numeroEnvio) {
  return callEdge({ action: 'track', id: numeroEnvio })
}
