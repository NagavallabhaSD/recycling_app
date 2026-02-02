import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { material, confidence, points } = await request.json()

    if (!material || !confidence || !points) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    console.log("[API] Recycling submitted", { material, confidence, points })

    return NextResponse.json({
      success: true,
      points,
    })
  } catch (error) {
    return NextResponse.json({ error: "Submission failed" }, { status: 500 })
  }
}
