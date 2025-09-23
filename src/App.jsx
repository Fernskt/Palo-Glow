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
import AdminGuard from '@/admin/AdminGuard'
import AdminLogin from '@/pages/AdminLogin'
import AdminProductForm from '@/pages/AdminProductForm'
import AdminProducts from '@/pages/AdminProducts'
import AdminProductEdit from '@/pages/AdminProductEdit'
import { Scroll } from 'lucide-react'

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
          <Route
            path="/about"
            element={
              <div className="min-h-screen flex items-center justify-center">
                <h1 className="text-2xl font-bold">Nosotros - En desarrollo!</h1>
              </div>
            }
          />
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
    </div>
  )
}

export default App
