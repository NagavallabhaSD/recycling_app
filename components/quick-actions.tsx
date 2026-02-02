"use client"

import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { RecycleIcon, Target, Trophy, ArrowRight } from "lucide-react"

export function QuickActions() {
  const router = useRouter()

  const actions = [
    {
      title: "Upload Recycling",
      description: "Scan & earn points",
      icon: RecycleIcon,
      color: "from-green-500 to-emerald-600",
      hoverColor: "hover:from-green-600 hover:to-emerald-700",
      route: "/upload",
    },
    {
      title: "Join Challenge",
      description: "Complete weekly goals",
      icon: Target,
      color: "from-teal-500 to-cyan-600",
      hoverColor: "hover:from-teal-600 hover:to-cyan-700",
      route: "/challenges",
    },
    {
      title: "Leaderboard",
      description: "See your ranking",
      icon: Trophy,
      color: "from-amber-500 to-orange-600",
      hoverColor: "hover:from-amber-600 hover:to-orange-700",
      route: "/leaderboard",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {actions.map((action) => {
        const Icon = action.icon
        return (
          <Card
            key={action.route}
            onClick={() => router.push(action.route)}
            className={`relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-0`}
          >
            <div className={`bg-gradient-to-br ${action.color} ${action.hoverColor} p-6 h-full transition-all`}>
              <div className="flex flex-col h-full justify-between text-white">
                <div className="flex items-start justify-between mb-3">
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                    <Icon className="w-7 h-7" />
                  </div>
                  <ArrowRight className="w-5 h-5 opacity-60" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">{action.title}</h3>
                  <p className="text-sm text-white/80">{action.description}</p>
                </div>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
