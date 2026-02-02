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

  const output = data.outputs?.[0]

  if (!output) {
    return NextResponse.json({ error: "No output from model" }, { status: 200 })
  }

  const classification = output.predictions

  if (!classification || !classification.top) {
    return NextResponse.json({ error: "No classification result" }, { status: 200 })
  }

  const material = classification.top
  const confidence = classification.confidence ?? 0

  console.log("[ML RESULT]", material, confidence)

  return NextResponse.json({
    all: [
      {
        material,
        confidence,
        points: Math.round(confidence * 20),
      },
    ],
  })
}
