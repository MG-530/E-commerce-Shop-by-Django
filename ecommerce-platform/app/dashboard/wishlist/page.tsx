"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart, Eye, Trash2 } from "lucide-react"
import Link from "next/link"
import { api, endpoints } from "@/lib/api"

interface WishlistItem {
  id: string
  product: {
    id: string
    product_name: string
    price: string
    image_url?: string
    category: string
  }
  added_at: string
}

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWishlist()
  }, [])

  const fetchWishlist = async () => {
    try {
      setLoading(true)
      const response = await api.get(endpoints.wishlist)
      setWishlistItems(response.data.items || [])
    } catch (error) {
      console.error("Failed to fetch wishlist:", error)
    } finally {
      setLoading(false)
    }
  }

  const removeFromWishlist = async (itemId: string) => {
    try {
      await api.delete(`${endpoints.wishlist}items/${itemId}/`)
      setWishlistItems(prev => prev.filter(item => item.id !== itemId))
    } catch (error) {
      console.error("Failed to remove item from wishlist:", error)
    }
  }

  const addToCart = async (productId: string) => {
    try {
      // First get the user's cart
      const cartResponse = await api.get(endpoints.carts)
      const cart = cartResponse.data.results?.[0] || cartResponse.data[0]
      
      if (!cart) {
        console.error("No cart found")
        return
      }

      // Add item to cart
      await api.post(endpoints.cartItems, {
        cart: cart.id,
        product_id: productId,
        quantity: 1
      })

      // Optionally remove from wishlist after adding to cart
      // You can uncomment this if you want to auto-remove from wishlist
      // const wishlistItem = wishlistItems.find(item => item.product.id === productId)
      // if (wishlistItem) {
      //   await removeFromWishlist(wishlistItem.id)
      // }
    } catch (error) {
      console.error("Failed to add to cart:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <DashboardLayout>
          <div className="space-y-6">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-1/3 mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-80 bg-muted rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </DashboardLayout>
      </div>
    )
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <DashboardLayout>
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Wishlist</h1>
              <p className="text-muted-foreground mt-1">Items you've saved for later</p>
            </div>

            <Card>
              <CardContent className="p-12 text-center">
                <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Your Wishlist is Empty</h3>
                <p className="text-muted-foreground mb-6">Start adding items you love to your wishlist.</p>
                <Link href="/products">
                  <Button>Start Shopping</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </DashboardLayout>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Wishlist</h1>
            <p className="text-muted-foreground mt-1">
              {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} saved
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Product Image */}
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                      {item.product.image_url ? (
                        <img
                          src={item.product.image_url}
                          alt={item.product.product_name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="text-muted-foreground text-center">
                          <div className="text-4xl mb-2">📦</div>
                          <p className="text-sm">No Image</p>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-2">
                      <h3 className="font-semibold line-clamp-2">{item.product.product_name}</h3>
                      <Badge variant="secondary">{item.product.category}</Badge>
                      <p className="text-lg font-bold text-primary">
                        ${Number(item.product.price).toFixed(2)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => addToCart(item.product.id)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                      <Link href={`/products/${item.product.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeFromWishlist(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      Added {new Date(item.added_at).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    </div>
  )
}
