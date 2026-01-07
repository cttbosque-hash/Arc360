"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Target, TrendingUp, CheckCircle2, Clock } from "lucide-react"

export default function GoalsPage() {
  const [goals, setGoals] = useState<any[]>([])

  useEffect(() => {
    // Dados mockados de metas
    setGoals([
      {
        id: 1,
        title: "Ler 24 livros em 2024",
        description: "Meta SMART: 2 livros por mês durante todo o ano",
        progress: 8,
        target: 24,
        status: "active",
        deadline: "2024-12-31",
        category: "Educação",
      },
      {
        id: 2,
        title: "Economizar R$ 100.000",
        description: "Guardar e investir mensalmente para atingir a meta",
        progress: 12000,
        target: 100000,
        status: "active",
        deadline: "2025-12-31",
        category: "Financeiro",
      },
      {
        id: 3,
        title: "Exercitar 4x por semana",
        description: "Praticar atividade física regularmente para saúde",
        progress: 32,
        target: 52,
        status: "active",
        deadline: "2024-12-31",
        category: "Saúde",
      },
    ])
  }, [])

  const statusColors: any = {
    active: "bg-[#4F46E5] text-white",
    completed: "bg-[#06D6A0] text-white",
    paused: "bg-[#64748B] text-white",
  }

  const statusLabels: any = {
    active: "Em Progresso",
    completed: "Concluída",
    paused: "Pausada",
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#F1F5F9]">Metas</h1>
          <p className="text-[#64748B] mt-1">Defina e acompanhe suas metas SMART</p>
        </div>
        <Button className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED]">
          <PlusCircle className="w-4 h-4 mr-2" />
          Nova Meta
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="bg-[#1E293B] border-[#334155]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#94A3B8]">Total de Metas</CardTitle>
            <Target className="w-4 h-4 text-[#4F46E5]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#F1F5F9]">{goals.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-[#1E293B] border-[#334155]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#94A3B8]">Em Progresso</CardTitle>
            <TrendingUp className="w-4 h-4 text-[#F59E0B]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#F1F5F9]">{goals.filter((g) => g.status === "active").length}</div>
          </CardContent>
        </Card>

        <Card className="bg-[#1E293B] border-[#334155]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#94A3B8]">Concluídas</CardTitle>
            <CheckCircle2 className="w-4 h-4 text-[#06D6A0]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#F1F5F9]">
              {goals.filter((g) => g.status === "completed").length}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1E293B] border-[#334155]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#94A3B8]">Taxa de Conclusão</CardTitle>
            <Clock className="w-4 h-4 text-[#7C3AED]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#F1F5F9]">
              {goals.length > 0
                ? Math.round((goals.filter((g) => g.status === "completed").length / goals.length) * 100)
                : 0}
              %
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {goals.map((goal) => {
          const progressPercent = (goal.progress / goal.target) * 100
          return (
            <Card key={goal.id} className="bg-[#1E293B] border-[#334155] hover:border-[#4F46E5] transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-[#F1F5F9] text-lg">{goal.title}</CardTitle>
                    <p className="text-sm text-[#94A3B8] mt-1">{goal.description}</p>
                  </div>
                  <Badge className={statusColors[goal.status]}>{statusLabels[goal.status]}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#64748B]">Progresso</span>
                    <span className="text-[#F1F5F9] font-medium">
                      {goal.progress.toLocaleString()} / {goal.target.toLocaleString()} ({progressPercent.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#334155] rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] h-3 rounded-full transition-all"
                      style={{ width: `${Math.min(progressPercent, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#334155]">
                  <Badge variant="outline" className="text-[#64748B] border-[#334155]">
                    {goal.category}
                  </Badge>
                  <span className="text-sm text-[#64748B]">Prazo: {goal.deadline}</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
