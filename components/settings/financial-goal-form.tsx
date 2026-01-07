"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Target, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { getSupabaseBrowserClient } from "@/lib/supabase-client"

interface FinancialGoalFormProps {
  user: {
    id: string
    financial_goal: number
    monthly_income?: number
  }
}

export function FinancialGoalForm({ user }: FinancialGoalFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    financial_goal: user.financial_goal.toString(),
    monthly_income: (user.monthly_income || 0).toString(),
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = getSupabaseBrowserClient()

      const { error } = await supabase
        .from("users")
        .update({
          financial_goal: Number.parseFloat(formData.financial_goal),
          monthly_income: Number.parseFloat(formData.monthly_income),
        })
        .eq("id", user.id)

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error("Error updating financial goals:", error)
    } finally {
      setLoading(false)
    }
  }

  const monthsToGoal = formData.monthly_income
    ? Math.ceil(Number.parseFloat(formData.financial_goal) / (Number.parseFloat(formData.monthly_income) * 0.2))
    : 0

  return (
    <Card className="bg-[#1E293B] border-[#334155] p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-[#06D6A0]/20 flex items-center justify-center">
          <Target className="w-6 h-6 text-[#06D6A0]" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-[#F1F5F9]">Meta Financeira</h3>
          <p className="text-sm text-[#64748B]">Configure sua meta e renda mensal</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="financial_goal" className="text-[#F1F5F9]">
            Meta Financeira (R$)
          </Label>
          <Input
            id="financial_goal"
            type="number"
            step="0.01"
            value={formData.financial_goal}
            onChange={(e) => setFormData({ ...formData, financial_goal: e.target.value })}
            className="mt-2 bg-[#0F172A] border-[#334155] text-[#F1F5F9]"
            required
          />
          <p className="text-xs text-[#64748B] mt-1">Quanto você deseja economizar?</p>
        </div>

        <div>
          <Label htmlFor="monthly_income" className="text-[#F1F5F9]">
            Renda Mensal (R$)
          </Label>
          <Input
            id="monthly_income"
            type="number"
            step="0.01"
            value={formData.monthly_income}
            onChange={(e) => setFormData({ ...formData, monthly_income: e.target.value })}
            className="mt-2 bg-[#0F172A] border-[#334155] text-[#F1F5F9]"
            required
          />
          <p className="text-xs text-[#64748B] mt-1">Sua renda mensal ajuda a calcular o tempo para atingir sua meta</p>
        </div>

        {monthsToGoal > 0 && (
          <div className="p-4 rounded-lg bg-[#4F46E5]/10 border border-[#4F46E5]/20">
            <p className="text-sm text-[#F1F5F9] mb-1">Previsão para atingir a meta:</p>
            <p className="text-2xl font-bold text-[#4F46E5]">{monthsToGoal} meses</p>
            <p className="text-xs text-[#64748B] mt-1">Economizando 20% da renda mensal</p>
          </div>
        )}

        <div className="flex justify-end">
          <Button type="submit" disabled={loading} className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED]">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar Configurações"
            )}
          </Button>
        </div>
      </form>
    </Card>
  )
}
