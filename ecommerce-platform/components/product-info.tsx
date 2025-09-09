"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { Star, ShoppingCart, Heart, Share2, Minus, Plus } from "lucide-react"

interface Product {
  id: number
  name: string
  price: number
  description: string
  category: string
  vendor: string
  rating?: number
  review_count?: number
  discount_percentage?: number
  stock_quantity?: number
  specifications?: Record<string, any>
}

interface ProductInfoProps {
  product: Product
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1)
  const { addToCart, loading } = useCart()
  const { isAuthenticated } = useAuth()

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      window.location.href = "/login"
      return
    }

    try {
      await addToCart(product.id, quantity)
    } catch (error) {
      console.error("Failed to add to cart:", error)
    }
  }

  const originalPrice = product.discount_percentage
    ? product.price / (1 - product.discount_percentage / 100)
    : product.price

  return (
    <div className="space-y-6">
      {/* Product Title & Rating */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">{product.name}</h1>
        <div className="flex items-center gap-4 mb-2">
          <Badge variant="secondary">{product.category}</Badge>
          <span className="text-muted-foreground">by {product.vendor}</span>
        </div>

        {product.rating && (
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating!) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {product.rating} ({product.review_count || 0} reviews)
            </span>
          </div>
        )}
      </div>

      <Separator />

      {/* Price */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold text-primary">${product.price}</span>
          {product.discount_percentage && (
            <span className="text-lg text-muted-foreground line-through">${originalPrice.toFixed(2)}</span>
          )}
        </div>
        {product.stock_quantity !== undefined && (
          <p className="text-sm text-muted-foreground">
            {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : "Out of stock"}
          </p>
        )}
      </div>

      <Separator />

      {/* Description */}
      <div>
        <h3 className="font-semibold mb-2">Description</h3>
        <p className="text-muted-foreground leading-relaxed">{product.description}</p>
      </div>

      {/* Specifications */}
      {product.specifications && Object.keys(product.specifications).length > 0 && (
        <>
          <Separator />
          <div>
            <h3 className="font-semibold mb-3">Specifications</h3>
            <div className="space-y-2">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-muted-foreground">{key}:</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <Separator />

      {/* Quantity & Add to Cart */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <span className="font-medium">Quantity:</span>
          <div className="flex items-center border rounded-lg">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setQuantity(quantity + 1)}
              disabled={product.stock_quantity !== undefined && quantity >= product.stock_quantity}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleAddToCart}
            disabled={loading || (product.stock_quantity !== undefined && product.stock_quantity <= 0)}
            className="flex-1 flex items-center gap-2"
            size="lg"
          >
            <ShoppingCart className="h-5 w-5" />
            {loading ? "Adding..." : "Add to Cart"}
          </Button>

          <Button variant="outline" size="lg">
            <Heart className="h-5 w-5" />
          </Button>

          <Button variant="outline" size="lg">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
