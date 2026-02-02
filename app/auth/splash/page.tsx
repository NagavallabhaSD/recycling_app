"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function SplashPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
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
    }

    checkAuth()
  }, [router])

  const handleGetStarted = async () => {
    setIsLoading(true)
    router.push("/auth/sign-up")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-40 h-40 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob"></div>
        <div className="absolute top-40 right-10 w-40 h-40 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-40 h-40 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 text-center max-w-md">
        {/* Logo / Title Animation */}
        <div className="mb-8 animate-bounce" style={{ animationDuration: "3s" }}>
          <div className="inline-block">
            <div className="text-7xl font-bold mb-4 text-emerald-600">♻️</div>
          </div>
        </div>

        <h1 className="text-5xl font-bold text-foreground mb-3 text-balance leading-tight">
          Welcome to{" "}
          <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">EcoQuest</span>
        </h1>

        <p className="text-xl font-medium text-emerald-700 mb-2">Turn your recycling into rewards</p>
        <p className="text-base text-gray-600 mb-10 text-balance leading-relaxed">
          Compete with your community, earn points, unlock achievements, and make a real impact on the planet
        </p>

        <div className="mb-12 space-y-4 text-left bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-emerald-100">
          <div className="flex items-center gap-4">
            <div className="text-3xl">🏆</div>
            <div>
              <p className="font-semibold text-foreground">Climb the Leaderboard</p>
              <p className="text-sm text-gray-600">Compete with eco-warriors worldwide</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-3xl">⭐</div>
            <div>
              <p className="font-semibold text-foreground">Earn Points & Badges</p>
              <p className="text-sm text-gray-600">Get rewarded for recycling</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-3xl">🎁</div>
            <div>
              <p className="font-semibold text-foreground">Redeem Awesome Rewards</p>
              <p className="text-sm text-gray-600">Convert points to real benefits</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleGetStarted}
            disabled={isLoading}
            className="w-full h-13 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-lg rounded-xl transition-all shadow-lg hover:shadow-xl"
          >
            {isLoading ? "Loading..." : "Get Started"}
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/auth/login")}
            className="w-full h-13 border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 font-semibold text-lg rounded-xl transition-all"
          >
            Sign In
          </Button>
        </div>

        <div className="mt-10 p-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl border border-emerald-200">
          <p className="text-sm font-medium text-emerald-700">♻️ Together we've recycled</p>
          <p className="text-2xl font-bold text-emerald-600">50,000+ kg</p>
          <p className="text-xs text-gray-600">of waste this month</p>
        </div>

        {/* Footer text */}
        <p className="text-sm text-gray-500 mt-8 font-medium">Join thousands of eco-warriors making a difference</p>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}
