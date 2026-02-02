"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Zap, Target, Users, Calendar } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"

const mockChallenges = [
  {
    id: 1,
    title: "Plastic-Free Week",
    description: "Submit 5 plastic recycling items",
    progress: 3,
    total: 5,
    reward: 150,
    participants: 1240,
    icon: "♻️",
    difficulty: "Easy",
    endsIn: "3 days",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 2,
    title: "Metal Master",
    description: "Recycle 10 metal cans or containers",
    progress: 0,
    total: 10,
    reward: 250,
    participants: 892,
    icon: "🥫",
    difficulty: "Medium",
    endsIn: "5 days",
    color: "from-amber-500 to-orange-500",
  },
  {
    id: 3,
    title: "Paper Collector",
    description: "Submit 15 paper or cardboard items",
    progress: 7,
    total: 15,
    reward: 300,
    participants: 2105,
    icon: "📦",
    difficulty: "Medium",
    endsIn: "7 days",
    color: "from-yellow-500 to-amber-500",
  },
  {
    id: 4,
    title: "Glass Guardian",
    description: "Complete 20 glass recycling submissions",
    progress: 0,
    total: 20,
    reward: 400,
    participants: 634,
    icon: "🍾",
    difficulty: "Hard",
    endsIn: "10 days",
    color: "from-green-500 to-emerald-500",
  },
]

const mockEvents = [
  {
    id: 1,
    title: "EcoQuest Community Cleanup",
    date: "Nov 15, 2024",
    time: "10:00 AM",
    location: "Central Park",
    participants: 342,
    image: "🌍",
  },
  {
    id: 2,
    title: "Recycling Workshop",
    date: "Nov 22, 2024",
    time: "2:00 PM",
    location: "Community Center",
    participants: 156,
    image: "📚",
  },
]

export default function ChallengesPage() {
  const [joinedChallenges, setJoinedChallenges] = useState([1, 3])
  const [challenges, setChallenges] = useState(mockChallenges)
  const [events, setEvents] = useState(mockEvents)

  // Fetch real challenges and events from Supabase
  useEffect(() => {
    const fetchData = async () => {
      // Placeholder for Supabase client creation and data fetching logic
      // This section is intentionally left empty as per the updates
    }

    fetchData()
  }, [])

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/user/events")
        const json = await response.json()
        if (json.success) {
          setEvents(json.data)
        }
      } catch (error) {
        console.error("[v0] Failed to fetch events:", error)
      }
    }

    fetchEvents()
  }, [])

  const handleJoinChallenge = (id: number) => {
    if (!joinedChallenges.includes(id)) {
      setJoinedChallenges([...joinedChallenges, id])
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary via-emerald-500 to-primary text-white p-6 sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-2">
          <Zap className="w-6 h-6" />
          <h1 className="text-2xl font-bold">Challenges & Events</h1>
        </div>
        <p className="text-green-50 text-sm">Join challenges to earn extra rewards</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Challenges Section */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Active Challenges
          </h2>
          <div className="space-y-3">
            {challenges.map((challenge) => (
              <Card key={challenge.id} className="p-4 hover:shadow-lg transition-all">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center text-2xl bg-gray-100 rounded-lg">
                    {challenge.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{challenge.title}</h3>
                        <p className="text-sm text-gray-600">{challenge.description}</p>
                      </div>
                      <Badge className="bg-primary text-white">{challenge.difficulty}</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-primary to-emerald-500 h-2 rounded-full transition-all"
                          style={{ width: `${(challenge.progress / challenge.total) * 100}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>
                          {challenge.progress}/{challenge.total}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {challenge.participants.toLocaleString()} joined
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-primary font-bold">+{challenge.reward} XP</span>
                        <span className="text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {challenge.endsIn}
                        </span>
                      </div>
                      <Button
                        onClick={() => handleJoinChallenge(challenge.id)}
                        variant={joinedChallenges.includes(challenge.id) ? "outline" : "default"}
                        size="sm"
                        className={
                          joinedChallenges.includes(challenge.id) ? "" : "bg-primary text-white hover:bg-primary/90"
                        }
                      >
                        {joinedChallenges.includes(challenge.id) ? "Joined" : "Join"}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Events Section */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Upcoming Events
          </h2>
          <div className="space-y-3">
            {events.map((event) => (
              <Card key={event.id} className="p-4 hover:shadow-lg transition-all">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center text-2xl bg-gray-100 rounded-lg">
                    {event.image}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{event.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {event.date} at {event.time}
                    </p>
                    <p className="text-sm text-gray-600">{event.location}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {event.participants} attending
                      </span>
                      <Button variant="outline" size="sm">
                        Learn More
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
