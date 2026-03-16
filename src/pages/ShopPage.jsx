import React, { useState, useMemo, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Grid, List, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/ProductCard';
//import { products, categories } from '@/data/products';
import { useCatalog } from '@/data/catalog'
import { toast } from '@/components/ui/use-toast';
import { useLocation } from 'react-router-dom';


export function ShopPage() {
  const { products, categories, featuredProducts, loading, error } = useCatalog();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const PAGE_SIZE = 6
  const [currentPage, setCurrentPage] = useState(1);

  // 1) Hooks de URL
  const location = useLocation();
  const isDiaDeLaMadre = useMemo(() => {
    const sp = new URLSearchParams(location.search);
    return sp.has('esDiaDeLaMadre');
  }, [location.search]);

  const searchQuery = useMemo(() => {
    const sp = new URLSearchParams(location.search);
    return (sp.get('q') || '').trim().toLowerCase();
  }, [location.search]);

  // 2) Aplicar precios con promo (20% OFF) si corresponde
  const pricedProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    if (!isDiaDeLaMadre) return products;

    return products.map(p => {
      const orig = Number(p.price || 0);
      const promo = Math.max(0, Math.round(orig * 0.8)); // 20% OFF
      return {
        ...p,
        originalPrice: p.originalPrice ?? orig,
        price: promo,
        original_price: p.original_price ?? p.originalPrice ?? orig,
      };
    });
  }, [products, isDiaDeLaMadre]);



  useEffect(() => {
    setCurrentPage(1)
  }, [pricedProducts, selectedCategory, sortBy, priceRange, searchQuery])


  const filteredAndSortedProducts = useMemo(() => {
    let filtered = Array.isArray(pricedProducts) ? [...pricedProducts] : [];


    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by search query (name, description, category id or category display name)
    if (searchQuery) {
      const categoryNameMap = Object.fromEntries(
        categories.map(c => [c.name.toLowerCase(), c.id])
      )
      // Find category ids whose display name matches the query
      const matchedCategoryIds = Object.entries(categoryNameMap)
        .filter(([name]) => name.includes(searchQuery))
        .map(([, id]) => id)

      filtered = filtered.filter(product =>
        product.name?.toLowerCase().includes(searchQuery) ||
        product.description?.toLowerCase().includes(searchQuery) ||
        product.category?.toLowerCase().includes(searchQuery) ||
        matchedCategoryIds.includes(product.category)
      );
    }

    // Filter by price range
    filtered = filtered.filter(product =>
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => b.id - a.id);
        break;
      default: // featured
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return filtered;
  }, [products, categories, selectedCategory, sortBy, priceRange, searchQuery]);

  const total = filteredAndSortedProducts.length
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const start = (currentPage - 1) * PAGE_SIZE
  const end = Math.min(start + PAGE_SIZE, total)
  const paginatedProducts = filteredAndSortedProducts.slice(start, end)


  return (
    <>
      <Helmet>
        {/* Title */}
        <title>Palo Glow | Tienda de Joyas y Accesorios</title>

        {/* Meta Description */}
        <meta
          name="description"
          content="Explorá la tienda oficial Palo Glow: joyas hipoalergénicas en acero quirúrgico 316L con pulido espejo, brillo duradero y accesorios como bolsos, carteras y riñoneras de eco-cuero."
        />

        {/* Canonical */}
        <link rel="canonical" href="https://paloglow.shop/shop" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Palo Glow | Tienda Online" />
        <meta
          property="og:description"
          content="Descubrí collares, anillos, aros y pulseras en acero quirúrgico 316L y accesorios en eco-cuero. Calidad real, brillo duradero y diseños modernos."
        />
        <meta property="og:url" content="https://paloglow.shop/shop" />
        <meta property="og:image" content="https://paloglow.shop/og-cover.jpg" />

        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Store",
            name: "Palo Glow",
            url: "https://paloglow.shop/shop",
            image: "https://paloglow.shop/og-cover.jpg",
            description:
              "Tienda oficial Palo Glow: joyas hipoalergénicas en acero quirúrgico 316L con pulido espejo, brillo duradero y accesorios en eco-cuero.",
            sameAs: ["https://www.instagram.com/paloglow"],
            department: [
              {
                "@type": "DepartmentStore",
                name: "Joyas de acero 316L",
                description:
                  "Collares, anillos, aros y pulseras hipoalergénicos en acero quirúrgico 316L, con terminación pulido espejo y apliques de strass de alta calidad."
              },
              {
                "@type": "DepartmentStore",
                name: "Accesorios en eco-cuero",
                description:
                  "Bolsos, carteras y riñoneras modernas fabricadas en eco-cuero resistente y de excelente terminación."
              }
            ]
          })}
        </script>
      </Helmet>


      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <section className="bg-white border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Nuestra Colección
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Descubre nuestra exclusiva selección de pulseras y collares, diseñados para realzar tu estilo con elegancia y autenticidad.
              </p>
            </motion.div>
          </div>
        </section>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:w-64 space-y-4"
            >
              {/* Mobile toggle button — only visible below lg */}
              <button
                className="lg:hidden w-full flex items-center justify-between px-4 py-3 bg-white rounded-lg shadow-sm font-semibold text-gray-900"
                onClick={() => setIsFiltersOpen(prev => !prev)}
              >
                <span className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filtros
                </span>
                {isFiltersOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>

              {/* Filter panels — always visible on desktop, collapsible on mobile */}
              <AnimatePresence initial={false}>
                {isFiltersOpen && (
                  <motion.div
                    key="mobile-filters"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="lg:hidden space-y-4 overflow-hidden"
                  >
                    {/* Categories */}
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                      <h3 className="font-semibold text-gray-900 mb-4">Categorías</h3>
                      <div className="space-y-2">
                        {categories.map((category) => (
                          <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`w-full text-left px-3 py-2 rounded-md transition-colors ${selectedCategory === category.id
                              ? 'bg-amber-100 text-amber-800'
                              : 'text-gray-600 hover:bg-gray-100'
                              }`}
                          >
                            <div className="flex justify-between items-center">
                              <span>{category.name}</span>
                              <span className="text-sm text-gray-400">({category.count})</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Price Range */}
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                      <h3 className="font-semibold text-gray-900 mb-4">Rango de precio</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>${priceRange[0]}</span>
                          <span>${priceRange[1]}</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="50000"
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex gap-2">
                          <input
                            type="number"
                            value={priceRange[0]}
                            onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            placeholder="Min"
                          />
                          <input
                            type="number"
                            value={priceRange[1]}
                            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 20000])}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            placeholder="Max"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Desktop: always visible */}
              {/* Categories */}
              <div className="hidden lg:block bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">Categorías</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors ${selectedCategory === category.id
                        ? 'bg-amber-100 text-amber-800'
                        : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{category.name}</span>
                        <span className="text-sm text-gray-400">({category.count})</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="hidden lg:block bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">Rango de precio</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      placeholder="Min"
                    />
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 20000])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      placeholder="Max"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Toolbar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white rounded-lg p-4 shadow-sm mb-6"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">
                      Mostrando {total ? `${start + 1}–${end}` : 0} de {total} productos
                    </span>
                    {searchQuery && (
                      <span className="text-sm text-amber-700 font-medium">
                        Resultados para: &quot;{searchQuery}&quot;
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Sort Dropdown */}
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="featured">Destacados</option>
                      <option value="newest">Novedades</option>
                      <option value="price-low">Precio: Low to High</option>
                      <option value="price-high">Precio: High to Low</option>
                      <option value="name">Nombre A-Z</option>
                      <option value="rating">Mejores puntuados</option>
                    </select>

                    {/* View Mode Toggle */}
                    <div className="flex border border-gray-300 rounded-md overflow-hidden">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 ${viewMode === 'grid'
                          ? 'bg-amber-100 text-amber-800'
                          : 'text-gray-600 hover:bg-gray-100'
                          }`}
                      >
                        <Grid className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 ${viewMode === 'list'
                          ? 'bg-amber-100 text-amber-800'
                          : 'text-gray-600 hover:bg-gray-100'
                          }`}
                      >
                        <List className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Loading */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="text-center py-12"
                >
                  <div className="loader mx-auto mb-4" />
                  <span className="text-gray-600">Cargando productos...</span>
                </motion.div>
              )}

              {/* Products Grid */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className={`grid gap-6 ${viewMode === 'grid'
                  ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                  : 'grid-cols-1'
                  }`}
              >
                {paginatedProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}

              </motion.div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                    aria-label="Primera página"
                  >
                    «
                  </button>
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                    aria-label="Anterior"
                  >
                    ‹
                  </button>

                  {/* Números (simple: todas las páginas) */}
                  {Array.from({ length: 5 }, (_, i) => i + 1).map(n => (
                    <button
                      key={n}
                      onClick={() => setCurrentPage(n)}
                      className={`px-3 py-1 border rounded ${n === currentPage ? 'bg-amber-100 border-amber-300 text-amber-800' : 'hover:bg-gray-100'
                        }`}
                      aria-current={n === currentPage ? 'page' : undefined}
                    >
                      {n}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                    aria-label="Siguiente"
                  >
                    ›
                  </button>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                    aria-label="Última página"
                  >
                    »
                  </button>
                </div>
              )}


              {/* No Results */}
              {(filteredAndSortedProducts.length === 0 && !loading) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-center py-12"
                >
                  <div className="text-gray-400 mb-4">
                    <Filter className="h-16 w-16 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No se encontraron productos
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Intenta ajustar tus filtros o restablecerlos para ver más productos.
                  </p>
                  <Button
                    onClick={() => {
                      setSelectedCategory('all');
                      setPriceRange([0, 20000]);
                      setSortBy('featured');
                    }}
                    variant="outline"
                  >
                    Limpiar filtros
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}