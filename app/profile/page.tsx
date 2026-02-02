"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings, LogOut, Award, TrendingUp, Flame } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"

const mockProfile = {
  name: "Your Name",
  email: "user@example.com",
  level: 8,
  currentXP: 1245,
  nextLevelXP: 2000,
  totalXP: 5245,
  streak: 3,
  totalSubmissions: 42,
  joinDate: "March 15, 2024",
  rank: 15,
}

const mockBadges = [
  {
    id: 1,
    name: "First Step",
    description: "Complete your first recycling submission",
    icon: "🌱",
    unlocked: true,
    date: "Mar 15, 2024",
  },
  { id: 2, name: "Eco Starter", description: "Recycle 10 items", icon: "♻️", unlocked: true, date: "Mar 20, 2024" },
  {
    id: 3,
    name: "Week Warrior",
    description: "Maintain a 7-day streak",
    icon: "🔥",
    unlocked: true,
    date: "Apr 2, 2024",
  },
  { id: 4, name: "Green Guardian", description: "Recycle 50 items", icon: "🌍", unlocked: false, date: null },
  {
    id: 5,
    name: "Leaderboard Champion",
    description: "Reach #1 on the leaderboard",
    icon: "👑",
    unlocked: false,
    date: null,
  },
  { id: 6, name: "Master Recycler", description: "Recycle 100 items", icon: "🏆", unlocked: false, date: null },
]

const mockStats = [
  { label: "Total Submissions", value: mockProfile.totalSubmissions, icon: "📊" },
  { label: "Current Streak", value: `${mockProfile.streak} days`, icon: "🔥" },
  { label: "Member Since", value: mockProfile.joinDate, icon: "📅" },
]

export default function ProfilePage() {
  const router = useRouter()
  const [showSettings] = useState(false)
  const [profile, setProfile] = useState(mockProfile)

  useEffect(() => {
    const userSession = localStorage.getItem("user_session")
    if (userSession) {
      try {
        const session = JSON.parse(userSession)
        setProfile({
          ...mockProfile,
          name: session.full_name || session.email?.split("@")[0] || "Eco Warrior",
          email: session.email || "user@example.com",
        })
      } catch (error) {
        console.error("[v0] Failed to load session:", error)
      }
    }
  }, [])

  const levelProgress = (profile.currentXP / profile.nextLevelXP) * 100

  const handleLogout = () => {
    localStorage.removeItem("user_session")
    router.push("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 pb-20">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-primary via-emerald-500 to-primary text-white p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 flex items-center justify-center text-3xl bg-white/20 rounded-full">👤</div>
            <div>
              <h1 className="text-2xl font-bold">{profile.name}</h1>
              <p className="text-green-50 text-sm">{profile.email}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="text-primary border-white text-white hover:bg-white/20 bg-transparent"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Level Card */}
        <Card className="bg-gradient-to-r from-primary/5 to-emerald-500/5 border-2 border-primary/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-gray-600 text-sm">Current Level</p>
              <h2 className="text-4xl font-bold text-primary">{profile.level}</h2>
            </div>
            <div className="text-4xl">🎖️</div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>{profile.currentXP} XP</span>
              <span>{profile.nextLevelXP} XP</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-primary to-emerald-500 h-3 rounded-full transition-all"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
          </div>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          {mockStats.map((stat, index) => (
            <Card key={index} className="p-4 text-center">
              <p className="text-2xl mb-2">{stat.icon}</p>
              <p className="text-xs text-gray-600">{stat.label}</p>
              <p className="text-sm font-bold text-primary mt-1">{stat.value}</p>
            </Card>
          ))}
        </div>

        {/* Rank Card */}
        <Card className="p-4 border-2 border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-gray-600">Global Rank</p>
                <p className="text-lg font-bold text-primary">#{profile.rank}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Flame className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Current Streak</p>
                <p className="text-lg font-bold text-orange-500">{profile.streak} days</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Badges Section */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            Achievements
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {mockBadges.map((badge) => (
              <Card
                key={badge.id}
                className={`p-4 text-center transition-all ${
                  badge.unlocked
                    ? "border-primary/20 bg-gradient-to-br from-primary/5 to-emerald-500/5"
                    : "border-gray-200 opacity-50"
                }`}
              >
                <p className="text-3xl mb-2">{badge.icon}</p>
                <p className="text-xs font-semibold text-gray-900">{badge.name}</p>
                {badge.unlocked && badge.date && <p className="text-xs text-gray-500 mt-1">{badge.date}</p>}
              </Card>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4 border-t border-gray-200">
          <Button className="w-full bg-primary text-white hover:bg-primary/90">Edit Profile</Button>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
