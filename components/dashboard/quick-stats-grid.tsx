"use client"

import { FolderKanban, Target, Lightbulb, BookOpen } from "lucide-react"
import { Card } from "@/components/ui/card"

interface QuickStatsGridProps {
  activeProjects: number
  completedGoals: number
  totalInsights: number
  booksReading: number
}

export function QuickStatsGrid({ activeProjects, completedGoals, totalInsights, booksReading }: QuickStatsGridProps) {
  const stats = [
    {
      label: "Projetos Ativos",
      value: activeProjects,
      icon: FolderKanban,
      color: "from-[#4F46E5] to-[#7C3AED]",
      bgColor: "bg-[#4F46E5]/20",
    },
    {
      label: "Metas Concluídas",
      value: completedGoals,
      icon: Target,
      color: "from-[#06D6A0] to-[#4F46E5]",
      bgColor: "bg-[#06D6A0]/20",
    },
    {
      label: "Insights Salvos",
      value: totalInsights,
      icon: Lightbulb,
      color: "from-[#7C3AED] to-[#06D6A0]",
      bgColor: "bg-[#7C3AED]/20",
    },
    {
      label: "Livros Lendo",
      value: booksReading,
      icon: BookOpen,
      color: "from-[#06D6A0] to-[#7C3AED]",
      bgColor: "bg-[#06D6A0]/20",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="bg-[#1E293B] border-[#334155] p-5 hover:border-[#4F46E5]/50 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#64748B] mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-[#F1F5F9]">{stat.value}</p>
            </div>
            <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
              <stat.icon className="w-6 h-6 text-[#F1F5F9]" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
