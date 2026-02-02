"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel"

const mockCommunityHighlights = [
  {
    id: 1,
    username: "EcoWarrior123",
    avatar: "/placeholder-user.jpg",
    material: "Plastic",
    timestamp: "2 hours ago",
    points: 50,
  },
  {
    id: 2,
    username: "GreenGuru",
    avatar: "/placeholder-user.jpg",
    material: "E-waste",
    timestamp: "4 hours ago",
    points: 100,
  },
  {
    id: 3,
    username: "RecycleQueen",
    avatar: "/placeholder-user.jpg",
    material: "Metal",
    timestamp: "6 hours ago",
    points: 75,
  },
]

export function CommunityHighlights() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <span>🌍</span>
          Community Highlights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Carousel className="w-full">
          <CarouselContent>
            {mockCommunityHighlights.map((highlight) => (
              <CarouselItem key={highlight.id} className="basis-full sm:basis-1/2">
                <div className="p-3 bg-gradient-to-br from-green-50 to-teal-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={highlight.avatar || "/placeholder.svg"} alt={highlight.username} />
                      <AvatarFallback>{highlight.username.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{highlight.username}</p>
                      <p className="text-xs text-gray-500">{highlight.timestamp}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{highlight.material}</Badge>
                    <Badge className="bg-primary ml-auto">+{highlight.points}</Badge>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
      </CardContent>
    </Card>
  )
}
