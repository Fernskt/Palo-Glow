import { supabase } from '@/lib/supabaseClient'

export async function fetchProducts({ category='all' } = {}) {
  let q = supabase.from('products').select('*').order('featured',{ascending:false}).order('id',{ascending:false})
  if (category !== 'all') q = q.eq('category', category)
  const { data, error } = await q
  if (error) throw error
  return data.map(p => ({
    id: p.id, name: p.name, price: Number(p.price),
    originalPrice: p.original_price ?? null,
    category: p.category, description: p.description,
    features: p.features ?? [], images: p.images ?? [],
    inStock: p.in_stock, featured: p.featured,
    stockQuantity: p.stock_quantity ?? null,
    rating: Number(p.rating ?? 0), reviews: p.reviews ?? 0,
    weight: p.weight ?? null, ingredients: p.ingredients ?? null
  }))
}

/**
 * Descuenta el stock de cada producto vendido.
 * Requiere la función SQL `decrement_stock` creada en Supabase.
 * Si el stock de un producto es NULL, lo ignora (sin límite).
 */
export async function decrementStock(items) {
  const errors = []
  for (const { id, quantity } of items) {
    const { error } = await supabase.rpc('decrement_stock', {
      product_id: id,
      qty: quantity
    })
    if (error) errors.push(error)
  }
  if (errors.length) throw new Error('Error al actualizar el stock: ' + errors[0].message)
}
