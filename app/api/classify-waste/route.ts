import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const image = formData.get("image")

    if (!image || !(image instanceof File)) {
      return NextResponse.json({ error: "Invalid image" }, { status: 400 })
    }

    // Convert image to base64
    const base64 = Buffer.from(await image.arrayBuffer()).toString("base64")

    // Send to Roboflow Workflow
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
    console.log("[ROBOFLOW RAW RESPONSE]", Object.keys(data))

    /**
     * Roboflow Workflows can return predictions in different shapes.
     * We safely extract classification predictions here.
     */
    let predictions =
      data.outputs?.[0]?.classification_predictions ||
      data.outputs?.[0]?.predictions ||
      data.outputs?.[0]?.detection_predictions ||
      null

    if (!predictions) {
      console.warn("[ML] No predictions field found")
      return NextResponse.json({ error: "No predictions returned" }, { status: 200 })
    }

    // If predictions is an object, convert to array
    if (!Array.isArray(predictions)) {
      predictions = Object.values(predictions)
    }

    if (predictions.length === 0) {
      return NextResponse.json({ error: "No waste detected" }, { status: 200 })
    }

    // Convert to frontend format
    console.log("[ML] First prediction object:", predictions[0])

const formatted = predictions.map((p: any) => {
  // Log every key Roboflow gives us
  console.log("[ML Prediction Keys]", Object.keys(p))

  return {
    material:
      p.class ||
      p.label ||
      p.top ||
      p.predicted_class ||
      p.name ||
      "Unknown",

    confidence:
      p.confidence ||
      p.score ||
      p.probability ||
      p.value ||
      0,

    points: Math.round(
      (p.confidence || p.score || p.probability || p.value || 0) * 20
    ),
  }
})


    // Sort highest confidence first
    formatted.sort((a, b) => b.confidence - a.confidence)

    console.log("[ML] Formatted Results:", formatted)

    return NextResponse.json({
      top: formatted[0],
      all: formatted,
    })
  } catch (err: any) {
    console.error("[ML ROUTE ERROR]", err.message)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
