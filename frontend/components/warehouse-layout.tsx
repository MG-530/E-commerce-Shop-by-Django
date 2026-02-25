"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Warehouse, Package, BarChart3, AlertTriangle, Settings, Menu, X, Plus } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface WarehouseLayoutProps {
  children: React.ReactNode
}

export function WarehouseLayout({ children }: WarehouseLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, isAuthenticated } = useAuth()
  const pathname = usePathname()

  if (!isAuthenticated || user?.user_type !== "warehouse") {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-foreground mb-4">Warehouse Access Required</h1>
          <p className="text-muted-foreground mb-6">
            You need to be signed in as a warehouse manager to access this dashboard.
          </p>
          <Link href="/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    )
  }

  const navigation = [
    { name: "Overview", href: "/warehouse", icon: BarChart3 },
    { name: "Warehouses", href: "/warehouse/locations", icon: Warehouse },
    { name: "Inventory", href: "/warehouse/inventory", icon: Package },
    { name: "Low Stock", href: "/warehouse/low-stock", icon: AlertTriangle },
    { name: "Settings", href: "/warehouse/settings", icon: Settings },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Mobile menu button */}
        <div className="lg:hidden">
          <Button variant="outline" onClick={() => setSidebarOpen(!sidebarOpen)} className="mb-4">
            {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            Menu
          </Button>
        </div>

        {/* Sidebar */}
        <aside className={`lg:w-64 ${sidebarOpen ? "block" : "hidden lg:block"}`}>
          <Card className="sticky top-8">
            <CardContent className="p-6">
              {/* Warehouse Info */}
              <div className="mb-6">
                <h2 className="font-semibold text-foreground">Warehouse Management</h2>
                <p className="text-sm text-muted-foreground">
                  {user?.first_name} {user?.last_name}
                </p>
              </div>

              {/* Quick Action */}
              <Link href="/warehouse/inventory/new">
                <Button className="w-full mb-6">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Inventory
                </Button>
              </Link>

              {/* Navigation */}
              <nav className="space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.name}
                    </Link>
                  )
                })}
              </nav>
            </CardContent>
          </Card>
        </aside>

        {/* Main Content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
