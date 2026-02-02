"use client"

import { Suspense } from "react"
import RewardsContent from "./content"

export default function RewardsPage() {
  return (
    <Suspense fallback={null}>
      <RewardsContent />
    </Suspense>
  )
}
