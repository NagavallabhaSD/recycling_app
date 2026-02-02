import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const formData = await req.formData()
  const image = formData.get("image")

  if (!image || !(image instanceof File)) {
    return NextResponse.json({ error: "Invalid image" }, { status: 400 })
  }

  const forwardData = new FormData()
  forwardData.append("file", image, image.name)

  const mlResponse = await fetch(`${process.env.ML_API_URL}/classify`, {
    method: "POST",
    body: forwardData,
  })

  if (!mlResponse.ok) {
    const text = await mlResponse.text()
    console.error("[ML ERROR]", text)
    return NextResponse.json(
      { error: "ML server error", details: text },
      { status: 500 }
    )
  }

  const data = await mlResponse.json()
  return NextResponse.json(data)
}
