"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, TrendingUp, TrendingDown, DollarSign } from "lucide-react"

export function FinanceView() {
  const [currentSavings, setCurrentSavings] = useState(32500)
  const [monthlyIncome, setMonthlyIncome] = useState(5000)
  const [monthlyExpenses, setMonthlyExpenses] = useState(3500)
  const savingsGoal = 100000

  const monthlySavings = monthlyIncome - monthlyExpenses
  const monthsToGoal = Math.ceil((savingsGoal - currentSavings) / monthlySavings)
  const progress = (currentSavings / savingsGoal) * 100

  const transactions = [
    { id: 1, description: "Salário", amount: 5000, type: "income", date: "2025-01-01" },
    { id: 2, description: "Aluguel", amount: -1200, type: "expense", date: "2025-01-05" },
    { id: 3, description: "Mercado", amount: -450, type: "expense", date: "2025-01-08" },
    { id: 4, description: "Freelance", amount: 800, type: "income", date: "2025-01-12" },
  ]

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Gestão Financeira 💰</h1>
        <p className="text-muted-foreground text-lg">Controle suas finanças e alcance seus objetivos</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="plan">Plano</TabsTrigger>
          <TabsTrigger value="transactions">Transações</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Progresso da Meta */}
          <Card className="border-primary/20 glow-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Meta: R$ 100.000,00
              </CardTitle>
              <CardDescription>Seu objetivo principal de economia</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-4xl font-bold text-primary">R$ {currentSavings.toLocaleString("pt-BR")}</div>
              <Progress value={progress} className="h-3" />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Progresso</p>
                  <p className="font-semibold">{progress.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Faltam</p>
                  <p className="font-semibold">R$ {(savingsGoal - currentSavings).toLocaleString("pt-BR")}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cards de Resumo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">R$ {monthlyIncome.toLocaleString("pt-BR")}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Despesas Mensais</CardTitle>
                <TrendingDown className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-500">R$ {monthlyExpenses.toLocaleString("pt-BR")}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Economia Mensal</CardTitle>
                <DollarSign className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">R$ {monthlySavings.toLocaleString("pt-BR")}</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="plan" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Plano para R$ 100.000</CardTitle>
              <CardDescription>Estratégia personalizada para atingir sua meta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="current">Economia Atual</Label>
                  <Input
                    id="current"
                    type="number"
                    value={currentSavings}
                    onChange={(e) => setCurrentSavings(Number(e.target.value))}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="income">Receita Mensal</Label>
                  <Input
                    id="income"
                    type="number"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="expenses">Despesas Mensais</Label>
                  <Input
                    id="expenses"
                    type="number"
                    value={monthlyExpenses}
                    onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="p-6 bg-primary/10 border border-primary/20 rounded-lg space-y-3">
                <h3 className="font-semibold text-lg">Projeção</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Economia mensal:</span>
                    <span className="font-semibold text-primary">R$ {monthlySavings.toLocaleString("pt-BR")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tempo estimado:</span>
                    <span className="font-semibold text-primary">
                      {monthsToGoal} meses ({(monthsToGoal / 12).toFixed(1)} anos)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Data prevista:</span>
                    <span className="font-semibold text-primary">
                      {new Date(Date.now() + monthsToGoal * 30 * 24 * 60 * 60 * 1000).toLocaleDateString("pt-BR", {
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold">Dicas para acelerar:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>
                      Reduza gastos desnecessários em{" "}
                      {(monthlyExpenses * 0.1).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} por mês
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Busque fontes de renda extra (freelances, investimentos)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Invista suas economias com rendimento de 1% ao mês</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Transações</CardTitle>
                  <CardDescription>Histórico de receitas e despesas</CardDescription>
                </div>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Adicionar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${transaction.type === "income" ? "bg-green-500" : "bg-red-500"}`}
                      />
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(transaction.date).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    </div>
                    <div className={`font-semibold ${transaction.amount > 0 ? "text-green-500" : "text-red-500"}`}>
                      {transaction.amount > 0 ? "+" : ""}R$ {Math.abs(transaction.amount).toLocaleString("pt-BR")}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
