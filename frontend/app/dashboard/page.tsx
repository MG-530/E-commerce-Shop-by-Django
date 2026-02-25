"use client"

import { Navigation } from "@/components/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardOverview } from "@/components/dashboard-overview"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <DashboardLayout>
        <DashboardOverview />
      </DashboardLayout>
    </div>
  )
}
