"use client"

import { useEffect } from "react"
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const userSession = localStorage.getItem("user_session")
    
    if (userSession) {
      try {
        const session = JSON.parse(userSession)
        if (session.email) {
          router.push("/dashboard")
          return
        }
      } catch (error) {
        console.error("[v0] Failed to parse user session:", error)
      }
    }
    
    // No session found, redirect to splash
    router.push("/auth/splash")
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4">♻️</div>
        <p className="text-gray-600">Loading EcoQuest...</p>
      </div>
    </div>
  )
}
