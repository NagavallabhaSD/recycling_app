"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { X } from "lucide-react"

interface AddRewardModalProps {
  onAdd: (reward: any) => void
  onClose: () => void
}

export function AddRewardModal({ onAdd, onClose }: AddRewardModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    points_required: 50,
    sponsor: "",
    stock_count: 10,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd(formData)
    setFormData({ name: "", description: "", points_required: 50, sponsor: "", stock_count: 10 })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="bg-slate-900 border-slate-800 w-full max-w-md">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Add New Reward</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-white">Reward Name</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Eco Bag"
              className="mt-2 bg-slate-800 border-slate-700 text-white"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-white">Description</label>
            <Input
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description"
              className="mt-2 bg-slate-800 border-slate-700 text-white"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-white">Points Required</label>
            <Input
              type="number"
              value={formData.points_required}
              onChange={(e) => setFormData({ ...formData, points_required: Number.parseInt(e.target.value) })}
              className="mt-2 bg-slate-800 border-slate-700 text-white"
              min="1"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-white">Sponsor</label>
            <Input
              value={formData.sponsor}
              onChange={(e) => setFormData({ ...formData, sponsor: e.target.value })}
              placeholder="Sponsor name"
              className="mt-2 bg-slate-800 border-slate-700 text-white"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-white">Stock Count</label>
            <Input
              type="number"
              value={formData.stock_count}
              onChange={(e) => setFormData({ ...formData, stock_count: Number.parseInt(e.target.value) })}
              className="mt-2 bg-slate-800 border-slate-700 text-white"
              min="0"
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
              Add Reward
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
