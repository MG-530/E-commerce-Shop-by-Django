"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { api, endpoints } from "@/lib/api"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { ShoppingCart, Star, AlertCircle, Wifi } from "lucide-react"
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

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      const response = await api.get(`${endpoints.products}?featured=true&limit=8`)
      setProducts(response.data.results || response.data)
      setError(null)
    } catch (error: any) {
      console.error("Failed to fetch featured products:", error)
      if (error.code === "ERR_NETWORK" || error.message === "Network Error") {
        setError("Unable to connect to the API. Please check if NEXT_PUBLIC_API_BASE_URL is configured correctly.")
      } else {
        setError("Failed to load featured products. Please try again later.")
      }
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
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
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
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Featured Products</h2>
            <p className="text-muted-foreground">Discover our handpicked selection of top-rated products</p>
          </div>

          <Card className="max-w-md mx-auto p-8 text-center">
            <Wifi className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Connection Error</h3>
            <p className="text-muted-foreground mb-4 text-sm">{error}</p>
            <Button onClick={fetchFeaturedProducts} variant="outline">
              <AlertCircle className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </Card>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Featured Products</h2>
          <p className="text-muted-foreground">Discover our handpicked selection of top-rated products</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-shadow">
              <div className="relative">
                <Image
                  src={
                    product.image_url || `/placeholder.svg?height=200&width=300&query=${encodeURIComponent(product.name)}`
                  }
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
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-sm text-muted-foreground mt-1">{product.vendor}</p>

                {product.rating && (
                  <div className="flex items-center mt-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-muted-foreground ml-1">{product.rating}</span>
                  </div>
                )}

                <div className="flex items-center justify-between mt-3">
                  <span className="text-lg font-bold text-primary">${Number(product.price).toFixed(2)}</span>
                  <Badge variant="secondary">{product.category_name}</Badge>
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-0">
                <Button
                  onClick={() => handleAddToCart(product.id)}
                  className="w-full flex items-center gap-2"
                  size="sm"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/products">
            <Button variant="outline" size="lg">
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
