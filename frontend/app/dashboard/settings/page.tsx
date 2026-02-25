"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Settings, User, Bell, Shield, Save } from "lucide-react"
import { api, endpoints } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"

interface UserProfile {
  id: number
  User_ID: number
  username?: string
  email: string
  first_name: string
  last_name: string
  phone_number?: string
  date_joined: string
  role: string
  account_status: string
  birthday?: string
}

export default function SettingsPage() {
  const { user, updateUser } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notifications, setNotifications] = useState({
    email_notifications: true,
    sms_notifications: false,
    order_updates: true,
    promotional_emails: false,
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      console.log("Fetching profile from:", endpoints.profile)
      const response = await api.get(endpoints.profile)
      console.log("Profile response:", response.data)
      setProfile(response.data)
    } catch (error) {
      console.error("Failed to fetch profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return

    try {
      setSaving(true)
      console.log("Saving profile to:", endpoints.profile)
      console.log("Profile data:", {
        first_name: profile.first_name,
        last_name: profile.last_name,
        phone_number: profile.phone_number,
      })
      const response = await api.patch(endpoints.profile, {
        first_name: profile.first_name,
        last_name: profile.last_name,
        phone_number: profile.phone_number,
      })
      console.log("Save response:", response.data)
      setProfile(response.data)
      updateUser(response.data)
    } catch (error) {
      console.error("Failed to save profile:", error)
      alert("Failed to save profile. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const currentPassword = formData.get('currentPassword') as string
    const newPassword = formData.get('newPassword') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (newPassword !== confirmPassword) {
      alert("New passwords don't match")
      return
    }

    try {
      await api.post(endpoints.changePassword, {
        current_password: currentPassword,
        new_password: newPassword,
      })
      alert("Password changed successfully")
      ;(e.target as HTMLFormElement).reset()
    } catch (error) {
      console.error("Failed to change password:", error)
      alert("Failed to change password. Please check your current password.")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <DashboardLayout>
          <div className="space-y-6">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-1/3 mb-6"></div>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-32 bg-muted rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </DashboardLayout>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Account Settings</h1>
            <p className="text-muted-foreground mt-1">Manage your account preferences and security</p>
          </div>

          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={saveProfile} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      value={profile?.first_name || ""}
                      onChange={(e) => setProfile(prev => prev ? { ...prev, first_name: e.target.value } : null)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      value={profile?.last_name || ""}
                      onChange={(e) => setProfile(prev => prev ? { ...prev, last_name: e.target.value } : null)}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile?.email || ""}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Email cannot be changed. Contact support if needed.
                  </p>
                </div>
                <div>
                  <Label htmlFor="phone_number">Phone Number</Label>
                  <Input
                    id="phone_number"
                    type="tel"
                    value={profile?.phone_number || ""}
                    onChange={(e) => setProfile(prev => prev ? { ...prev, phone_number: e.target.value } : null)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <Button type="submit" disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={changePassword} className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    required
                    minLength={8}
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    minLength={8}
                  />
                </div>
                <Button type="submit" variant="outline">
                  Change Password
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive important updates via email
                  </p>
                </div>
                <Switch
                  checked={notifications.email_notifications}
                  onCheckedChange={(checked) =>
                    setNotifications(prev => ({ ...prev, email_notifications: checked }))
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive text message updates
                  </p>
                </div>
                <Switch
                  checked={notifications.sms_notifications}
                  onCheckedChange={(checked) =>
                    setNotifications(prev => ({ ...prev, sms_notifications: checked }))
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Order Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about order status changes
                  </p>
                </div>
                <Switch
                  checked={notifications.order_updates}
                  onCheckedChange={(checked) =>
                    setNotifications(prev => ({ ...prev, order_updates: checked }))
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Promotional Emails</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive special offers and product updates
                  </p>
                </div>
                <Switch
                  checked={notifications.promotional_emails}
                  onCheckedChange={(checked) =>
                    setNotifications(prev => ({ ...prev, promotional_emails: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>User ID</Label>
                  <Input value={profile?.User_ID || ""} disabled className="bg-muted" />
                </div>
                <div>
                  <Label>Member Since</Label>
                  <Input
                    value={profile?.date_joined ? new Date(profile.date_joined).toLocaleDateString() : ""}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </div>
  )
}
