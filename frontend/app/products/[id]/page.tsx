"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { ProductImages } from "@/components/product-images"
import { ProductInfo } from "@/components/product-info"
import { ProductReviews } from "@/components/product-reviews"
import { RelatedProducts } from "@/components/related-products"
import { api, endpoints } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"

interface Product {
  id: number
  name: string
  price: number
  description: string
  images?: string[]
  category: string
  vendor: string
  rating?: number
  review_count?: number
  discount_percentage?: number
  stock_quantity?: number
  specifications?: Record<string, any>
}

export default function ProductDetailPage() {
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchProduct(params.id as string)
    }
  }, [params.id])

  const fetchProduct = async (id: string) => {
    try {
      setLoading(true)
      const response = await api.get(endpoints.productDetail(id))
      setProduct(response.data)
    } catch (error) {
      console.error("Failed to fetch product:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <Skeleton className="h-96 w-full" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-10 w-1/3" />
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-foreground mb-4">Product Not Found</h1>
            <p className="text-muted-foreground">The product you're looking for doesn't exist.</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <ProductImages product={product} />
          <ProductInfo product={product} />
        </div>

        {/* Reviews Section */}
        <ProductReviews productId={product.id} />

        {/* Related Products */}
        <RelatedProducts category={product.category} currentProductId={product.id} />
      </main>
    </div>
  )
}
