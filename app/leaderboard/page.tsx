"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, TrendingUp, Flame } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import { DesktopSidebar } from "@/components/desktop-sidebar"

// Mock leaderboard data
const mockLeaderboardData = [
  { id: 1, rank: 1, name: "Alex Green", points: 2450, streak: 12, avatar: "👤", badge: "Eco Warrior" },
  { id: 2, rank: 2, name: "Sarah Eco", points: 2180, streak: 9, avatar: "👤", badge: "Green Master" },
  { id: 3, rank: 3, name: "Jordan Lee", points: 1920, streak: 7, avatar: "👤", badge: "Recycler Pro" },
  { id: 4, rank: 4, name: "Taylor Swift", points: 1645, streak: 5, avatar: "👤", badge: "Recycler" },
  { id: 5, rank: 5, name: "Casey Park", points: 1420, streak: 4, avatar: "👤", badge: "Recycler" },
  { id: 6, rank: 6, name: "Morgan Hall", points: 1180, streak: 3, avatar: "👤", badge: "Starter" },
  { id: 7, rank: 7, name: "Riley Chen", points: 945, streak: 2, avatar: "👤", badge: "Starter" },
  { id: 8, rank: 8, name: "Quinn Davis", points: 720, streak: 1, avatar: "👤", badge: "Beginner" },
]

const mockWeeklyLeaderboard = [
  { id: 1, rank: 1, name: "Sarah Eco", points: 580, streak: 7, avatar: "👤" },
  { id: 2, rank: 2, name: "Alex Green", points: 520, streak: 6, avatar: "👤" },
  { id: 3, rank: 3, name: "Jordan Lee", points: 480, streak: 5, avatar: "👤" },
  { id: 4, rank: 4, name: "Taylor Swift", points: 420, streak: 4, avatar: "👤" },
  { id: 5, rank: 5, name: "Casey Park", points: 360, streak: 3, avatar: "👤" },
]

export default function LeaderboardPage() {
  const [currentUserRank, setCurrentUserRank] = useState({ rank: 15, name: "You", points: 580, streak: 3 })
  const [leaderboardData, setLeaderboardData] = useState(mockLeaderboardData)
  const [weeklyData, setWeeklyData] = useState(mockWeeklyLeaderboard)

  useEffect(() => {
    // Using mock data
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 pb-20 sm:ml-64">
      <DesktopSidebar />

      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 text-white p-6 sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="w-6 h-6" />
          <h1 className="text-2xl font-bold">Leaderboard</h1>
        </div>
        <p className="text-emerald-50 text-sm">Compete with the EcoQuest community</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Tabs */}
        <Tabs defaultValue="all-time" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white border border-emerald-200">
            <TabsTrigger value="all-time" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              All Time
            </TabsTrigger>
            <TabsTrigger value="monthly" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              Monthly
            </TabsTrigger>
            <TabsTrigger value="weekly" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              Weekly
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all-time" className="space-y-3 mt-4">
            {leaderboardData.map((user, index) => (
              <Card key={user.id} className="p-4 hover:shadow-lg transition-all hover:border-emerald-300">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 font-bold text-white">
                    {index < 3 ? "🏅" : user.rank}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{user.name}</h3>
                    <p className="text-sm text-emerald-700 font-medium">{user.badge}</p>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-right">
                      <p className="font-bold text-emerald-600">{user.points}</p>
                      <p className="text-xs text-gray-600 flex items-center gap-1">
                        <Flame className="w-3 h-3 text-orange-500" />
                        {user.streak}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="monthly" className="space-y-3 mt-4">
            {leaderboardData.map((user) => (
              <Card key={user.id} className="p-4 hover:shadow-lg transition-all hover:border-emerald-300">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-600">
                    {user.rank}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{user.name}</h3>
                    <p className="text-sm text-emerald-700 font-medium">{user.badge}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-600">{Math.floor(user.points * 0.7)}</p>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="weekly" className="space-y-3 mt-4">
            {weeklyData.map((user, index) => (
              <Card key={user.id} className="p-4 hover:shadow-lg transition-all hover:border-emerald-300">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-600">
                    {index < 3 ? "🥇🥈🥉"[index] : user.rank}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{user.name}</h3>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-600">{user.points}</p>
                    <p className="text-xs text-gray-600 flex items-center gap-1">
                      <Flame className="w-3 h-3 text-orange-500" />
                      {user.streak}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        {/* Your Rank Card */}
        <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-300 p-4 mt-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-emerald-100">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900">Your Rank: #{currentUserRank.rank}</h3>
              <p className="text-sm text-gray-700">
                {currentUserRank.points} points • {currentUserRank.streak} day streak
              </p>
            </div>
          </div>
        </Card>
      </div>

      <BottomNav />
    </div>
  )
}
