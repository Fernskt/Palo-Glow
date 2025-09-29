import { useCartContext } from '../context/CartContex.jsx'

export function useCart() {
  return useCartContext()
}
