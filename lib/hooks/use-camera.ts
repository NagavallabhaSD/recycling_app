"use client"

import { useRef, useState, useCallback } from "react"

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isActive, setIsActive] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<string | null>(null)

  const startCamera = useCallback(async () => {
    try {
      setError(null)
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        setStream(mediaStream)
        setIsActive(true)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to access camera")
      setIsActive(false)
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
      setIsActive(false)
    }
  }, [stream])

  const capturePhoto = useCallback((): string | null => {
    if (!videoRef.current || !canvasRef.current) return null

    const context = canvasRef.current.getContext("2d")
    if (!context) return null

    canvasRef.current.width = videoRef.current.videoWidth
    canvasRef.current.height = videoRef.current.videoHeight
    context.drawImage(videoRef.current, 0, 0)

    return canvasRef.current.toDataURL("image/jpeg")
  }, [])

  return { videoRef, canvasRef, isActive, error, startCamera, stopCamera, capturePhoto }
}
