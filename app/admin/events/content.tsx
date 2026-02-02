"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Calendar, Plus, Trash2, Search, Loader2 } from "lucide-react"
import { AddEventModal } from "@/components/admin/add-event-modal"

interface Event {
  id: string
  title: string
  description: string
  start_date: string
  end_date: string
  reward_multiplier: number
  city: string
}

interface Stats {
  totalUsers: number
  activeSubmissions: number
  eventParticipants: number
}

export default function EventsContent() {
  const [events, setEvents] = useState<Event[]>([])
  const [stats, setStats] = useState<Stats>({ totalUsers: 0, activeSubmissions: 0, eventParticipants: 0 })
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stored = localStorage.getItem("admin_events")
        if (stored) {
          setEvents(JSON.parse(stored))
        } else {
          // Initialize with default data if not exists
          const defaultEvents = [
            {
              id: "1",
              title: "Plastic Free Week",
              description: "Reduce plastic waste this week",
              start_date: "2025-01-01",
              end_date: "2025-01-07",
              reward_multiplier: 1.5,
              city: "Mumbai",
            },
            {
              id: "2",
              title: "Glass Recycling Drive",
              description: "Focus on glass collection",
              start_date: "2025-01-10",
              end_date: "2025-01-17",
              reward_multiplier: 2.0,
              city: "Bangalore",
            },
          ]
          setEvents(defaultEvents)
          localStorage.setItem("admin_events", JSON.stringify(defaultEvents))
        }
        setStats({ totalUsers: 1250, activeSubmissions: 340, eventParticipants: 450 })
      } catch (error) {
        console.error("[v0] Failed to fetch events:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filtered = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.city.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddEvent = (event: Omit<Event, "id">) => {
    const newEvent = { ...event, id: Math.random().toString() }
    const updated = [newEvent, ...events]
    setEvents(updated)
    localStorage.setItem("admin_events", JSON.stringify(updated))
    setShowAddModal(false)
  }

  const handleDelete = (id: string) => {
    const updated = events.filter((e) => e.id !== id)
    setEvents(updated)
    localStorage.setItem("admin_events", JSON.stringify(updated))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Events Management</h1>
          <p className="text-slate-400 mt-2">Create and manage recycling events</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
          <Plus className="w-4 h-4" />
          Add Event
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
            <p className="text-slate-400 text-sm">Event Participants</p>
            <p className="text-3xl font-bold text-purple-400 mt-2">{stats.eventParticipants}</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search events by title or city..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-slate-900 border-slate-800 text-white"
        />
      </div>

      {/* Events List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((event) => (
            <Card key={event.id} className="bg-slate-900 border-slate-800">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white text-lg">{event.title}</h3>
                    <p className="text-sm text-slate-400 mt-1">{event.description}</p>
                    <div className="flex gap-2 mt-3">
                      <Badge className="bg-emerald-600">
                        <Calendar className="w-3 h-3 mr-1" />
                        {event.start_date} to {event.end_date}
                      </Badge>
                      <Badge className="bg-blue-600">{event.city}</Badge>
                      <Badge className="bg-purple-600">{event.reward_multiplier}x Multiplier</Badge>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleDelete(event.id)}
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

      {showAddModal && <AddEventModal onAdd={handleAddEvent} onClose={() => setShowAddModal(false)} />}
    </div>
  )
}
