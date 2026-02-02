"use client"

import { useEffect, useRef } from "react"

interface RecyclingLocation {
  id: string
  name: string
  latitude: number
  longitude: number
  radius_meters: number
  active: boolean
}

interface LocationMapViewProps {
  locations: RecyclingLocation[]
}

export function LocationMapView({ locations }: LocationMapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Create a simple canvas-based map visualization
    const canvas = document.createElement("canvas")
    canvas.width = containerRef.current.clientWidth
    canvas.height = containerRef.current.clientHeight

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Fill background
    ctx.fillStyle = "#1e293b"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grid
    ctx.strokeStyle = "#334155"
    ctx.lineWidth = 1
    for (let i = 0; i < canvas.width; i += 50) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, canvas.height)
      ctx.stroke()
    }
    for (let i = 0; i < canvas.height; i += 50) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(canvas.width, i)
      ctx.stroke()
    }

    // Normalize coordinates to canvas size
    const minLat = Math.min(...locations.map((l) => l.latitude))
    const maxLat = Math.max(...locations.map((l) => l.latitude))
    const minLon = Math.min(...locations.map((l) => l.longitude))
    const maxLon = Math.max(...locations.map((l) => l.longitude))

    const padding = 40
    const mapWidth = canvas.width - padding * 2
    const mapHeight = canvas.height - padding * 2

    const latRange = maxLat - minLat || 1
    const lonRange = maxLon - minLon || 1

    // Draw locations with geo-fence circles
    locations.forEach((location) => {
      const x = padding + ((location.longitude - minLon) / lonRange) * mapWidth
      const y = padding + ((maxLat - location.latitude) / latRange) * mapHeight

      // Draw geo-fence circle
      const radiusPixels = (location.radius_meters / 1000) * 50 // Simplified scale
      ctx.fillStyle = location.active ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)"
      ctx.beginPath()
      ctx.arc(x, y, radiusPixels, 0, Math.PI * 2)
      ctx.fill()

      ctx.strokeStyle = location.active ? "#22c55e" : "#ef4444"
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw location marker
      ctx.fillStyle = location.active ? "#22c55e" : "#ef4444"
      ctx.beginPath()
      ctx.arc(x, y, 6, 0, Math.PI * 2)
      ctx.fill()

      // Draw label
      ctx.fillStyle = "#e2e8f0"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(location.name, x, y - radiusPixels - 10)
    })

    containerRef.current.innerHTML = ""
    containerRef.current.appendChild(canvas)
  }, [locations])

  return <div ref={containerRef} className="w-full h-full" />
}
