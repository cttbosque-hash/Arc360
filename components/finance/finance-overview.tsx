"use client"

import { TrendingUp, TrendingDown, Wallet, Target } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface FinanceOverviewProps {
  income: number
  expenses: number
  balance: number
  investments: number
  goal: number
}

export function FinanceOverview({ income, expenses, balance, investments, goal }: FinanceOverviewProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const totalSaved = balance + investments
  const goalProgress = (totalSaved / goal) * 100

  const stats = [
    {
      label: "Receitas",
      value: formatCurrency(income),
      icon: TrendingUp,
      color: "text-[#06D6A0]",
      bgColor: "bg-[#06D6A0]/20",
    },
    {
      label: "Despesas",
      value: formatCurrency(expenses),
      icon: TrendingDown,
      color: "text-red-400",
      bgColor: "bg-red-400/20",
    },
    {
      label: "Saldo Atual",
      value: formatCurrency(balance),
      icon: Wallet,
      color: "text-[#4F46E5]",
      bgColor: "bg-[#4F46E5]/20",
    },
    {
      label: "Investimentos",
      value: formatCurrency(investments),
      icon: Target,
      color: "text-[#7C3AED]",
      bgColor: "bg-[#7C3AED]/20",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-[#1E293B] border-[#334155] p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <p className="text-sm text-[#64748B] mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-[#F1F5F9]">{stat.value}</p>
          </Card>
        ))}
      </div>

      <Card className="bg-[#1E293B] border-[#334155] p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-[#F1F5F9]">Progresso da Meta</h3>
            <p className="text-sm text-[#64748B]">R$ 100.000,00</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-[#F1F5F9]">{formatCurrency(totalSaved)}</p>
            <p className="text-sm text-[#06D6A0]">{goalProgress.toFixed(1)}%</p>
          </div>
        </div>
        <Progress value={goalProgress} className="h-3" />
        <p className="text-sm text-[#64748B] mt-3">Faltam {formatCurrency(goal - totalSaved)} para atingir sua meta</p>
      </Card>
    </div>
  )
}
