import React, { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { CheckCircle2, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/hooks/useCart'

export function CheckoutSuccess() {
  const [params] = useSearchParams()
  const { clearCart } = useCart()

  const paymentId = params.get('payment_id')
  const status = params.get('status')
  const externalRef = params.get('external_reference')

  useEffect(() => {
    clearCart()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Helmet>
        <title>Pago exitoso | Palo Glow</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="bg-white rounded-2xl shadow-sm p-10 max-w-md w-full text-center space-y-6">
          <div className="flex justify-center">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">¡Pago realizado!</h1>
            <p className="text-gray-500 mt-2">
              Tu pago fue procesado correctamente. Nos pondremos en contacto pronto para confirmar el envío.
            </p>
          </div>

          {paymentId && (
            <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-600 space-y-1 text-left">
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
              {status && (
                <p>
                  <span className="font-medium text-gray-800">Estado:</span>{' '}
                  <span className="capitalize">{status}</span>
                </p>
              )}
            </div>
          )}

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
