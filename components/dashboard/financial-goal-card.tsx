"use client"

import { TrendingUp, Calendar, Target } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface FinancialGoalCardProps {
  currentAmount: number
  goalAmount: number
  monthlyIncome: number
}

export function FinancialGoalCard({ currentAmount, goalAmount, monthlyIncome }: FinancialGoalCardProps) {
  const progress = (currentAmount / goalAmount) * 100
  const remaining = goalAmount - currentAmount
  const monthsToGoal = monthlyIncome > 0 ? Math.ceil(remaining / (monthlyIncome * 0.2)) : 0

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  return (
    <Card className="bg-[#1E293B] border-[#334155] p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-[#F1F5F9]">Meta Financeira</h3>
          <p className="text-sm text-[#64748B]">Objetivo: R$ 100.000</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#06D6A0] to-[#4F46E5] flex items-center justify-center">
          <Target className="w-6 h-6 text-white" />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-3xl font-bold text-[#F1F5F9]">{formatCurrency(currentAmount)}</span>
            <span className="text-[#64748B] mb-1">de {formatCurrency(goalAmount)}</span>
          </div>
          <Progress value={progress} className="h-3" />
          <p className="text-sm text-[#06D6A0] mt-2 font-medium">{progress.toFixed(1)}% alcançado</p>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#334155]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#4F46E5]/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[#4F46E5]" />
            </div>
            <div>
              <p className="text-xs text-[#64748B]">Faltam</p>
              <p className="text-sm font-semibold text-[#F1F5F9]">{formatCurrency(remaining)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#7C3AED]/20 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-[#7C3AED]" />
            </div>
            <div>
              <p className="text-xs text-[#64748B]">Previsão</p>
              <p className="text-sm font-semibold text-[#F1F5F9]">
                {monthsToGoal > 0 ? `${monthsToGoal} meses` : "Configure renda"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
