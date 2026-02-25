"use client"

import { Navigation } from "@/components/navigation"
import { VendorLayout } from "@/components/vendor-layout"
import { VendorOverview } from "@/components/vendor-overview"

export default function VendorDashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <VendorLayout>
        <VendorOverview />
      </VendorLayout>
    </div>
  )
}
