"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Package, Edit, Save, X, AlertTriangle } from "lucide-react"

interface InventoryItem {
  id: number
  product_name: string
  product_id: number
  warehouse_name: string
  warehouse_id: number
  quantity: number
  min_quantity: number
  max_quantity: number
  unit_cost: number
  last_updated: string
}

interface InventoryListProps {
  inventory: InventoryItem[]
  loading: boolean
  onUpdateStock: (itemId: number, newQuantity: number) => Promise<void>
}

export function InventoryList({ inventory, loading, onUpdateStock }: InventoryListProps) {
  const [editingItem, setEditingItem] = useState<number | null>(null)
  const [editQuantity, setEditQuantity] = useState("")

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (inventory.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Inventory Items Found</h3>
          <p className="text-muted-foreground">Start by adding inventory items to your warehouses.</p>
        </CardContent>
      </Card>
    )
  }

  const getStockStatus = (item: InventoryItem) => {
    if (item.quantity <= item.min_quantity) {
      return { status: "Low Stock", color: "bg-red-100 text-red-800", icon: AlertTriangle }
    }
    if (item.quantity >= item.max_quantity) {
      return { status: "Overstock", color: "bg-yellow-100 text-yellow-800", icon: null }
    }
    return { status: "In Stock", color: "bg-green-100 text-green-800", icon: null }
  }

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item.id)
    setEditQuantity(item.quantity.toString())
  }

  const handleSave = async (itemId: number) => {
    const newQuantity = Number.parseInt(editQuantity)
    if (!isNaN(newQuantity) && newQuantity >= 0) {
      await onUpdateStock(itemId, newQuantity)
      setEditingItem(null)
      setEditQuantity("")
    }
  }

  const handleCancel = () => {
    setEditingItem(null)
    setEditQuantity("")
  }

  return (
    <div className="space-y-4">
      {inventory.map((item) => {
        const stockStatus = getStockStatus(item)
        const StatusIcon = stockStatus.icon
        const isEditing = editingItem === item.id

        return (
          <Card key={item.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-foreground">{item.product_name}</h3>
                    <Badge className={stockStatus.color}>
                      {StatusIcon && <StatusIcon className="h-3 w-3 mr-1" />}
                      {stockStatus.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Warehouse</p>
                      <p className="font-medium">{item.warehouse_name}</p>
                    </div>

                    <div>
                      <p className="text-muted-foreground">Current Stock</p>
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={editQuantity}
                            onChange={(e) => setEditQuantity(e.target.value)}
                            className="w-20 h-8"
                            min="0"
                          />
                        </div>
                      ) : (
                        <p className="font-medium">{item.quantity}</p>
                      )}
                    </div>

                    <div>
                      <p className="text-muted-foreground">Min / Max</p>
                      <p className="font-medium">
                        {item.min_quantity} / {item.max_quantity}
                      </p>
                    </div>

                    <div>
                      <p className="text-muted-foreground">Unit Cost</p>
                      <p className="font-medium">${item.unit_cost.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="mt-2">
                    <p className="text-xs text-muted-foreground">
                      Last updated: {new Date(item.last_updated).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button size="sm" onClick={() => handleSave(item.id)}>
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleCancel}>
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Update Stock
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
