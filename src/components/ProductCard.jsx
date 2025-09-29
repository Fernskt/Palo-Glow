import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart';
import { toast } from '@/components/ui/use-toast';
import { buildWhatsAppUrl, formatARS } from '@/lib/whatsapp'
import { FaWhatsapp } from 'react-icons/fa';


export function ProductCard({ product, index = 0 }) {

  const { addToCart, isInCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast({
      title: 'Agregado al carrito!',
      description: `${product.name} ha sido agregado a tu carrito.`,
    });
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toast({ title: 'Lo estamos trabajando ❤️' });
  };

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const firstImgName = product.images?.[0];

  const handleWhatsAppProduct = () => {
    const text =
      `Hola Palo! Me interesa *${product.name}* (${formatARS(product.price)})\n` +
      // poné la URL de producto SIN protocolo para que no cuente como link
      `Link: paloglow.shop/product/${product.id}`
    window.open(buildWhatsAppUrl(text), '_blank')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <Link to={`/product/${product.id}`}>
        <div className="product-card bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          {/* Image Container */}
          <div className="relative overflow-hidden bg-gray-50">
            {firstImgName ? (
              <img
                src={firstImgName}
                alt={product.name}
                loading="lazy"
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-64 bg-gray-100 animate-pulse" />
            )}

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {discountPercentage > 0 && (
                <Badge variant="destructive" className="bg-red-500 text-white">
                  -{discountPercentage}%
                </Badge>
              )}
              {product.featured && (
                <Badge className="bg-amber-500 text-white border-0">Destacado</Badge>
              )}
              {!product.inStock && (
                <Badge variant="secondary" className="bg-gray-500 text-white">
                  Sin Stock
                </Badge>
              )}
            </div>

            {/* Action Buttons */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                size="icon"
                onClick={handleWhatsAppProduct}
                className="text-amber-700 hover:text-amber-400 border-amber-300"
              >
                <FaWhatsapp className="w-10 h-10" />
              </Button>
            </div>

            {/* Quick Add to Cart */}
            <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="w-full bg-amber-600 text-white border-0 hover:bg-amber-700"
                size="sm"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {isInCart(product.id) ? 'Ver más' : 'Agregar al carrito'}
              </Button>
            </div>
          </div>

          {/* Product Info */}
          <div className="p-4">
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'text-amber-400 fill-current' : 'text-gray-300'
                    }`}
                />
              ))}
              <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
            </div>

            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-amber-600 transition-colors">
              {product.name}
            </h3>

            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-900">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                )}
              </div>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {product.weight}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
