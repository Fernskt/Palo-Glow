import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useNavigate } from 'react-router-dom'
import {
  setProductStock,
  setProductFeatured,
  deleteProductWithImages,
} from '@/services/admin'

const PAGE_SIZE = 9

export default function AdminProducts() {
  const [rows, setRows] = useState([])
  const [busy, setBusy] = useState({}) // { [id]: 'stock' | 'featured' | 'delete' }
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const navigate = useNavigate()

  const load = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: false })
    if (!error) setRows(data || [])
  }

  const newProduct = () => {
    navigate('/admin/new-product')
  }

  useEffect(() => { load() }, [])

  const q = search.trim().toLowerCase()
  const filtered = q
    ? rows.filter(p =>
        p.name?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      )
    : rows

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const handleSearch = (e) => {
    setSearch(e.target.value)
    setPage(1)
  }

  const setBusyFor = (id, action) => setBusy((b) => ({ ...b, [id]: action }))
  const clearBusyFor = (id) => setBusy((b) => { const { [id]: _, ...rest } = b; return rest })

  // ----- STOCK -----
  const onToggleStock = async (p, checked) => {
    // optimista
    const prev = rows
    setRows(prev => prev.map(x => x.id === p.id ? { ...x, in_stock: checked } : x))
    setBusyFor(p.id, 'stock')
    try {
      await setProductStock(p.id, checked)
    } catch (e) {
      alert(e.message || 'No se pudo actualizar el stock')
      setRows(prev) // revertir
    } finally {
      clearBusyFor(p.id)
    }
  }

  // ----- FEATURED -----
  const onToggleFeatured = async (p, checked) => {
    const prev = rows
    setRows(prev => prev.map(x => x.id === p.id ? { ...x, featured: checked } : x))
    setBusyFor(p.id, 'featured')
    try {
      await setProductFeatured(p.id, checked)
    } catch (e) {
      alert(e.message || 'No se pudo actualizar el destacado')
      setRows(prev) 
    } finally {
      clearBusyFor(p.id)
    }
  }

  // ----- DELETE -----
  const onDelete = async (p) => {
    if (!confirm(`¿Eliminar "${p.name}"? Esta acción no se puede deshacer.`)) return
    const prev = rows
    setRows(prev => prev.filter(x => x.id !== p.id))
    setBusyFor(p.id, 'delete')
    try {
      await deleteProductWithImages(p)
    } catch (e) {
      alert(e.message || 'No se pudo eliminar el producto')
      setRows(prev) // revertir
    } finally {
      clearBusyFor(p.id)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Panel de Administrador</h1>
        <button
          onClick={newProduct}
          className="text-sm text-white honey-gradient px-3 py-2 border rounded hover:bg-gray-50"
          title="Refrescar"
        >
          Agregar
        </button>
      </div>

      {/* Buscador */}
      <div className="mb-4">
        <input
          type="search"
          value={search}
          onChange={handleSearch}
          placeholder="Buscar por nombre, categoría o descripción…"
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-gray-600">{search ? 'Sin resultados para esa búsqueda.' : 'No hay productos todavía.'}</div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginated.map((p) => {
              const isBusy = !!busy[p.id]
              return (
                <div key={p.id} className="border rounded-lg p-3 bg-white">
                  {/* Imagen */}
                  {p.images?.[0] ? (
                    <div className="relative">
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="w-full h-44 object-cover rounded mb-2"
                        loading="lazy"
                      />
                      {p.featured && (
                        <span className="absolute top-2 left-2 text-xs bg-amber-500 text-white px-2 py-1 rounded">
                          Destacado
                        </span>
                      )}
                      {!p.in_stock && (
                        <span className="absolute top-2 right-2 text-xs bg-gray-700 text-white px-2 py-1 rounded">
                          Sin stock
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-44 bg-gray-100 rounded mb-2 grid place-items-center text-gray-400">
                      Sin imagen
                    </div>
                  )}

                  {/* Info */}
                  <div className="font-medium line-clamp-2">{p.name}</div>
                  <div className="text-sm text-gray-600 mb-3">${p.price}</div>

                  {/* Controles */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={!!p.in_stock}
                        onChange={(e) => onToggleStock(p, e.target.checked)}
                        disabled={isBusy}
                      />
                      {isBusy && busy[p.id] === 'stock' ? 'Actualizando…' : 'En stock'}
                    </label>

                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={!!p.featured}
                        onChange={(e) => onToggleFeatured(p, e.target.checked)}
                        disabled={isBusy}
                      />
                      {isBusy && busy[p.id] === 'featured' ? 'Actualizando…' : 'Destacado'}
                    </label>

                    <div className="flex items-center justify-between pt-2">
                       <button
                        onClick={() => navigate(`/admin/edit/${p.id}`)}
                        className="text-sm px-2 py-1 rounded border hover:bg-gray-50"
                        title="Editar producto"
                      >
                        Editar
                      </button>
                      <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">
                        ID: {p.id}
                      </span>
                      <button
                        onClick={() => onDelete(p)}
                        className="text-red-600 text-sm hover:underline disabled:opacity-50"
                        disabled={isBusy}
                        title="Eliminar producto"
                      >
                        {isBusy && busy[p.id] === 'delete' ? 'Eliminando…' : 'Eliminar'}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1 mt-6 flex-wrap">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="px-3 py-1 rounded border text-sm disabled:opacity-40 hover:bg-gray-50"
                aria-label="Página anterior"
              >
                ‹
              </button>
              {(() => {
                const start = Math.max(1, Math.min(safePage - 1, totalPages - 2))
                const end = Math.min(totalPages, start + 2)
                return Array.from({ length: end - start + 1 }, (_, i) => start + i).map(n => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`w-9 py-1 rounded border text-sm ${n === safePage ? 'honey-gradient text-white border-transparent' : 'hover:bg-gray-50'}`}
                  >
                    {n}
                  </button>
                ))
              })()}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="px-3 py-1 rounded border text-sm disabled:opacity-40 hover:bg-gray-50"
                aria-label="Página siguiente"
              >
                ›
              </button>
              <span className="text-xs text-gray-500 w-full text-center mt-1">
                Página {safePage} de {totalPages}
              </span>
            </div>
          )}
        </>
      )}
    </div>
  )
}
