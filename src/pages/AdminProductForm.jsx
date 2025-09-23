import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function AdminProductForm() {
  const [form, setForm] = useState({
    name: '',
    price: '',
    originalPrice: '',
    category: 'esclavas', // <-- agregado
    description: '',
    features: '',
    files: [],
    inStock: true,
    featured: false,
    rating: '4.9',
    reviews: '125',
    weight: '',
    ingredients: ''
  })
  const [saving, setSaving] = useState(false)
  const [previews, setPreviews] = useState([])

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

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)

      // asegurar sesión
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        alert('Tenés que iniciar sesión para crear productos.')
        return
      }

      const images = form.files.length ? await uploadImages(form.files) : []

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
        images, // URLs públicas
        in_stock: !!form.inStock,
        featured: !!form.featured,
        rating: form.rating ? Math.max(0, Math.min(5, Number(form.rating))) : 0,
        reviews: form.reviews ? parseInt(form.reviews, 10) : 0,
        weight: form.weight || null,
        ingredients: form.ingredients || null
      }

      // Validaciones mínimas
      if (!payload.name) throw new Error('El nombre es obligatorio.')
      if (!payload.price || isNaN(payload.price)) throw new Error('Precio inválido.')
      if (!payload.category) throw new Error('La categoría es obligatoria.')

      const { error } = await supabase.from('products').insert([payload])
      if (error) throw error

      alert('Producto creado ✅')
      setForm({
        name: '',
        price: '',
        originalPrice: '',
        category: 'esclavas',
        description: '',
        features: '',
        files: [],
        inStock: true,
        featured: false,
        rating: '4.9',
        reviews: '125',
        weight: '',
        ingredients: ''
      })
      setPreviews([])
    } catch (err) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-5">
      <h1 className="text-2xl font-semibold mb-4">Nuevo producto</h1>

      <form onSubmit={onSubmit} className="space-y-4">
        {/* Básicos */}
        <div className="grid md:grid-cols-2 gap-3">
          <input name="name" value={form.name} onChange={onChange}
                 className="w-full border p-2 rounded" placeholder="Nombre (ej. Esclava Mariposa Strass)" />
          <input name="price" value={form.price} onChange={onChange} type="number" min="0" step="0.01"
                 className="w-full border p-2 rounded" placeholder="Precio (ej. 12000)" />
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <input name="originalPrice" value={form.originalPrice} onChange={onChange} type="number" min="0" step="0.01"
                 className="w-full border p-2 rounded" placeholder="Precio original (opcional, ej. 15000)" />
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
                  placeholder={'Características (una por línea)\nEj:\nAcero quirúrgico 316L con baño dorado\nStrass de alta calidad\nHipoalergénica\nNo se oxida ni pierde el color\nAjustable a diferentes tamaños de muñeca'} />

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
                 className="w-full border p-2 rounded" placeholder="Medida/peso (ej. 10 cm)" />
          <input name="ingredients" value={form.ingredients} onChange={onChange}
                 className="w-full border p-2 rounded" placeholder="Materiales (ej. Acero 316L, strass)" />
        </div>

        {/* Imágenes */}
        <div>
          <label className="block font-medium mb-1">Imágenes (podés subir varias)</label>
          <input type="file" accept="image/*" multiple onChange={onFiles} />
          {!!previews.length && (
            <div className="grid grid-cols-3 gap-2 mt-2">
              {previews.map((src, i) => (
                <img key={i} src={src} alt="" className="w-full h-24 object-cover rounded" />
              ))}
            </div>
          )}
        </div>

        <button className="w-full honey-gradient text-white rounded p-3" disabled={saving}>
          {saving ? 'Guardando…' : 'Crear producto'}
        </button>
      </form>
    </div>
  )
}
