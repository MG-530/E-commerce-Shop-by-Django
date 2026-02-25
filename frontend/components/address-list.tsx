"use client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Edit, Trash2, Plus } from "lucide-react"

interface Address {
  Address_ID: number
  street: string
  city: string
  state: string
  zip_code: string
}

interface AddressListProps {
  addresses: Address[]
  loading?: boolean
  onEdit: (address: Address) => void
  onDelete: (id: number) => void
}

export function AddressList({ addresses, loading, onEdit, onDelete }: AddressListProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Saved Addresses</h3>
      </div>

      {loading ? (
        <Card className="p-8 text-center">Loading...</Card>
      ) : addresses.length === 0 ? (
        <Card className="p-8 text-center">
          <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No addresses saved</h3>
          <p className="text-muted-foreground mb-4">Add your first address to get started</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {addresses.map((address) => (
            <Card key={address.Address_ID} className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{address.street}</p>
                  <p className="text-sm text-muted-foreground">{address.city}, {address.state} {address.zip_code}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => onEdit(address)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onDelete(address.Address_ID)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
