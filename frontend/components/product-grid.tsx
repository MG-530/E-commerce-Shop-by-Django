"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { ShoppingCart, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Product {
  id: number
  name: string
  product_name: string
  price: number
  description: string
  image_url?: string
  category: number
  category_name: string
  vendor: string
  rating?: number
  discount_percentage?: number
  sku: string
  weight: number
  dimensions: string
  status: string
}

interface ProductGridProps {
  products: Product[]
  loading: boolean
}

export function ProductGrid({ products, loading }: ProductGridProps) {
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()

  const handleAddToCart = async (productId: number) => {
    if (!isAuthenticated) {
      window.location.href = "/login"
      return
    }

    try {
      await addToCart(productId, 1)
    } catch (error) {
      console.error("Failed to add to cart:", error)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(12)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-48 bg-muted rounded-t-lg"></div>
            <CardContent className="p-4">
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-3 bg-muted rounded w-2/3 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No products found matching your criteria.</p>
        <p className="text-muted-foreground">Try adjusting your filters or search terms.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="group hover:shadow-lg transition-shadow">
          <div className="relative">
            <Image
              src={product.image_url || `/placeholder.svg?height=200&width=300&query=${encodeURIComponent(product.name)}`}
              alt={product.name}
              width={300}
              height={200}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            {product.discount_percentage && (
              <Badge className="absolute top-2 right-2 bg-destructive">-{product.discount_percentage}%</Badge>
            )}
          </div>

          <CardContent className="p-4">
            <Link href={`/products/${product.id}`}>
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-1">
                {product.name}
              </h3>
            </Link>
            <p className="text-sm text-muted-foreground mb-2">{product.vendor}</p>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{product.description}</p>

            {product.rating && (
              <div className="flex items-center mb-3">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm text-muted-foreground ml-1">{product.rating}</span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-primary">${Number(product.price).toFixed(2)}</span>
              <Badge variant="secondary">{product.category_name}</Badge>
            </div>
          </CardContent>

          <CardFooter className="p-4 pt-0">
            <Button onClick={() => handleAddToCart(product.id)} className="w-full flex items-center gap-2" size="sm">
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
