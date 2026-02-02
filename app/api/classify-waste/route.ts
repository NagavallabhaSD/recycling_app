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
    headers: {
      "Content-Type": "application/json",
    },
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
    return NextResponse.json(
      { error: "Roboflow API error", details: text },
      { status: 500 }
    )
  }

  const data = await mlResponse.json()

// Grab predictions safely (handle array or nested object)
let predictions = data.outputs?.[0]?.predictions

if (!predictions) {
  return NextResponse.json({ error: "No predictions returned" }, { status: 200 })
}

// If predictions is an object, extract its values
if (!Array.isArray(predictions)) {
  predictions = Object.values(predictions)
}

if (predictions.length === 0) {
  return NextResponse.json({ error: "No waste detected" }, { status: 200 })
}

// Pick highest confidence
const top = predictions.reduce((best: any, current: any) =>
  current.confidence > best.confidence ? current : best
)

return NextResponse.json({
  class: top.class,
  confidence: top.confidence,
})
}
