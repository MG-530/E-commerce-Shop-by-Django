"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Warehouse, MapPin, Phone, User, Edit, Eye } from "lucide-react"
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

interface WarehouseLocationsListProps {
  warehouses: WarehouseLocation[]
  loading: boolean
}

export function WarehouseLocationsList({ warehouses, loading }: WarehouseLocationsListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded w-1/3 mb-4"></div>
              <div className="h-3 bg-muted rounded w-full mb-2"></div>
              <div className="h-3 bg-muted rounded w-2/3 mb-4"></div>
              <div className="h-2 bg-muted rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (warehouses.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Warehouse className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Warehouses Found</h3>
          <p className="text-muted-foreground mb-6">Add your first warehouse location to get started.</p>
          <Link href="/warehouse/locations/new">
            <Button>Add Warehouse</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-red-100 text-red-800"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return "bg-red-500"
    if (utilization >= 75) return "bg-yellow-500"
    return "bg-green-500"
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {warehouses.map((warehouse) => (
        <Card key={warehouse.id} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <Warehouse className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-semibold text-foreground">{warehouse.name}</h3>
                  <Badge className={getStatusColor(warehouse.status)}>{warehouse.status}</Badge>
                </div>
              </div>

              <div className="flex gap-2">
                <Link href={`/warehouse/locations/${warehouse.id}`}>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href={`/warehouse/locations/${warehouse.id}/edit`}>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div className="text-sm">
                  <p>{warehouse.address}</p>
                  <p>
                    {warehouse.city}, {warehouse.state} {warehouse.zip_code}
                  </p>
                </div>
              </div>

              {warehouse.manager_name && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{warehouse.manager_name}</span>
                </div>
              )}

              {warehouse.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{warehouse.phone}</span>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Capacity Utilization</span>
                  <span>{warehouse.current_utilization}%</span>
                </div>
                <Progress
                  value={warehouse.current_utilization}
                  className="h-2"
                  // className={`h-2 ${getUtilizationColor(warehouse.current_utilization)}`}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0</span>
                  <span>{warehouse.capacity} items</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
