"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Search, Loader2 } from "lucide-react"
import { AddRewardModal } from "@/components/admin/add-reward-modal"

interface Reward {
  id: string
  name: string
  description: string
  points_required: number
  image_url?: string
  sponsor: string
  stock_count: number
}

interface Stats {
  totalUsers: number
  activeSubmissions: number
  totalRedeemed: number
}

export default function RewardsContent() {
  const [rewards, setRewards] = useState<Reward[]>([])
  const [stats, setStats] = useState<Stats>({ totalUsers: 0, activeSubmissions: 0, totalRedeemed: 0 })
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/admin/rewards")
        const data = await response.json()
        if (Array.isArray(data)) {
          setRewards(data)
        }
        setStats({ totalUsers: 1250, activeSubmissions: 340, totalRedeemed: 285 })
      } catch (error) {
        console.error("[v0] Failed to fetch rewards:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filtered = rewards.filter((reward) => reward.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleAddReward = async (reward: Omit<Reward, "id">) => {
    try {
      const response = await fetch("/api/admin/rewards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reward),
      })
      const newReward = await response.json()
      if (newReward && newReward.id) {
        setRewards([newReward, ...rewards])
      }
      setShowAddModal(false)
    } catch (error) {
      console.error("[v0] Failed to add reward:", error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/admin/rewards/${id}`, { method: "DELETE" })
      setRewards(rewards.filter((r) => r.id !== id))
    } catch (error) {
      console.error("[v0] Failed to delete reward:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Rewards Management</h1>
          <p className="text-slate-400 mt-2">Manage rewards and redemption tracking</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
          <Plus className="w-4 h-4" />
          Add Reward
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <p className="text-slate-400 text-sm">Total Users</p>
            <p className="text-3xl font-bold text-emerald-400 mt-2">{stats.totalUsers}</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <p className="text-slate-400 text-sm">Active Submissions</p>
            <p className="text-3xl font-bold text-blue-400 mt-2">{stats.activeSubmissions}</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <p className="text-slate-400 text-sm">Rewards Redeemed</p>
            <p className="text-3xl font-bold text-purple-400 mt-2">{stats.totalRedeemed}</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search rewards..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-slate-900 border-slate-800 text-white"
        />
      </div>

      {/* Rewards List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((reward) => (
            <Card key={reward.id} className="bg-slate-900 border-slate-800">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white text-lg">{reward.name}</h3>
                    <p className="text-sm text-slate-400 mt-1">{reward.description}</p>
                    <div className="flex gap-2 mt-3">
                      <Badge className="bg-emerald-600">{reward.points_required} Points</Badge>
                      <Badge className="bg-slate-700">{reward.sponsor}</Badge>
                      <Badge className="bg-blue-600">{reward.stock_count} in stock</Badge>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleDelete(reward.id)}
                    variant="outline"
                    className="border-red-700/30 text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showAddModal && <AddRewardModal onAdd={handleAddReward} onClose={() => setShowAddModal(false)} />}
    </div>
  )
}
