"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  MessageSquare,
  ListTodo,
  Target,
  FolderKanban,
  Bell,
  Wallet,
  BookOpen,
  Lightbulb,
  Newspaper,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"

interface DashboardSidebarProps {
  user: {
    name: string
    email: string
    image_url?: string
  }
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Chat IA", href: "/chat", icon: MessageSquare },
  { name: "Tarefas", href: "/tasks", icon: ListTodo },
  { name: "Hábitos", href: "/habits", icon: Target },
  { name: "Projetos", href: "/projects", icon: FolderKanban },
  { name: "Lembretes", href: "/reminders", icon: Bell },
  { name: "Finanças", href: "/finance", icon: Wallet },
  { name: "Diário", href: "/journal", icon: BookOpen },
  { name: "Brain Dump", href: "/insights", icon: Lightbulb },
  { name: "Novidades", href: "/news", icon: Newspaper },
]

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)

  const handleSignOut = () => {
    localStorage.removeItem("user")
    window.location.href = "/"
  }

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <aside
      className={cn(
        "bg-[#0F1629] border-r border-[#1E293B] transition-all duration-300 flex flex-col",
        collapsed ? "w-20" : "w-64",
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[#1E293B]">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <img
                src="/images/api-attachments-k6hggwbdppsfww9bfh0te.jpg"
                alt="ARC 360"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-[#94A3B8] hover:text-[#00D9FF] hover:bg-[#1E293B]"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
                isActive
                  ? "bg-gradient-to-r from-[#00D9FF]/20 to-[#0891B2]/20 text-[#00D9FF] border border-[#00D9FF]/30 shadow-lg shadow-[#00D9FF]/10"
                  : "text-[#94A3B8] hover:text-[#00D9FF] hover:bg-[#1E293B]",
              )}
              title={collapsed ? item.name : undefined}
            >
              <item.icon className={cn("w-5 h-5", collapsed ? "mx-auto" : "")} />
              {!collapsed && <span className="font-medium">{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-[#1E293B] space-y-2">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-[#94A3B8] hover:text-[#00D9FF] hover:bg-[#1E293B]",
            collapsed && "justify-center",
          )}
          title={collapsed ? "Configurações" : undefined}
        >
          <Settings className="w-5 h-5" />
          {!collapsed && <span className="font-medium">Configurações</span>}
        </Link>

        <button
          onClick={handleSignOut}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-[#94A3B8] hover:text-red-400 hover:bg-[#1E293B]",
            collapsed && "justify-center",
          )}
          title={collapsed ? "Sair" : undefined}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="font-medium">Sair</span>}
        </button>

        {!collapsed && (
          <div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-[#131729] border border-[#1E293B]">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user.image_url || "/placeholder.svg"} />
              <AvatarFallback className="bg-gradient-to-br from-[#00D9FF] to-[#0891B2] text-[#0A0E27] font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#F1F5F9] truncate">{user.name}</p>
              <p className="text-xs text-[#64748B] truncate">{user.email}</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
