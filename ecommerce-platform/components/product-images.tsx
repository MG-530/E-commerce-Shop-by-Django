"use client"

import { useState } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"

interface Product {
  id: number
  name: string
  images?: string[]
  discount_percentage?: number
}

interface ProductImagesProps {
  product: Product
}

export function ProductImages({ product }: ProductImagesProps) {
  const images = product.images || [`/placeholder.svg?height=400&width=400&query=${encodeURIComponent(product.name)}`]
  const [selectedImage, setSelectedImage] = useState(0)

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
        <Image src={images[selectedImage] || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
        {product.discount_percentage && (
          <Badge className="absolute top-4 right-4 bg-destructive text-destructive-foreground">
            -{product.discount_percentage}% OFF
          </Badge>
        )}
      </div>

      {/* Thumbnail Images */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                selectedImage === index ? "border-primary" : "border-border"
              }`}
            >
              <Image
                src={image || "/placeholder.svg"}
                alt={`${product.name} ${index + 1}`}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
