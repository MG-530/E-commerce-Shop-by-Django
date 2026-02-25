"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

interface ReviewFiltersProps {
  filters: {
    rating: string
    product: string
    dateRange: string
  }
  onFilterChange: (filters: any) => void
}

export function ReviewFilters({ filters, onFilterChange }: ReviewFiltersProps) {
  const clearFilters = () => {
    onFilterChange({ rating: "", product: "", dateRange: "" })
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Rating</label>
              <Select value={filters.rating} onValueChange={(value) => onFilterChange({ ...filters, rating: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="All Ratings" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <Select
                value={filters.dateRange}
                onValueChange={(value) => onFilterChange({ ...filters, dateRange: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="last_week">Last Week</SelectItem>
                  <SelectItem value="last_month">Last Month</SelectItem>
                  <SelectItem value="last_3_months">Last 3 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button variant="outline" onClick={clearFilters} className="w-full bg-transparent">
                Clear Filters
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
