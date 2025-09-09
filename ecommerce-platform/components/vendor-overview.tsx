"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { api, endpoints } from "@/lib/api"
import { Package, Star, DollarSign, TrendingUp, ArrowRight, Eye } from "lucide-react"
import Link from "next/link"

interface VendorStats {
  total_products: number
  total_reviews: number
  average_rating: number
  total_sales: number
  monthly_revenue: number
  pending_orders: number
}

export function VendorOverview() {
  const [stats, setStats] = useState<VendorStats | null>(null)
  const [recentProducts, setRecentProducts] = useState([])
  const [recentReviews, setRecentReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVendorData()
  }, [])

  const fetchVendorData = async () => {
    try {
      const [statsResponse, productsResponse, reviewsResponse] = await Promise.all([
        api.get("/api/vendors/dashboard-stats/"),
        api.get(`${endpoints.vendorProducts}?limit=5`),
        api.get(`${endpoints.vendorReviews}?limit=5`),
      ])

      setStats(statsResponse.data)
      setRecentProducts(productsResponse.data.results || productsResponse.data)
      setRecentReviews(reviewsResponse.data.results || reviewsResponse.data)
    } catch (error) {
      console.error("Failed to fetch vendor data:", error)
      // Set default stats if API fails
      setStats({
        total_products: 0,
        total_reviews: 0,
        average_rating: 0,
        total_sales: 0,
        monthly_revenue: 0,
        pending_orders: 0,
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64 bg-muted rounded"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  const statCards = [
    {
      title: "Total Products",
      value: stats?.total_products || 0,
      icon: Package,
      href: "/vendor/products",
      color: "text-blue-600",
    },
    {
      title: "Average Rating",
      value: stats?.average_rating ? `${stats.average_rating.toFixed(1)}★` : "0★",
      icon: Star,
      href: "/vendor/reviews",
      color: "text-yellow-600",
    },
    {
      title: "Monthly Revenue",
      value: `$${stats?.monthly_revenue?.toFixed(2) || "0.00"}`,
      icon: DollarSign,
      href: "/vendor/orders",
      color: "text-green-600",
    },
    {
      title: "Total Sales",
      value: stats?.total_sales || 0,
      icon: TrendingUp,
      href: "/vendor/orders",
      color: "text-purple-600",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Vendor Dashboard</h1>
        <p className="text-muted-foreground mt-1">Manage your products and track your performance.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                <Link href={stat.href}>
                  <Button variant="ghost" size="sm" className="mt-3 p-0 h-auto">
                    View details <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Products */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Products</CardTitle>
              <Link href="/vendor/products">
                <Button variant="ghost" size="sm">
                  View All <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentProducts.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No products yet</p>
                <Link href="/vendor/products/new">
                  <Button className="mt-4">Add Your First Product</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentProducts.map((product: any) => (
                  <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium line-clamp-1">{product.name}</p>
                      <p className="text-sm text-muted-foreground">${product.price}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{product.stock || 0} in stock</span>
                      <Link href={`/vendor/products/${product.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Reviews */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Reviews</CardTitle>
              <Link href="/vendor/reviews">
                <Button variant="ghost" size="sm">
                  View All <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentReviews.length === 0 ? (
              <div className="text-center py-8">
                <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No reviews yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentReviews.map((review: any) => (
                  <div key={review.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{review.user}</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
