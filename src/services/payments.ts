// src/services/payments.ts
import { supabase } from '@/lib/supabaseClient'

export async function createMercadoPagoPreference(payload) {
  const { data, error } = await supabase.functions.invoke('create-mercadopago-preference', {
    body: payload,
  })

  if (error) {
    throw new Error(error.message || 'No se pudo crear la preferencia de pago')
  }

  return data
}