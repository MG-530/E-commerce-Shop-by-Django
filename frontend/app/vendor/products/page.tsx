"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { VendorLayout } from "@/components/vendor-layout"
import { VendorProductsList } from "@/components/vendor-products-list"
import { ProductFilters } from "@/components/vendor-product-filters"
import { Button } from "@/components/ui/button"
import { api, endpoints } from "@/lib/api"
import { Plus } from "lucide-react"
import Link from "next/link"

interface VendorProduct {
  id: number
  name: string
  price: number
  description: string
  image?: string
  category: string
  stock_quantity: number
  status: string
  created_at: string
}

export default function VendorProductsPage() {
  const [products, setProducts] = useState<VendorProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: "",
    category: "",
    search: "",
  })

  useEffect(() => {
    fetchProducts()
  }, [filters])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()

      if (filters.status) params.append("status", filters.status)
      if (filters.category) params.append("category", filters.category)
      if (filters.search) params.append("search", filters.search)

      const response = await api.get(`${endpoints.vendorProducts}?${params.toString()}`)
      setProducts(response.data.results || response.data)
    } catch (error) {
      console.error("Failed to fetch products:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (productId: number) => {
    try {
      await api.delete(`${endpoints.vendorProducts}${productId}/`)
      await fetchProducts()
    } catch (error) {
      console.error("Failed to delete product:", error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <VendorLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Products</h1>
              <p className="text-muted-foreground mt-1">Manage your product catalog</p>
            </div>

            <Link href="/vendor/products/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </Link>
          </div>

          <ProductFilters filters={filters} onFilterChange={setFilters} />
          <VendorProductsList products={products} loading={loading} onDelete={handleDelete} />
        </div>
      </VendorLayout>
    </div>
  )
}
