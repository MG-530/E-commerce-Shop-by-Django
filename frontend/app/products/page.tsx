"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { ProductGrid } from "@/components/product-grid"
import { ProductFilters } from "@/components/product-filters"
import { SearchBar } from "@/components/search-bar"
import { api, endpoints } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { SlidersHorizontal } from "lucide-react"

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

interface Category {
  id: number
  name: string
  slug: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    sortBy: "name",
  })

  useEffect(() => {
    fetchCategories()
    fetchProducts()
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [filters])

  const fetchCategories = async () => {
    try {
      const response = await api.get(endpoints.categories)
      setCategories(response.data.results || response.data)
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    }
  }

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()

      if (filters.search) params.append("search", filters.search)
      if (filters.category) params.append("category", filters.category)
      if (filters.minPrice) params.append("min_price", filters.minPrice)
      if (filters.maxPrice) params.append("max_price", filters.maxPrice)
      if (filters.sortBy) params.append("ordering", filters.sortBy)

      const response = await api.get(`${endpoints.products}?${params.toString()}`)
      setProducts(response.data.results || response.data)
    } catch (error) {
      console.error("Failed to fetch products:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className={`lg:w-64 ${showFilters ? "block" : "hidden lg:block"}`}>
            <div className="sticky top-8">
              <ProductFilters categories={categories} filters={filters} onFilterChange={handleFilterChange} />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Products</h1>
                <p className="text-muted-foreground mt-1">
                  {loading ? "Loading..." : `${products.length} products found`}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <SearchBar value={filters.search} onChange={(value) => handleFilterChange({ search: value })} />
                <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="lg:hidden">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Products Grid */}
            <ProductGrid products={products} loading={loading} />
          </div>
        </div>
      </main>
    </div>
  )
}
