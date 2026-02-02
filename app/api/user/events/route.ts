import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const events = [
      {
        id: "1",
        title: "Plastic Free Week",
        description: "Reduce plastic waste this week",
        start_date: "2025-01-01",
        end_date: "2025-01-07",
        reward_multiplier: 1.5,
        city: "Mumbai",
        icon: "♻️",
        participants: 340,
      },
      {
        id: "2",
        title: "Glass Recycling Drive",
        description: "Focus on glass collection",
        start_date: "2025-01-10",
        end_date: "2025-01-17",
        reward_multiplier: 2.0,
        city: "Bangalore",
        icon: "🍾",
        participants: 220,
      },
      {
        id: "3",
        title: "Metal Collection Challenge",
        description: "Collect metal waste for recycling",
        start_date: "2025-01-20",
        end_date: "2025-01-27",
        reward_multiplier: 1.8,
        city: "Delhi",
        icon: "⚙️",
        participants: 180,
      },
    ]
    return NextResponse.json({
      success: true,
      data: events,
    })
  } catch (error) {
    console.error("[v0] Failed to fetch events:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch events" }, { status: 500 })
  }
}
