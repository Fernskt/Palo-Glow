import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useNavigate } from 'react-router-dom'
import {
  setProductStock,
  setProductFeatured,
  deleteProductWithImages,
} from '@/services/admin'

export default function AdminProducts() {
  const [rows, setRows] = useState([])
  const [busy, setBusy] = useState({}) // { [id]: 'stock' | 'featured' | 'delete' }
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

      {rows.length === 0 ? (
        <div className="text-gray-600">No hay productos todavía.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rows.map((p) => {
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
      )}
    </div>
  )
}
