"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MapPin, Plus, Edit2, Trash2, Map, Loader2 } from "lucide-react"
import { AddLocationModal } from "@/components/admin/add-location-modal"
import { LocationMapView } from "@/components/admin/location-map-view"

interface RecyclingLocation {
  id: string
  name: string
  latitude: number
  longitude: number
  radius_meters: number
  active: boolean
}

export default function LocationsPage() {
  const [locations, setLocations] = useState<RecyclingLocation[]>([])
  const [loading, setLoading] = useState(true)
  const [showMap, setShowMap] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch("/api/admin/locations")
        const data = await response.json()
        if (Array.isArray(data)) {
          setLocations(data)
        }
      } catch (error) {
        console.error("[v0] Failed to fetch locations:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchLocations()
  }, [])

  const filtered = locations.filter((loc) => {
    const name = loc?.name || ""
    const search = searchTerm || ""
    return name.toLowerCase().includes(search.toLowerCase())
  })

  const handleAddLocation = async (location: Omit<RecyclingLocation, "id">) => {
    try {
      const response = await fetch("/api/admin/locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(location),
      })
      const newLocation = await response.json()
      if (newLocation && newLocation.id) {
        setLocations([newLocation, ...locations])
      }
      setShowAddModal(false)
    } catch (error) {
      console.error("[v0] Failed to add location:", error)
    }
  }

  const handleToggleActive = async (id: string) => {
    try {
      const location = locations.find((loc) => loc.id === id)
      if (!location) return
      
      const response = await fetch(`/api/admin/locations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !location.active }),
      })
      const updated = await response.json()
      setLocations(locations.map((loc) => (loc.id === id ? updated : loc)))
    } catch (error) {
      console.error("[v0] Failed to update location:", error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/admin/locations/${id}`, { method: "DELETE" })
      setLocations(locations.filter((loc) => loc.id !== id))
    } catch (error) {
      console.error("[v0] Failed to delete location:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Recycling Locations</h1>
          <p className="text-slate-400 mt-2">Manage registered recycling centers and geo-fence boundaries</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
          <Plus className="w-4 h-4" />
          Add Location
        </Button>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Search locations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-slate-900 border-slate-800 text-white"
        />
        <Button
          onClick={() => setShowMap(!showMap)}
          variant="outline"
          className="gap-2 border-slate-700 text-slate-300 hover:bg-slate-800"
        >
          <Map className="w-4 h-4" />
          {showMap ? "Hide" : "Show"} Map
        </Button>
      </div>

      {showMap && locations.length > 0 && (
        <Card className="bg-slate-900 border-slate-800 h-96">
          <LocationMapView locations={locations} />
        </Card>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-12 text-center">
            <MapPin className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No locations found. Add your first recycling center to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filtered.map((location) => (
            <Card key={location.id} className="bg-slate-900 border-slate-800">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-lg">{location.name}</h3>
                      <p className="text-sm text-slate-400 mt-1">
                        📍 {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                      </p>
                      <p className="text-sm text-slate-400">
                        Radius: <span className="font-semibold text-emerald-400">{location.radius_meters}m</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={location.active ? "bg-emerald-600" : "bg-red-600"}>
                      {location.active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t border-slate-800">
                  <Button
                    onClick={() => handleToggleActive(location.id)}
                    variant="outline"
                    className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800"
                  >
                    {location.active ? "Disable" : "Enable"}
                  </Button>
                  <Button
                    variant="outline"
                    className="border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handleDelete(location.id)}
                    variant="outline"
                    className="border-red-700/30 text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showAddModal && <AddLocationModal onAdd={handleAddLocation} onClose={() => setShowAddModal(false)} />}
    </div>
  )
}
