import { Suspense } from "react"
import ModerationContent from "./content"

export default function ModerationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ModerationContent />
    </Suspense>
  )
}
