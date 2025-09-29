import React, { createContext, useContext, useEffect, useMemo, useReducer, useCallback } from 'react'

const CART_STORAGE_KEY = 'glow-store-cart@v1'
const MAX_QTY = 10

const hasLS = typeof window !== 'undefined' && 'localStorage' in window

const compact = (p) => ({
  id: p.id,
  name: p.name,
  price: Number(p.price || 0),
  image: Array.isArray(p.images) && p.images.length ? p.images[0] : null,
  category: p.category ?? null,
  weight: p.weight ?? null,
})

const loadInitialState = () => {
  if (!hasLS) return { items: [] }
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return { items: [] }
    const parsed = JSON.parse(raw)
    if (parsed && Array.isArray(parsed.items)) return parsed
  } catch {}
  return { items: [] }
}

const persist = (state) => {
  if (!hasLS) return
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state))
  } catch {}
}

const CartContext = createContext(null)

// Reducer
function reducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const { product, quantity } = action.payload
      const idx = state.items.findIndex(i => i.id === product.id)
      if (idx >= 0) {
        const items = state.items.map((i, k) =>
          k === idx ? { ...i, quantity: Math.min(MAX_QTY, i.quantity + quantity) } : i
        )
        return { ...state, items }
      }
      return { ...state, items: [...state.items, { ...compact(product), quantity: Math.min(MAX_QTY, quantity) }] }
    }
    case 'REMOVE': {
      return { ...state, items: state.items.filter(i => i.id !== action.payload.id) }
    }
    case 'UPDATE_QTY': {
      const { id, quantity } = action.payload
      if (quantity <= 0) return { ...state, items: state.items.filter(i => i.id !== id) }
      const items = state.items.map(i => (i.id === id ? { ...i, quantity: Math.min(MAX_QTY, quantity) } : i))
      return { ...state, items }
    }
    case 'CLEAR':
      return { ...state, items: [] }
    case 'SET': // para sync entre pestañas
      return { ...state, items: Array.isArray(action.payload.items) ? action.payload.items : [] }
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitialState)

  // Persistir en LS
  useEffect(() => { persist(state) }, [state])

  // Sync entre pestañas
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === CART_STORAGE_KEY && e.newValue) {
        try {
          const next = JSON.parse(e.newValue)
          if (next && Array.isArray(next.items)) {
            dispatch({ type: 'SET', payload: { items: next.items } })
          }
        } catch {}
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  // Selectores memoizados
  const total = useMemo(() => {
    // centavos para evitar flotantes
    const cents = state.items.reduce((c, it) => c + Math.round(Number(it.price || 0) * 100) * Number(it.quantity || 0), 0)
    return cents / 100
  }, [state.items])

  const count = useMemo(() => state.items.reduce((n, it) => n + Number(it.quantity || 0), 0), [state.items])

  // Actions (API estable)
  const addToCart = useCallback((product, quantity = 1) => {
    dispatch({ type: 'ADD', payload: { product, quantity: Number(quantity || 1) } })
  }, [])

  const removeFromCart = useCallback((id) => {
    dispatch({ type: 'REMOVE', payload: { id } })
  }, [])

  const updateQuantity = useCallback((id, quantity) => {
    dispatch({ type: 'UPDATE_QTY', payload: { id, quantity: Number(quantity || 0) } })
  }, [])

  const clearCart = useCallback(() => dispatch({ type: 'CLEAR' }), [])

  const isInCart = useCallback((id) => state.items.some(i => i.id === id), [state.items])

  const getItemQuantity = useCallback((id) => {
    const it = state.items.find(i => i.id === id)
    return it ? Number(it.quantity || 0) : 0
  }, [state.items])

  const value = useMemo(() => ({
    cartItems: state.items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal: () => total,
    getCartItemsCount: () => count,
    isInCart,
    getItemQuantity,
    isLoading: false,
  }), [state.items, addToCart, removeFromCart, updateQuantity, clearCart, total, count, isInCart, getItemQuantity])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCartContext() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCartContext must be used within <CartProvider>')
  return ctx
}
