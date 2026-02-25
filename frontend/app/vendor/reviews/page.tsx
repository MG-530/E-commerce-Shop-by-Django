"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { VendorLayout } from "@/components/vendor-layout"
import { VendorReviewsList } from "@/components/vendor-reviews-list"
import { ReviewFilters } from "@/components/vendor-review-filters"
import { api, endpoints } from "@/lib/api"

interface VendorReview {
  id: number
  product_name: string
  user: string
  rating: number
  comment: string
  created_at: string
  product_id: number
}

export default function VendorReviewsPage() {
  const [reviews, setReviews] = useState<VendorReview[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    rating: "",
    product: "",
    dateRange: "",
  })

  useEffect(() => {
    fetchReviews()
  }, [filters])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()

      if (filters.rating) params.append("rating", filters.rating)
      if (filters.product) params.append("product", filters.product)
      if (filters.dateRange) params.append("date_range", filters.dateRange)

      const response = await api.get(`${endpoints.vendorReviews}?${params.toString()}`)
      setReviews(response.data.results || response.data)
    } catch (error) {
      console.error("Failed to fetch reviews:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <VendorLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Product Reviews</h1>
            <p className="text-muted-foreground mt-1">Monitor customer feedback on your products</p>
          </div>

          <ReviewFilters filters={filters} onFilterChange={setFilters} />
          <VendorReviewsList reviews={reviews} loading={loading} />
        </div>
      </VendorLayout>
    </div>
  )
}
