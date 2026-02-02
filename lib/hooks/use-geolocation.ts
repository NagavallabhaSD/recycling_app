"use client"

import { useState, useCallback } from "react"

export interface GeolocationCoords {
  latitude: number
  longitude: number
  timestamp: number
}

interface GeolocationError {
  code: number
  message: string
}

export function useGeolocation() {
  const [coords, setCoords] = useState<GeolocationCoords | null>(null)
  const [error, setError] = useState<GeolocationError | null>(null)
  const [loading, setLoading] = useState(false)

  const requestLocation = useCallback(async () => {
    setLoading(true)
    setError(null)

    if (!navigator.geolocation) {
      setError({
        code: 0,
        message: "Geolocation is not supported by your browser",
      })
      setLoading(false)
      return false
    }

    return new Promise<boolean>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: position.timestamp,
          })
          setLoading(false)
          resolve(true)
        },
        (err) => {
          setError({
            code: err.code,
            message: err.message,
          })
          setLoading(false)
          resolve(false)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        },
      )
    })
  }, [])

  return { coords, error, loading, requestLocation }
}
