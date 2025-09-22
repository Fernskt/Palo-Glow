import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Menu, X, Search, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { toast } from '@/components/ui/use-toast';
export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {
    getCartItemsCount
  } = useCart();
  const location = useLocation();
  const cartItemsCount = getCartItemsCount();
  const navigation = [{
    name: 'Home',
    href: '/'
  }, {
    name: 'Tienda',
    href: '/shop'
  }, {
    name: 'Nosotros',
    href: '/about'
  }, {
    name: 'Contacto',
    href: '/contact'
  }];
  const isActive = path => location.pathname === path;
  const handleWishlistClick = () => {
    toast({
      title: "🚧 Esta funcionalidad está en desarrollo!"
    });
  };
  const handleSearchClick = () => {
    toast({
      title: "🚧 Esta funcionalidad está en desarrollo!"
    });
  };
  return <header className="sticky top-0 z-50 glass-effect border-b">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div whileHover={{
            rotate: 360
          }} transition={{
            duration: 0.5
          }} className="w-8 h-8 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">👑</span>
            </motion.div>
            <span className="text-xl font-bold text-gray-900">PaloGlow</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map(item => <Link key={item.name} to={item.href} className={`text-sm font-medium transition-colors hover:text-amber-600 ${isActive(item.href) ? 'text-amber-600' : 'text-gray-700'}`}>
                {item.name}
              </Link>)}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={handleSearchClick} className="hidden sm:flex">
              <Search className="h-5 w-5" />
            </Button>
            
            <Button variant="ghost" size="icon" onClick={handleWishlistClick} className="hidden sm:flex">
              <Heart className="h-5 w-5" />
            </Button>

            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                <AnimatePresence>
                  {cartItemsCount > 0 && <motion.span initial={{
                  scale: 0
                }} animate={{
                  scale: 1
                }} exit={{
                  scale: 0
                }} className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center cart-badge">
                      {cartItemsCount}
                    </motion.span>}
                </AnimatePresence>
              </Button>
            </Link>

            {/* Mobile menu button */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && <motion.div initial={{
          opacity: 0,
          height: 0
        }} animate={{
          opacity: 1,
          height: 'auto'
        }} exit={{
          opacity: 0,
          height: 0
        }} className="md:hidden border-t bg-white/95 backdrop-blur-sm">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigation.map(item => <Link key={item.name} to={item.href} className={`block px-3 py-2 text-base font-medium transition-colors hover:text-amber-600 ${isActive(item.href) ? 'text-amber-600' : 'text-gray-700'}`} onClick={() => setIsMenuOpen(false)}>
                    {item.name}
                  </Link>)}
                <div className="flex items-center space-x-4 px-3 py-2">
                  <Button variant="ghost" size="sm" onClick={handleSearchClick} className="flex items-center space-x-2">
                    <Search className="h-4 w-4" />
                    <span>Search</span>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleWishlistClick} className="flex items-center space-x-2">
                    <Heart className="h-4 w-4" />
                    <span>Wishlist</span>
                  </Button>
                </div>
              </div>
            </motion.div>}
        </AnimatePresence>
      </nav>
    </header>;
}