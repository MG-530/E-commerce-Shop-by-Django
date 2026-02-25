"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/contexts/cart-context"
import Image from "next/image"

export function OrderSummary() {
  const { cart } = useCart()

  if (!cart || cart.items.length === 0) {
    return null
  }

  const subtotal = cart.total_amount
  const shipping = subtotal > 50 ? 0 : 9.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  return (
    <Card className="sticky top-8">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Items */}
        <div className="space-y-3">
          {cart.items.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <div className="relative">
                <Image
                  src={
                    item.product.image ||
                    `/placeholder.svg?height=60&width=60&query=${encodeURIComponent(item.product.name)}`
                  }
                  alt={item.product.name}
                  width={60}
                  height={60}
                  className="w-15 h-15 object-cover rounded-lg"
                />
                <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {item.quantity}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm line-clamp-2">{item.product.name}</p>
                <p className="text-sm text-muted-foreground">${item.product.price}</p>
              </div>

              <div className="text-sm font-medium">${item.total_price.toFixed(2)}</div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Totals */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>

          <Separator />

          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
