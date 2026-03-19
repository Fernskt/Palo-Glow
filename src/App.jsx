import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import ScrollToTop from '@/components/ScrollToTop'
import { Header } from '@/components/Layout/Header'
import { Footer } from '@/components/Layout/Footer'
import { Toaster } from '@/components/ui/toaster'
import { HomePage } from '@/pages/HomePage'
import { ShopPage } from '@/pages/ShopPage'
import { ProductPage } from '@/pages/ProductPage'
import { CartPage } from '@/pages/CartPage'
import { CheckoutPage } from '@/pages/CheckoutPage'
import { CheckoutSuccess } from '@/pages/CheckoutSuccess'
import { CheckoutFailure } from '@/pages/CheckoutFailure'
import { CheckoutPending } from '@/pages/CheckoutPending'
import AdminGuard from '@/admin/AdminGuard'
import AdminLogin from '@/pages/AdminLogin'
import AdminProductForm from '@/pages/AdminProductForm'
import AdminProducts from '@/pages/AdminProducts'
import AdminProductEdit from '@/pages/AdminProductEdit'
import { AboutPage } from '@/pages/AboutPage'

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/checkout/success" element={<CheckoutSuccess />} />
          <Route path="/checkout/failure" element={<CheckoutFailure />} />
          <Route path="/checkout/pending" element={<CheckoutPending />} />
          <Route path="/about" element={<AboutPage />} />
          <Route
            path="/contact"
            element={
              <div className="min-h-screen flex items-center justify-center">
                <h1 className="text-2xl font-bold">Contacto - En desarrollo!</h1>
              </div>
            }
          />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/new-product" element={
            <AdminGuard><AdminProductForm /></AdminGuard>
          } />
          <Route path="/admin/products" element={
            <AdminGuard><AdminProducts /></AdminGuard>
          } />
          <Route
            path="/admin/edit/:id"
            element={
              <AdminGuard><AdminProductEdit /></AdminGuard>
            }
          />
        </Routes>
      </main>
      <Footer />
      <Toaster />

      {/* Floating WhatsApp button */}
      <a
        href="https://wa.me/5491132801394?text=Hola%2C%20Palo%20quiero%20hacerte%20una%20consulta"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg hover:scale-110 transition-transform duration-200"
        style={{ backgroundColor: '#25D366' }}
      >
        <svg viewBox="0 0 32 32" width="30" height="30" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 1C7.716 1 1 7.716 1 16c0 2.628.686 5.131 1.993 7.334L1 31l7.875-2.063A14.94 14.94 0 0 0 16 31c8.284 0 15-6.716 15-15S24.284 1 16 1zm0 27.5a12.44 12.44 0 0 1-6.352-1.74l-.455-.27-4.672 1.224 1.247-4.55-.297-.468A12.462 12.462 0 0 1 3.5 16C3.5 9.097 9.097 3.5 16 3.5S28.5 9.097 28.5 16 22.903 28.5 16 28.5zm6.844-9.262c-.375-.188-2.219-1.094-2.563-1.219-.344-.125-.594-.188-.844.188s-.969 1.219-1.188 1.469-.438.281-.813.094c-.375-.188-1.582-.583-3.015-1.858-1.114-.994-1.866-2.221-2.085-2.596-.219-.375-.023-.578.164-.765.169-.168.375-.438.563-.656.188-.219.25-.375.375-.625.125-.25.063-.469-.031-.656-.094-.188-.844-2.031-1.156-2.781-.305-.73-.614-.631-.844-.643l-.719-.013c-.25 0-.656.094-.999.469s-1.313 1.281-1.313 3.125 1.344 3.625 1.531 3.875c.188.25 2.645 4.038 6.407 5.661 4.538 1.91 4.538 1.272 5.351 1.194.813-.078 2.22-.907 2.532-1.782.313-.875.313-1.625.219-1.782-.093-.156-.344-.25-.719-.438z"/>
        </svg>
      </a>
    </div>
  )
}

export default App
