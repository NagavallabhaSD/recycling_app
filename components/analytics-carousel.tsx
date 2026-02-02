"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"

interface AnalyticsItem {
  title: string
  value: string | number
  description: string
  icon: string
  color: string
}

interface AnalyticsCarouselProps {
  userStats: {
    rank?: number
    city?: string
    points_this_month?: number
    next_reward_points?: number
  }
}

export function AnalyticsCarousel({ userStats }: AnalyticsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const analytics: AnalyticsItem[] = [
    {
      title: "Your Rank",
      value: `#${userStats.rank || 12}`,
      description: `in ${userStats.city || "your city"}`,
      icon: "🏆",
      color: "from-yellow-50 to-orange-50",
    },
    {
      title: "Points This Month",
      value: userStats.points_this_month || 340,
      description: "total XP earned",
      icon: "⭐",
      color: "from-blue-50 to-cyan-50",
    },
    {
      title: "Next Reward",
      value: `${userStats.next_reward_points || 660} pts`,
      description: "₹50 Amazon Voucher",
      icon: "🎁",
      color: "from-pink-50 to-rose-50",
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % analytics.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [analytics.length])

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-lg">
        {analytics.map((item, idx) => (
          <div
            key={idx}
            className={`transition-opacity duration-500 ${
              idx === currentIndex ? "opacity-100" : "opacity-0 absolute inset-0"
            }`}
          >
            <Card className={`bg-gradient-to-br ${item.color} border-0`}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{item.title}</p>
                    <p className="text-3xl font-bold text-foreground mb-1">{item.value}</p>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                  <div className="text-4xl">{item.icon}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Carousel indicators */}
      <div className="flex justify-center gap-2 mt-3">
        {analytics.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 rounded-full transition-all ${
              idx === currentIndex ? "bg-primary w-6" : "bg-gray-300 w-2 hover:bg-gray-400"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
