export interface LocationValidationResult {
  isValid: boolean
  matchedLocationId?: string
  matchedLocationName?: string
  distance?: number
  message: string
}

export interface RecyclingLocation {
  id: string
  name: string
  latitude: number
  longitude: number
  radius_meters: number
  active: boolean
}

/**
 * Calculate distance between two GPS coordinates using Haversine formula
 * Returns distance in meters
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000 // Earth's radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

/**
 * Validate if user's location is within an allowed recycling zone
 */
export function validateLocationAgainstZones(
  userLat: number,
  userLon: number,
  locations: RecyclingLocation[],
): LocationValidationResult {
  const activeLocations = locations.filter((loc) => loc.active)

  if (activeLocations.length === 0) {
    return {
      isValid: false,
      message: "No recycling zones registered. Please contact admin.",
    }
  }

  // Check distance to each location
  for (const location of activeLocations) {
    const distance = calculateDistance(userLat, userLon, location.latitude, location.longitude)

    if (distance <= location.radius_meters) {
      return {
        isValid: true,
        matchedLocationId: location.id,
        matchedLocationName: location.name,
        distance: Math.round(distance),
        message: `✅ Recycling center detected (${Math.round(distance)}m away)`,
      }
    }
  }

  // Find nearest location for helpful error message
  let nearestDistance = Number.POSITIVE_INFINITY
  let nearestLocation = null

  for (const location of activeLocations) {
    const distance = calculateDistance(userLat, userLon, location.latitude, location.longitude)
    if (distance < nearestDistance) {
      nearestDistance = distance
      nearestLocation = location
    }
  }

  return {
    isValid: false,
    message: `⚠️ You must be at a registered recycling shop to submit proof. Nearest: ${nearestLocation?.name} (${Math.round(nearestDistance)}m away)`,
  }
}
