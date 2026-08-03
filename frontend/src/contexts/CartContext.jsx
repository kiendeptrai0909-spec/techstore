import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { cartApi } from '../api/cartApi'
import { useAuth } from '../hooks/useAuth'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(false)

  const cartCount = useMemo(() => {
    return cartItems.reduce((total, item) => {
      return total + Number(item.quantity || 0)
    }, 0)
  }, [cartItems])

  const normalizeCartItems = (data) => {
    if (Array.isArray(data)) return data

    if (Array.isArray(data?.items)) return data.items

    if (Array.isArray(data?.cartItems)) return data.cartItems

    if (Array.isArray(data?.content)) return data.content

    return []
  }

  const fetchCart = async () => {
    if (!isAuthenticated) {
      setCartItems([])
      return
    }

    setLoading(true)

    try {
      const data = await cartApi.getCart()
      setCartItems(normalizeCartItems(data))
    } catch (error) {
      console.error('Fetch cart failed:', error)
      setCartItems([])
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async ({ variantId, quantity = 1 }) => {
    await cartApi.addToCart({
      productVariantId: variantId,
      variantId,
      quantity,
    })

    await fetchCart()
  }

  const refreshCart = async () => {
    await fetchCart()
  }

  const clearCartState = () => {
    setCartItems([])
  }

  useEffect(() => {
    fetchCart()
  }, [isAuthenticated])

  const value = {
    cartItems,
    cartCount,
    loading,
    fetchCart,
    refreshCart,
    addToCart,
    clearCartState,
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart must be used inside CartProvider')
  }

  return context
}