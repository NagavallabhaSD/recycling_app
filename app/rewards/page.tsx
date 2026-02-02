"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Gift, Zap, TrendingUp } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import { DesktopSidebar } from "@/components/desktop-sidebar"

const RewardsPage = () => {
  const [userXP, setUserXP] = useState(0)
  const [rewards, setRewards] = useState([])
  const [claimedRewards, setClaimedRewards] = useState([])

  useEffect(() => {
    // Fetch rewards from Supabase via API
    const fetchRewards = async () => {
      try {
        const response = await fetch("/api/user/rewards")
        const json = await response.json()
        if (json.success && Array.isArray(json.data)) {
          // Transform rewards to match the user rewards format
          const transformedRewards = json.data.map((reward: any) => ({
            id: reward.id,
            name: reward.name,
            description: reward.description,
            cost: reward.points_required,
            category: reward.sponsor || reward.category || "Merchandise",
            icon: reward.image_url || reward.icon || "🎁",
            stock: reward.stock_count,
          }))
          setRewards(transformedRewards)
        }
      } catch (error) {
        console.error("[v0] Failed to fetch rewards:", error)
      }
    }

    const userSession = localStorage.getItem("user_session")
    if (userSession) {
      const session = JSON.parse(userSession)
      const currentUser = session.id || "demo_user"
      const xpKey = `user_xp_${currentUser}`
      const storedXPString = localStorage.getItem(xpKey)
      const storedXP = storedXPString ? Number.parseInt(storedXPString, 10) : 0
      setUserXP(Number.isNaN(storedXP) ? 0 : storedXP)

      const claimedKey = `user_claimed_rewards_${currentUser}`
      const storedClaimed = JSON.parse(localStorage.getItem(claimedKey) || "[]")
      setClaimedRewards(storedClaimed)
    }

    fetchRewards()
  }, [])

  const handleClaimReward = (reward) => {
    if (userXP < reward.cost) return

    const newXP = userXP - reward.cost
    setUserXP(newXP)

    const userSession = localStorage.getItem("user_session")
    if (userSession) {
      const session = JSON.parse(userSession)
      const currentUser = session.id || "demo_user"
      const xpKey = `user_xp_${currentUser}`
      localStorage.setItem(xpKey, newXP.toString())

      const newClaimed = [...claimedRewards, reward]
      setClaimedRewards(newClaimed)
      const claimedKey = `user_claimed_rewards_${currentUser}`
      localStorage.setItem(claimedKey, JSON.stringify(newClaimed))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 pb-20 sm:ml-64">
      <DesktopSidebar />

      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 text-white p-6 sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-2">
          <Gift className="w-6 h-6" />
          <h1 className="text-2xl font-bold">Rewards Shop</h1>
        </div>
        <p className="text-emerald-50 text-sm">Spend your XP on awesome rewards</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* XP Balance */}
        <Card className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-50 text-sm opacity-90">Your XP Balance</p>
              <p className="text-4xl font-bold mt-1">{userXP.toLocaleString()} XP</p>
            </div>
            <div className="text-5xl">⭐</div>
          </div>
        </Card>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {["All", "Merchandise", "Vouchers", "Impact", "Cosmetic", "Booster"].map((category) => (
            <Badge
              key={category}
              className="px-4 py-2 cursor-pointer flex-shrink-0 bg-emerald-100 text-emerald-700 border border-emerald-300 hover:bg-emerald-600 hover:text-white transition-all"
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Rewards Grid */}
        <div className="space-y-3">
          {rewards.map((reward) => {
            const isClaimed = claimedRewards.some((r) => r.id === reward.id)
            return (
              <Card key={reward.id} className={`p-4 transition-all ${isClaimed ? "opacity-60 bg-gray-50" : ""}`}>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center text-4xl bg-white rounded-lg border-2 border-gray-200">
                    {reward.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{reward.name}</h3>
                        <p className="text-sm text-gray-700">{reward.description}</p>
                      </div>
                      <Badge variant="outline" className="text-xs text-emerald-700 border-emerald-300">
                        {reward.category}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2 text-emerald-600 font-bold">
                        <Zap className="w-4 h-4" />
                        {reward.cost} XP
                      </div>
                      {isClaimed ? (
                        <Badge className="bg-emerald-600 text-white">✓ Claimed</Badge>
                      ) : (
                        <Button
                          size="sm"
                          disabled={userXP < reward.cost}
                          onClick={() => handleClaimReward(reward)}
                          className={userXP >= reward.cost ? "bg-emerald-600 text-white hover:bg-emerald-700" : ""}
                        >
                          {userXP >= reward.cost ? "Claim" : "Locked"}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Claimed Rewards */}
        {claimedRewards.length > 0 && (
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              Your Claimed Rewards ({claimedRewards.length})
            </h3>
            <div className="space-y-2">
              {claimedRewards.map((reward) => (
                <Card key={reward.id} className="p-3 bg-emerald-50 border-emerald-300">
                  <p className="text-sm font-semibold text-emerald-900">
                    {reward.icon} {reward.name}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}

export default RewardsPage
