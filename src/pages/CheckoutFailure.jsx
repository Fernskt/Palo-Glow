import React from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { XCircle, RotateCcw, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CheckoutFailure() {
  const navigate = useNavigate()
  const [params] = useSearchParams()

  const externalRef = params.get('external_reference')

  return (
    <>
      <Helmet>
        <title>Pago fallido | Palo Glow</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="bg-white rounded-2xl shadow-sm p-10 max-w-md w-full text-center space-y-6">
          <div className="flex justify-center">
            <XCircle className="w-16 h-16 text-red-500" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pago no procesado</h1>
            <p className="text-gray-500 mt-2">
              No pudimos completar tu pago. Podés intentarlo de nuevo o elegir otro medio de pago.
            </p>
          </div>

          {externalRef && (
            <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-600 text-left">
              <p>
                <span className="font-medium text-gray-800">Referencia:</span>{' '}
                <span className="font-mono">{externalRef}</span>
              </p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Button
              onClick={() => navigate(-1)}
              className="w-full honey-gradient text-white border-0 hover:opacity-90"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Intentar de nuevo
            </Button>
            <Link to="/cart">
              <Button variant="outline" className="w-full">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Volver al carrito
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
