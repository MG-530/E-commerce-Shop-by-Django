"use client"

import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, User, Package } from "lucide-react"

export function Navigation() {
  const { user, logout, isAuthenticated } = useAuth()
  const { cart } = useCart()

  return (
    <nav className="bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Package className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">MarketPlace</span>
          </Link>

          {/* Role-based Navigation Tabs */}
          {isAuthenticated && (
            <div className="flex space-x-1">
              <Link href="/">
                <Button variant="ghost" className="text-sm">
                  Customer
                </Button>
              </Link>
              {user?.user_type === "vendor" && (
                <Link href="/vendor">
                  <Button variant="ghost" className="text-sm">
                    Vendor
                  </Button>
                </Link>
              )}
              {user?.user_type === "warehouse" && (
                <Link href="/warehouse">
                  <Button variant="ghost" className="text-sm">
                    Warehouse
                  </Button>
                </Link>
              )}
            </div>
          )}

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link href="/cart" className="relative">
                  <Button variant="ghost" size="sm">
                    <ShoppingCart className="h-5 w-5" />
                    {cart?.item_count && cart.item_count > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                        {cart.item_count}
                      </Badge>
                    )}
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <div className="flex space-x-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
