// supabase/functions/create-mercadopago-preference/index.ts
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const MP_ACCESS_TOKEN = Deno.env.get("MP_ACCESS_TOKEN")!;
const APP_BASE_URL = Deno.env.get("APP_BASE_URL")!;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
  });
}

Deno.serve(async (req) => {
  try {
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: CORS_HEADERS });
    }

    if (req.method !== "POST") {
      return json({ error: "Method not allowed" }, 405);
    }

    const body = await req.json();

    const {
      cartItems,
      shipmentInfo,
      subtotal,
      costoEnvio = 0,
      total,
      customer,
      paymentMethod,
    } = body;

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return json({ error: "cartItems es obligatorio" }, 400);
    }

    const items = cartItems.map((item) => ({
      id: String(item.id),
      title: item.name,
      quantity: Number(item.quantity),
      unit_price: Number(item.price),
      currency_id: "ARS",
    }));

    if (costoEnvio > 0) {
      items.push({
        id: "shipping",
        title: "Costo de envío",
        quantity: 1,
        unit_price: Number(costoEnvio),
        currency_id: "ARS",
      });
    }

    // Idealmente esto debería ser el ID real de una orden guardada en tu DB
    const externalReference = crypto.randomUUID();

    const preferencePayload = {
      items,
      payer: customer?.email
        ? {
            email: customer.email,
            name: customer.name ?? undefined,
            surname: customer.surname ?? undefined,
          }
        : undefined,
      external_reference: externalReference,
      statement_descriptor: "PALO GLOW",
      back_urls: {
        success: `${APP_BASE_URL}/checkout/success`,
        failure: `${APP_BASE_URL}/checkout/failure`,
        pending: `${APP_BASE_URL}/checkout/pending`,
      },
      auto_return: "approved",
      notification_url: `${APP_BASE_URL}/api/mercadopago/webhook`,
      metadata: {
        paymentMethod,
        shipmentInfo,
        subtotal,
        costoEnvio,
        total,
      },
    };

    const mpRes = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${MP_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(preferencePayload),
    });

    const mpData = await mpRes.json();

    if (!mpRes.ok) {
      return json(
        { error: "Error creando preferencia en Mercado Pago", detail: mpData },
        mpRes.status
      );
    }

    return json({
      id: mpData.id,
      init_point: mpData.init_point,
      sandbox_init_point: mpData.sandbox_init_point,
      external_reference: externalReference,
    });
  } catch (error) {
    return json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      500
    );
  }
});