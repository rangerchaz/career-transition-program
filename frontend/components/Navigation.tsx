"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Home, MessageSquare, Map, BarChart, Users, LogOut } from "lucide-react"

export function Navigation() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  // Don't show navigation on auth pages or landing page
  if (!user || pathname.startsWith("/auth") || pathname === "/") {
    return null
  }

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/intake", label: "Intake", icon: MessageSquare },
    { href: "/plan", label: "My Plan", icon: Map },
    { href: "/agents", label: "Advisors", icon: Users },
  ]

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              CareerShift AI
            </Link>
            <div className="hidden md:flex gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      className="gap-2"
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Button>
                  </Link>
                )
              })}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden sm:inline">
              {user.name}
            </span>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
