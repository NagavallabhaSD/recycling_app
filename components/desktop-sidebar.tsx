"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, RecycleIcon, Trophy, Gift, User, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

export function DesktopSidebar() {
  const pathname = usePathname()

  const items = [
    { name: "Home", href: "/dashboard", icon: Home },
    { name: "Upload", href: "/upload", icon: RecycleIcon },
    { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
    { name: "Rewards", href: "/rewards", icon: Gift },
    { name: "Profile", href: "/profile", icon: User },
  ]

  return (
    <aside className="hidden sm:flex fixed left-0 top-0 h-screen w-64 bg-white border-r border-emerald-100 flex-col pt-6 z-50">
      <div className="px-6 mb-8">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          EcoQuest
        </h1>
      </div>

      <nav className="flex-1 space-y-2 px-4">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors",
                isActive
                  ? "bg-emerald-100 text-emerald-700"
                  : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-600",
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      <div className="px-4 pb-6 border-t border-gray-200 pt-6">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  )
}
