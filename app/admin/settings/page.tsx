"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SettingsIcon, Save, AlertCircle, ToggleLeft as Toggle2 } from "lucide-react"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    appName: "EcoRecycle",
    maintenanceMode: false,
    emailNotifications: true,
    gpsCaptureRequired: true,
    minConfidenceScore: 70,
    maxPointsPerSubmission: 50,
    weeklyStreakBonus: 25,
    locationRadiusKm: 0.5,
    pointsMultiplier: 1.0,
  })

  const [savedMessage, setSavedMessage] = useState(false)

  const handleChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setSavedMessage(true)
    setTimeout(() => setSavedMessage(false), 3000)
    // Save to backend
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 mt-2">Manage application settings and configuration</p>
      </div>

      {/* Success Message */}
      {savedMessage && (
        <div className="p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-emerald-400 flex items-center gap-2">
          <AlertCircle size={18} />
          Settings saved successfully
        </div>
      )}

      {/* App Settings Section */}
      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <SettingsIcon size={20} />
            Application Settings
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-300">App Name</label>
              <Input
                value={settings.appName}
                onChange={(e) => handleChange("appName", e.target.value)}
                className="mt-2 bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
              <div>
                <p className="text-white font-medium">Maintenance Mode</p>
                <p className="text-sm text-slate-400">Disable app for all users during maintenance</p>
              </div>
              <button
                onClick={() => handleChange("maintenanceMode", !settings.maintenanceMode)}
                className={`p-2 rounded transition-colors ${
                  settings.maintenanceMode ? "bg-red-500/30 text-red-400" : "bg-slate-700 text-slate-400"
                }`}
              >
                <Toggle2 size={24} />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
              <div>
                <p className="text-white font-medium">Email Notifications</p>
                <p className="text-sm text-slate-400">Send admin alerts for user activities</p>
              </div>
              <button
                onClick={() => handleChange("emailNotifications", !settings.emailNotifications)}
                className={`p-2 rounded transition-colors ${
                  settings.emailNotifications ? "bg-emerald-500/30 text-emerald-400" : "bg-slate-700 text-slate-400"
                }`}
              >
                <Toggle2 size={24} />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
              <div>
                <p className="text-white font-medium">GPS Capture Required</p>
                <p className="text-sm text-slate-400">Require GPS location for all submissions</p>
              </div>
              <button
                onClick={() => handleChange("gpsCaptureRequired", !settings.gpsCaptureRequired)}
                className={`p-2 rounded transition-colors ${
                  settings.gpsCaptureRequired ? "bg-emerald-500/30 text-emerald-400" : "bg-slate-700 text-slate-400"
                }`}
              >
                <Toggle2 size={24} />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI & Detection Settings */}
      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-white mb-4">AI & Detection Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-300">Minimum Confidence Score (%)</label>
              <Input
                type="number"
                value={settings.minConfidenceScore}
                onChange={(e) => handleChange("minConfidenceScore", Number.parseInt(e.target.value))}
                min="0"
                max="100"
                className="mt-2 bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="text-sm text-slate-300">Location Radius (km)</label>
              <Input
                type="number"
                value={settings.locationRadiusKm}
                onChange={(e) => handleChange("locationRadiusKm", Number.parseFloat(e.target.value))}
                step="0.1"
                className="mt-2 bg-slate-800 border-slate-700 text-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Points & Rewards Settings */}
      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Points & Rewards</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-300">Max Points Per Submission</label>
              <Input
                type="number"
                value={settings.maxPointsPerSubmission}
                onChange={(e) => handleChange("maxPointsPerSubmission", Number.parseInt(e.target.value))}
                className="mt-2 bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="text-sm text-slate-300">Weekly Streak Bonus</label>
              <Input
                type="number"
                value={settings.weeklyStreakBonus}
                onChange={(e) => handleChange("weeklyStreakBonus", Number.parseInt(e.target.value))}
                className="mt-2 bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="text-sm text-slate-300">Points Multiplier (for events)</label>
              <Input
                type="number"
                value={settings.pointsMultiplier}
                onChange={(e) => handleChange("pointsMultiplier", Number.parseFloat(e.target.value))}
                step="0.1"
                min="0.5"
                max="5"
                className="mt-2 bg-slate-800 border-slate-700 text-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <Button onClick={handleSave} className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700">
        <Save size={18} />
        Save Settings
      </Button>
    </div>
  )
}
