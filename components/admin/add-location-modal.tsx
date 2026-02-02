"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { X } from "lucide-react"

interface AddLocationModalProps {
  onAdd: (location: {
    name: string
    latitude: number
    longitude: number
    radius_meters: number
    active: boolean
  }) => void
  onClose: () => void
}

export function AddLocationModal({ onAdd, onClose }: AddLocationModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    latitude: "",
    longitude: "",
    radius_meters: "100",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.latitude && formData.longitude) {
      onAdd({
        name: formData.name,
        latitude: Number.parseFloat(formData.latitude),
        longitude: Number.parseFloat(formData.longitude),
        radius_meters: Number.parseInt(formData.radius_meters),
        active: true,
      })
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="bg-slate-900 border-slate-800 w-full max-w-md">
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Add Recycling Location</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Shop Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Ramesh Scrap Dealers"
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Latitude</label>
                <Input
                  type="number"
                  step="0.00001"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  placeholder="12.9716"
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Longitude</label>
                <Input
                  type="number"
                  step="0.00001"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  placeholder="77.5946"
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Radius (meters)</label>
              <Input
                type="number"
                value={formData.radius_meters}
                onChange={(e) => setFormData({ ...formData, radius_meters: e.target.value })}
                placeholder="100"
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={onClose} variant="outline" className="flex-1 border-slate-700 bg-transparent">
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                Add Location
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  )
}
