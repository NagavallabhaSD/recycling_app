"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, MoreVertical, TrendingUp } from "lucide-react"

// Mock user data
const mockUsers = [
  {
    id: 1,
    name: "Rajesh Kumar",
    city: "Bengaluru",
    rank: 12,
    totalPoints: 3450,
    submissions: 48,
    joinDate: "Jan 15, 2024",
  },
  {
    id: 2,
    name: "Priya Singh",
    city: "Mumbai",
    rank: 8,
    totalPoints: 4920,
    submissions: 65,
    joinDate: "Dec 20, 2023",
  },
  {
    id: 3,
    name: "Amit Patel",
    city: "Delhi",
    rank: 3,
    totalPoints: 8750,
    submissions: 142,
    joinDate: "Nov 5, 2023",
  },
  {
    id: 4,
    name: "Neha Gupta",
    city: "Hyderabad",
    rank: 25,
    totalPoints: 2100,
    submissions: 28,
    joinDate: "Feb 1, 2024",
  },
]

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filtered = mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.city.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">User Management</h1>
        <p className="text-slate-400 mt-2">Manage and monitor platform users</p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search by name or city..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-slate-900 border-slate-800 text-white"
        />
      </div>

      {/* Users Table */}
      <Card className="bg-slate-900 border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50 border-b border-slate-800">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">City</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Rank</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Points</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Submissions</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Joined</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-slate-800/50 transition">
                  <td className="px-6 py-4 text-white font-medium">{user.name}</td>
                  <td className="px-6 py-4 text-slate-400">{user.city}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400 font-semibold">#{user.rank}</span>
                      <TrendingUp size={14} className="text-emerald-400" />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-white">{user.totalPoints.toLocaleString()}</td>
                  <td className="px-6 py-4 text-slate-400">{user.submissions}</td>
                  <td className="px-6 py-4 text-slate-400 text-sm">{user.joinDate}</td>
                  <td className="px-6 py-4">
                    <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-300">
                      <MoreVertical size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {filtered.length === 0 && (
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-12 text-center">
            <p className="text-slate-400">No users found</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
