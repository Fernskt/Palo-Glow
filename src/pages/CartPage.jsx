import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { toast } from '@/components/ui/use-toast';
export function CartPage() {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartItemsCount
  } = useCart();
  const subtotal = getCartTotal();
  const shipping = subtotal >= 50 ? 0 : 8.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;
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
      title: "Item removed",
      description: `${productName} has been removed from your cart.`
    });
  };
  const handleClearCart = () => {
    clearCart();
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart."
    });
  };
  const handleCheckout = () => {
    toast({
      title: "🚧 Checkout isn't implemented yet—but don't worry! Esta funcionalidad está en desarrollo!"
    });
  };
  if (cartItems.length === 0) {
    return <>
        <Helmet>
          <title>Shopping Cart | Golden Hive - Your cart is empty</title>
          <meta name="description" content="Your shopping cart is currently empty. Browse our collection of premium honey and beeswax products to add items to your cart." />
          <meta property="og:title" content="Shopping Cart | Golden Hive - Your cart is empty" />
          <meta property="og:description" content="Your shopping cart is currently empty. Browse our collection of premium honey and beeswax products to add items to your cart." />
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
                Your cart is empty
              </h1>
              <p className="text-gray-600 mb-8">
                Looks like you haven't added any items to your cart yet. 
                Start shopping to fill it up with our amazing products!
              </p>
              <Link to="/shop">
                <Button className="honey-gradient text-white border-0 hover:opacity-90 w-full">Start Shopping</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </>;
  }
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
                  Shopping Cart
                </h1>
                <p className="text-gray-600 mt-1">
                  {getCartItemsCount()} {getCartItemsCount() === 1 ? 'item' : 'items'} in your cart
                </p>
              </div>
              <Link to="/shop">
                <Button variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-50">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Continue Shopping
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
                    <h2 className="text-lg font-semibold text-gray-900">Cart Items</h2>
                    <Button variant="ghost" size="sm" onClick={handleClearCart} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                      Clear Cart
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
                  }} className="p-6">
                        <div className="flex items-center gap-4">
                          {/* Product Image */}
                          <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            <img className="w-full h-full object-cover" alt={`${item.name} in shopping cart`} src="https://images.unsplash.com/photo-1595872018818-97555653a011" />
                          </div>

                          {/* Product Info */}
                          <div className="flex-1 min-w-0">
                            <Link to={`/product/${item.id}`} className="text-lg font-medium text-gray-900 hover:text-amber-600 transition-colors">
                              {item.name}
                            </Link>
                            <p className="text-sm text-gray-600 mt-1">
                              {item.weight} • {item.category}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-lg font-semibold text-gray-900">
                                ${item.price}
                              </span>
                              {item.originalPrice && <span className="text-sm text-gray-500 line-through">
                                  ${item.originalPrice}
                                </span>}
                            </div>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3">
                            <div className="flex items-center border border-gray-300 rounded-lg">
                              <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)} className="p-2 hover:bg-gray-100 transition-colors" disabled={item.quantity <= 1}>
                                <Minus className="h-4 w-4" />
                              </button>
                              <input type="number" value={item.quantity} onChange={e => handleQuantityChange(item.id, parseInt(e.target.value) || 1)} className="w-16 text-center py-2 border-0 focus:outline-none quantity-input" min="1" />
                              <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)} className="p-2 hover:bg-gray-100 transition-colors">
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>

                            <button onClick={() => handleRemoveItem(item.id, item.name)} className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          {/* Item Total */}
                          <div className="text-right min-w-0">
                            <div className="text-lg font-semibold text-gray-900">
                              ${(item.price * item.quantity).toFixed(2)}
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
            }} className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Summary</h2>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? <span className="text-green-600">Free</span> : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>

                  {subtotal < 50 && <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <p className="text-sm text-amber-800">
                        Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                      </p>
                    </div>}

                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button onClick={handleCheckout} className="w-full honey-gradient text-white border-0 hover:opacity-90 text-lg py-3 mt-6">
                    Proceed to Checkout
                  </Button>

                  <div className="text-center text-sm text-gray-500 mt-4">
                    <div className="flex items-center justify-center gap-2">
                      <span>🔒</span>
                      <span>Secure checkout guaranteed</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>;
}