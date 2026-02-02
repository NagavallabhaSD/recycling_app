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
      .from("recycling_locations")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Location fetch error:", error)
      return NextResponse.json([])
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error("[v0] Location fetch error:", error)
    return NextResponse.json([])
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, latitude, longitude, radius_meters } = body

    const { data, error } = await supabase
      .from("recycling_locations")
      .insert({
        name,
        latitude,
        longitude,
        radius_meters: radius_meters || 100,
        active: true,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Location insert error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Location creation error:", error)
    return NextResponse.json({ error: "Failed to create location" }, { status: 500 })
  }
}
