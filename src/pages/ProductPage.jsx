import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import {
  Star,
  Heart,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProductCard } from '@/components/ProductCard';
import { fetchProductById } from '@/data/catalog'
import { useCart } from '@/hooks/useCart';
import { toast } from '@/components/ui/use-toast';
import { productImages } from '@/assets/productImages';
import { buildWhatsAppUrl, formatARS } from '@/lib/whatsapp'
import { FaWhatsapp } from 'react-icons/fa';



export function ProductPage() {

  const { id } = useParams();
  const [product, setProduct] = useState(null)
  const [error, setError] = useState(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, isInCart, getItemQuantity } = useCart();

  useEffect(() => {
    fetchProductById(id).then(setProduct).catch(e => setError(e.message))
  }, [id])

  if (error) {
    return <div className="p-8 text-red-600">Error: {error}</div>
  }
  if (!product) {
    return <div className="min-h-screen grid place-items-center">Cargando…</div>
  }

  const mainImg = product.images?.[selectedImageIndex] || product.images?.[0] || '';

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Producto no encontrado</h1>
          <Link to="/shop">
            <Button>Volver a tienda</Button>
          </Link>
        </div>
      </div>
    );
  }

  /* const relatedProducts = products
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, 3); */

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast({
      title: "Added to cart!",
      description: `${quantity} x ${product.name} added to your cart.`
    });
  };

  const handleWishlistClick = () => {
    toast({
      title: "Lo estamos trabajando ❤️"
    });
  };

  const handleShareClick = () => {
    toast({
      title: "Lo estamos trabajando ❤️"
    });
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleWhatsAppProduct = () => {
    const text =
      `Hola Palo! Me interesa *${product.name}* (${formatARS(product.price)})\n` +
      // poné la URL de producto SIN protocolo para que no cuente como link
      `Link: paloglow.shop/product/${product.id}`
    window.open(buildWhatsAppUrl(text), '_blank')
  }

  return (
    <>
      <Helmet>
        <title>{product.name} | Palo Glow</title>
        <meta name="description" content={product.description} />
        <meta property="og:title" content={`${product.name} | Palo Glow`} />
        <meta property="og:description" content={product.description} />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center space-x-2 text-sm text-gray-600">
              <Link to="/" className="hover:text-amber-600">Home</Link>
              <span>/</span>
              <Link to="/shop" className="hover:text-amber-600">Tienda</Link>
              <span>/</span>
              <span className="text-gray-900">{product.name}</span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              {/* Main Image */}
              <div className="relative bg-white rounded-xl overflow-hidden shadow-lg">
                <img
                  className="w-full h-96 lg:h-[500px] object-cover"
                  alt={`${product.name} - imagen principal`}
                  src={mainImg}
                />

                {/* Image Navigation */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-colors"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {discountPercentage > 0 && (
                    <Badge variant="destructive" className="bg-red-500 text-white">
                      -{discountPercentage}%
                    </Badge>
                  )}
                  {product.featured && (
                    <Badge className="honey-gradient text-white border-0">
                      Destacado
                    </Badge>
                  )}
                  {!product.inStock && (
                    <Badge variant="secondary" className="bg-gray-500 text-white">
                      Sin stock
                    </Badge>
                  )}
                </div>
              </div>

              {/* Thumbnail Images */}
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative bg-white rounded-lg overflow-hidden border-2 transition-colors ${selectedImageIndex === index ? 'border-amber-500' : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <img
                    className="w-full h-20 object-cover"
                    alt={`${product.name} - imagen ${index + 1}`}
                    src={image}
                  />
                </button>
              ))}
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-6"
            >
              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(product.rating)
                        ? 'text-amber-400 fill-current'
                        : 'text-gray-300'
                        }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating} ({product.reviews} vistas)
                </span>
              </div>

              {/* Title and Price */}
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  {product.name}
                </h1>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-3xl font-bold text-gray-900">
                    ${product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xl text-gray-500 line-through">
                      ${product.originalPrice}
                    </span>
                  )}
                  <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                    {product.weight}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {product.description}
                </p>
              </div>

              {/* Features */}
              {product.features && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Features:</h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 honey-gradient rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-600 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Ingredients */}
              <div className="bg-amber-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Materiales:</h3>
                <p className="text-sm text-gray-700">{product.ingredients}</p>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="font-medium text-gray-900">Cantidad:</span>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-gray-100 transition-colors"
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 text-center py-2 border-0 focus:outline-none quantity-input"
                      min="1"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 hover:bg-gray-100 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  {isInCart(product.id) && (
                    <span className="text-sm text-amber-600">
                      {getItemQuantity(product.id)} en el carrito
                    </span>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className="flex-1 honey-gradient text-white border-0 hover:opacity-90 text-lg py-3"
                  >
                    {product.inStock ? 'Agregar al carrito' : 'Sin stock'}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleWhatsAppProduct}
                    className="border-amber-300 text-amber-700 hover:bg-amber-50"
                  >
                    <FaWhatsapp className="w-5 h-5" />
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleShareClick}
                    className="border-amber-300 text-amber-700 hover:bg-amber-50"
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Shipping Info */}
              {/*  <div className="border-t pt-6 space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Truck className="h-5 w-5 text-amber-600" />
                  <span>Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <RotateCcw className="h-5 w-5 text-amber-600" />
                  <span>30-day return policy</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Shield className="h-5 w-5 text-amber-600" />
                  <span>Secure checkout guaranteed</span>
                </div>
              </div> */}
            </motion.div>
          </div>

          {/* Related Products */}
          {/*  {relatedProducts.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mt-20"
            >
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-8 text-center">
                You Might Also Like
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedProducts.map((relatedProduct, index) => (
                  <ProductCard
                    key={relatedProduct.id}
                    product={relatedProduct}
                    index={index}
                  />
                ))}
              </div>
            </motion.section>
          )} */}
        </div>
      </div>
    </>
  );
}