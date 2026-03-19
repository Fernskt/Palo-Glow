import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Menu, X, Search, Heart, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { useCart } from '@/hooks/useCart'
import { toast } from '@/components/ui/use-toast'
import { supabase } from '@/lib/supabaseClient'
import logo from '@/assets/paloGlowLogo1.png'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [session, setSession] = useState(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef(null)

  const { getCartItemsCount } = useCart()
  const cartItemsCount = getCartItemsCount()
  const location = useLocation()
  const navigate = useNavigate()

  // --- Auth state ---
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session || null))
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, sess) => setSession(sess))
    return () => sub.subscription.unsubscribe()
  }, [])

  const logout = async () => {
    await supabase.auth.signOut()
    navigate('/admin/login', { replace: true })
  }

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Tienda', href: '/shop' },
    { name: 'Nosotros', href: '/about' },
    /* { name: 'Contacto', href: '/contact' } */
  ]
  const isActive = (path) => location.pathname === path

  const handleWishlistClick = () => {
    toast({ title: 'Lo estamos trabajando ❤️' })
  }
  const handleSearchClick = () => {
    setIsSearchOpen(prev => !prev)
    setSearchQuery('')
  }
  const handleSearchSubmit = (e) => {
    e.preventDefault()
    const q = searchQuery.trim()
    if (q) {
      navigate(`/shop?q=${encodeURIComponent(q)}`)
      setIsSearchOpen(false)
      setSearchQuery('')
    }
  }

  useEffect(() => {
    if (!isSearchOpen) return
    const onKey = (e) => { if (e.key === 'Escape') setIsSearchOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isSearchOpen])

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) searchInputRef.current.focus()
  }, [isSearchOpen])

  return (
    <header className="sticky top-0 z-50 glass-effect border-b">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-8 h-8 rounded-full flex items-center justify-center"
            >
              <span className="text-white font-bold text-lg"><img src={logo} alt="PaloGlow Logo" /></span>
            </motion.div> 
            <span className="text-xl font-bold text-gray-900 logo">PaloGlow</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors hover:text-amber-600 ${
                  isActive(item.href) ? 'text-amber-600' : 'text-gray-700'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <AnimatePresence>
              {isSearchOpen && (
                <motion.form
                  key="search-form"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 200, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleSearchSubmit}
                  className="hidden sm:flex items-center bg-gray-100 rounded-full px-3 py-1 overflow-hidden"
                >
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar productos..."
                    className="bg-transparent outline-none text-sm text-gray-700 w-full min-w-0"
                  />
                </motion.form>
              )}
            </AnimatePresence>
            <Button variant="ghost" size="icon" onClick={handleSearchClick} className="hidden sm:flex">
              {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </Button>

            {/* <Button variant="ghost" size="icon" onClick={handleWishlistClick} className="hidden sm:flex">
              <Heart className="h-5 w-5" />
            </Button> */}

            {/* Cart */}
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                <AnimatePresence>
                  {cartItemsCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center cart-badge"
                    >
                      {cartItemsCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </Link>

            {/* Admin Dropdown (solo logueado) */}
            {session ? (
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <Button variant="outline" size="sm" className="hidden md:inline-flex gap-2">
                    <User className="h-4 w-4" />
                    Admin
                  </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content
                  align="end"
                  sideOffset={8}
                  className="min-w-[220px] rounded-md border bg-white p-1 shadow-md"
                >
                  <DropdownMenu.Item
                    className="px-3 py-2 text-sm rounded hover:bg-gray-100 cursor-pointer"
                    onSelect={() => navigate('/admin/new-product')}
                  >
                    Agregar producto
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    className="px-3 py-2 text-sm rounded hover:bg-gray-100 cursor-pointer"
                    onSelect={() => navigate('/admin/products')}
                  >
                    Panel de Admin
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator className="my-1 h-px bg-gray-200" />
                  <DropdownMenu.Item
                    className="px-3 py-2 text-sm rounded hover:bg-red-50 text-red-600 cursor-pointer"
                    onSelect={logout}
                  >
                    Cerrar sesión
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            ) : (
              // Si NO está logueado, mostrás un botón a login (opcional)
              ""
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t bg-white/95 backdrop-blur-sm"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`block px-3 py-2 text-base font-medium transition-colors hover:text-amber-600 ${
                      isActive(item.href) ? 'text-amber-600' : 'text-gray-700'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}

                <div className="px-3 py-2">
                  <form
                    onSubmit={(e) => { handleSearchSubmit(e); setIsMenuOpen(false) }}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Buscar productos..."
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <Button type="submit" size="sm" className="bg-amber-500 hover:bg-amber-600 text-white shrink-0">
                      <Search className="h-4 w-4" />
                    </Button>
                  </form>
                </div>

                {/* Admin en mobile */}
                <div className="px-3 pt-2 pb-4 border-t">
                  {session ? (
                    <div className="grid gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => { setIsMenuOpen(false); navigate('/admin/new-product') }}
                      >
                        Crear nuevo producto
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => { setIsMenuOpen(false); navigate('/admin/products') }}
                      >
                        Productos
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => { setIsMenuOpen(false); logout() }}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        Cerrar sesión
                      </Button>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}
