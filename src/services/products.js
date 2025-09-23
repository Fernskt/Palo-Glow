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
    rating: Number(p.rating ?? 0), reviews: p.reviews ?? 0,
    weight: p.weight ?? null, ingredients: p.ingredients ?? null
  }))
}
