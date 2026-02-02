"use client"

import { Suspense } from "react"
import EventsContent from "./content"

export default function EventsPage() {
  return (
    <Suspense fallback={null}>
      <EventsContent />
    </Suspense>
  )
}
