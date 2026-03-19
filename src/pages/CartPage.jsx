import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { toast } from '@/components/ui/use-toast';
import { decrementStock } from '@/services/products';
import { ShippingForm } from '@/components/ShippingForm'
import { useNavigate } from 'react-router-dom'


export function CartPage() {

  const navigate = useNavigate()
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartItemsCount
  } = useCart();
  const subtotal = getCartTotal();
  const tax = subtotal * 0;

  const [showShipping, setShowShipping] = useState(false)
  const [shipmentInfo, setShipmentInfo] = useState(null) // datos del envío creado

  const costoEnvio = shipmentInfo?.costoEnvio ?? 0
  const total = subtotal + costoEnvio + tax

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      toast({
        title: "Item removed",
        description: "Product has been removed from your cart."
      });
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId, productName) => {
    removeFromCart(productId);
    toast({
      title: "Producto eliminado",
      description: `${productName} ha sido eliminado de su carrito.`
    });
  };

  const handleClearCart = () => {
    clearCart();
    toast({
      title: "Carrito vaciado",
      description: "Todos los productos fueron eliminados de su carrito."
    });
  };

  const handleCheckout = () => {
    navigate('/checkout', {
      state: {
        cartItems,
        subtotal,
        costoEnvio,
        total,
        tax,
        shipmentInfo,
      }
    })
  }

  const handleShipmentCreated = (result) => {
    setShipmentInfo(result)
    setShowShipping(false)
    toast({ title: '¡Envío generado!', description: `N° seguimiento: ${result.codigoSeguimiento ?? result.numeroEnvio ?? 'OK'}` })
  }

  if (cartItems.length === 0) {
    return <>
      <Helmet>
        <title>Carrito | Palo Glow</title>
        <meta name="description" content="Tu carrito de compras está vacío. Explora nuestra colección de productos premium de miel y cera de abeja para agregar artículos a tu carrito." />
        <meta property="og:title" content="Carrito | Palo Glow - Tu carrito está vacío" />
        <meta property="og:description" content="Tu carrito de compras está vacío. Explora nuestra colección de productos premium de miel y cera de abeja para agregar artículos a tu carrito." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }} className="text-center max-w-md mx-auto px-4">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-12 w-12 text-amber-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Tu carrito está vacío
            </h1>
            <p className="text-gray-600 mb-8">
              Parece que aún no has agregado ningún artículo a tu carrito.
              ¡Comienza a comprar para llenarlo con nuestros increíbles productos!
            </p>
            <Link to="/shop">
              <Button className="honey-gradient text-white border-0 hover:opacity-90 w-full">Comenzar a comprar</Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </>;
  }

  const getThumb = (it) => it.image || it.images?.[0] || 'https://via.placeholder.com/80?text=PG'
  const getOrig = (it) => it.originalPrice ?? it.original_price ?? null

  return <>
    <Helmet>
      <title>Carrito de envíos | Palo Glow</title>
      <meta name="description" content={`Review your cart with ${getCartItemsCount()} items. Premium honey and beeswax products ready for checkout.`} />
      <meta property="og:title" content={`Shopping Cart (${getCartItemsCount()} items) | Golden Hive`} />
      <meta property="og:description" content={`Review your cart with ${getCartItemsCount()} items. Premium honey and beeswax products ready for checkout.`} />
    </Helmet>

    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Carrito
              </h1>
              <p className="text-gray-600 mt-1">
                {getCartItemsCount()} {getCartItemsCount() === 1 ? 'producto' : 'productos'} en tu carrito
              </p>
            </div>
            <Link to="/shop">
              <Button variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-50">
                <ArrowLeft className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Continuar comprando</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Productos en el carrito</h2>
                  <Button variant="ghost" size="sm" onClick={handleClearCart} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                    Limpiar Carrito
                  </Button>
                </div>
              </div>

              <div className="divide-y">
                <AnimatePresence>
                  {cartItems.map(item => <motion.div key={item.id} initial={{
                    opacity: 1,
                    height: 'auto'
                  }} exit={{
                    opacity: 0,
                    height: 0
                  }} transition={{
                    duration: 0.3
                  }} className="p-4 sm:p-6">
                    <div className="flex gap-3 sm:gap-4">
                      {/* Product Image */}
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img className="w-full h-full object-cover" alt={`${item.name} in shopping cart`} src={getThumb(item)} />
                      </div>

                      {/* Product Content */}
                      <div className="flex-1 min-w-0">
                        {/* Name + Remove */}
                        <div className="flex items-start justify-between gap-1">
                          <Link to={`/product/${item.id}`} className="text-sm sm:text-base font-medium text-gray-900 hover:text-amber-600 transition-colors leading-snug">
                            {item.name}
                          </Link>
                          <button onClick={() => handleRemoveItem(item.id, item.name)} className="p-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <p className="text-xs text-gray-500 mt-0.5">{item.weight} · {item.category}</p>

                        {/* Price + Qty + Total */}
                        <div className="flex items-center justify-between mt-3 flex-wrap gap-y-2">
                          {/* Unit price */}
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-semibold text-gray-900">${item.price}</span>
                            {!!getOrig(item) && (
                              <span className="text-xs text-gray-400 line-through">${Number(getOrig(item)).toFixed(2)}</span>
                            )}
                          </div>

                          {/* Qty controls */}
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)} className="p-1.5 hover:bg-gray-100 transition-colors" disabled={item.quantity <= 1}>
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <input type="number" value={item.quantity} onChange={e => handleQuantityChange(item.id, parseInt(e.target.value) || 1)} className="w-10 text-center py-1 border-0 focus:outline-none text-sm quantity-input" min="1" />
                            <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)} className="p-1.5 hover:bg-gray-100 transition-colors">
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          {/* Item total */}
                          <div className="text-sm font-bold text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>)}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.6
            }} className="bg-white rounded-lg shadow-sm p-6 lg:sticky lg:top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Resumen</h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Envío</span>
                  <span className="font-medium">
                    {shipmentInfo
                      ? <span className="text-gray-900">${costoEnvio.toFixed(2)}</span>
                      : <button onClick={() => setShowShipping(true)} className="text-amber-600 underline text-sm">Calcular envío</button>}
                  </span>
                </div>

                {shipmentInfo && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-xs text-green-800">
                    ✓ Envío generado · N° <span className="font-mono">{shipmentInfo.codigoSeguimiento ?? shipmentInfo.numeroEnvio}</span>
                    <button onClick={() => setShowShipping(true)} className="ml-2 underline">ver</button>
                  </div>
                )}

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {!shipmentInfo && (
                  <Button onClick={() => setShowShipping(true)} variant="outline"
                    className="w-full border-amber-300 text-amber-700 hover:bg-amber-50">
                    📦 Generar envío por Correo Argentino
                  </Button>
                )}

                <Button onClick={handleCheckout} className="w-full honey-gradient text-white border-0 hover:opacity-90 text-lg py-3">
                  Iniciar Compra
                </Button>

                <div className="text-center text-sm text-gray-500 mt-4">
                  <div className="flex items-center justify-center gap-2">
                    <span>🔒</span>
                    <span>Seguridad garantizada</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>

    {/* Modal de envío */}
    <AnimatePresence>
      {showShipping && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowShipping(false) }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="font-semibold text-lg">Envío por Correo Argentino</h2>
              <button onClick={() => setShowShipping(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5">
              <ShippingForm
                cartItems={cartItems}
                subtotal={subtotal}
                onShipmentCreated={handleShipmentCreated}
                onSkip={() => setShowShipping(false)}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  </>;
}