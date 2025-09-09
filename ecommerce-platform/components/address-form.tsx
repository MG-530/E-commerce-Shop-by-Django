"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Address {
  Address_ID?: number
  street: string
  city: string
  state: string
  zip_code: string
}

interface AddressFormProps {
  address?: Address | null
  onSubmit: (address: Address) => void
  onCancel: () => void
}

export function AddressForm({ address, onSubmit, onCancel }: AddressFormProps) {
  const [formData, setFormData] = useState<Address>({
    street: address?.street || "",
    city: address?.city || "",
    state: address?.state || "",
    zip_code: address?.zip_code || "",
    ...(address?.Address_ID && { Address_ID: address.Address_ID }),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (field: keyof Address, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">{address ? "Edit Address" : "Add New Address"}</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Street</label>
          <Input
            value={formData.street}
            onChange={(e) => handleChange("street", e.target.value)}
            placeholder="123 Main Street"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">City</label>
            <Input
              value={formData.city}
              onChange={(e) => handleChange("city", e.target.value)}
              placeholder="New York"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">State</label>
            <Input
              value={formData.state}
              onChange={(e) => handleChange("state", e.target.value)}
              placeholder="NY"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">ZIP Code</label>
            <Input
              value={formData.zip_code}
              onChange={(e) => handleChange("zip_code", e.target.value)}
              placeholder="10001"
              required
            />
          </div>
          
        </div>

        <div className="flex gap-2 pt-4">
          <Button type="submit">{address ? "Update Address" : "Save Address"}</Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  )
}
