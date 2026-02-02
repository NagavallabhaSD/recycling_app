"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, BarChart3, Users, CheckCircle2, Gift, Calendar, MessageSquare, Settings, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: BarChart3 },
  { href: "/admin/submissions", label: "Submissions", icon: CheckCircle2 },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/rewards", label: "Rewards", icon: Gift },
  { href: "/admin/events", label: "Events", icon: Calendar },
  { href: "/admin/moderation", label: "Moderation", icon: MessageSquare },
  { href: "/admin/settings", label: "Settings", icon: Settings },
]

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="md:hidden bg-slate-900 border-b border-slate-800 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-emerald-400">EcoAdmin</h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="text-slate-400 hover:text-slate-300"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      {isOpen && (
        <nav className="mt-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive ? "bg-emerald-500/20 text-emerald-400" : "text-slate-400 hover:bg-slate-800"
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </div>
              </Link>
            )
          })}
          <div className="pt-2 border-t border-slate-800">
            <Link href="/dashboard" onClick={() => setIsOpen(false)}>
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-emerald-400 hover:bg-emerald-500/10">
                <Home size={20} />
                <span>Back to App</span>
              </div>
            </Link>
          </div>
        </nav>
      )}
    </div>
  )
}
