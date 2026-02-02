"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (!email || !password) {
        setError("Email and password are required")
        setIsLoading(false)
        return
      }

      // Simple validation
      if (password.length < 6) {
        setError("Password must be at least 6 characters")
        setIsLoading(false)
        return
      }

      // Demo: Store session in localStorage
      localStorage.setItem(
        "user_session",
        JSON.stringify({
          email,
          id: `user_${Date.now()}`,
          created_at: new Date().toISOString(),
        }),
      )

      // Simulate success
      await new Promise((resolve) => setTimeout(resolve, 500))
      router.push("/dashboard")
    } catch (err) {
      setError("An error occurred. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoSignIn = async () => {
    setIsLoading(true)
    setError(null)

    try {
      localStorage.setItem(
        "user_session",
        JSON.stringify({
          email: "demo@ecoquest.com",
          id: `user_${Date.now()}`,
          created_at: new Date().toISOString(),
        }),
      )

      await new Promise((resolve) => setTimeout(resolve, 500))
      router.push("/dashboard")
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-blue-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome Back to <span className="text-primary">EcoQuest</span>
            </h1>
            <p className="text-sm text-gray-600">Continue your recycling journey</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
          )}

          {/* Form */}
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Password</label>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full"
              />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Signing in..." : "Sign In with Email"}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-border"></div>
            <span className="text-xs text-gray-500">OR</span>
            <div className="flex-1 h-px bg-border"></div>
          </div>

          <Button
            onClick={handleDemoSignIn}
            disabled={isLoading}
            variant="outline"
            className="w-full bg-green-50 hover:bg-green-100"
          >
            Try Demo Account
          </Button>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account?{" "}
            <Link href="/auth/sign-up" className="text-primary hover:text-green-700 font-semibold">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
