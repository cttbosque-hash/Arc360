"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  PlusCircle,
  TrendingUp,
  TrendingDown,
  Wallet,
  Target,
  ShoppingCart,
  Home,
  Car,
  Coffee,
  Calendar,
} from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function FinancePage() {
  const [user, setUser] = useState<any>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [isAddingTransaction, setIsAddingTransaction] = useState(false)
  const [isAddingSubscription, setIsAddingSubscription] = useState(false)
  const [editingSubscription, setEditingSubscription] = useState<any>(null)
  const [newTransaction, setNewTransaction] = useState({
    type: "expense",
    description: "",
    amount: 0,
    date: new Date().toISOString().split("T")[0],
    category: "Alimentação",
  })

  const [newSubscription, setNewSubscription] = useState({
    name: "",
    amount: 0,
    nextPayment: new Date().toISOString().split("T")[0],
    icon: "📦",
    frequency: "monthly",
    category: "Entretenimento",
  })

  const [budgets, setBudgets] = useState([
    { category: "Alimentação", icon: Coffee, spent: 800, limit: 1200, color: "#00D9FF" },
    { category: "Transporte", icon: Car, spent: 400, limit: 600, color: "#0EA5E9" },
    { category: "Lazer", icon: ShoppingCart, spent: 300, limit: 500, color: "#7C3AED" },
    { category: "Moradia", icon: Home, spent: 1500, limit: 1500, color: "#EF4444" },
    { category: "Saúde", icon: Calendar, spent: 200, limit: 300, color: "#FBBF24" },
  ])

  const [subscriptions, setSubscriptions] = useState<any[]>([])

  const chartData = [
    { month: "Jul", receita: 5000, despesa: 3200 },
    { month: "Ago", receita: 5200, despesa: 3500 },
    { month: "Set", receita: 4800, despesa: 3100 },
    { month: "Out", receita: 5500, despesa: 3800 },
    { month: "Nov", receita: 5300, despesa: 3300 },
    { month: "Dez", receita: 6000, despesa: 4200 },
  ]

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Trabalho":
        return <Wallet className="w-5 h-5 text-[#06D6A0]" />
      case "Moradia":
        return <Home className="w-5 h-5 text-[#EF4444]" />
      case "Alimentação":
        return <Coffee className="w-5 h-5 text-[#00D9FF]" />
      case "Investimentos":
        return <Target className="w-5 h-5 text-[#7C3AED]" />
      default:
        return <ShoppingCart className="w-5 h-5 text-[#94A3B8]" />
    }
  }

  const handleAddTransaction = () => {
    if (newTransaction.description.trim() && newTransaction.amount > 0) {
      const transaction = {
        id: Date.now(),
        ...newTransaction,
      }
      const updatedTransactions = [...transactions, transaction]
      setTransactions(updatedTransactions)
      localStorage.setItem("arc360_transactions", JSON.stringify(updatedTransactions))
      setNewTransaction({
        type: "expense",
        description: "",
        amount: 0,
        date: new Date().toISOString().split("T")[0],
        category: "Alimentação",
      })
      setIsAddingTransaction(false)
    }
  }

  const handleAddSubscription = () => {
    if (newSubscription.name.trim() && newSubscription.amount > 0) {
      const subscription = {
        id: Date.now(),
        ...newSubscription,
      }
      const updatedSubscriptions = [...subscriptions, subscription]
      setSubscriptions(updatedSubscriptions)
      localStorage.setItem("arc360_subscriptions", JSON.stringify(updatedSubscriptions))
      setNewSubscription({
        name: "",
        amount: 0,
        nextPayment: new Date().toISOString().split("T")[0],
        icon: "📦",
        frequency: "monthly",
        category: "Entretenimento",
      })
      setIsAddingSubscription(false)
    }
  }

  const handleUpdateSubscription = () => {
    if (editingSubscription) {
      const updatedSubscriptions = subscriptions.map((sub) =>
        sub.id === editingSubscription.id ? editingSubscription : sub,
      )
      setSubscriptions(updatedSubscriptions)
      localStorage.setItem("arc360_subscriptions", JSON.stringify(updatedSubscriptions))
      setEditingSubscription(null)
    }
  }

  const handleDeleteSubscription = (id: number) => {
    const updatedSubscriptions = subscriptions.filter((sub) => sub.id !== id)
    setSubscriptions(updatedSubscriptions)
    localStorage.setItem("arc360_subscriptions", JSON.stringify(updatedSubscriptions))
  }

  const getFrequencyText = (frequency: string) => {
    switch (frequency) {
      case "weekly":
        return "/semana"
      case "monthly":
        return "/mês"
      case "yearly":
        return "/ano"
      default:
        return "/mês"
    }
  }

  useEffect(() => {
    const userData = localStorage.getItem("arc360_user")
    if (userData) {
      setUser(JSON.parse(userData))
      const savedTransactions = localStorage.getItem("arc360_transactions")
      if (savedTransactions) {
        setTransactions(JSON.parse(savedTransactions))
      } else {
        setTransactions([
          { id: 1, type: "income", description: "Salário", amount: 5000, date: "2024-01-15", category: "Trabalho" },
          { id: 2, type: "expense", description: "Aluguel", amount: 1500, date: "2024-01-10", category: "Moradia" },
          {
            id: 3,
            type: "expense",
            description: "Supermercado",
            amount: 800,
            date: "2024-01-08",
            category: "Alimentação",
          },
          {
            id: 4,
            type: "investment",
            description: "Tesouro Direto",
            amount: 1000,
            date: "2024-01-05",
            category: "Investimentos",
          },
        ])
      }

      const savedSubscriptions = localStorage.getItem("arc360_subscriptions")
      if (savedSubscriptions) {
        setSubscriptions(JSON.parse(savedSubscriptions))
      } else {
        const defaultSubscriptions = [
          {
            id: 1,
            name: "Netflix",
            amount: 55.9,
            nextPayment: "2025-01-20",
            icon: "🎬",
            frequency: "monthly",
            category: "Entretenimento",
          },
          {
            id: 2,
            name: "Spotify",
            amount: 19.9,
            nextPayment: "2025-01-15",
            icon: "🎵",
            frequency: "monthly",
            category: "Entretenimento",
          },
          {
            id: 3,
            name: "Amazon Prime",
            amount: 14.9,
            nextPayment: "2025-01-25",
            icon: "📦",
            frequency: "monthly",
            category: "Compras",
          },
          {
            id: 4,
            name: "GitHub Pro",
            amount: 29.0,
            nextPayment: "2025-01-18",
            icon: "💻",
            frequency: "monthly",
            category: "Trabalho",
          },
        ]
        setSubscriptions(defaultSubscriptions)
        localStorage.setItem("arc360_subscriptions", JSON.stringify(defaultSubscriptions))
      }
    }
  }, [])

  const income = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
  const expenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
  const investments = transactions.filter((t) => t.type === "investment").reduce((sum, t) => sum + t.amount, 0)
  const balance = income - expenses
  const goal = 100000
  const progress = (investments / goal) * 100

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#F1F5F9]">Finanças</h1>
          <p className="text-[#64748B] mt-1">Gerencie suas finanças e acompanhe sua meta</p>
        </div>
        <Dialog open={isAddingTransaction} onOpenChange={setIsAddingTransaction}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] btn-3d">
              <PlusCircle className="w-4 h-4 mr-2" />
              Nova Transação
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-[#1E293B] border-[#334155] text-[#F1F5F9]">
            <DialogHeader>
              <DialogTitle className="text-2xl">Nova Transação</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium text-[#94A3B8]">Tipo de Transação</label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {["expense", "income", "investment"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setNewTransaction({ ...newTransaction, type })}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        newTransaction.type === type
                          ? "border-[#00D9FF] bg-[#00D9FF]/10 text-[#00D9FF]"
                          : "border-[#334155] text-[#94A3B8] hover:border-[#00D9FF]/50"
                      }`}
                    >
                      {type === "expense" ? "Despesa" : type === "income" ? "Receita" : "Investimento"}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-[#94A3B8]">Descrição</label>
                <input
                  type="text"
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                  className="w-full mt-1 px-4 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
                  placeholder="Ex: Supermercado, Salário, Tesouro Direto..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-[#94A3B8]">Valor (R$)</label>
                  <input
                    type="number"
                    value={newTransaction.amount}
                    onChange={(e) => setNewTransaction({ ...newTransaction, amount: Number(e.target.value) })}
                    className="w-full mt-1 px-4 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-[#94A3B8]">Data</label>
                  <input
                    type="date"
                    value={newTransaction.date}
                    onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                    className="w-full mt-1 px-4 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-[#94A3B8]">Categoria</label>
                <select
                  value={newTransaction.category}
                  onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
                  className="w-full mt-1 px-4 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
                >
                  <option value="Alimentação">Alimentação</option>
                  <option value="Moradia">Moradia</option>
                  <option value="Transporte">Transporte</option>
                  <option value="Trabalho">Trabalho</option>
                  <option value="Investimentos">Investimentos</option>
                  <option value="Lazer">Lazer</option>
                  <option value="Saúde">Saúde</option>
                </select>
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleAddTransaction}
                  className="bg-gradient-to-r from-[#00D9FF] to-[#0EA5E9] btn-3d flex-1"
                >
                  Adicionar Transação
                </Button>
                <Button variant="outline" onClick={() => setIsAddingTransaction(false)} className="border-[#334155]">
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-[#1E293B] border-[#334155]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#94A3B8]">Receitas</CardTitle>
            <TrendingUp className="w-4 h-4 text-[#06D6A0]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#F1F5F9]">R$ {income.toLocaleString("pt-BR")}</div>
          </CardContent>
        </Card>

        <Card className="bg-[#1E293B] border-[#334155]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#94A3B8]">Despesas</CardTitle>
            <TrendingDown className="w-4 h-4 text-[#EF4444]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#F1F5F9]">R$ {expenses.toLocaleString("pt-BR")}</div>
          </CardContent>
        </Card>

        <Card className="bg-[#1E293B] border-[#334155]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#94A3B8]">Saldo</CardTitle>
            <Wallet className="w-4 h-4 text-[#4F46E5]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#F1F5F9]">R$ {balance.toLocaleString("pt-BR")}</div>
          </CardContent>
        </Card>

        <Card className="bg-[#1E293B] border-[#334155]">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-[#94A3B8]">Meta R$ 100k</CardTitle>
            <Target className="w-4 h-4 text-[#7C3AED]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#F1F5F9]">{progress.toFixed(1)}%</div>
            <div className="w-full bg-[#334155] rounded-full h-2 mt-2">
              <div
                className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] h-2 rounded-full transition-all"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-[#1E293B] border-[#334155]">
        <CardHeader>
          <CardTitle className="text-[#F1F5F9]">Receita vs. Despesa (Últimos 6 meses)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
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
              <Bar dataKey="receita" fill="#06D6A0" radius={[8, 8, 0, 0]} />
              <Bar dataKey="despesa" fill="#EF4444" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList className="bg-[#1E293B] border border-[#334155]">
          <TabsTrigger
            value="transactions"
            className="data-[state=active]:bg-[#00D9FF] data-[state=active]:text-[#0F172A]"
          >
            Transações
          </TabsTrigger>
          <TabsTrigger value="budgets" className="data-[state=active]:bg-[#00D9FF] data-[state=active]:text-[#0F172A]">
            Orçamentos
          </TabsTrigger>
          <TabsTrigger
            value="subscriptions"
            className="data-[state=active]:bg-[#00D9FF] data-[state=active]:text-[#0F172A]"
          >
            Assinaturas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <Card className="bg-[#1E293B] border-[#334155]">
            <CardHeader>
              <CardTitle className="text-[#F1F5F9]">Transações Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 bg-[#0F172A] rounded-lg hover:bg-[#0F172A]/80 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.type === "income"
                            ? "bg-[#06D6A0]/20"
                            : transaction.type === "expense"
                              ? "bg-[#EF4444]/20"
                              : "bg-[#00D9FF]/20"
                        }`}
                      >
                        {getCategoryIcon(transaction.category)}
                      </div>
                      <div>
                        <p className="font-medium text-[#F1F5F9]">{transaction.description}</p>
                        <p className="text-sm text-[#64748B]">
                          {transaction.category} • {transaction.date}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`text-lg font-bold ${
                        transaction.type === "income"
                          ? "text-[#06D6A0]"
                          : transaction.type === "expense"
                            ? "text-[#EF4444]"
                            : "text-[#00D9FF]"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}R$ {transaction.amount.toLocaleString("pt-BR")}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budgets" className="space-y-4">
          {budgets.map((budget, index) => {
            const percentage = Math.min((budget.spent / budget.limit) * 100, 100)
            const isOverBudget = budget.spent > budget.limit
            const Icon = budget.icon

            return (
              <Card key={index} className="bg-[#1E293B] border-[#334155]">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-[#00D9FF]/10">
                        <Icon className="w-5 h-5 text-[#00D9FF]" />
                      </div>
                      <div>
                        <p className="font-medium text-[#F1F5F9]">{budget.category}</p>
                        <p className="text-sm text-[#64748B]">
                          R$ {budget.spent.toLocaleString("pt-BR")} de R$ {budget.limit.toLocaleString("pt-BR")}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        isOverBudget
                          ? "bg-red-500/10 text-red-400 border-red-500/20"
                          : "bg-green-500/10 text-green-400 border-green-500/20"
                      }
                    >
                      {percentage.toFixed(0)}%
                    </Badge>
                  </div>
                  <div className="w-full bg-[#334155] rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all ${
                        isOverBudget
                          ? "bg-gradient-to-r from-[#EF4444] to-[#DC2626]"
                          : "bg-gradient-to-r from-[#00D9FF] to-[#0EA5E9]"
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>

        <TabsContent value="subscriptions" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#F1F5F9]">Assinaturas Recorrentes</h3>
            <Dialog open={isAddingSubscription} onOpenChange={setIsAddingSubscription}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] btn-3d">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Nova Assinatura
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-xl bg-[#1E293B] border-[#334155] text-[#F1F5F9]">
                <DialogHeader>
                  <DialogTitle className="text-2xl">Nova Assinatura</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <label className="text-sm font-medium text-[#94A3B8]">Nome da Assinatura</label>
                    <input
                      type="text"
                      value={newSubscription.name}
                      onChange={(e) => setNewSubscription({ ...newSubscription, name: e.target.value })}
                      className="w-full mt-1 px-4 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
                      placeholder="Ex: Netflix, Spotify..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-[#94A3B8]">Valor (R$)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={newSubscription.amount}
                        onChange={(e) => setNewSubscription({ ...newSubscription, amount: Number(e.target.value) })}
                        className="w-full mt-1 px-4 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-[#94A3B8]">Próximo Pagamento</label>
                      <input
                        type="date"
                        value={newSubscription.nextPayment}
                        onChange={(e) => setNewSubscription({ ...newSubscription, nextPayment: e.target.value })}
                        className="w-full mt-1 px-4 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-[#94A3B8]">Frequência</label>
                      <select
                        value={newSubscription.frequency}
                        onChange={(e) => setNewSubscription({ ...newSubscription, frequency: e.target.value })}
                        className="w-full mt-1 px-4 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
                      >
                        <option value="weekly">Semanal</option>
                        <option value="monthly">Mensal</option>
                        <option value="yearly">Anual</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-[#94A3B8]">Categoria</label>
                      <select
                        value={newSubscription.category}
                        onChange={(e) => setNewSubscription({ ...newSubscription, category: e.target.value })}
                        className="w-full mt-1 px-4 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
                      >
                        <option value="Entretenimento">Entretenimento</option>
                        <option value="Trabalho">Trabalho</option>
                        <option value="Compras">Compras</option>
                        <option value="Saúde">Saúde</option>
                        <option value="Educação">Educação</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#94A3B8]">Ícone</label>
                    <div className="grid grid-cols-8 gap-2 mt-2">
                      {["🎬", "🎵", "📦", "💻", "🎮", "📚", "🏋️", "🍔"].map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => setNewSubscription({ ...newSubscription, icon: emoji })}
                          className={`text-2xl p-2 rounded-lg border-2 transition-all ${
                            newSubscription.icon === emoji
                              ? "border-[#00D9FF] bg-[#00D9FF]/10"
                              : "border-[#334155] hover:border-[#00D9FF]/50"
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={handleAddSubscription}
                      className="bg-gradient-to-r from-[#00D9FF] to-[#0EA5E9] btn-3d flex-1"
                    >
                      Adicionar Assinatura
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddingSubscription(false)}
                      className="border-[#334155]"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {subscriptions.map((sub) => (
              <Card
                key={sub.id}
                className="bg-[#1E293B] border-[#334155] hover:border-[#00D9FF]/30 transition-all group"
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="text-3xl">{sub.icon}</div>
                      <div className="flex-1">
                        <p className="font-medium text-[#F1F5F9]">{sub.name}</p>
                        <Badge variant="outline" className="mt-1 text-xs border-[#334155]">
                          {sub.category}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-[#64748B] mt-2">
                          <Calendar className="w-3 h-3" />
                          Próximo: {new Date(sub.nextPayment).toLocaleDateString("pt-BR")}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-[#00D9FF]">R$ {sub.amount.toFixed(2)}</p>
                      <p className="text-xs text-[#64748B]">{getFrequencyText(sub.frequency)}</p>
                      <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingSubscription(sub)}
                          className="h-8 px-2 text-[#00D9FF] hover:bg-[#00D9FF]/10"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteSubscription(sub.id)}
                          className="h-8 px-2 text-red-400 hover:bg-red-400/10"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Dialog open={!!editingSubscription} onOpenChange={() => setEditingSubscription(null)}>
            <DialogContent className="max-w-xl bg-[#1E293B] border-[#334155] text-[#F1F5F9]">
              <DialogHeader>
                <DialogTitle className="text-2xl">Editar Assinatura</DialogTitle>
              </DialogHeader>
              {editingSubscription && (
                <div className="space-y-4 mt-4">
                  <div>
                    <label className="text-sm font-medium text-[#94A3B8]">Nome da Assinatura</label>
                    <input
                      type="text"
                      value={editingSubscription.name}
                      onChange={(e) => setEditingSubscription({ ...editingSubscription, name: e.target.value })}
                      className="w-full mt-1 px-4 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-[#94A3B8]">Valor (R$)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={editingSubscription.amount}
                        onChange={(e) =>
                          setEditingSubscription({ ...editingSubscription, amount: Number(e.target.value) })
                        }
                        className="w-full mt-1 px-4 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-[#94A3B8]">Próximo Pagamento</label>
                      <input
                        type="date"
                        value={editingSubscription.nextPayment}
                        onChange={(e) =>
                          setEditingSubscription({ ...editingSubscription, nextPayment: e.target.value })
                        }
                        className="w-full mt-1 px-4 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-[#94A3B8]">Frequência</label>
                      <select
                        value={editingSubscription.frequency}
                        onChange={(e) => setEditingSubscription({ ...editingSubscription, frequency: e.target.value })}
                        className="w-full mt-1 px-4 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
                      >
                        <option value="weekly">Semanal</option>
                        <option value="monthly">Mensal</option>
                        <option value="yearly">Anual</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-[#94A3B8]">Categoria</label>
                      <select
                        value={editingSubscription.category}
                        onChange={(e) => setEditingSubscription({ ...editingSubscription, category: e.target.value })}
                        className="w-full mt-1 px-4 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
                      >
                        <option value="Entretenimento">Entretenimento</option>
                        <option value="Trabalho">Trabalho</option>
                        <option value="Compras">Compras</option>
                        <option value="Saúde">Saúde</option>
                        <option value="Educação">Educação</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#94A3B8]">Ícone</label>
                    <div className="grid grid-cols-8 gap-2 mt-2">
                      {["🎬", "🎵", "📦", "💻", "🎮", "📚", "🏋️", "🍔"].map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => setEditingSubscription({ ...editingSubscription, icon: emoji })}
                          className={`text-2xl p-2 rounded-lg border-2 transition-all ${
                            editingSubscription.icon === emoji
                              ? "border-[#00D9FF] bg-[#00D9FF]/10"
                              : "border-[#334155] hover:border-[#00D9FF]/50"
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={handleUpdateSubscription}
                      className="bg-gradient-to-r from-[#00D9FF] to-[#0EA5E9] btn-3d flex-1"
                    >
                      Salvar Alterações
                    </Button>
                    <Button variant="outline" onClick={() => setEditingSubscription(null)} className="border-[#334155]">
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          <Card className="bg-[#1E293B] border-[#334155]">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#94A3B8]">Total mensal de assinaturas</p>
                  <p className="text-xs text-[#64748B] mt-1">
                    {subscriptions.length} assinatura{subscriptions.length !== 1 ? "s" : ""} ativa
                    {subscriptions.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <p className="text-2xl font-bold text-[#F1F5F9]">
                  R${" "}
                  {subscriptions
                    .filter((sub) => sub.frequency === "monthly")
                    .reduce((sum, sub) => sum + sub.amount, 0)
                    .toFixed(2)}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
