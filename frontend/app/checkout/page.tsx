"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { CheckoutForm } from "@/components/checkout-form"
import { OrderSummary } from "@/components/order-summary"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { api, endpoints } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { ShoppingBag } from "lucide-react"
import Link from "next/link"

export default function CheckoutPage() {
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState("")
  const { cart, clearCart } = useCart()
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-4">Please Sign In</h1>
            <p className="text-muted-foreground mb-6">You need to be signed in to checkout.</p>
            <Link href="/login">
              <Button>Sign In</Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-4">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-6">Add some products before checking out.</p>
            <Link href="/products">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  const handlePlaceOrder = async (_orderData: any) => {
    try {
      setProcessing(true)
      setError("")

      // Backend creates order from authenticated user's cart; pass address_id if provided
      const payload = _orderData?.address_id ? { address_id: Number(_orderData.address_id) } : undefined
      const response = await api.post(endpoints.createOrder, payload)

      // Redirect to success page
      const orderId = response.data?.order_id || response.data?.id
      router.push(`/checkout/success?order=${orderId}`)
    } catch (err: any) {
      const data = err?.response?.data
      const msg = data?.error || data?.message || data?.detail || "Failed to place order. Please try again."
      setError(msg)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Checkout</h1>
          <p className="text-muted-foreground mt-1">Complete your order</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-destructive">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div>
            <CheckoutForm onSubmit={handlePlaceOrder} processing={processing} />
          </div>

          {/* Order Summary */}
          <div>
            <OrderSummary />
          </div>
        </div>
      </main>
    </div>
  )
}
