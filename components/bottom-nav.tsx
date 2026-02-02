"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, RecycleIcon, Trophy, Gift, User, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

export function BottomNav() {
  const pathname = usePathname()

  const items = [
    { name: "Home", href: "/dashboard", icon: Home },
    { name: "Upload", href: "/upload", icon: RecycleIcon },
    { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
    { name: "Rewards", href: "/rewards", icon: Gift },
    { name: "Profile", href: "/profile", icon: User },
    { name: "Settings", href: "/settings", icon: Settings },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 sm:hidden">
      <div className="flex items-center justify-around overflow-x-auto">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center py-3 px-2 text-xs font-medium transition-colors min-w-fit",
                isActive ? "text-emerald-600 border-t-2 border-emerald-600" : "text-gray-500 hover:text-emerald-600",
              )}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="truncate">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
