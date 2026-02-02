"use client"

import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"

interface ProfileCardProps {
  user: {
    full_name?: string
    avatar_url?: string
    level?: number
    xp?: number
    total_waste_kg?: number
  }
}

export function ProfileCard({ user }: ProfileCardProps) {
  const router = useRouter()
  const xpForNextLevel = 1000
  const currentXP = (user.xp || 0) % xpForNextLevel
  const xpProgress = (currentXP / xpForNextLevel) * 100

  return (
    <Card
      className="bg-gradient-to-br from-green-50 to-teal-50 border-green-200 cursor-pointer hover:shadow-lg transition-all"
      onClick={() => router.push("/profile")}
    >
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary">
              <AvatarImage src={user.avatar_url || "/placeholder.svg"} alt={user.full_name} />
              <AvatarFallback>{user.full_name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-xl font-bold text-foreground">{user.full_name || "EcoWarrior"}</h2>
                <Badge className="bg-primary">Level {user.level || 1}</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                You've saved {(user.total_waste_kg || 0).toFixed(1)}kg of waste this week
              </p>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-gray-600">
                    {currentXP} / {xpForNextLevel} XP
                  </span>
                </div>
                <Progress value={xpProgress} className="h-2" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
