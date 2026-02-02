"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Upload,
  CheckCircle,
  Sparkles,
  Zap,
  Brain,
  Trash2,
  Battery,
  Leaf,
  Package,
  Shirt,
  Wine,
  Wrench,
  FileText,
  Recycle,
  Camera,
  Loader2,
  MapPin,
} from "lucide-react"
import Link from "next/link"
import type { RecyclingLocation } from "@/lib/utils/location-validator"

const addXP = (points: number) => {
  const userSession = localStorage.getItem("user_session")
  if (!userSession) return
  const session = JSON.parse(userSession)
  const key = `user_xp_${session.id}`
  const storedValue = localStorage.getItem(key)
  const currentXP = storedValue ? Number.parseInt(storedValue, 10) : 0
  const safeCurrentXP = Number.isNaN(currentXP) ? 0 : currentXP
  const newXP = safeCurrentXP + points
  localStorage.setItem(key, String(newXP))
}

interface DetectionResult {
  material: string
  confidence: number
  points: number
}

interface GpsLocation {
  latitude: number
  longitude: number
  accuracy: number
  locationId?: string
  locationName?: string
  isValidated?: boolean
}

interface LocationValidation {
  isValid: boolean
  locationName?: string
  distance?: number
  message: string
}

const getCategoryIcon = (material: string) => {
  const icons: Record<string, any> = {
    Battery: Battery,
    Cardboard: Package,
    Electronic: "CircuitBoard",
    Fabric: Shirt,
    Glass: Wine,
    Metal: Wrench,
    Mixed: Trash2,
    Organic: Leaf,
    Paper: FileText,
    Plastic: Recycle,
  }
  return icons[material] || Trash2
}

const getCategoryColor = (material: string) => {
  const colors: Record<string, string> = {
    Battery: "bg-red-500",
    Cardboard: "bg-orange-500",
    Electronic: "bg-indigo-500",
    Fabric: "bg-purple-500",
    Glass: "bg-cyan-400",
    Metal: "bg-gray-500",
    Mixed: "bg-gray-700",
    Organic: "bg-green-600",
    Paper: "bg-amber-600",
    Plastic: "bg-blue-500",
  }
  return colors[material] || "bg-gray-400"
}

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371e3 // metres
  const φ1 = (lat1 * Math.PI) / 180 // φ, λ in radians
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lon2 - lon1) * Math.PI) / 180

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c // in metres
}

export default function UploadPage() {
  const [step, setStep] = useState<"upload" | "gps-validating" | "gps-capturing" | "detecting" | "result">("upload")
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [detectionResults, setDetectionResults] = useState<DetectionResult[]>([])
  const [topMaterial, setTopMaterial] = useState<DetectionResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [gpsLocation, setGpsLocation] = useState<GpsLocation | null>(null)
  const [gpsError, setGpsError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null) // 👈 ADD THIS
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [locationValidation, setLocationValidation] = useState<LocationValidation | null>(null)
  const [recyclingLocations, setRecyclingLocations] = useState<RecyclingLocation[]>([])
  const [captureMethod, setCaptureMethod] = useState<"gallery" | "gps" | null>(null)
  const [adminLocations, setAdminLocations] = useState<RecyclingLocation[]>([])

  // Fetch locations from Supabase on mount
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch("/api/admin/locations")
        const data = await response.json()
        if (Array.isArray(data)) {
          setAdminLocations(data.filter((loc: RecyclingLocation) => loc.active !== false))
        }
      } catch (e) {
        console.error("[v0] Failed to load admin locations:", e)
      }
    }
    fetchLocations()
  }, [])

  const validateLocationAgainstAdmin = (lat: number, lon: number, locations: RecyclingLocation[]) => {
    for (const loc of locations) {
      const distance = calculateDistance(lat, lon, loc.latitude, loc.longitude)
      const radius = loc.radius_meters || 100
      if (distance <= radius) {
        return {
          isValid: true,
          locationName: loc.name,
          locationId: loc.id,
          distance: Math.round(distance),
          message: `You are at ${loc.name} (${Math.round(distance)}m away)`
        }
      }
    }
    
    // Find nearest location for helpful message
    let nearest: RecyclingLocation | null = null
    let nearestDistance = Infinity
    for (const loc of locations) {
      const distance = calculateDistance(lat, lon, loc.latitude, loc.longitude)
      if (distance < nearestDistance) {
        nearestDistance = distance
        nearest = loc
      }
    }
    
    if (nearest) {
      return {
        isValid: false,
        locationName: undefined,
        locationId: undefined,
        distance: Math.round(nearestDistance),
        message: `Not at a valid recycling location. Nearest: ${nearest.name} (${Math.round(nearestDistance)}m away)`
      }
    }
    
    return {
      isValid: false,
      locationName: undefined,
      locationId: undefined,
      distance: undefined,
      message: "No recycling locations configured. Contact admin to add locations."
    }
  }

  const requestGPS = (): Promise<GpsLocation | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.warn("[GPS] Not supported")
        setLocationValidation({
          isValid: false,
          message: "GPS not supported on this device"
        })
        resolve(null)
        return
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude, accuracy } = pos.coords
          
          // Validate against admin locations
          const validation = validateLocationAgainstAdmin(latitude, longitude, adminLocations)
          setLocationValidation(validation)
          
          resolve({
            latitude,
            longitude,
            accuracy,
            locationId: validation.locationId,
            locationName: validation.locationName,
            isValidated: validation.isValid,
          })
        },
        (err) => {
          console.warn("[GPS] Permission denied", err.message)
          setLocationValidation({
            isValid: false,
            message: "GPS permission denied. Location verification unavailable."
          })
          resolve(null)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      )
    })
  }

  const captureGpsLocation = async () => {
    console.log("[GPS] Button clicked") // 👈 ADD THIS

    setStep("gps-validating")
    setCaptureMethod("gps")

    if (!navigator.geolocation) {
      console.warn("[GPS] Not supported")

      setStep("gps-capturing")
      if (isMobile) {
        cameraInputRef.current?.click()
      } else {
        await startCameraCapture()
      }
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords

        // Validate against admin-defined locations
        const validation = validateLocationAgainstAdmin(latitude, longitude, adminLocations)
        setLocationValidation(validation)

        setGpsLocation({
          latitude,
          longitude,
          accuracy,
          locationId: validation.locationId,
          locationName: validation.locationName,
          isValidated: validation.isValid,
        })

        setStep("gps-capturing")

        if (isMobile) {
          cameraInputRef.current?.click()
        } else {
          await startCameraCapture()
        }
      },

      async (error) => {
        console.warn("[GPS] Error:", error.message)
        
        setLocationValidation({
          isValid: false,
          message: "GPS permission denied. Location verification unavailable."
        })

        setGpsLocation({
          latitude: 0,
          longitude: 0,
          accuracy: 0,
          isValidated: false,
        })

        setStep("gps-capturing")

        if (isMobile) {
          cameraInputRef.current?.click()
        } else {
          await startCameraCapture()
        }
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    )
  }

  const startCameraCapture = async () => {
    if (typeof window === "undefined") return

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error("Camera API not available")
      setGpsError("Camera not supported on this device/browser")
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
    } catch (err: any) {
      console.error("Camera access error:", err)
      setGpsError("Camera permission denied or unavailable")
    }
  }

  const capturePhoto = async () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d")
      if (!context) return

      canvasRef.current.width = videoRef.current.videoWidth
      canvasRef.current.height = videoRef.current.videoHeight
      context.drawImage(videoRef.current, 0, 0)

      // Convert canvas → Blob → File
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) return

        const file = new File([blob], "capture.jpg", { type: "image/jpeg" })
        setUploadedImage(URL.createObjectURL(file))

        const stream = videoRef.current?.srcObject as MediaStream
        stream?.getTracks().forEach((track) => track.stop())

        try {
          setStep("detecting")
          await classifyWithML(file)
          setStep("result")
        } catch (err) {
          console.error("[ML] Camera classification failed")
          setStep("upload")
        }
      }, "image/jpeg")
    }
  }

  const classifyWithML = async (file: File) => {
    setIsAnalyzing(true)

    try {
      console.log("[ML] 🤖 Sending image to backend")

      const formData = new FormData()
      formData.append("image", file)

      const response = await fetch("/api/classify-waste", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText)
      }

      const data = await response.json()
      console.log("[ML] ✅ Response:", data)

      // ML server returns: { top, all }
      const formattedResults = data.all.map((item: any) => ({
        material: item.material,
        confidence: item.confidence,
        points: Math.round(item.confidence * 20),
      }))

      setDetectionResults(formattedResults)
      setTopMaterial(formattedResults[0])
    } catch (error: any) {
      console.error("[ML] ❌ Classification failed:", error.message)
      setDetectionResults([])
      setTopMaterial(null)
      throw error
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleGalleryUpload = async (file: File) => {
    setCaptureMethod("gallery")
    setIsAnalyzing(true)
    setStep("detecting")

    try {
      await classifyWithML(file)
      setStep("result")
    } catch (error) {
      console.error("[ML] Gallery classification failed")
      setStep("upload")
    }
  }

  const handleConfirmAndEarnXP = async () => {
    if (!topMaterial) return

    try {
      const response = await fetch("/api/recycling/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          material: topMaterial.material,
          confidence: topMaterial.confidence,
          points: topMaterial.points,
        }),
      })

      const data = await response.json()

      if (!data.success) throw new Error("Submit failed")

      // ✅ XP UPDATE MUST BE CLIENT SIDE
      addXP(topMaterial.points)

      // 🔄 Force dashboard reload
      window.location.href = "/dashboard"
    } catch (error) {
      console.error("Submit failed", error)
    }
  }

  const isMobile =
    typeof window !== "undefined" &&
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-green-100 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="hover:bg-green-50">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-foreground">AI Waste Scanner</h1>
            <p className="text-xs text-muted-foreground">Smart Classification</p>
          </div>
          <Badge className="gap-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0">
            <Brain className="w-3 h-3" />
            <span className="text-xs font-semibold">AI</span>
          </Badge>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Step 1: Upload */}
        {step === "upload" && (
          <div className="space-y-6">
            <div className="text-center space-y-3 py-4">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-foreground">AI Waste Detection</h2>
              <p className="text-muted-foreground max-w-sm mx-auto">
                Upload an image to identify waste materials with advanced AI analysis
              </p>
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full p-8 rounded-2xl border-2 border-green-300 bg-white hover:bg-green-50 transition-all duration-300 transform hover:scale-105 shadow-md"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-green-600" />
                </div>
                <span className="text-xl font-bold text-foreground">Upload Image</span>
                <span className="text-sm text-muted-foreground">From your gallery</span>
              </div>
            </button>

            <button
              onClick={async () => {
                setCaptureMethod("gps")
                setStep("gps-validating")

                const gps = await requestGPS()

                if (gps) {
                  setGpsLocation(gps)
                } else {
                  setGpsLocation(null)
                }

                setStep("gps-capturing")

                if (isMobile) {
                  cameraInputRef.current?.click()
                } else {
                  await startCameraCapture()
                }
              }}
              className="w-full p-8 rounded-2xl border-2 border-blue-300 bg-white hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-md"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                  <Camera className="w-8 h-8 text-blue-600" />
                </div>
                <span className="text-xl font-bold text-foreground">Capture with GPS</span>
                <span className="text-sm text-muted-foreground">Camera + Location</span>
              </div>
            </button>

            {gpsError && (
              <Card className="p-4 bg-red-50 border-red-200">
                <p className="text-sm text-red-800">{gpsError}</p>
              </Card>
            )}

            <Card className="p-4 bg-white/80 backdrop-blur-sm border-green-200">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-green-600" />
                <span className="text-sm font-semibold text-foreground">Waste Categories</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  "plastic",
                  "paper",
                  "glass",
                  "metal",
                  "bio-degradable",
                  "cardboard",
                  "clothes",
                  "battery",
                  "footwear",
                  "trash",
                ].map((category) => {
                  const Icon = getCategoryIcon(category)
                  const color = getCategoryColor(category)
                  return (
                    <Badge key={category} variant="outline" className="gap-1 text-xs">
                      <div className={`w-2 h-2 rounded-full ${color}`} />
                      {category}
                    </Badge>
                  )
                })}
              </div>
            </Card>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (file) {
                  handleGalleryUpload(file)
                }
              }}
              className="hidden"
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (file) {
                  setCaptureMethod("gps")
                  handleGalleryUpload(file)
                }
              }}
            />
          </div>
        )}

        {/* Step 1.5: GPS Validation */}
        {step === "gps-validating" && (
          <div className="space-y-6">
            <div className="text-center space-y-3">
              <div className="relative inline-flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-400 to-cyan-500 animate-pulse" />
                <div className="absolute inset-1 bg-white rounded-full flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-blue-600 animate-pulse" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-foreground">Verifying Location</h2>
              <p className="text-sm text-muted-foreground">Checking if you're at a trusted recycling center...</p>
            </div>
          </div>
        )}

        {/* Step 2: GPS Camera Capture */}
        {step === "gps-capturing" && (
          <div className="space-y-6">
            <div className="text-center space-y-3">
              {/* GPS Status Badge */}
              {gpsLocation && gpsLocation.accuracy > 0 && (
                <Badge className="w-fit mx-auto gap-1 bg-blue-100 text-blue-800 border-0">
                  <MapPin className="w-3 h-3" />
                  <span className="text-xs font-semibold">
                    GPS Connected ({gpsLocation.accuracy.toFixed(1)}m accuracy)
                  </span>
                </Badge>
              )}
              
              {/* Location Validation Status */}
              {locationValidation?.isValid ? (
                <Card className="p-4 bg-green-50 border-green-200">
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <p className="text-sm font-medium text-green-800">
                      Location Verified: {locationValidation.locationName}
                    </p>
                  </div>
                  {locationValidation.distance !== undefined && (
                    <p className="text-xs text-green-600 mt-1">
                      You are {locationValidation.distance}m from the center
                    </p>
                  )}
                </Card>
              ) : locationValidation ? (
                <Card className="p-4 bg-amber-50 border-amber-200">
                  <div className="flex items-center justify-center gap-2">
                    <MapPin className="w-5 h-5 text-amber-600" />
                    <p className="text-sm font-medium text-amber-800">
                      {locationValidation.message}
                    </p>
                  </div>
                </Card>
              ) : gpsLocation === null ? (
                <Card className="p-4 bg-gray-50 border-gray-200">
                  <p className="text-sm text-gray-600">GPS not available - location verification skipped</p>
                </Card>
              ) : null}
              <h2 className="text-2xl font-bold text-foreground">Position Camera</h2>
              <p className="text-sm text-muted-foreground">Frame the waste item clearly</p>
            </div>

            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black aspect-video">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              <div className="absolute inset-0 border-4 border-blue-500/50 rounded-2xl pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex justify-center gap-3">
                  <Button
                    variant="outline"
                    className="bg-white/20 border-white text-white hover:bg-white/30"
                    onClick={() => {
                      const stream = videoRef.current?.srcObject as MediaStream
                      stream?.getTracks().forEach((track) => track.stop())
                      setStep("upload")
                      setGpsLocation(null)
                    }}
                  >
                    Cancel
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={capturePhoto}>
                    <Camera className="w-4 h-4 mr-2" />
                    Capture
                  </Button>
                </div>
              </div>
            </div>

            <canvas ref={canvasRef} className="hidden" />
          </div>
        )}

        {/* Step 3: Detecting */}
        {step === "detecting" && isAnalyzing && (
          <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-4">
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full opacity-75 blur-xl animate-pulse" />
              <div className="relative w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl">
                <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
              </div>
            </div>
            <p className="text-xl font-semibold text-gray-800 mb-2">Analyzing with YOLO…</p>
            <p className="text-sm text-gray-600 text-center">Processing your waste image with advanced AI detection</p>
          </div>
        )}

        {/* Step 4: Result */}
        {step === "result" && topMaterial && (
          <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-4">
            <div className="w-full max-w-md">
              <Card className="border-2 border-emerald-200 bg-white shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-8 text-white">
                  <p className="text-sm font-semibold opacity-90 mb-2">🤖 Detected by YOLO</p>
                  <h2 className="text-4xl font-bold">{topMaterial.material}</h2>
                </div>

                <div className="p-6 space-y-4">
                  {captureMethod === "gallery" && (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-sm text-amber-800">
                        <strong>Demo Mode:</strong> Points are awarded only for GPS-verified captures at recycling
                        shops.
                      </p>
                    </div>
                  )}

                  {captureMethod === "gps" && gpsLocation && (
                    <div
                      className={`p-4 rounded-lg border ${gpsLocation.isValidated ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
                    >
                      <p className="text-sm font-semibold mb-1">
                        {gpsLocation.isValidated ? "✅ Location Verified" : "❌ Location Not Verified"}
                      </p>
                      <p className="text-xs text-gray-600">{gpsLocation.locationName || "Unknown Location"}</p>
                      {gpsLocation.accuracy && (
                        <p className="text-xs text-gray-500 mt-1">GPS Accuracy: ±{Math.round(gpsLocation.accuracy)}m</p>
                      )}
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground font-medium">AI Confidence</span>
                      <span className="font-bold text-lg text-green-700">
                        {Math.round(topMaterial.confidence * 100)}%
                      </span>
                    </div>
                    <Progress value={topMaterial.confidence * 100} className="h-3 bg-green-100" />
                  </div>

                  {captureMethod === "gps" && gpsLocation?.isValidated && topMaterial.confidence >= 0.7 ? (
                    <Button
                      onClick={() => handleConfirmAndEarnXP()}
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-3 rounded-lg shadow-lg"
                    >
                      ✅ Confirm & Earn {topMaterial.points} XP
                    </Button>
                  ) : (
                    <Button disabled className="w-full opacity-50 cursor-not-allowed py-3 rounded-lg">
                      {captureMethod === "gallery"
                        ? "Gallery uploads are demo only"
                        : !gpsLocation?.isValidated
                          ? "Location not verified"
                          : topMaterial.confidence < 0.7
                            ? "Confidence too low (need ≥70%)"
                            : "Cannot earn XP"}
                    </Button>
                  )}
                </div>
              </Card>

              <div className="space-y-3 mt-6">
                {/* Other Predictions */}
                {detectionResults.slice(1, 4).map((result) => {
                  const Icon = getCategoryIcon(result.material)
                  const color = getCategoryColor(result.material)
                  return (
                    <div
                      key={result.material}
                      className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-green-300 transition-colors shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center shadow-md`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-foreground">{result.material}</span>
                          <p className="text-xs text-muted-foreground">+{result.points} XP</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-foreground">
                          {Math.round(result.confidence * 100)}%
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>

              <Button onClick={() => setStep("upload")} variant="outline" className="w-full mt-6">
                Try Another
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
