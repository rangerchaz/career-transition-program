import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/AuthContext"
import { Navigation } from "@/components/Navigation"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CareerShift AI - Your AI-Powered Career Transition Companion",
  description: "AI-powered career transition guidance with personalized plans and expert coaching",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Navigation />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
