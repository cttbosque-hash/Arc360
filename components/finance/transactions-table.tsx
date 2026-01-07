"use client"

import { useState } from "react"
import { Trash2, Edit, ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Transaction {
  id: string
  type: string
  category: string
  amount: number
  description: string
  date: string
}

interface TransactionsTableProps {
  transactions: Transaction[]
}

export function TransactionsTable({ transactions }: TransactionsTableProps) {
  const [filter, setFilter] = useState<string>("all")

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const filteredTransactions = filter === "all" ? transactions : transactions.filter((t) => t.type === filter)

  const typeLabels = {
    income: "Receita",
    expense: "Despesa",
    investment: "Investimento",
  }

  const typeIcons = {
    income: ArrowDownRight,
    expense: ArrowUpRight,
    investment: TrendingUp,
  }

  const typeColors = {
    income: "text-[#06D6A0] bg-[#06D6A0]/20",
    expense: "text-red-400 bg-red-400/20",
    investment: "text-[#4F46E5] bg-[#4F46E5]/20",
  }

  return (
    <Card className="bg-[#1E293B] border-[#334155] p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-[#F1F5F9]">Transações</h3>
        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
            className={filter === "all" ? "bg-[#4F46E5]" : ""}
          >
            Todas
          </Button>
          <Button
            variant={filter === "income" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("income")}
            className={filter === "income" ? "bg-[#06D6A0]" : ""}
          >
            Receitas
          </Button>
          <Button
            variant={filter === "expense" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("expense")}
            className={filter === "expense" ? "bg-red-400" : ""}
          >
            Despesas
          </Button>
          <Button
            variant={filter === "investment" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("investment")}
            className={filter === "investment" ? "bg-[#7C3AED]" : ""}
          >
            Investimentos
          </Button>
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[#64748B]">Nenhuma transação encontrada</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-[#334155] hover:bg-transparent">
                <TableHead className="text-[#94A3B8]">Tipo</TableHead>
                <TableHead className="text-[#94A3B8]">Categoria</TableHead>
                <TableHead className="text-[#94A3B8]">Descrição</TableHead>
                <TableHead className="text-[#94A3B8]">Data</TableHead>
                <TableHead className="text-[#94A3B8] text-right">Valor</TableHead>
                <TableHead className="text-[#94A3B8] text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => {
                const Icon = typeIcons[transaction.type as keyof typeof typeIcons]
                return (
                  <TableRow key={transaction.id} className="border-[#334155]">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${typeColors[transaction.type as keyof typeof typeColors]}`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-[#F1F5F9] text-sm">
                          {typeLabels[transaction.type as keyof typeof typeLabels]}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-[#334155] text-[#94A3B8]">
                        {transaction.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[#F1F5F9]">{transaction.description || "-"}</TableCell>
                    <TableCell className="text-[#94A3B8]">
                      {new Date(transaction.date).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={`font-semibold ${transaction.type === "expense" ? "text-red-400" : "text-[#06D6A0]"}`}
                      >
                        {transaction.type === "expense" ? "-" : "+"} {formatCurrency(transaction.amount)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="w-8 h-8">
                          <Edit className="w-4 h-4 text-[#94A3B8]" />
                        </Button>
                        <Button variant="ghost" size="icon" className="w-8 h-8">
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </Card>
  )
}
