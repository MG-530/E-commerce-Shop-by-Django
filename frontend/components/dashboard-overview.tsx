"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { api, endpoints } from "@/lib/api"
import { Package, Heart, MapPin, MessageSquare, ArrowRight } from "lucide-react"
import Link from "next/link"

interface DashboardStats {
  total_orders: number
  pending_orders: number
  wishlist_items: number
  addresses_count: number
  open_tickets: number
}

export function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch dashboard stats and recent orders
      const [statsResponse, ordersResponse] = await Promise.all([
        api.get("/api/users/dashboard-stats/"),
        api.get(`${endpoints.orders}?limit=3`),
      ])

      setStats(statsResponse.data)
      setRecentOrders(ordersResponse.data.results || ordersResponse.data)
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
      // Set default stats if API fails
      setStats({
        total_orders: 0,
        pending_orders: 0,
        wishlist_items: 0,
        addresses_count: 0,
        open_tickets: 0,
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
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  const statCards = [
    {
      title: "Total Orders",
      value: stats?.total_orders || 0,
      icon: Package,
      href: "/dashboard/orders",
      color: "text-blue-600",
    },
    {
      title: "Pending Orders",
      value: stats?.pending_orders || 0,
      icon: Package,
      href: "/dashboard/orders?status=pending",
      color: "text-orange-600",
    },
    {
      title: "Wishlist Items",
      value: stats?.wishlist_items || 0,
      icon: Heart,
      href: "/dashboard/wishlist",
      color: "text-red-600",
    },
    {
      title: "Support Tickets",
      value: stats?.open_tickets || 0,
      icon: MessageSquare,
      href: "/dashboard/support",
      color: "text-green-600",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here's an overview of your account.</p>
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
                    View all <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>
            <Link href="/dashboard/orders">
              <Button variant="ghost" size="sm">
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No orders yet</p>
              <Link href="/products">
                <Button className="mt-4">Start Shopping</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order: any) => (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Order #{order.order_number}</p>
                    <p className="text-sm text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${order.total_amount}</p>
                    <p className="text-sm text-muted-foreground capitalize">{order.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <MapPin className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Manage Addresses</h3>
            <p className="text-sm text-muted-foreground mb-4">Add or update your shipping addresses</p>
            <Link href="/dashboard/addresses">
              <Button variant="outline" size="sm">
                Manage
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Heart className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Your Wishlist</h3>
            <p className="text-sm text-muted-foreground mb-4">View and manage your saved items</p>
            <Link href="/dashboard/wishlist">
              <Button variant="outline" size="sm">
                View Wishlist
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <MessageSquare className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Get Support</h3>
            <p className="text-sm text-muted-foreground mb-4">Need help? Contact our support team</p>
            <Link href="/dashboard/support">
              <Button variant="outline" size="sm">
                Contact Support
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
