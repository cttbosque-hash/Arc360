"use client"

import { LayoutDashboard, Wallet, FolderKanban, Lightbulb, Target, BookOpen, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  activeView: string
  setActiveView: (view: string) => void
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "finance", label: "Finanças", icon: Wallet },
  { id: "projects", label: "Projetos", icon: FolderKanban },
  { id: "insights", label: "Insights", icon: Lightbulb },
  { id: "goals", label: "Metas", icon: Target },
  { id: "readings", label: "Leituras", icon: BookOpen },
]

export function Sidebar({ activeView, setActiveView }: SidebarProps) {
  return (
    <aside className="w-64 border-r border-border bg-card/50 backdrop-blur-xl flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center pulse-glow">
            <div className="w-6 h-6 rounded-full bg-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">JARVIS</h1>
            <p className="text-xs text-muted-foreground">Assistente Pessoal</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = activeView === item.id

          return (
            <Button
              key={item.id}
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 h-11 transition-all",
                isActive && "bg-primary/10 text-primary border border-primary/20 glow-border",
              )}
              onClick={() => setActiveView(item.id)}
            >
              <Icon className="h-5 w-5" />
              <span className="flex-1 text-left">{item.label}</span>
              {isActive && <ChevronRight className="h-4 w-4" />}
            </Button>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground text-center">Powered by AI</div>
      </div>
    </aside>
  )
}
