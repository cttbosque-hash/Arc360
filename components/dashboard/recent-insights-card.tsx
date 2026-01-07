"use client"

import Link from "next/link"
import { ArrowRight, Lightbulb, BookOpen, Brain, AlertCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Insight {
  id: string
  title: string
  content: string
  category: string
  created_at: string
}

interface RecentInsightsCardProps {
  insights: Insight[]
}

export function RecentInsightsCard({ insights }: RecentInsightsCardProps) {
  const categoryIcons = {
    idea: Lightbulb,
    learning: BookOpen,
    reflection: Brain,
  }

  const categoryColors = {
    idea: "bg-[#7C3AED]/20 text-[#7C3AED]",
    learning: "bg-[#4F46E5]/20 text-[#4F46E5]",
    reflection: "bg-[#06D6A0]/20 text-[#06D6A0]",
  }

  const categoryLabels = {
    idea: "Ideia",
    learning: "Aprendizado",
    reflection: "Reflexão",
  }

  return (
    <Card className="bg-[#1E293B] border-[#334155] p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-[#F1F5F9]">Insights Recentes</h3>
        <Link href="/insights">
          <Button variant="ghost" size="sm" className="text-[#4F46E5] hover:text-[#7C3AED]">
            Ver todos
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {insights.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <AlertCircle className="w-12 h-12 text-[#64748B] mx-auto mb-3" />
            <p className="text-[#64748B]">Nenhum insight salvo</p>
            <Link href="/insights">
              <Button variant="outline" size="sm" className="mt-4 bg-transparent">
                Criar insight
              </Button>
            </Link>
          </div>
        ) : (
          insights.map((insight) => {
            const Icon = categoryIcons[insight.category as keyof typeof categoryIcons]
            return (
              <div
                key={insight.id}
                className="p-4 rounded-lg bg-[#0F172A]/50 border border-[#334155] hover:border-[#4F46E5]/50 transition-all"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${categoryColors[insight.category as keyof typeof categoryColors]}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[#F1F5F9] font-medium truncate">{insight.title}</h4>
                    <p className="text-xs text-[#64748B]">{new Date(insight.created_at).toLocaleDateString("pt-BR")}</p>
                  </div>
                </div>
                <p className="text-sm text-[#94A3B8] line-clamp-2 mb-3">{insight.content}</p>
                <Badge className={categoryColors[insight.category as keyof typeof categoryColors]}>
                  {categoryLabels[insight.category as keyof typeof categoryLabels]}
                </Badge>
              </div>
            )
          })
        )}
      </div>
    </Card>
  )
}
