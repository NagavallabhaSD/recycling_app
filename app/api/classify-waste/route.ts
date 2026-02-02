import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const formData = await req.formData()
  const image = formData.get("image")

  if (!image || !(image instanceof File)) {
    return NextResponse.json({ error: "Invalid image" }, { status: 400 })
  }

  const base64 = Buffer.from(await image.arrayBuffer()).toString("base64")

  const mlResponse = await fetch(process.env.ROBOFLOW_WORKFLOW_URL!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: process.env.ROBOFLOW_API_KEY,
      inputs: {
        image: { type: "base64", value: base64 },
      },
    }),
  })

  if (!mlResponse.ok) {
    const text = await mlResponse.text()
    console.error("[ROBOFLOW ERROR]", text)
    return NextResponse.json({ error: "Roboflow API error" }, { status: 500 })
  }

  const data = await mlResponse.json()

  console.log("[ROBOFLOW RAW RESPONSE]", Object.keys(data))

  // 🔹 Safely get classification predictions
  const classificationBlock = data.outputs?.[0]?.predictions

  if (!classificationBlock) {
    console.warn("[ML] No classification block found")
    return NextResponse.json({ top: null, all: [] }, { status: 200 })
  }

  const predictionsArray = classificationBlock.predictions

  if (!Array.isArray(predictionsArray) || predictionsArray.length === 0) {
    console.warn("[ML] No predictions array found")
    return NextResponse.json({ top: null, all: [] }, { status: 200 })
  }

  // 🔹 Convert Roboflow predictions → Frontend format
  const formattedResults = predictionsArray.map((p: any) => ({
    material: p.class || "Unknown",
    confidence: p.confidence || 0,
    points: Math.round((p.confidence || 0) * 20),
  }))

  // Sort by confidence highest first
  formattedResults.sort((a, b) => b.confidence - a.confidence)

  console.log("[ML] Formatted Results:", formattedResults)

  return NextResponse.json({
    top: formattedResults[0],
    all: formattedResults,
  })
}
