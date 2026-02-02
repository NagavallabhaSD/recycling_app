import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

// Use service role key to bypass RLS for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("rewards")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Rewards fetch error:", error)
      return NextResponse.json([])
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error("[v0] Rewards fetch error:", error)
    return NextResponse.json([])
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description, points_required, sponsor, stock_count, image_url } = body

    const { data, error } = await supabase
      .from("rewards")
      .insert({
        name,
        description,
        points_required: points_required || 50,
        sponsor,
        stock_count: stock_count || 10,
        image_url,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Reward insert error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Reward creation error:", error)
    return NextResponse.json({ error: "Failed to create reward" }, { status: 500 })
  }
}
