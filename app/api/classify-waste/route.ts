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
    return NextResponse.json({ error: "Roboflow API error", details: text }, { status: 500 })
  }

  const data = await mlResponse.json()
  console.log("[ROBOFLOW RAW RESPONSE]", Object.keys(data))

  let predictionsRaw = data.outputs?.[0]?.predictions

  if (!predictionsRaw) {
    return NextResponse.json({ error: "No predictions returned" }, { status: 200 })
  }

  // If predictions come nested (your case)
  if (predictionsRaw.predictions) {
    const topClass = predictionsRaw.top || "Unknown"
    const confidence = predictionsRaw.confidence || 0

    return NextResponse.json({
      all: [
        {
          material: topClass,
          confidence,
          points: Math.round(confidence * 20),
        },
      ],
    })
  }

  // Fallback if ever array format
  if (Array.isArray(predictionsRaw)) {
    const formatted = predictionsRaw.map((p: any) => ({
      material: p.class || p.label || "Unknown",
      confidence: p.confidence || p.score || 0,
      points: Math.round((p.confidence || p.score || 0) * 20),
    }))

    formatted.sort((a, b) => b.confidence - a.confidence)

    return NextResponse.json({ all: formatted })
  }

  return NextResponse.json({ error: "Unexpected prediction format" }, { status: 200 })
}
