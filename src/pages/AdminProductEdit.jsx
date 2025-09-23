import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '@/lib/supabaseClient'

export default function AdminProductEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [previews, setPreviews] = useState([])
  const [existingImages, setExistingImages] = useState([]) // imágenes actuales en DB
  const [replaceImages, setReplaceImages] = useState(false) // si querés reemplazar en vez de agregar

  const [form, setForm] = useState({
    name: '',
    price: '',
    originalPrice: '',
    category: 'esclavas',
    description: '',
    features: '',
    files: [],
    inStock: true,
    featured: false,
    rating: '0',
    reviews: '0',
    weight: '',
    ingredients: ''
  })

  // Helpers
  const onChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }
  const onFiles = (e) => {
    const files = Array.from(e.target.files || [])
    setForm(f => ({ ...f, files }))
    setPreviews(files.map(f => URL.createObjectURL(f)))
  }
  const uid = () =>
    (typeof crypto !== 'undefined' && crypto.randomUUID)
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2)

  const uploadImages = async (files) => {
    const urls = []
    for (const file of files) {
      const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
      const path = `images/${Date.now()}-${uid()}.${ext}`
      const { error } = await supabase.storage.from('products').upload(path, file, {
        cacheControl: '31536000',
        upsert: true,
        contentType: file.type || 'image/jpeg'
      })
      if (error) throw error
      const { data } = supabase.storage.from('products').getPublicUrl(path)
      urls.push(data.publicUrl)
    }
    return urls
  }

  // Cargar producto
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()
      if (error) {
        alert('No se pudo cargar el producto')
        navigate('/admin/products', { replace: true })
        return
      }
      // mapear a campos del form
      setForm({
        name: data.name || '',
        price: String(data.price ?? ''),
        originalPrice: data.original_price != null ? String(data.original_price) : '',
        category: data.category || 'esclavas',
        description: data.description || '',
        features: (data.features || []).join('\n'),
        files: [],
        inStock: !!data.in_stock,
        featured: !!data.featured,
        rating: String(data.rating ?? '0'),
        reviews: String(data.reviews ?? '0'),
        weight: data.weight || '',
        ingredients: data.ingredients || ''
      })
      setExistingImages(data.images || [])
      setLoading(false)
    })()
  }, [id, navigate])

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)

      // asegurar sesión
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        alert('Tenés que iniciar sesión para editar productos.')
        return
      }

      // subir nuevas imágenes (si se seleccionaron)
      const newImages = form.files.length ? await uploadImages(form.files) : []
      const finalImages = replaceImages ? newImages : [...existingImages, ...newImages]

      const features = form.features
        ? form.features.split('\n').map(s => s.trim()).filter(Boolean)
        : []

      const payload = {
        name: form.name.trim(),
        price: Number(form.price || 0),
        original_price: form.originalPrice ? Number(form.originalPrice) : null,
        category: form.category,
        description: form.description.trim(),
        features,
        images: finalImages,
        in_stock: !!form.inStock,
        featured: !!form.featured,
        rating: form.rating ? Math.max(0, Math.min(5, Number(form.rating))) : 0,
        reviews: form.reviews ? parseInt(form.reviews, 10) : 0,
        weight: form.weight || null,
        ingredients: form.ingredients || null
      }

      if (!payload.name) throw new Error('El nombre es obligatorio.')
      if (!payload.price || isNaN(payload.price)) throw new Error('Precio inválido.')
      if (!payload.category) throw new Error('La categoría es obligatoria.')

      const { error } = await supabase
        .from('products')
        .update(payload)
        .eq('id', id)
      if (error) throw error

      alert('Producto actualizado ✅')
      navigate('/admin/products')
    } catch (err) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-8 text-center">Cargando…</div>

  return (
    <div className="max-w-2xl mx-auto py-8 px-5">
      <h1 className="text-2xl font-semibold mb-1">Editar producto</h1>
      <p className="text-gray-500 mb-4">ID: {id}</p>

      <form onSubmit={onSubmit} className="space-y-4">
        {/* Básicos */}
        <div className="grid md:grid-cols-2 gap-3">
          <input name="name" value={form.name} onChange={onChange}
                 className="w-full border p-2 rounded" placeholder="Nombre" />
          <input name="price" value={form.price} onChange={onChange} type="number" min="0" step="0.01"
                 className="w-full border p-2 rounded" placeholder="Precio" />
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <input name="originalPrice" value={form.originalPrice} onChange={onChange} type="number" min="0" step="0.01"
                 className="w-full border p-2 rounded" placeholder="Precio original (opcional)" />
          <select name="category" value={form.category} onChange={onChange}
                  className="w-full border p-2 rounded">
            <option value="esclavas">Esclavas</option>
            <option value="bracelets">Pulseras</option>
            <option value="rings">Anillos</option>
            <option value="earrings">Aros</option>
            <option value="necklaces">Collares</option>
            <option value="sets">Sets</option>
          </select>
        </div>

        <textarea name="description" value={form.description} onChange={onChange}
                  className="w-full border p-2 rounded" rows={3}
                  placeholder="Descripción" />

        {/* Features (una por línea) */}
        <textarea name="features" value={form.features} onChange={onChange}
                  className="w-full border p-2 rounded" rows={4}
                  placeholder="Características (una por línea)" />

        {/* Flags y métricas */}
        <div className="grid md:grid-cols-4 gap-3">
          <label className="flex items-center gap-2 border p-2 rounded">
            <input type="checkbox" name="inStock" checked={form.inStock} onChange={onChange} />
            En stock
          </label>
          <label className="flex items-center gap-2 border p-2 rounded">
            <input type="checkbox" name="featured" checked={form.featured} onChange={onChange} />
            Destacado
          </label>
          <input name="rating" value={form.rating} onChange={onChange} type="number" min="0" max="5" step="0.1"
                 className="w-full border p-2 rounded" placeholder="Rating (0–5)" />
          <input name="reviews" value={form.reviews} onChange={onChange} type="number" min="0" step="1"
                 className="w-full border p-2 rounded" placeholder="Reviews" />
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <input name="weight" value={form.weight} onChange={onChange}
                 className="w-full border p-2 rounded" placeholder="Medida/peso" />
          <input name="ingredients" value={form.ingredients} onChange={onChange}
                 className="w-full border p-2 rounded" placeholder="Materiales" />
        </div>

        {/* Imágenes existentes */}
        {existingImages.length > 0 && (
          <div>
            <label className="block font-medium mb-1">Imágenes actuales</label>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {existingImages.map((src, i) => (
                <img key={i} src={src} alt="" className="w-full h-24 object-cover rounded" />
              ))}
            </div>
          </div>
        )}

        {/* Nuevas imágenes */}
        <div className="space-y-2">
          <label className="block font-medium">Subir imágenes nuevas</label>
          <input type="file" accept="image/*" multiple onChange={onFiles} />
          {!!previews.length && (
            <div className="grid grid-cols-3 gap-2 mt-2">
              {previews.map((src, i) => (
                <img key={i} src={src} alt="" className="w-full h-24 object-cover rounded" />
              ))}
            </div>
          )}

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={replaceImages}
              onChange={(e) => setReplaceImages(e.target.checked)}
            />
            Reemplazar imágenes existentes (si no, se agregan al final)
          </label>
        </div>

        <div className="flex gap-3">
          <button className="w-full honey-gradient text-white rounded p-3" disabled={saving}>
            {saving ? 'Guardando…' : 'Guardar cambios'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="w-full border rounded p-3 hover:bg-gray-50"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
