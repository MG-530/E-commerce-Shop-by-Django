"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"
import { Minus, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function CartItems() {
  const { cart, updateQuantity, removeFromCart, loading } = useCart()

  if (!cart || cart.items.length === 0) {
    return null
  }

  const handleQuantityChange = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return
    try {
      await updateQuantity(itemId, newQuantity)
    } catch (error) {
      console.error("Failed to update quantity:", error)
    }
  }

  const handleRemoveItem = async (itemId: number) => {
    try {
      await removeFromCart(itemId)
    } catch (error) {
      console.error("Failed to remove item:", error)
    }
  }

  return (
    <div className="space-y-4">
      {cart.items.map((item) => (
        <Card key={item.id}>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Product Image */}
              <div className="flex-shrink-0">
                <Image
                  src={
                    item.product.image ||
                    `/placeholder.svg?height=120&width=120&query=${encodeURIComponent(item.product.product_name)}`
                  }
                  alt={item.product.product_name}
                  width={120}
                  height={120}
                  className="w-24 h-24 sm:w-30 sm:h-30 object-cover rounded-lg"
                />
              </div>

              {/* Product Details */}
              <div className="flex-1 min-w-0">
                <Link href={`/products/${item.product.id}`}>
                  <h3 className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-2">
                    {item.product.product_name}
                  </h3>
                </Link>

                <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-bold text-primary">${Number(item.product.price).toFixed(2)}</span>

                    {/* Quantity Controls */}
                    <div className="flex items-center border rounded-lg">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={loading || item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="px-4 py-2 min-w-[3rem] text-center">{item.quantity}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        disabled={loading}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <span className="text-lg font-semibold">${Number(item.total_price ?? (Number(item.product.price) * item.quantity)).toFixed(2)}</span>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={loading}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
