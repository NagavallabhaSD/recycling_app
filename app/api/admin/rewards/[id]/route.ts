import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()

    const { data, error } = await supabase
      .from("rewards")
      .update(body)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("[v0] Reward update error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Reward update error:", error)
    return NextResponse.json({ error: "Failed to update reward" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const { error } = await supabase.from("rewards").delete().eq("id", id)

    if (error) {
      console.error("[v0] Reward delete error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Reward delete error:", error)
    return NextResponse.json({ error: "Failed to delete reward" }, { status: 500 })
  }
}
