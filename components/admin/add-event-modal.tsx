"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { X } from "lucide-react"

interface AddEventModalProps {
  onAdd: (event: any) => void
  onClose: () => void
}

export function AddEventModal({ onAdd, onClose }: AddEventModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    reward_multiplier: 1.5,
    city: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd(formData)
    setFormData({
      title: "",
      description: "",
      start_date: "",
      end_date: "",
      reward_multiplier: 1.5,
      city: "",
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="bg-slate-900 border-slate-800 w-full max-w-md max-h-96 overflow-y-auto">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900">
          <h2 className="text-xl font-bold text-white">Create Event</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-white">Event Title</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Plastic Free Week"
              className="mt-2 bg-slate-800 border-slate-700 text-white"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-white">Description</label>
            <Input
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Event details"
              className="mt-2 bg-slate-800 border-slate-700 text-white"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-white">Start Date</label>
            <Input
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              className="mt-2 bg-slate-800 border-slate-700 text-white"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-white">End Date</label>
            <Input
              type="date"
              value={formData.end_date}
              onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              className="mt-2 bg-slate-800 border-slate-700 text-white"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-white">Reward Multiplier</label>
            <Input
              type="number"
              step="0.1"
              value={formData.reward_multiplier}
              onChange={(e) => setFormData({ ...formData, reward_multiplier: Number.parseFloat(e.target.value) })}
              className="mt-2 bg-slate-800 border-slate-700 text-white"
              min="1"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-white">City</label>
            <Input
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              placeholder="e.g., Mumbai, Bangalore"
              className="mt-2 bg-slate-800 border-slate-700 text-white"
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1 border-slate-700 bg-transparent"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700">
              Create Event
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
