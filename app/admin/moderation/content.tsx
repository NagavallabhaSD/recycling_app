"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Trash2, EyeOff, Search, Flag } from "lucide-react"

// Mock flagged content
const mockFlaggedContent = [
  {
    id: 1,
    user: "John Doe",
    content: "Inappropriate comment on post",
    type: "comment",
    flags: 3,
    reason: "Offensive language",
    timestamp: "2 hours ago",
    status: "pending",
  },
  {
    id: 2,
    user: "Jane Smith",
    content: "Suspicious submission image",
    type: "submission",
    flags: 2,
    reason: "Potential fraud",
    timestamp: "4 hours ago",
    status: "pending",
  },
  {
    id: 3,
    user: "Mike Johnson",
    content: "Spam post in community",
    type: "post",
    flags: 5,
    reason: "Spam/Advertising",
    timestamp: "1 day ago",
    status: "pending",
  },
]

export default function ModerationContent() {
  const [items, setItems] = useState(mockFlaggedContent)
  const [searchTerm, setSearchTerm] = useState("")

  const handleRemove = (id: number) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const handleApprove = (id: number) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const filtered = items.filter(
    (item) =>
      item.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.reason.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const stats = {
    pending: items.length,
    totalFlags: items.reduce((sum, item) => sum + item.flags, 0),
    resolved: 12,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Content Moderation</h1>
        <p className="text-slate-400 mt-2">Review and manage flagged user content</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4">
            <p className="text-slate-400 text-sm">Pending Review</p>
            <p className="text-3xl font-bold text-emerald-400 mt-2">{stats.pending}</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4">
            <p className="text-slate-400 text-sm">Total Flags</p>
            <p className="text-3xl font-bold text-amber-400 mt-2">{stats.totalFlags}</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4">
            <p className="text-slate-400 text-sm">Resolved Today</p>
            <p className="text-3xl font-bold text-blue-400 mt-2">{stats.resolved}</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search by user, content, or reason..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-slate-900 border-slate-800 text-white"
        />
      </div>

      {/* Flagged Content List */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <Card key={item.id} className="bg-slate-900 border-slate-800">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Flag className="h-5 w-5 text-red-400" />
                    <h3 className="font-semibold text-white">{item.user}</h3>
                    <span className="text-xs px-2 py-1 bg-slate-800 text-slate-300 rounded-full">{item.type}</span>
                  </div>
                  <p className="text-sm text-slate-400 mt-2">"{item.content}"</p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                    <span>Reason: {item.reason}</span>
                    <span>{item.timestamp}</span>
                    <span className="flex items-center gap-1">
                      <AlertTriangle size={14} />
                      {item.flags} flags
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4 pt-4 border-t border-slate-800 justify-end">
                <Button
                  onClick={() => handleApprove(item.id)}
                  variant="outline"
                  className="gap-2 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                >
                  <EyeOff size={16} />
                  Keep
                </Button>
                <Button onClick={() => handleRemove(item.id)} className="gap-2 bg-red-600 hover:bg-red-700">
                  <Trash2 size={16} />
                  Remove
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {filtered.length === 0 && (
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-12 text-center">
              <p className="text-slate-400">No flagged content found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
