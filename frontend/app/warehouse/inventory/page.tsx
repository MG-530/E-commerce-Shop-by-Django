"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { WarehouseLayout } from "@/components/warehouse-layout"
import { InventoryList } from "@/components/inventory-list"
import { InventoryFilters } from "@/components/inventory-filters"
import { Button } from "@/components/ui/button"
import { api, endpoints } from "@/lib/api"
import { Plus } from "lucide-react"
import Link from "next/link"

interface InventoryItem {
  id: number
  product_name: string
  product_id: number
  warehouse_name: string
  warehouse_id: number
  quantity: number
  min_quantity: number
  max_quantity: number
  unit_cost: number
  last_updated: string
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    warehouse: "",
    product: "",
    stockLevel: "",
    search: "",
  })

  useEffect(() => {
    fetchInventory()
  }, [filters])

  const fetchInventory = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()

      if (filters.warehouse) params.append("warehouse", filters.warehouse)
      if (filters.product) params.append("product", filters.product)
      if (filters.stockLevel) params.append("stock_level", filters.stockLevel)
      if (filters.search) params.append("search", filters.search)

      const response = await api.get(`${endpoints.inventories}?${params.toString()}`)
      setInventory(response.data.results || response.data)
    } catch (error) {
      console.error("Failed to fetch inventory:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStock = async (itemId: number, newQuantity: number) => {
    try {
      await api.patch(`${endpoints.inventories}${itemId}/`, { quantity: newQuantity })
      await fetchInventory()
    } catch (error) {
      console.error("Failed to update stock:", error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <WarehouseLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Inventory Management</h1>
              <p className="text-muted-foreground mt-1">Monitor and manage stock levels across warehouses</p>
            </div>

            <Link href="/warehouse/inventory/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Inventory
              </Button>
            </Link>
          </div>

          <InventoryFilters filters={filters} onFilterChange={setFilters} />
          <InventoryList inventory={inventory} loading={loading} onUpdateStock={handleUpdateStock} />
        </div>
      </WarehouseLayout>
    </div>
  )
}
