"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, MessageCircle, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { api } from "@/lib/api"

export default function SupportPage() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [showNewTicket, setShowNewTicket] = useState(false)
  const [newTicket, setNewTicket] = useState({
    subject: "",
    description: "",
    priority: "medium",
  })

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await api.get("/api/support/tickets/")
        setTickets(response.data)
      } catch (error) {
        console.error("Error fetching tickets:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTickets()
  }, [])

  const handleCreateTicket = async (e) => {
    e.preventDefault()
    try {
      const response = await api.post("/api/support/tickets/", newTicket)
      setTickets([response.data, ...tickets])
      setNewTicket({ subject: "", description: "", priority: "medium" })
      setShowNewTicket(false)
    } catch (error) {
      console.error("Error creating ticket:", error)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "open":
        return <Clock className="h-4 w-4" />
      case "in_progress":
        return <AlertCircle className="h-4 w-4" />
      case "resolved":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <MessageCircle className="h-4 w-4" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "default"
      case "in_progress":
        return "secondary"
      case "resolved":
        return "outline"
      default:
        return "outline"
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-balance">Support Center</h1>
          <p className="text-muted-foreground mt-2">Get help with your orders and account</p>
        </div>
        <Button onClick={() => setShowNewTicket(!showNewTicket)}>
          <Plus className="h-4 w-4 mr-2" />
          New Ticket
        </Button>
      </div>

      {showNewTicket && (
        <Card className="p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Create New Support Ticket</h3>
          <form onSubmit={handleCreateTicket} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Subject</label>
              <Input
                value={newTicket.subject}
                onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                placeholder="Brief description of your issue"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Priority</label>
              <select
                value={newTicket.priority}
                onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                className="w-full p-2 border rounded-md"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Textarea
                value={newTicket.description}
                onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                placeholder="Detailed description of your issue"
                rows={4}
                required
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit">Create Ticket</Button>
              <Button type="button" variant="outline" onClick={() => setShowNewTicket(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="space-y-4">
        {tickets.length === 0 ? (
          <Card className="p-8 text-center">
            <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No support tickets</h3>
            <p className="text-muted-foreground">You haven't created any support tickets yet.</p>
          </Card>
        ) : (
          tickets.map((ticket) => (
            <Card key={ticket.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(ticket.status)}
                      <h3 className="font-semibold">
                        #{ticket.id} - {ticket.subject}
                      </h3>
                    </div>
                    <Badge variant={getStatusColor(ticket.status)}>{ticket.status.replace("_", " ")}</Badge>
                    <Badge variant="outline" className="capitalize">
                      {ticket.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Created on {new Date(ticket.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-sm line-clamp-2">{ticket.description}</p>
                </div>

                <div className="flex flex-col gap-2">
                  <Button variant="outline" size="sm">
                    View Messages
                  </Button>
                  {ticket.status !== "resolved" && (
                    <Button variant="outline" size="sm">
                      Add Message
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
