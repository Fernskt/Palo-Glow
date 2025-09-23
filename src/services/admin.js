import { supabase } from '@/lib/supabaseClient'

export async function setProductStock(id, inStock) {
  const { error } = await supabase
    .from('products')
    .update({ in_stock: !!inStock })
    .eq('id', id)

  if (error) throw error
}

// ✔️ Setear destacado (featured true/false)
export async function setProductFeatured(id, featured) {
  const { error } = await supabase
    .from('products')
    .update({ featured: !!featured })
    .eq('id', id)

  if (error) throw error
}

// 🔁 Toggle rápido (por si te resulta cómodo en la UI)
export async function toggleProductFeatured(product) {
  return setProductFeatured(product.id, !product.featured)
}

// (opcional) Batch update por si querés marcar varios de una
export async function setFeaturedBatch(ids = [], featured = true) {
  if (!ids.length) return
  const { error } = await supabase
    .from('products')
    .update({ featured: !!featured })
    .in('id', ids)

  if (error) throw error
}

// ---- helpers existentes ----

// Convierte una URL pública a la ruta interna del bucket (`products`)
function urlToStoragePath(publicUrl) {
  const marker = '/storage/v1/object/public/products/'
  const i = publicUrl.indexOf(marker)
  if (i === -1) return null
  return publicUrl.slice(i + marker.length) // -> "images/xxx.jpg"
}

export async function deleteProductWithImages(product) {
  const paths = (product.images || []).map(urlToStoragePath).filter(Boolean)

  if (paths.length) {
    const { error: delImgsErr } = await supabase.storage
      .from('products')
      .remove(paths)
    if (delImgsErr) console.warn('No se pudieron borrar algunas imágenes:', delImgsErr.message)
  }

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', product.id)

  if (error) throw error
}
