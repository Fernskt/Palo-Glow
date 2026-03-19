import React, { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { CreditCard, Banknote, Building2, Smartphone, CheckCircle, ShoppingBag, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { buildCartMessage, buildWhatsAppUrl, formatARS } from '@/lib/whatsapp'
import { decrementStock } from '@/services/products'
import { createMercadoPagoPreference } from '@/services/payments'

const PAYMENT_METHODS = [
  {
    id: 'card',
    icon: <CreditCard className="w-5 h-5 text-amber-600" />,
    label: 'Tarjeta de crédito o débito',
    sublabel: 'Hasta 3 cuotas sin interés',
  },
  {
    id: 'cash',
    icon: <Banknote className="w-5 h-5 text-amber-600" />,
    label: 'Efectivo',
    sublabel: null,
  },
  {
    id: 'transfer',
    icon: <Building2 className="w-5 h-5 text-amber-600" />,
    label: 'Transferencia o depósito bancario',
    sublabelDynamic: true, // se calcula con el total
  },
  {
    id: 'mercadopago',
    icon: <Smartphone className="w-5 h-5 text-amber-600" />,
    label: 'Mercado Pago',
    sublabel: null,
  },
]

export function CheckoutPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state

  // Si llegaron sin estado (acceso directo), redirigir al carrito
  if (!state?.cartItems?.length) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <p className="text-gray-600">No hay información de compra.</p>
        <Link to="/cart"><Button>Volver al carrito</Button></Link>
      </div>
    )
  }

  const { cartItems, subtotal, costoEnvio = 0, total, shipmentInfo, tax = 0 } = state

  const [selectedPayment, setSelectedPayment] = useState('card')
  const [loading, setLoading] = useState(false)
  const [payError, setPayError] = useState(null)

  const destinatario = shipmentInfo?.destinatario ?? null
  const trackingCode = shipmentInfo?.codigoSeguimiento ?? shipmentInfo?.numeroEnvio ?? null

  const handlePay = async () => {
    setLoading(true)
    setPayError(null)

    try {
      await decrementStock(cartItems.map(i => ({ id: i.id, quantity: i.quantity })))
    } catch (err) {
      console.error('Stock update error:', err)
    }

    if (selectedPayment === 'mercadopago') {
      try {
        const preference = await createMercadoPagoPreference({
          cartItems,
          shipmentInfo,
          subtotal,
          costoEnvio,
          total,
          customer: {
            email: destinatario?.email ?? undefined,
            name: destinatario?.nombre ?? undefined,
            surname: destinatario?.apellido ?? undefined,
          },
          paymentMethod: 'mercadopago',
        })
        window.location.href = preference.init_point
      } catch (err) {
        console.error('MercadoPago error:', err)
        setPayError('No se pudo iniciar el pago con Mercado Pago. Intentá de nuevo.')
        setLoading(false)
      }
      return
    }

    const items = cartItems.map(ci => ({ name: ci.name, quantity: ci.quantity, price: ci.price }))
    const text = buildCartMessage({
      items,
      subtotal,
      shipping: costoEnvio,
      tax,
      total,
      shipmentInfo,
      paymentMethod: PAYMENT_METHODS.find(m => m.id === selectedPayment)?.label,
    })
    window.open(buildWhatsAppUrl(text), '_blank')
    setLoading(false)
  }

  const getThumb = (it) => it.image || it.images?.[0] || null

  return (
    <>
      <Helmet>
        <title>Checkout | Palo Glow</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-10">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid lg:grid-cols-3 gap-8">

            {/* ── Columna izquierda ─────────────────────────────────── */}
            <div className="lg:col-span-2 space-y-6">

              {/* Globo de agradecimiento */}
              <div className="relative bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center shadow-sm">
                <CheckCircle className="mx-auto w-10 h-10 text-amber-500 mb-3" />
                <p className="text-lg font-semibold text-amber-900">
                  ¡Gracias por su compra en Palo Glow!
                </p>
                <p className="text-sm text-amber-700 mt-1">
                  Entregaremos tu pedido lo antes posible.
                </p>
                {/* Triángulo decorativo */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0
                  border-l-[12px] border-l-transparent
                  border-r-[12px] border-r-transparent
                  border-t-[12px] border-t-amber-200" />
              </div>

              {/* Info de contacto y entrega */}
              <div className="bg-white rounded-2xl shadow-sm divide-y">
                {destinatario && (
                  <>
                    <div className="p-5">
                      <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">Correo electrónico</p>
                      <p className="text-sm font-medium text-gray-800">{destinatario.email}</p>
                    </div>
                    <div className="p-5">
                      <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">Domicilio de entrega</p>
                      <p className="text-sm font-medium text-gray-800">
                        {destinatario.calle} {destinatario.numero}
                        {destinatario.piso ? `, ${destinatario.piso}` : ''} —{' '}
                        {destinatario.localidad}, CP {destinatario.codigoPostal}
                      </p>
                      <p className="text-sm text-gray-500">
                        {destinatario.nombre} {destinatario.apellido}
                      </p>
                    </div>
                  </>
                )}
                <div className="p-5">
                  <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">Medio de envío</p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-800">
                      Correo Argentino{shipmentInfo?.modalidad ? ` · ${shipmentInfo.modalidad}` : ''}
                      {trackingCode && (
                        <span className="ml-2 font-mono text-xs text-gray-500">#{trackingCode}</span>
                      )}
                    </p>
                    <p className="text-sm font-semibold text-gray-900">{formatARS(costoEnvio)}</p>
                  </div>
                </div>
              </div>

              {/* Métodos de pago */}
              <div className="bg-white rounded-2xl shadow-sm p-5">
                <h3 className="font-semibold text-gray-900 mb-4">Medio de pago</h3>
                <div className="space-y-3">
                  {PAYMENT_METHODS.map((m) => (
                    <label
                      key={m.id}
                      className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${
                        selectedPayment === m.id
                          ? 'border-amber-400 bg-amber-50'
                          : 'border-gray-200 hover:border-amber-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={m.id}
                        checked={selectedPayment === m.id}
                        onChange={() => setSelectedPayment(m.id)}
                        className="accent-amber-500"
                      />
                      <span className="flex-shrink-0">{m.icon}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{m.label}</p>
                        {m.sublabel && (
                          <p className="text-xs text-gray-500">{m.sublabel}</p>
                        )}
                        {m.sublabelDynamic && (
                          <p className="text-xs text-gray-500">Pagás {formatARS(total)}</p>
                        )}
                      </div>
                    </label>
                  ))}
                </div>

                <Button
                  onClick={handlePay}
                  disabled={loading}
                  className="w-full honey-gradient text-white border-0 hover:opacity-90 text-base py-6 mt-6 rounded-xl"
                >
                  {loading
                    ? 'Procesando…'
                    : selectedPayment === 'mercadopago'
                      ? 'Pagar con Mercado Pago'
                      : 'Realizar el pago'}
                </Button>

                {payError && (
                  <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    <AlertCircle className="mt-0.5 w-4 h-4 flex-shrink-0" />
                    <span>{payError}</span>
                  </div>
                )}
              </div>
            </div>

            {/* ── Columna derecha: resumen ──────────────────────────── */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm p-5 sticky top-8">
                <h3 className="font-semibold text-gray-900 mb-4">Tu compra</h3>

                <div className="space-y-4 mb-5">
                  {cartItems.map((item) => {
                    const thumb = getThumb(item)
                    return (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 relative">
                          {thumb
                            ? <img src={thumb} alt={item.name} className="w-full h-full object-cover" />
                            : <ShoppingBag className="m-auto w-6 h-6 text-gray-300 mt-4" />}
                          <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                          <p className="text-xs text-gray-500">{item.category}</p>
                        </div>
                        <p className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                          {formatARS(item.price * item.quantity)}
                        </p>
                      </div>
                    )
                  })}
                </div>

                <div className="border-t space-y-2 pt-4 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatARS(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Costo de envío</span>
                    <span>{costoEnvio > 0 ? formatARS(costoEnvio) : <span className="text-amber-600">A consultar</span>}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-gray-900 text-base border-t pt-3 mt-2">
                    <span>Total</span>
                    <span>{formatARS(total)}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}
