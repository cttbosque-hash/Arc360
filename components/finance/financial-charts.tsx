"use client"

import { Card } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

interface Transaction {
  type: string
  category: string
  amount: number
  date: string
}

interface FinancialChartsProps {
  transactions: Transaction[]
}

export function FinancialCharts({ transactions }: FinancialChartsProps) {
  // Agrupar por categoria
  const categoryData = transactions.reduce(
    (acc, t) => {
      const existing = acc.find((item) => item.name === t.category)
      if (existing) {
        existing.value += Number(t.amount)
      } else {
        acc.push({ name: t.category, value: Number(t.amount) })
      }
      return acc
    },
    [] as { name: string; value: number }[],
  )

  // Agrupar por mês
  const monthlyData = transactions.reduce(
    (acc, t) => {
      const month = new Date(t.date).toLocaleDateString("pt-BR", { month: "short" })
      const existing = acc.find((item) => item.month === month)

      if (existing) {
        if (t.type === "income") {
          existing.income += Number(t.amount)
        } else if (t.type === "expense") {
          existing.expense += Number(t.amount)
        }
      } else {
        acc.push({
          month,
          income: t.type === "income" ? Number(t.amount) : 0,
          expense: t.type === "expense" ? Number(t.amount) : 0,
        })
      }
      return acc
    },
    [] as { month: string; income: number; expense: number }[],
  )

  const COLORS = ["#4F46E5", "#7C3AED", "#06D6A0", "#F59E0B", "#EF4444", "#10B981"]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-[#1E293B] border-[#334155] p-6">
        <h3 className="text-lg font-semibold text-[#F1F5F9] mb-6">Receitas vs Despesas</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="month" stroke="#94A3B8" />
            <YAxis stroke="#94A3B8" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1E293B",
                border: "1px solid #334155",
                borderRadius: "8px",
                color: "#F1F5F9",
              }}
            />
            <Bar dataKey="income" fill="#06D6A0" name="Receitas" />
            <Bar dataKey="expense" fill="#EF4444" name="Despesas" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="bg-[#1E293B] border-[#334155] p-6">
        <h3 className="text-lg font-semibold text-[#F1F5F9] mb-6">Gastos por Categoria</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#1E293B",
                border: "1px solid #334155",
                borderRadius: "8px",
                color: "#F1F5F9",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}
