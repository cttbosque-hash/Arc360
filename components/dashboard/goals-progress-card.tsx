"use client"

import Link from "next/link"
import { ArrowRight, AlertCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface Goal {
  id: string
  title: string
  progress: number
  target_date: string | null
}

interface GoalsProgressCardProps {
  goals: Goal[]
}

export function GoalsProgressCard({ goals }: GoalsProgressCardProps) {
  return (
    <Card className="bg-[#1E293B] border-[#334155] p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-[#F1F5F9]">Metas em Progresso</h3>
        <Link href="/goals">
          <Button variant="ghost" size="sm" className="text-[#4F46E5] hover:text-[#7C3AED]">
            Ver todas
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {goals.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-[#64748B] mx-auto mb-3" />
            <p className="text-[#64748B]">Nenhuma meta cadastrada</p>
            <Link href="/goals">
              <Button variant="outline" size="sm" className="mt-4 bg-transparent">
                Criar meta
              </Button>
            </Link>
          </div>
        ) : (
          goals.map((goal) => (
            <div
              key={goal.id}
              className="p-4 rounded-lg bg-[#0F172A]/50 border border-[#334155] hover:border-[#4F46E5]/50 transition-all"
            >
              <div className="mb-3">
                <h4 className="text-[#F1F5F9] font-medium mb-1">{goal.title}</h4>
                {goal.target_date && (
                  <p className="text-xs text-[#64748B]">
                    Meta: {new Date(goal.target_date).toLocaleDateString("pt-BR")}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#64748B]">Progresso</span>
                  <span className="text-[#F1F5F9] font-medium">{goal.progress}%</span>
                </div>
                <Progress value={goal.progress} className="h-2" />
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}
