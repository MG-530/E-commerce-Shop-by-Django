"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { api, endpoints } from "@/lib/api"
import { Warehouse, Package, AlertTriangle, TrendingUp, ArrowRight, MapPin } from "lucide-react"
import Link from "next/link"

interface WarehouseStats {
  total_warehouses: number
  total_inventory_items: number
  low_stock_items: number
  total_value: number
}

export function WarehouseOverview() {
  const [stats, setStats] = useState<WarehouseStats | null>(null)
  const [warehouses, setWarehouses] = useState([])
  const [lowStockItems, setLowStockItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWarehouseData()
  }, [])

  const fetchWarehouseData = async () => {
    try {
      const [statsResponse, warehousesResponse, lowStockResponse] = await Promise.all([
        api.get("/api/inventory/dashboard-stats/"),
        api.get(`${endpoints.warehouses}?limit=5`),
        api.get(`${endpoints.inventories}?low_stock=true&limit=5`),
      ])

      setStats(statsResponse.data)
      setWarehouses(warehousesResponse.data.results || warehousesResponse.data)
      setLowStockItems(lowStockResponse.data.results || lowStockResponse.data)
    } catch (error) {
      console.error("Failed to fetch warehouse data:", error)
      // Set default stats if API fails
      setStats({
        total_warehouses: 0,
        total_inventory_items: 0,
        low_stock_items: 0,
        total_value: 0,
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
      title: "Total Warehouses",
      value: stats?.total_warehouses || 0,
      icon: Warehouse,
      href: "/warehouse/locations",
      color: "text-blue-600",
    },
    {
      title: "Inventory Items",
      value: stats?.total_inventory_items || 0,
      icon: Package,
      href: "/warehouse/inventory",
      color: "text-green-600",
    },
    {
      title: "Low Stock Items",
      value: stats?.low_stock_items || 0,
      icon: AlertTriangle,
      href: "/warehouse/low-stock",
      color: "text-red-600",
    },
    {
      title: "Total Value",
      value: `$${stats?.total_value?.toFixed(2) || "0.00"}`,
      icon: TrendingUp,
      href: "/warehouse/inventory",
      color: "text-purple-600",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Warehouse Dashboard</h1>
        <p className="text-muted-foreground mt-1">Monitor inventory levels and warehouse operations.</p>
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
        {/* Warehouses */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Warehouse Locations</CardTitle>
              <Link href="/warehouse/locations">
                <Button variant="ghost" size="sm">
                  View All <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {warehouses.length === 0 ? (
              <div className="text-center py-8">
                <Warehouse className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No warehouses configured</p>
                <Link href="/warehouse/locations/new">
                  <Button className="mt-4">Add Warehouse</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {warehouses.map((warehouse: any) => (
                  <div key={warehouse.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{warehouse.name}</p>
                        <p className="text-sm text-muted-foreground">{warehouse.location}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{warehouse.capacity || 0} items</p>
                      <p className="text-sm text-muted-foreground">{warehouse.utilization || 0}% utilized</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Low Stock Items */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Low Stock Alert
              </CardTitle>
              <Link href="/warehouse/low-stock">
                <Button variant="ghost" size="sm">
                  View All <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {lowStockItems.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">All items are well stocked</p>
              </div>
            ) : (
              <div className="space-y-4">
                {lowStockItems.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg border-red-200">
                    <div>
                      <p className="font-medium">{item.product_name}</p>
                      <p className="text-sm text-muted-foreground">{item.warehouse_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-red-600">{item.quantity} left</p>
                      <p className="text-sm text-muted-foreground">Min: {item.min_quantity}</p>
                    </div>
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
