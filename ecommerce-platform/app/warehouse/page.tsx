"use client"

import { Navigation } from "@/components/navigation"
import { WarehouseLayout } from "@/components/warehouse-layout"
import { WarehouseOverview } from "@/components/warehouse-overview"

export default function WarehouseDashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <WarehouseLayout>
        <WarehouseOverview />
      </WarehouseLayout>
    </div>
  )
}
