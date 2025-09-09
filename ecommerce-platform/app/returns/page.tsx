"use client"

import { useState, useEffect } from "react"
import { api } from "@/lib/api" // Assuming api is imported from a library
import { Button } from "@/components/ui/button" // Assuming Button is imported from a UI library
import { Plus } from "lucide-react" // Assuming Plus is imported from Lucide React
import { Package } from "lucide-react" // Assuming Package is imported from Lucide React
import { Badge } from "@/components/ui/badge" // Assuming Badge is imported from a UI library
import { Card } from "@/components/ui/card" // Assuming Card is imported from a UI library
import { Skeleton } from "@/components/ui/skeleton" // Assuming Skeleton is imported from a UI library

export default function ReturnsPage() {
  const [returns, setReturns] = useState([])
  const [returnItems, setReturnItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    const fetchReturns = async () => {
      try {
        const [returnsRes, itemsRes] = await Promise.all([
          api.get("/api/returns/requests/"),
          api.get("/api/returns/items/"),
        ])
        setReturns(returnsRes.data)
        setReturnItems(itemsRes.data)
      } catch (error) {
        console.error("Error fetching returns:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchReturns()
  }, [])

  const filteredReturns = returns.filter((returnReq) => {
    if (filter === "all") return true
    return returnReq.status === filter
  })

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-balance">Returns & Refunds</h1>
          <p className="text-muted-foreground mt-2">Manage your return requests and track their status</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Return Request
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {["all", "pending", "approved", "rejected", "completed"].map((status) => (
          <Button
            key={status}
            variant={filter === status ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(status)}
            className="capitalize"
          >
            {status}
          </Button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredReturns.length === 0 ? (
          <Card className="p-8 text-center">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No returns found</h3>
            <p className="text-muted-foreground">You haven't made any return requests yet.</p>
          </Card>
        ) : (
          filteredReturns.map((returnReq) => (
            <Card key={returnReq.id} className="p-6">
              <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold">Return #{returnReq.id}</h3>
                    <Badge
                      variant={
                        returnReq.status === "approved"
                          ? "default"
                          : returnReq.status === "rejected"
                            ? "destructive"
                            : returnReq.status === "completed"
                              ? "secondary"
                              : "outline"
                      }
                    >
                      {returnReq.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Requested on {new Date(returnReq.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-sm mb-4">{returnReq.reason}</p>

                  <div className="space-y-2">
                    {returnItems
                      .filter((item) => item.return_request === returnReq.id)
                      .map((item) => (
                        <div key={item.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                          <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
                            <Package className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{item.product_name}</p>
                            <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">${item.refund_amount}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  {returnReq.status === "pending" && (
                    <Button variant="outline" size="sm">
                      Cancel Request
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
