"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Package, MapPin, CreditCard, Truck, MessageSquare } from "lucide-react"
import Link from "next/link"
import { api, endpoints } from "@/lib/api"

interface OrderItem {
  id: string
  product: {
    id: string
    product_name: string
    price: string
    image_url?: string
  }
  quantity: number
  price: string
}

interface Order {
  id: string
  order_number: string
  total_amount: number
  status: string
  created_at: string
  updated_at: string
  items: OrderItem[]
  items_count: number
  address?: {
    street: string
    city: string
    state: string
    zip_code: string
  }
  payments?: Array<{
    payment_method: string
    amount: string
    payment_date: string
    transaction_id: string
  }>
  shipments?: Array<{
    carrier: string
    tracking_number: string
    status: string
    shipment_date: string
  }>
}

export default function OrderDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string
  
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails()
    }
  }, [orderId])

  const fetchOrderDetails = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get(`${endpoints.orders}${orderId}/`)
      setOrder(response.data)
    } catch (error: any) {
      console.error("Failed to fetch order details:", error)
      if (error.response?.status === 404) {
        setError("Order not found")
      } else {
        setError("Failed to load order details")
      }
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <Package className="h-4 w-4" />
      case "processing":
        return <Package className="h-4 w-4" />
      case "shipped":
        return <Truck className="h-4 w-4" />
      case "delivered":
        return <Package className="h-4 w-4" />
      case "cancelled":
        return <Package className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
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
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-32 bg-muted rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </DashboardLayout>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <DashboardLayout>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h1 className="text-3xl font-bold text-foreground">Order Details</h1>
            </div>

            <Card>
              <CardContent className="p-12 text-center">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Order Not Found</h3>
                <p className="text-muted-foreground mb-6">{error || "The order you're looking for doesn't exist."}</p>
                <Link href="/dashboard/orders">
                  <Button>View All Orders</Button>
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
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Order Details</h1>
                <p className="text-muted-foreground">Order #{order.order_number}</p>
              </div>
            </div>
            <Badge className={getStatusColor(order.status)}>
              {getStatusIcon(order.status)}
              <span className="ml-1 capitalize">{order.status}</span>
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Order Items */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Order Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                        <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                          {item.product.image_url ? (
                            <img
                              src={item.product.image_url}
                              alt={item.product.product_name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <Package className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{item.product.product_name}</h3>
                          <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${Number(item.price).toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">each</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Separator className="my-4" />
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total</span>
                    <span>${Number(order.total_amount).toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Information */}
            <div className="space-y-6">
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Order Number</span>
                    <span className="font-mono">#{order.order_number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Order Date</span>
                    <span>{new Date(order.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Items</span>
                    <span>{order.items_count}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>${Number(order.total_amount).toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              {order.address && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Shipping Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      <p>{order.address.street}</p>
                      <p>{order.address.city}, {order.address.state} {order.address.zip_code}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Payment Information */}
              {order.payments && order.payments.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Payment Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {order.payments.map((payment, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between">
                          <span>Method</span>
                          <span className="capitalize">{payment.payment_method}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Amount</span>
                          <span>${Number(payment.amount).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Transaction ID</span>
                          <span className="font-mono text-sm">{payment.transaction_id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Date</span>
                          <span>{new Date(payment.payment_date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Shipping Information */}
              {order.shipments && order.shipments.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5" />
                      Shipping Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {order.shipments.map((shipment, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between">
                          <span>Carrier</span>
                          <span>{shipment.carrier}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tracking Number</span>
                          <span className="font-mono text-sm">{shipment.tracking_number}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Status</span>
                          <Badge variant="outline" className="capitalize">{shipment.status}</Badge>
                        </div>
                        {shipment.shipment_date && (
                          <div className="flex justify-between">
                            <span>Ship Date</span>
                            <span>{new Date(shipment.shipment_date).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Support */}
              <Card>
                <CardContent className="p-6 text-center">
                  <MessageSquare className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Need Help?</h3>
                  <p className="text-sm text-muted-foreground mb-4">Have questions about this order?</p>
                  <Link href="/dashboard/support">
                    <Button variant="outline" size="sm">
                      Contact Support
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </div>
  )
}
