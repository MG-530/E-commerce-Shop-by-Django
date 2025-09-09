"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Package, Star, Truck } from "lucide-react"

interface Stats {
  totalProducts: number
  totalVendors: number
  totalOrders: number
  averageRating: number
}

export function StatsSection() {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalVendors: 0,
    totalOrders: 0,
    averageRating: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading stats (in a real app, you'd fetch from an API)
    const timer = setTimeout(() => {
      setStats({
        totalProducts: 1250,
        totalVendors: 45,
        totalOrders: 8900,
        averageRating: 4.8
      })
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const statItems = [
    {
      icon: Package,
      label: "Products",
      value: stats.totalProducts.toLocaleString(),
      description: "Available items"
    },
    {
      icon: Users,
      label: "Vendors",
      value: stats.totalVendors.toLocaleString(),
      description: "Trusted sellers"
    },
    {
      icon: Truck,
      label: "Orders",
      value: stats.totalOrders.toLocaleString(),
      description: "Completed orders"
    },
    {
      icon: Star,
      label: "Rating",
      value: stats.averageRating.toFixed(1),
      description: "Average rating"
    }
  ]

  if (loading) {
    return (
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statItems.map((item, index) => {
            const Icon = item.icon
            return (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-foreground mb-1">{item.value}</h3>
                  <p className="text-sm font-medium text-foreground mb-1">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
