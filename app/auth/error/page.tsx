"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function ErrorPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Oops!</h1>
        <p className="text-gray-600 mb-6">Something went wrong during authentication. Please try again.</p>
        <Button
          onClick={() => router.push("/auth/login")}
          className="bg-primary hover:bg-green-700 text-white font-semibold"
        >
          Back to Login
        </Button>
      </div>
    </div>
  )
}
