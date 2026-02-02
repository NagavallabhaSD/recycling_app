"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { BarChart3, Users, CheckCircle2, Gift, Calendar, MessageSquare, Settings, LogOut, MapPin, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: BarChart3 },
  { href: "/admin/submissions", label: "Submissions", icon: CheckCircle2 },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/locations", label: "Locations", icon: MapPin },
  { href: "/admin/rewards", label: "Rewards", icon: Gift },
  { href: "/admin/events", label: "Events", icon: Calendar },
  { href: "/admin/moderation", label: "Moderation", icon: MessageSquare },
  { href: "/admin/settings", label: "Settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    localStorage.removeItem("user_session")
    router.push("/")
  }

  return (
    <aside className="hidden md:flex w-64 bg-slate-900 border-r border-slate-800 flex-col">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-emerald-400">EcoAdmin</h1>
        <p className="text-xs text-slate-400 mt-1">Control Panel</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-300"
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </div>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 space-y-2">
        <Link href="/dashboard">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300"
          >
            <Home size={20} />
            Back to App
          </Button>
        </Link>
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start gap-3 text-red-400 hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut size={20} />
          Logout
        </Button>
      </div>
    </aside>
  )
}
