"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { api, endpoints } from "@/lib/api"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { ShoppingCart, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Product {
  id: number
  name: string
  price: number
  image?: string
  category: string
  vendor: string
  rating?: number
  discount_percentage?: number
}

interface RelatedProductsProps {
  category: string
  currentProductId: number
}

export function RelatedProducts({ category, currentProductId }: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    fetchRelatedProducts()
  }, [category, currentProductId])

  const fetchRelatedProducts = async () => {
    try {
      const response = await api.get(`${endpoints.products}?category=${category}&limit=4`)
      const allProducts = response.data.results || response.data
      // Filter out current product
      const relatedProducts = allProducts.filter((p: Product) => p.id !== currentProductId)
      setProducts(relatedProducts.slice(0, 4))
    } catch (error) {
      console.error("Failed to fetch related products:", error)
    } finally {
      setLoading(false)
    }
  }

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
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Related Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-muted rounded-t-lg"></div>
              <CardContent className="p-4">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Related Products</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="group hover:shadow-lg transition-shadow">
            <div className="relative">
              <Image
                src={product.image || `/placeholder.svg?height=200&width=300&query=${encodeURIComponent(product.name)}`}
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

              {product.rating && (
                <div className="flex items-center mb-3">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-muted-foreground ml-1">{product.rating}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-primary">${product.price}</span>
                <Badge variant="secondary">{product.category}</Badge>
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
    </div>
  )
}
