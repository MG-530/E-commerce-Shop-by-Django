"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { api, endpoints } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"
import { Star, ThumbsUp } from "lucide-react"

interface Review {
  id: number
  user: string
  rating: number
  comment: string
  created_at: string
  helpful_count?: number
}

interface ProductReviewsProps {
  productId: number
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" })
  const [submitting, setSubmitting] = useState(false)
  const { isAuthenticated, user } = useAuth()

  useEffect(() => {
    fetchReviews()
  }, [productId])

  const fetchReviews = async () => {
    try {
      const response = await api.get(`${endpoints.comments}?product=${productId}`)
      setReviews(response.data.results || response.data)
    } catch (error) {
      console.error("Failed to fetch reviews:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAuthenticated) {
      window.location.href = "/login"
      return
    }

    try {
      setSubmitting(true)
      await api.post(endpoints.comments, {
        product: productId,
        rating: newReview.rating,
        comment: newReview.comment,
      })
      setNewReview({ rating: 5, comment: "" })
      await fetchReviews()
    } catch (error) {
      console.error("Failed to submit review:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onRatingChange?.(star)}
            className={`${interactive ? "cursor-pointer hover:scale-110" : "cursor-default"} transition-transform`}
            disabled={!interactive}
          >
            <Star
              className={`h-4 w-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
            />
          </button>
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Customer Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-full mb-1"></div>
                <div className="h-3 bg-muted rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Reviews ({reviews.length})</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Write Review Form */}
        {isAuthenticated && (
          <form onSubmit={handleSubmitReview} className="space-y-4 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold">Write a Review</h4>

            <div className="space-y-2">
              <label className="text-sm font-medium">Rating</label>
              {renderStars(newReview.rating, true, (rating) => setNewReview((prev) => ({ ...prev, rating })))}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Comment</label>
              <Textarea
                value={newReview.comment}
                onChange={(e) => setNewReview((prev) => ({ ...prev, comment: e.target.value }))}
                placeholder="Share your experience with this product..."
                rows={3}
              />
            </div>

            <Button type="submit" disabled={submitting || !newReview.comment.trim()}>
              {submitting ? "Submitting..." : "Submit Review"}
            </Button>
          </form>
        )}

        <Separator />

        {/* Reviews List */}
        <div className="space-y-6">
          {reviews.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No reviews yet. Be the first to review this product!
            </p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{review.user}</span>
                    {renderStars(review.rating)}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-muted-foreground leading-relaxed">{review.comment}</p>

                {review.helpful_count !== undefined && (
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      Helpful ({review.helpful_count})
                    </Button>
                  </div>
                )}

                <Separator />
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
