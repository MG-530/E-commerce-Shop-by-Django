"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { api, endpoints } from "@/lib/api"

interface User {
  id: number
  User_ID: number
  email: string
  first_name: string
  last_name: string
  phone_number: string
  role: "customer" | "vendor" | "warehouse"
  account_status: string
  birthday: string
  date_joined: string
}

interface RegisterData {
  email: string
  password: string
  first_name: string
  last_name: string
  role: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  updateUser: (userData: User) => void
  loading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    if (storedToken) {
      setToken(storedToken)
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUser = async () => {
    try {
      const response = await api.get("/api/users/me/")
      setUser(response.data)
    } catch (error) {
      console.error("Failed to fetch user:", error)
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/api/users/api-token-auth/", { email, password })
      const { token: authToken } = response.data

      localStorage.setItem("token", authToken)
      setToken(authToken)

      await fetchUser()
    } catch (error) {
      throw new Error("Login failed")
    }
  }

  const register = async (data: RegisterData) => {
    try {
      const response = await api.post("/api/users/register/", data)
      // Registration successful, redirect to login
      return response.data
    } catch (error) {
      throw new Error("Registration failed")
    }
  }

  const logout = async () => {
    try {
      // No logout endpoint needed for token auth
    } catch (error) {
      console.error("Logout API call failed:", error)
    } finally {
      localStorage.removeItem("token")
      setToken(null)
      setUser(null)
    }
  }

  const updateUser = (userData: User) => {
    setUser(userData)
  }

  const value = {
    user,
    token,
    login,
    register,
    logout,
    updateUser,
    loading,
    isAuthenticated: !!token && !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export type { RegisterData }
