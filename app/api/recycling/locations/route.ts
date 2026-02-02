import { NextResponse } from "next/server"

// Demo recycling locations data
const DEMO_LOCATIONS = [
  {
    id: "1",
    name: "Downtown Recycling Center",
    latitude: 40.7128,
    longitude: -74.006,
    radius_meters: 100,
    active: true,
  },
  {
    id: "2",
    name: "West Side Eco Hub",
    latitude: 40.718,
    longitude: -74.005,
    radius_meters: 150,
    active: true,
  },
  {
    id: "3",
    name: "Central Park Green Zone",
    latitude: 40.785,
    longitude: -73.968,
    radius_meters: 120,
    active: true,
  },
]

export async function GET() {
  // Return demo locations for now
  return NextResponse.json({
    locations: DEMO_LOCATIONS,
  })
}
