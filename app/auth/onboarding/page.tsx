"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const ONBOARDING_STEPS = [
  {
    id: "profile",
    title: "Create Your Profile",
    description: "Tell us about yourself",
  },
  {
    id: "motivation",
    title: "Your Mission",
    description: "Why do you want to recycle?",
  },
  {
    id: "complete",
    title: "Ready to Go!",
    description: "You're all set to start recycling",
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    fullName: "",
    city: "",
    bio: "",
    avatarUrl: "/placeholder-user.jpg",
  })

  useEffect(() => {
    const userSession = localStorage.getItem("user_session")
    if (!userSession) {
      router.push("/auth/login")
    } else {
      const session = JSON.parse(userSession)
      setUserId(session.id)
      setFormData((prev) => ({
        ...prev,
        fullName: session.full_name || session.email?.split("@")[0] || "",
      }))
    }
  }, [router])

  const handleNext = async () => {
    if (currentStep === ONBOARDING_STEPS.length - 1) {
      await handleSaveProfile()
    } else {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleSaveProfile = async () => {
    if (!userId) return

    setIsLoading(true)

    try {
      const userSession = localStorage.getItem("user_session")
      if (userSession) {
        const session = JSON.parse(userSession)
        session.full_name = formData.fullName
        session.city = formData.city
        session.bio = formData.bio
        localStorage.setItem("user_session", JSON.stringify(session))
      }

      router.push("/dashboard")
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
              <Input
                type="text"
                placeholder="Your name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">City</label>
              <Input
                type="text"
                placeholder="e.g., Bengaluru, Delhi, Mumbai"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full"
              />
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Your Recycling Bio</label>
              <Textarea
                placeholder="What motivates you to recycle? e.g., 'Saving the planet for future generations'"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full h-24"
              />
            </div>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700">
                This helps your community know what drives you to make a difference!
              </p>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="text-center py-8">
            <div className="mb-6 text-5xl">🎉</div>
            <h2 className="text-2xl font-bold text-foreground mb-1">{ONBOARDING_STEPS[currentStep].title}</h2>
            <p className="text-gray-600 mb-4">You're ready to start your recycling journey</p>
            <div className="space-y-2 text-left p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Next:</span> Upload your first recycling proof and earn points
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Goal:</span> Climb the leaderboard and unlock rewards
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Compete:</span> Join challenges with your community
              </p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-blue-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex justify-between mb-3">
              {ONBOARDING_STEPS.map((step, idx) => (
                <div
                  key={step.id}
                  className={`flex-1 h-1 mx-1 rounded-full transition-colors ${
                    idx <= currentStep ? "bg-primary" : "bg-gray-200"
                  }`}
                ></div>
              ))}
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-1">{ONBOARDING_STEPS[currentStep].title}</h1>
            <p className="text-sm text-gray-600">{ONBOARDING_STEPS[currentStep].description}</p>
          </div>

          {/* Step Content */}
          <div className="mb-8">{renderStepContent()}</div>

          {/* Navigation Buttons */}
          <div className="flex gap-3">
            {currentStep > 0 && (
              <Button
                onClick={handlePrevious}
                variant="outline"
                className="flex-1 h-10 border-2 border-gray-300 bg-transparent"
              >
                Previous
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={
                isLoading ||
                (currentStep === 0 && (!formData.fullName || !formData.city)) ||
                (currentStep === 1 && !formData.bio)
              }
              className="flex-1 h-10 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-all"
            >
              {isLoading ? "Saving..." : currentStep === ONBOARDING_STEPS.length - 1 ? "Start Journey" : "Next"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
