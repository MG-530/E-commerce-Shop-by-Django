"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface Category {
  id: number
  name: string
  slug: string
}

interface Filters {
  search: string
  category: string
  minPrice: string
  maxPrice: string
  sortBy: string
}

interface ProductFiltersProps {
  categories: Category[]
  filters: Filters
  onFilterChange: (filters: Partial<Filters>) => void
}

export function ProductFilters({ categories, filters, onFilterChange }: ProductFiltersProps) {
  const clearFilters = () => {
    onFilterChange({
      search: "",
      category: "",
      minPrice: "",
      maxPrice: "",
      sortBy: "name",
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filters</CardTitle>
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear All
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Category Filter */}
        <div className="space-y-2">
          <Label>Category</Label>
          <Select value={filters.category} onValueChange={(value) => onFilterChange({ category: value })}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.slug}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Price Range */}
        <div className="space-y-3">
          <Label>Price Range</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => onFilterChange({ minPrice: e.target.value })}
              />
            </div>
            <div>
              <Input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => onFilterChange({ maxPrice: e.target.value })}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Sort By */}
        <div className="space-y-2">
          <Label>Sort By</Label>
          <Select value={filters.sortBy} onValueChange={(value) => onFilterChange({ sortBy: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name (A-Z)</SelectItem>
              <SelectItem value="-name">Name (Z-A)</SelectItem>
              <SelectItem value="price">Price (Low to High)</SelectItem>
              <SelectItem value="-price">Price (High to Low)</SelectItem>
              <SelectItem value="-rating">Rating (High to Low)</SelectItem>
              <SelectItem value="-created_at">Newest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
