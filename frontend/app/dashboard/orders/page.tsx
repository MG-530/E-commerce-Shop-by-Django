"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { OrdersList } from "@/components/orders-list"
import { OrderFilters } from "@/components/order-filters"
import { api, endpoints } from "@/lib/api"

interface Order {
  id: string
  order_number?: string
  total_amount?: number
  status: string
  created_at: string
  items_count?: number
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: "",
    dateRange: "",
  })

  useEffect(() => {
    fetchOrders()
  }, [filters])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()

      if (filters.status) params.append("status", filters.status)
      if (filters.dateRange) params.append("date_range", filters.dateRange)

      const response = await api.get(`${endpoints.orders}?${params.toString()}`)
      setOrders(response.data.results || response.data)
    } catch (error) {
      console.error("Failed to fetch orders:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Orders</h1>
            <p className="text-muted-foreground mt-1">Track and manage your orders</p>
          </div>

          <OrderFilters filters={filters} onFilterChange={setFilters} />
          <OrdersList orders={orders} loading={loading} />
        </div>
      </DashboardLayout>
    </div>
  )
}
