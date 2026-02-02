"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import { Sidebar } from "@/components/admin/sidebar"
import { MobileNav } from "@/components/admin/mobile-nav"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const userSession = localStorage.getItem("user_session")
        
        console.log("[v0] Admin check - userSession:", userSession)
        
        if (!userSession) {
          console.log("[v0] No user session, redirecting to login")
          router.push("/auth/login")
          return
        }

        const session = JSON.parse(userSession)
        console.log("[v0] Session email:", session.email)
        
        const adminEmailsEnv = process.env.NEXT_PUBLIC_ADMIN_EMAILS
        console.log("[v0] Admin emails from env:", adminEmailsEnv)
        
        const adminEmails = adminEmailsEnv 
          ? adminEmailsEnv.split(",").map(e => e.trim().toLowerCase())
          : ["admin@example.com", "admin@ecoquest.com"].map(e => e.toLowerCase())
        
        console.log("[v0] Admin emails list:", adminEmails)
        
        const userEmail = (session.email || "").toLowerCase()
        const userIsAdmin = adminEmails.includes(userEmail)
        
        console.log("[v0] User is admin?", userIsAdmin)

        if (!userIsAdmin) {
          console.log("[v0] Not admin, redirecting to dashboard")
          router.push("/dashboard")
          return
        }

        setIsAdmin(true)
      } catch (error) {
        console.error("[v0] Admin check error:", error)
        router.push("/dashboard")
      } finally {
        setIsChecking(false)
      }
    }

    checkAdminAccess()
  }, [router])

  if (isChecking) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white">Verifying admin access...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <Card className="bg-slate-900 border-red-500/20">
          <CardContent className="pt-6">
            <p className="text-red-400 mb-4">You don't have permission to access the admin dashboard.</p>
            <p className="text-slate-400 text-sm mb-4">
              To access admin, log in with: admin@example.com
            </p>
            <Button onClick={() => router.push("/dashboard")} className="w-full">
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <MobileNav />
        <main className="flex-1 p-4 md:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
