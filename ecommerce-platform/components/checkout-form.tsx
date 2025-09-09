"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreditCard, MapPin, User } from "lucide-react"
import { api, endpoints } from "@/lib/api"

interface CheckoutFormProps {
  onSubmit: (data: any) => Promise<void>
  processing: boolean
}

export function CheckoutForm({ onSubmit, processing }: CheckoutFormProps) {
  const [formData, setFormData] = useState({
    // Shipping Address
    firstName: "",
    lastName: "",
    email: "",
    phone: "",

    // Payment
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",

    // Options
    sameAsBilling: true,
    address_id: "",
  })

  const [addresses, setAddresses] = useState<any[]>([])
  const hasAddresses = Array.isArray(addresses) && addresses.length > 0
  const isUsingSavedAddress = !!formData.address_id

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await api.get(`${endpoints.addresses}?mine=1`)
        const list = res.data?.results || res.data || []
        setAddresses(list)
        // Auto-select first address if none selected
        if ((!formData.address_id || formData.address_id === "") && Array.isArray(list) && list.length > 0) {
          const firstId = list[0]?.Address_ID ?? list[0]?.id
          if (firstId) {
            setFormData((prev) => ({ ...prev, address_id: String(firstId) }))
          }
        }
      } catch (e) {
        setAddresses([])
      }
    }
    fetchAddresses()
  }, [])

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Require a saved address selection
    await onSubmit({ address_id: Number(formData.address_id) })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Shipping Address */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Shipping Address
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Address selector */}
          <div className="space-y-2">
            <Label htmlFor="addressSelect">Select Saved Address</Label>
            <Select value={formData.address_id} onValueChange={(value) => handleChange("address_id", value)}>
              <SelectTrigger>
                <SelectValue placeholder={hasAddresses ? "Choose an address" : "No saved addresses. Add in Dashboard → Addresses"} />
              </SelectTrigger>
              <SelectContent>
                {hasAddresses ? (
                  addresses
                    .map((a: any) => ({ id: a?.Address_ID ?? a?.id, ...a }))
                    .filter((a: any) => a.id !== undefined && a.id !== null)
                    .map((a: any) => (
                      <SelectItem key={a.id} value={String(a.id)}>
                        {a.street}, {a.city} {a.state} {a.zip_code}
                      </SelectItem>
                    ))
                ) : (
                  <SelectItem disabled value="placeholder">No saved addresses</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Manual address entry removed for checkout; users add addresses in Dashboard */}

          <div className="grid grid-cols-2 gap-4">
            {/* City/State inputs removed */}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* ZIP/Country inputs removed */}
          </div>
        </CardContent>
      </Card>

      {/* Payment Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardName">Name on Card</Label>
            <Input
              id="cardName"
              value={formData.cardName}
              onChange={(e) => handleChange("cardName", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={formData.cardNumber}
              onChange={(e) => handleChange("cardNumber", e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                placeholder="MM/YY"
                value={formData.expiryDate}
                onChange={(e) => handleChange("expiryDate", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                placeholder="123"
                value={formData.cvv}
                onChange={(e) => handleChange("cvv", e.target.value)}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" className="w-full" size="lg" disabled={processing || !isUsingSavedAddress}>
        {processing ? "Processing..." : "Place Order"}
      </Button>
    </form>
  )
}
