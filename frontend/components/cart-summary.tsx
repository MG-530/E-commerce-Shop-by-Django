"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/contexts/cart-context"
import { ShoppingCart, CreditCard } from "lucide-react"
import Link from "next/link"

export function CartSummary() {
  const { cart } = useCart()

  if (!cart || cart.items.length === 0) {
    return null
  }

  const subtotal = cart.total_amount
  const shipping = subtotal > 50 ? 0 : 9.99
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + shipping + tax

  return (
    <Card className="sticky top-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Order Summary
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal ({cart.item_count} items)</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
          </div>

          <div className="flex justify-between">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>

          {shipping === 0 && <p className="text-sm text-green-600">🎉 Free shipping on orders over $50!</p>}
        </div>

        <Separator />

        <div className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-3">
        <Link href="/checkout" className="w-full">
          <Button className="w-full flex items-center gap-2" size="lg">
            <CreditCard className="h-5 w-5" />
            Proceed to Checkout
          </Button>
        </Link>

        <Link href="/products" className="w-full">
          <Button variant="outline" className="w-full bg-transparent" size="lg">
            Continue Shopping
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
