"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useGeolocation } from "@/lib/hooks/use-geolocation"
import { useCamera } from "@/lib/hooks/use-camera"
import { validateLocationAgainstZones } from "@/lib/utils/location-validator"
import { MapPin, Camera, CheckCircle, AlertCircle, Loader, X, Navigation } from "lucide-react"

interface RecyclingLocation {
  id: string
  name: string
  latitude: number
  longitude: number
  radius_meters: number
  active: boolean
}

interface GpsCameraCaptureProps {
  onPhotoCapture: (data: {
    image: string
    latitude: number
    longitude: number
    timestamp: number
    locationId?: string
    locationName?: string
  }) => void
  recyclingLocations: RecyclingLocation[]
}

export function GpsCameraCapture({ onPhotoCapture, recyclingLocations }: GpsCameraCaptureProps) {
  const { coords, error: geoError, loading: geoLoading, requestLocation } = useGeolocation()
  const { videoRef, canvasRef, isActive, error: cameraError, startCamera, stopCamera, capturePhoto } = useCamera()
  const [locationValid, setLocationValid] = useState(false)
  const [validationMessage, setValidationMessage] = useState("")
  const [matchedLocation, setMatchedLocation] = useState<{ id: string; name: string } | null>(null)
  const [phase, setPhase] = useState<"gps" | "camera" | "capture">("gps")

  useEffect(() => {
    if (coords) {
      const validation = validateLocationAgainstZones(coords.latitude, coords.longitude, recyclingLocations)
      setLocationValid(validation.isValid)
      setValidationMessage(validation.message)
      if (validation.isValid && validation.matchedLocationId) {
        setMatchedLocation({
          id: validation.matchedLocationId,
          name: validation.matchedLocationName || "Unknown Location",
        })
      }
    }
  }, [coords, recyclingLocations])

  const handleStartCapture = async () => {
    if (phase === "gps") {
      const success = await requestLocation()
      if (success) {
        setPhase("camera")
      }
    } else if (phase === "camera") {
      await startCamera()
      setPhase("capture")
    } else if (phase === "capture") {
      const photoData = capturePhoto()
      if (photoData && coords && locationValid && matchedLocation) {
        onPhotoCapture({
          image: photoData,
          latitude: coords.latitude,
          longitude: coords.longitude,
          timestamp: coords.timestamp,
          locationId: matchedLocation.id,
          locationName: matchedLocation.name,
        })
        stopCamera()
      }
    }
  }

  const handleCancel = () => {
    stopCamera()
    setPhase("gps")
  }

  return (
    <div className="space-y-6">
      {/* GPS Phase */}
      {phase === "gps" && (
        <div className="space-y-6">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-bold text-blue-900">Location Verification</h3>
              </div>
              <p className="text-sm text-blue-700">
                Enable GPS to verify you're at a registered recycling center. You'll only earn points when submitting
                from allowed locations.
              </p>
            </div>
          </Card>

          <Button
            onClick={handleStartCapture}
            disabled={geoLoading}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {geoLoading ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Getting Location...
              </>
            ) : (
              <>
                <Navigation className="w-4 h-4 mr-2" />
                Enable GPS & Continue
              </>
            )}
          </Button>

          {geoError && (
            <Card className="p-4 bg-red-50 border-red-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-900">GPS Error</p>
                  <p className="text-sm text-red-700">{geoError.message}</p>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Location Validation */}
      {(phase === "camera" || phase === "capture") && coords && (
        <Card className={`p-4 border-2 ${locationValid ? "bg-green-50 border-green-300" : "bg-red-50 border-red-300"}`}>
          <div className="flex items-start gap-3">
            {locationValid ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-green-900">{validationMessage}</p>
                  {matchedLocation && <p className="text-sm text-green-700 mt-1">📍 {matchedLocation.name}</p>}
                </div>
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-900">Location Not Verified</p>
                  <p className="text-sm text-red-700 mt-1">{validationMessage}</p>
                </div>
              </>
            )}
          </div>
        </Card>
      )}

      {/* Camera Phase */}
      {phase === "camera" && (
        <div className="space-y-4">
          <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden border-2 border-gray-300">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {!isActive && !cameraError && (
            <Button onClick={handleStartCapture} className="w-full h-12 bg-green-600 hover:bg-green-700 text-white">
              <Camera className="w-4 h-4 mr-2" />
              Start Camera
            </Button>
          )}

          {isActive && locationValid && (
            <Button onClick={handleStartCapture} className="w-full h-12 bg-green-600 hover:bg-green-700 text-white">
              <Camera className="w-4 h-4 mr-2" />
              Capture Photo
            </Button>
          )}

          {!locationValid && (
            <div className="p-4 bg-yellow-50 border border-yellow-300 rounded-lg">
              <p className="text-sm font-semibold text-yellow-900">Cannot Submit</p>
              <p className="text-sm text-yellow-700 mt-1">{validationMessage}</p>
            </div>
          )}

          <Button onClick={handleCancel} variant="outline" className="w-full bg-transparent">
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>

          {cameraError && (
            <Card className="p-4 bg-red-50 border-red-200">
              <p className="text-sm font-semibold text-red-900">Camera Error</p>
              <p className="text-sm text-red-700">{cameraError}</p>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
