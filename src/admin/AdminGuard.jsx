import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Navigate } from 'react-router-dom'

export default function AdminGuard({ children }) {
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, sess) => setSession(sess))
    return () => sub.subscription.unsubscribe()
  }, [])

  if (loading) return <div className="p-8 text-center">Cargando…</div>
  if (!session) return <Navigate to="/admin/login" replace />
  return children
}
