"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { AddressList } from "@/components/address-list"
import { AddressForm } from "@/components/address-form"
import { Button } from "@/components/ui/button"
import { api, endpoints } from "@/lib/api"
import { Plus } from "lucide-react"

interface Address {
  Address_ID: number
  street: string
  city: string
  state: string
  zip_code: string
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)

  useEffect(() => {
    fetchAddresses()
  }, [])

  const fetchAddresses = async () => {
    try {
      const response = await api.get(endpoints.addresses)
      setAddresses(response.data.results || response.data)
    } catch (error) {
      console.error("Failed to fetch addresses:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddressSubmit = async (addressData: any) => {
    try {
      if (editingAddress) {
        await api.patch(`${endpoints.addresses}${editingAddress.Address_ID}/`, addressData)
      } else {
        await api.post(endpoints.addresses, addressData)
      }

      await fetchAddresses()
      setShowForm(false)
      setEditingAddress(null)
    } catch (error) {
      console.error("Failed to save address:", error)
      throw error
    }
  }

  const handleEdit = (address: Address) => {
    setEditingAddress(address)
    setShowForm(true)
  }

  const handleDelete = async (addressId: number) => {
    try {
      await api.delete(`${endpoints.addresses}${addressId}/`)
      await fetchAddresses()
    } catch (error) {
      console.error("Failed to delete address:", error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Addresses</h1>
              <p className="text-muted-foreground mt-1">Manage your shipping addresses</p>
            </div>

            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Address
            </Button>
          </div>

          {showForm && (
            <AddressForm
              address={editingAddress}
              onSubmit={handleAddressSubmit}
              onCancel={() => {
                setShowForm(false)
                setEditingAddress(null)
              }}
            />
          )}

          <AddressList addresses={addresses} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />
        </div>
      </DashboardLayout>
    </div>
  )
}
