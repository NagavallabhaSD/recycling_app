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

// Log only prediction parts to avoid huge logs
console.log("RF KEYS:", Object.keys(data))
console.log("RF OUTPUTS:", Object.keys(data.outputs || {}))
console.log("RF CLASSIFICATIONS:", data.outputs?.classification_predictions)
console.log("RF DETECTIONS:", data.outputs?.detection_predictions)

return NextResponse.json(data)

}
