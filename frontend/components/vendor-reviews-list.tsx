"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, MessageSquare, ExternalLink } from "lucide-react"
import Link from "next/link"

interface VendorReview {
  id: number
  product_name: string
  user: string
  rating: number
  comment: string
  created_at: string
  product_id: number
}

interface VendorReviewsListProps {
  reviews: VendorReview[]
  loading: boolean
}

export function VendorReviewsList({ reviews, loading }: VendorReviewsListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-muted rounded w-full mb-2"></div>
              <div className="h-3 bg-muted rounded w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Reviews Found</h3>
          <p className="text-muted-foreground">Your products haven't received any reviews yet.</p>
        </CardContent>
      </Card>
    )
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "bg-green-100 text-green-800"
    if (rating >= 3) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review.id} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Link href={`/products/${review.product_id}`}>
                    <h3 className="font-semibold text-foreground hover:text-primary transition-colors">
                      {review.product_name}
                    </h3>
                  </Link>
                  <Badge className={getRatingColor(review.rating)}>
                    {review.rating} <Star className="h-3 w-3 ml-1 fill-current" />
                  </Badge>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-medium">{review.user}</span>
                  <span className="text-sm text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>

                <p className="text-muted-foreground leading-relaxed">{review.comment}</p>
              </div>

              <div className="flex sm:flex-col gap-2">
                <Link href={`/products/${review.product_id}`}>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Product
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
