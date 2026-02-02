"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BottomNav } from "@/components/bottom-nav"
import { DesktopSidebar } from "@/components/desktop-sidebar"
import { Bell, MapPin, LogOut } from "lucide-react"

export default function SettingsPage() {
  const router = useRouter()
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    soundEnabled: true,
    maxLocationRadius: 0.5,
    minConfidenceScore: 70,
  })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    // Load settings from localStorage
    const stored = localStorage.getItem("user_settings")
    if (stored) {
      setSettings(JSON.parse(stored))
    }
  }, [])

  const handleToggle = (key: string) => {
    setSettings((prev) => {
      const updated = { ...prev, [key]: !prev[key] }
      localStorage.setItem("user_settings", JSON.stringify(updated))
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      return updated
    })
  }

  const handleChange = (key: string, value: any) => {
    setSettings((prev) => {
      const updated = { ...prev, [key]: value }
      localStorage.setItem("user_settings", JSON.stringify(updated))
      return updated
    })
  }

  const handleLogout = () => {
    localStorage.removeItem("user_session")
    router.push("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 pb-24 sm:pb-0 sm:ml-64">
      <DesktopSidebar />

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <div className="pt-4">
          <h1 className="text-3xl font-bold text-emerald-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your preferences and account settings</p>
        </div>

        {saved && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm font-medium">
            ✓ Settings saved successfully
          </div>
        )}

        {/* Notifications */}
        <Card className="border-emerald-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-900">
              <Bell className="w-5 h-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
              <div>
                <p className="font-medium text-emerald-900">Email Notifications</p>
                <p className="text-sm text-gray-600">Receive updates about rewards and challenges</p>
              </div>
              <button
                onClick={() => handleToggle("emailNotifications")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  settings.emailNotifications ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                {settings.emailNotifications ? "On" : "Off"}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
              <div>
                <p className="font-medium text-emerald-900">Push Notifications</p>
                <p className="text-sm text-gray-600">Get notified about new events</p>
              </div>
              <button
                onClick={() => handleToggle("pushNotifications")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  settings.pushNotifications ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                {settings.pushNotifications ? "On" : "Off"}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
              <div>
                <p className="font-medium text-emerald-900">Sound Effects</p>
                <p className="text-sm text-gray-600">Play sounds for actions and achievements</p>
              </div>
              <button
                onClick={() => handleToggle("soundEnabled")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  settings.soundEnabled ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                {settings.soundEnabled ? "On" : "Off"}
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Location & Detection */}
        <Card className="border-emerald-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-900">
              <MapPin className="w-5 h-5" />
              Detection Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-emerald-900 mb-2">GPS Validation Radius (km)</label>
              <Input
                type="number"
                value={settings.maxLocationRadius}
                onChange={(e) => handleChange("maxLocationRadius", Number.parseFloat(e.target.value))}
                step="0.1"
                min="0.1"
                max="5"
                className="border-emerald-300 focus:border-emerald-500"
              />
              <p className="text-xs text-gray-600 mt-1">How far from a recycling center to validate GPS</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-emerald-900 mb-2">Minimum Confidence Score (%)</label>
              <Input
                type="number"
                value={settings.minConfidenceScore}
                onChange={(e) => handleChange("minConfidenceScore", Number.parseInt(e.target.value))}
                min="0"
                max="100"
                className="border-emerald-300 focus:border-emerald-500"
              />
              <p className="text-xs text-gray-600 mt-1">Minimum accuracy required for waste classification</p>
            </div>
          </CardContent>
        </Card>

        {/* Account */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-900">
              <LogOut className="w-5 h-5" />
              Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={handleLogout} className="w-full gap-2 bg-red-600 hover:bg-red-700 text-white">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  )
}
