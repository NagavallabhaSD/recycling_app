import type React from "react"
import { Suspense } from "react"

export default function RewardsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <Suspense fallback={null}>{children}</Suspense>
}
