"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { api, endpoints } from "@/lib/api"
import { useAuth } from "./auth-context"

interface CartItem {
  id: number
  product: {
    id: number
    product_name: string
    price: number
    image?: string
  }
  quantity: number
  total_price: number
}

interface Cart {
  id: number
  items: CartItem[]
  total_amount: number
  item_count: number
}

interface CartContextType {
  cart: Cart | null
  addToCart: (productId: number, quantity: number) => Promise<void>
  updateQuantity: (itemId: number, quantity: number) => Promise<void>
  removeFromCart: (itemId: number) => Promise<void>
  clearCart: () => Promise<void>
  loading: boolean
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(false)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      refreshCart()
    }
  }, [isAuthenticated])

  const refreshCart = async () => {
    if (!isAuthenticated) return

    try {
      setLoading(true)
      const response = await api.get(endpoints.carts)
      setCart(response.data)
    } catch (error) {
      console.error("Failed to fetch cart:", error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (productId: number, quantity: number) => {
    try {
      setLoading(true)
      await api.post(endpoints.cartItems, {
        product_id: productId,
        quantity,
      })
      await refreshCart()
    } catch (error) {
      console.error("Failed to add to cart:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (itemId: number, quantity: number) => {
    try {
      setLoading(true)
      await api.patch(`${endpoints.cartItems}${itemId}/`, { quantity })
      await refreshCart()
    } catch (error) {
      console.error("Failed to update quantity:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const removeFromCart = async (itemId: number) => {
    try {
      setLoading(true)
      await api.delete(`${endpoints.cartItems}${itemId}/`)
      await refreshCart()
    } catch (error) {
      console.error("Failed to remove from cart:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const clearCart = async () => {
    try {
      setLoading(true)
      if (cart?.items) {
        await Promise.all(cart.items.map((item) => api.delete(`${endpoints.cartItems}${item.id}/`)))
      }
      await refreshCart()
    } catch (error) {
      console.error("Failed to clear cart:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const value = {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    loading,
    refreshCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
