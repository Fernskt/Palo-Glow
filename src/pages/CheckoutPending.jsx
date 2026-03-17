import React from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { Clock, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CheckoutPending() {
  const [params] = useSearchParams()

  const paymentId = params.get('payment_id')
  const externalRef = params.get('external_reference')

  return (
    <>
      <Helmet>
        <title>Pago pendiente | Palo Glow</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="bg-white rounded-2xl shadow-sm p-10 max-w-md w-full text-center space-y-6">
          <div className="flex justify-center">
            <Clock className="w-16 h-16 text-amber-500" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pago pendiente</h1>
            <p className="text-gray-500 mt-2">
              Tu pago está siendo procesado. Te notificaremos cuando se confirme y coordinaremos el envío.
            </p>
          </div>

          {(paymentId || externalRef) && (
            <div className="rounded-xl bg-amber-50 p-4 text-sm text-gray-600 space-y-1 text-left">
              {paymentId && (
                <p>
                  <span className="font-medium text-gray-800">ID de pago:</span>{' '}
                  <span className="font-mono">{paymentId}</span>
                </p>
              )}
              {externalRef && (
                <p>
                  <span className="font-medium text-gray-800">Referencia:</span>{' '}
                  <span className="font-mono">{externalRef}</span>
                </p>
              )}
            </div>
          )}

          <p className="text-xs text-gray-400">
            Guardá estos datos por si necesitás consultar el estado del pago.
          </p>

          <div className="flex flex-col gap-3">
            <Link to="/shop">
              <Button className="w-full honey-gradient text-white border-0 hover:opacity-90">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Seguir comprando
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" className="w-full">
                Volver al inicio
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
