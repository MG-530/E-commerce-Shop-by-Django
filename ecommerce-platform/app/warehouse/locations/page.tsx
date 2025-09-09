"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { WarehouseLayout } from "@/components/warehouse-layout"
import { WarehouseLocationsList } from "@/components/warehouse-locations-list"
import { Button } from "@/components/ui/button"
import { api, endpoints } from "@/lib/api"
import { Plus } from "lucide-react"
import Link from "next/link"

interface WarehouseLocation {
  id: number
  name: string
  address: string
  city: string
  state: string
  zip_code: string
  capacity: number
  current_utilization: number
  manager_name?: string
  phone?: string
  status: string
}

export default function WarehouseLocationsPage() {
  const [warehouses, setWarehouses] = useState<WarehouseLocation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWarehouses()
  }, [])

  const fetchWarehouses = async () => {
    try {
      const response = await api.get(endpoints.warehouses)
      setWarehouses(response.data.results || response.data)
    } catch (error) {
      console.error("Failed to fetch warehouses:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <WarehouseLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Warehouse Locations</h1>
              <p className="text-muted-foreground mt-1">Manage your warehouse facilities and locations</p>
            </div>

            <Link href="/warehouse/locations/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Warehouse
              </Button>
            </Link>
          </div>

          <WarehouseLocationsList warehouses={warehouses} loading={loading} />
        </div>
      </WarehouseLayout>
    </div>
  )
}
