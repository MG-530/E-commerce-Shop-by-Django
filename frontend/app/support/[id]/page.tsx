"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Send, User, Headphones } from "lucide-react"
import Link from "next/link"
import { api } from "@/lib/api"

export default function TicketDetailPage() {
  const params = useParams()
  const [ticket, setTicket] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        const [ticketRes, messagesRes] = await Promise.all([
          api.get(`/api/support/tickets/${params.id}/`),
          api.get(`/api/support/messages/?ticket=${params.id}`),
        ])
        setTicket(ticketRes.data)
        setMessages(messagesRes.data)
      } catch (error) {
        console.error("Error fetching ticket details:", error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchTicketDetails()
    }
  }, [params.id])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    try {
      const response = await api.post("/api/support/messages/", {
        ticket: params.id,
        message: newMessage,
        sender_type: "customer",
      })
      setMessages([...messages, response.data])
      setNewMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-64 mb-6" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Ticket not found</h1>
          <Link href="/support">
            <Button>Back to Support</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/support">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Support
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">
            #{ticket.id} - {ticket.subject}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={ticket.status === "resolved" ? "outline" : "default"}>
              {ticket.status.replace("_", " ")}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {ticket.priority}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Messages</h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.sender_type === "customer" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.sender_type === "customer" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {message.sender_type === "customer" ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Headphones className="h-4 w-4" />
                      )}
                      <span className="text-sm font-medium">
                        {message.sender_type === "customer" ? "You" : "Support"}
                      </span>
                      <span className="text-xs opacity-70">{new Date(message.created_at).toLocaleString()}</span>
                    </div>
                    <p className="text-sm">{message.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {ticket.status !== "resolved" && (
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Send Message</h3>
              <form onSubmit={handleSendMessage} className="space-y-4">
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  rows={3}
                  required
                />
                <Button type="submit" className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Ticket Details</h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium">Created:</span>
                <p className="text-muted-foreground">{new Date(ticket.created_at).toLocaleString()}</p>
              </div>
              <div>
                <span className="font-medium">Last Updated:</span>
                <p className="text-muted-foreground">{new Date(ticket.updated_at).toLocaleString()}</p>
              </div>
              <div>
                <span className="font-medium">Priority:</span>
                <p className="text-muted-foreground capitalize">{ticket.priority}</p>
              </div>
              <div>
                <span className="font-medium">Status:</span>
                <p className="text-muted-foreground">{ticket.status.replace("_", " ")}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Original Description</h3>
            <p className="text-sm text-muted-foreground">{ticket.description}</p>
          </Card>
        </div>
      </div>
    </div>
  )
}
