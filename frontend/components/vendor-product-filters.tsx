"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

interface VendorProductFiltersProps {
  filters: {
    status: string
    category: string
    search: string
  }
  onFilterChange: (filters: any) => void
}

export function VendorProductFilters({ filters, onFilterChange }: VendorProductFiltersProps) {
  const clearFilters = () => {
    onFilterChange({ status: "all", category: "all", search: "" })
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-end">
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
                className="pl-10"
              />
            </div>

            <Select value={filters.status} onValueChange={(value) => onFilterChange({ ...filters, status: value })}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.category} onValueChange={(value) => onFilterChange({ ...filters, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="clothing">Clothing</SelectItem>
                <SelectItem value="home">Home & Garden</SelectItem>
                <SelectItem value="books">Books</SelectItem>
                <SelectItem value="sports">Sports</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button variant="outline" onClick={clearFilters}>
            Clear Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export { VendorProductFilters as ProductFilters }
