import { createContext, useContext, useState, useMemo, useCallback } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])

  const addItem = useCallback((item, vendor) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id)
      if (existing) {
        return prev.map((c) => (c.id === item.id ? { ...c, qty: c.qty + 1 } : c))
      }
      return [...prev, { ...item, qty: 1, vendorId: vendor.id, vendorName: vendor.name, vendorColor: vendor.color }]
    })
  }, [])

  const decreaseItem = useCallback((itemId) => {
    setCart((prev) =>
      prev
        .map((c) => (c.id === itemId ? { ...c, qty: c.qty - 1 } : c))
        .filter((c) => c.qty > 0)
    )
  }, [])

  const removeItem = useCallback((itemId) => {
    setCart((prev) => prev.filter((c) => c.id !== itemId))
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  const totalItems = useMemo(() => cart.reduce((s, i) => s + i.qty, 0), [cart])
  const totalPrice = useMemo(() => cart.reduce((s, i) => s + i.price * i.qty, 0), [cart])

  const value = { cart, addItem, decreaseItem, removeItem, clearCart, totalItems, totalPrice }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
