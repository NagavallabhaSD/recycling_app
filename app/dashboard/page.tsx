"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProfileCard } from "@/components/profile-card"
import { QuickActions } from "@/components/quick-actions"
import { AnalyticsCarousel } from "@/components/analytics-carousel"
import { CommunityHighlights } from "@/components/community-highlights"
import { BottomNav } from "@/components/bottom-nav"
import { DesktopSidebar } from "@/components/desktop-sidebar"
import { LogOut, BarChart3, Zap, Leaf, Calendar, Gift } from "lucide-react"

interface UserProfile {
  id: string
  full_name?: string
  avatar_url?: string
  level?: number
  xp?: number
  total_waste_kg?: number
  city?: string
  weekly_streak?: number
}

interface Event {
  id: string
  title: string
  reward_multiplier: number
  start_date: string
  end_date: string
}

interface Reward {
  id: string
  name: string
  points_required: number
  sponsor: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [currentXP, setCurrentXP] = useState(0)
  const [adminEvents, setAdminEvents] = useState<Event[]>([])
  const [adminRewards, setAdminRewards] = useState<Reward[]>([])

useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userSession = localStorage.getItem("user_session")
        if (!userSession) {
          router.push("/auth/login")
          return
        }

        const session = JSON.parse(userSession)

        const adminEmailsEnv = process.env.NEXT_PUBLIC_ADMIN_EMAILS || ""
        const adminEmails = adminEmailsEnv
          ? adminEmailsEnv.split(",").map((e) => e.trim())
          : ["admin@example.com", "admin@ecoquest.com"]
        const userIsAdmin = adminEmails.includes(session.email || "")
        setIsAdmin(userIsAdmin)

        const xpKey = `user_xp_${session.id}`
        const storedXPString = localStorage.getItem(xpKey)
        const storedXP = storedXPString ? Number.parseInt(storedXPString, 10) : 0
        setCurrentXP(Number.isNaN(storedXP) ? 0 : storedXP)

        try {
          const eventsRes = await fetch("/api/user/events")
          const eventsData = await eventsRes.json()
          if (eventsData.success) {
            setAdminEvents(eventsData.data.slice(0, 3))
          }
        } catch (err) {
          console.error("[v0] Failed to fetch events:", err)
        }

        try {
          const rewardsRes = await fetch("/api/user/rewards")
          const rewardsData = await rewardsRes.json()
          if (rewardsData.success) {
            setAdminRewards(rewardsData.data.slice(0, 3))
          }
        } catch (err) {
          console.error("[v0] Failed to fetch rewards:", err)
        }

        const mockProfile: UserProfile = {
          id: session.id,
          full_name: session.full_name || session.email?.split("@")[0] || "Eco Warrior",
          avatar_url: undefined,
          level: Math.floor(storedXP / 100) + 1,
          xp: storedXP,
          total_waste_kg: 24.5,
          city: "San Francisco",
          weekly_streak: 12,
        }
        setProfile(mockProfile)
      } catch (err) {
        console.error("[v0] Dashboard error:", err)
        setError("An error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [router])

  const handleLogout = async () => {
    try {
      localStorage.removeItem("user_session")
      router.push("/auth/login")
    } catch (err) {
      console.error(err)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">♻️</div>
          <p className="text-lg font-medium text-emerald-700">Loading your EcoQuest...</p>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-red-600 mb-4 font-medium">{error || "Failed to load profile"}</p>
            <Button onClick={() => router.push("/dashboard")} className="w-full bg-emerald-600 hover:bg-emerald-700">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 pb-24 sm:pb-0 sm:ml-64">
      <DesktopSidebar />

      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-emerald-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">♻️</div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              EcoQuest
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Button
                onClick={() => router.push("/admin")}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
              >
                <BarChart3 className="w-4 h-4" />
                Admin
              </Button>
            )}
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="icon"
              className="text-gray-600 hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Profile Card */}
        <ProfileCard user={profile} />

        <Card className="bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 text-white border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Zap className="w-6 h-6" />
                <CardTitle className="text-xl">Your Impact Points</CardTitle>
              </div>
              <Button
                onClick={() => router.push("/rewards")}
                size="sm"
                className="bg-white text-emerald-600 hover:bg-gray-100 font-semibold"
              >
                View Rewards →
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-emerald-100 text-sm font-medium opacity-90">Total XP Earned</p>
                <p className="text-4xl font-bold mt-1">{currentXP} XP</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium">Progress to Level {Math.floor(currentXP / 100) + 2}</p>
                  <p className="text-sm font-bold">{currentXP % 100}/100</p>
                </div>
                <div className="w-full bg-white/30 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-white h-3 rounded-full transition-all duration-500"
                    style={{ width: `${currentXP % 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <QuickActions />

        {/* Featured Events */}
        {adminEvents.length > 0 && (
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <CardTitle className="text-emerald-900">Featured Events</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {adminEvents.map((event) => (
                  <div key={event.id} className="p-3 bg-white rounded-lg border border-blue-100">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-semibold text-emerald-900">{event.title}</p>
                        <p className="text-xs text-gray-600 mt-1">
                          {event.start_date} to {event.end_date}
                        </p>
                      </div>
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold">
                        {event.reward_multiplier}x Points
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Featured Rewards */}
        {adminRewards.length > 0 && (
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-purple-600" />
                <CardTitle className="text-emerald-900">Top Rewards</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {adminRewards.map((reward) => (
                  <div key={reward.id} className="p-3 bg-white rounded-lg border border-purple-100">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-semibold text-emerald-900">{reward.name}</p>
                        <p className="text-xs text-gray-600 mt-1">by {reward.sponsor}</p>
                      </div>
                      <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-semibold">
                        {reward.points_required} pts
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Analytics Carousel */}
        <AnalyticsCarousel
          userStats={{
            rank: 12,
            city: profile.city || "your city",
            points_this_month: currentXP * 2,
            next_reward_points: 660,
          }}
        />

        {/* Community Highlights */}
        <CommunityHighlights />

        <Card className="border-2 border-dashed border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-emerald-600" />
              <CardTitle className="text-base text-emerald-900">Your Impact Matters</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-emerald-700 font-medium">
              Every waste item you classify helps build a more sustainable community. Keep earning points, unlocking
              rewards, and making a difference!
            </p>
          </CardContent>
        </Card>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  )
}
