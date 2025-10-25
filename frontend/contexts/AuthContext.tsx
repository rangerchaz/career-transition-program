"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { authApi, handleApiError } from "@/lib/api"
import type { User, LoginRequest, RegisterRequest } from "@/lib/types"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (data: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => void
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Check for existing auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("authToken")
        if (token) {
          const currentUser = await authApi.getCurrentUser()
          setUser(currentUser)
        }
      } catch (err) {
        // Token invalid or expired
        localStorage.removeItem("authToken")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (data: LoginRequest) => {
    try {
      setError(null)
      setLoading(true)
      const response = await authApi.login(data)
      localStorage.setItem("authToken", response.token)
      setUser(response.user)
      router.push("/intake")
    } catch (err) {
      const errorMessage = handleApiError(err)
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const register = async (data: RegisterRequest) => {
    try {
      setError(null)
      setLoading(true)
      const response = await authApi.register(data)
      localStorage.setItem("authToken", response.token)
      setUser(response.user)
      router.push("/intake")
    } catch (err) {
      const errorMessage = handleApiError(err)
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("authToken")
    setUser(null)
    router.push("/")
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, error }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
