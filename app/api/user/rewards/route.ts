import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from("rewards")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error

    // If no rewards in DB, return default rewards
    if (!data || data.length === 0) {
      const defaultRewards = [
        {
          id: "1",
          name: "Eco Bag",
          description: "Reusable shopping bag",
          points_required: 50,
          sponsor: "GreenCorp",
          stock_count: 25,
          icon: "👜",
          category: "Merchandise",
        },
        {
          id: "2",
          name: "Water Bottle",
          description: "Sustainable water bottle",
          points_required: 75,
          sponsor: "EcoLife",
          stock_count: 15,
          icon: "💧",
          category: "Merchandise",
        },
      ]
      return NextResponse.json({ success: true, data: defaultRewards })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("[v0] Failed to fetch rewards:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch rewards" }, { status: 500 })
  }
}
