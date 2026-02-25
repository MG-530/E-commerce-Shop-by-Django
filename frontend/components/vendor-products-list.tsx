"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, Edit, Trash2, Eye } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface VendorProduct {
  id: number
  name: string
  price: number
  description: string
  image?: string
  category: string
  stock_quantity: number
  status: string
  created_at: string
}

interface VendorProductsListProps {
  products: VendorProduct[]
  loading: boolean
  onDelete: (productId: number) => Promise<void>
}

export function VendorProductsList({ products, loading, onDelete }: VendorProductsListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-48 bg-muted rounded-t-lg"></div>
            <CardContent className="p-4">
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-3 bg-muted rounded w-2/3 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Products Found</h3>
          <p className="text-muted-foreground mb-6">Start building your catalog by adding your first product.</p>
          <Link href="/vendor/products/new">
            <Button>Add Your First Product</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800"
      case "draft":
        return "bg-yellow-100 text-yellow-800"
      case "inactive":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleDeleteClick = async (productId: number, productName: string) => {
    if (window.confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
      await onDelete(productId)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="group hover:shadow-lg transition-shadow">
          <div className="relative">
            <Image
              src={product.image || `/placeholder.svg?height=200&width=300&query=${encodeURIComponent(product.name)}`}
              alt={product.name}
              width={300}
              height={200}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <Badge className={`absolute top-2 right-2 ${getStatusColor(product.status)}`}>{product.status}</Badge>
          </div>

          <CardContent className="p-4">
            <h3 className="font-semibold text-foreground line-clamp-2 mb-2">{product.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{product.description}</p>

            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-bold text-primary">${product.price}</span>
              <Badge variant="secondary">{product.category}</Badge>
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">Stock: {product.stock_quantity}</span>
              <span className="text-sm text-muted-foreground">{new Date(product.created_at).toLocaleDateString()}</span>
            </div>

            <div className="flex gap-2">
              <Link href={`/products/${product.id}`} className="flex-1">
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
              </Link>

              <Link href={`/vendor/products/${product.id}/edit`}>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
              </Link>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDeleteClick(product.id, product.name)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
