"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Lightbulb, BookOpen, Sparkles } from "lucide-react"

export default function InsightsPage() {
  const [insights, setInsights] = useState<any[]>([])

  useEffect(() => {
    // Dados mockados de insights
    setInsights([
      {
        id: 1,
        title: "Estratégia de Marketing Digital",
        content: "Focar em conteúdo orgânico no LinkedIn para gerar leads B2B de qualidade",
        category: "ideias",
        tags: ["marketing", "B2B", "linkedin"],
        date: "2024-01-15",
      },
      {
        id: 2,
        title: "Aprendizado sobre React Server Components",
        content: "RSC permitem buscar dados no servidor sem expor APIs, melhorando segurança e performance",
        category: "aprendizados",
        tags: ["react", "nextjs", "desenvolvimento"],
        date: "2024-01-12",
      },
      {
        id: 3,
        title: "Reflexão sobre Produtividade",
        content: "Trabalhar em blocos de tempo focado de 90 minutos é mais eficiente que multitasking",
        category: "reflexoes",
        tags: ["produtividade", "foco"],
        date: "2024-01-10",
      },
    ])
  }, [])

  const categoryColors: any = {
    ideias: "bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]",
    aprendizados: "bg-[#06D6A0]/20 text-[#06D6A0] border-[#06D6A0]",
    reflexoes: "bg-[#7C3AED]/20 text-[#7C3AED] border-[#7C3AED]",
  }

  const categoryIcons: any = {
    ideias: Lightbulb,
    aprendizados: BookOpen,
    reflexoes: Sparkles,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#F1F5F9]">Insights</h1>
          <p className="text-[#64748B] mt-1">Capture ideias, aprendizados e reflexões</p>
        </div>
        <Button className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED]">
          <PlusCircle className="w-4 h-4 mr-2" />
          Novo Insight
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-[#1E293B] border-[#334155]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#94A3B8]">Ideias</CardTitle>
            <Lightbulb className="w-4 h-4 text-[#F59E0B]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#F1F5F9]">
              {insights.filter((i) => i.category === "ideias").length}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1E293B] border-[#334155]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#94A3B8]">Aprendizados</CardTitle>
            <BookOpen className="w-4 h-4 text-[#06D6A0]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#F1F5F9]">
              {insights.filter((i) => i.category === "aprendizados").length}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1E293B] border-[#334155]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#94A3B8]">Reflexões</CardTitle>
            <Sparkles className="w-4 h-4 text-[#7C3AED]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#F1F5F9]">
              {insights.filter((i) => i.category === "reflexoes").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {insights.map((insight) => {
          const Icon = categoryIcons[insight.category]
          return (
            <Card key={insight.id} className="bg-[#1E293B] border-[#334155] hover:border-[#4F46E5] transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${categoryColors[insight.category]}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-[#F1F5F9] text-lg">{insight.title}</CardTitle>
                      <p className="text-sm text-[#64748B] mt-1">{insight.date}</p>
                    </div>
                  </div>
                  <Badge className={`${categoryColors[insight.category]} border`}>{insight.category}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-[#94A3B8]">{insight.content}</p>
                <div className="flex flex-wrap gap-2">
                  {insight.tags.map((tag: string) => (
                    <Badge key={tag} variant="outline" className="text-[#64748B] border-[#334155]">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
