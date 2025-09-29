import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import logo from '@/assets/paloGlowLogo1.png'

export function Footer() {
  const handleSocialClick = (platform) => {
    switch(platform) {
      case 'Facebook':
        window.open('https://www.facebook.com/paloglow', '_blank');
        break;
      case 'Instagram':
        window.open('https://www.instagram.com/paloglow', '_blank');
        break;
      case 'Twitter':
        window.open('https://www.twitter.com/paloglow', '_blank');
        break;
      default:
        break;
    }
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "Lo estamos trabajando ❤️"
    });
  };

  const handleAutorClick = () => {
    window.open('https://www.hasperue.com/', '_blank');
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-8 h-8 rounded-full flex items-center justify-center"
              >
                <span className="text-white font-bold text-lg"><img src={logo} alt="PaloGlow Logo" /></span>
              </motion.div>
              <span className="text-xl logo font-bold">PaloGlow</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Colección de joyas: collares, pulseras y accesorios únicos que realzan tu estilo y cuentan tu historia. 
            </p>
            <div className="flex space-x-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleSocialClick('Facebook')}
                className="text-gray-400 hover:text-amber-400 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleSocialClick('Instagram')}
                className="text-gray-400 hover:text-amber-400 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleSocialClick('Twitter')}
                className="text-gray-400 hover:text-amber-400 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </motion.button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <span className="text-lg font-semibold">Links</span>
            <nav className="flex flex-col space-y-2">
              <Link to="/" className="text-gray-300 hover:text-amber-400 transition-colors text-sm">
                Home
              </Link>
              <Link to="/shop" className="text-gray-300 hover:text-amber-400 transition-colors text-sm">
                Tienda
              </Link>
              <Link to="/about" className="text-gray-300 hover:text-amber-400 transition-colors text-sm">
                Nosotros
              </Link>
              <Link to="/contact" className="text-gray-300 hover:text-amber-400 transition-colors text-sm">
                Contacto
              </Link>
            </nav>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <span className="text-lg font-semibold">Servicios</span>
            <nav className="flex flex-col space-y-2">
              <button 
                onClick={() => toast({ title: "Lo estamos trabajando ❤️" })}
                className="text-gray-300 hover:text-amber-400 transition-colors text-sm text-left"
              >
                Info de envíos
              </button>
              <button 
                onClick={() => toast({ title: "Lo estamos trabajando ❤️" })}
                className="text-gray-300 hover:text-amber-400 transition-colors text-sm text-left"
              >
                Cambios
              </button>
              <button 
                onClick={() => toast({ title: "Lo estamos trabajando ❤️" })}
                className="text-gray-300 hover:text-amber-400 transition-colors text-sm text-left"
              >
                FAQ
              </button>
              <button 
                onClick={() => toast({ title: "Lo estamos trabajando ❤️" })}
                className="text-gray-300 hover:text-amber-400 transition-colors text-sm text-left"
              >
                Size Guide
              </button>
            </nav>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-4">
            <span className="text-lg font-semibold">Contacto</span>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Mail className="h-4 w-4" />
                <span>palomaagomez06@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Phone className="h-4 w-4" />
                <span>(011) 32801394</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <MapPin className="h-4 w-4" />
                <span>José Mármol</span>
              </div>
            </div>
            
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <span className="text-sm font-medium">Newsletter</span>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 rounded-r-md transition-colors text-sm font-medium"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 Palo Glow. Todos los derechos reservados.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <button 
              onClick={handleAutorClick}
              className="text-gray-400 hover:text-amber-400 text-sm transition-colors"
            >
              Desarrollado por Fernando Hasperué
            </button>
            <Link to="/admin/products">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}