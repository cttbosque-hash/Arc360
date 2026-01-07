"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sun, Eye, EyeOff, Plus, CheckCircle2, TrendingUp, Target, Flame, Calendar, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  getCurrentUser,
  getTasks,
  createTask,
  getProjects,
  getHabits,
  getTransactions,
  createTransaction,
  createBrainDump,
} from "@/lib/supabaseClient"

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [showBalance, setShowBalance] = useState(true)
  const [fabOpen, setFabOpen] = useState(false)
  const [quickAddType, setQuickAddType] = useState<"task" | "expense" | "note" | null>(null)
  const [loading, setLoading] = useState(true)

  const [tasks, setTasks] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [habits, setHabits] = useState<any[]>([])
  const [transactions, setTransactions] = useState<any[]>([])

  const [taskTitle, setTaskTitle] = useState("")
  const [taskPriority, setTaskPriority] = useState("medium")
  const [expenseDescription, setExpenseDescription] = useState("")
  const [expenseValue, setExpenseValue] = useState("")
  const [expenseCategory, setExpenseCategory] = useState("Alimentação")
  const [noteContent, setNoteContent] = useState("")

  useEffect(() => {
    const loadData = async () => {
      try {
        const currentUser = await getCurrentUser()
        if (!currentUser) {
          window.location.href = "/"
          return
        }

        setUser({
          id: currentUser.id,
          name: currentUser.user_metadata?.full_name || currentUser.email?.split("@")[0],
          nickname: currentUser.user_metadata?.nickname || currentUser.user_metadata?.full_name?.split(" ")[0],
          email: currentUser.email,
        })

        // Load all data in parallel
        const [tasksData, projectsData, habitsData, transactionsData] = await Promise.all([
          getTasks(currentUser.id),
          getProjects(currentUser.id),
          getHabits(currentUser.id),
          getTransactions(currentUser.id),
        ])

        setTasks(tasksData)
        setProjects(projectsData)
        setHabits(habitsData)
        setTransactions(transactionsData)
      } catch (error) {
        console.error("[v0] Error loading dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Bom dia"
    if (hour < 18) return "Boa tarde"
    return "Boa noite"
  }

  const weather = {
    temp: 28,
    condition: "Ensolarado",
    icon: <Sun className="w-6 h-6 text-yellow-400" />,
  }

  const topTask =
    tasks
      .filter((t: any) => t.status !== "done")
      .sort((a: any, b: any) => {
        const priorityOrder: any = { high: 0, medium: 1, low: 2 }
        return priorityOrder[a.priority] - priorityOrder[b.priority]
      })[0] || null

  const habitsCompleted = habits.filter((h: any) => {
    const today = new Date().toISOString().split("T")[0]
    return h.completed_dates?.includes(today)
  }).length
  const habitsTotal = habits.length || 1

  const handleAddTask = async () => {
    if (!taskTitle.trim() || !user) return

    try {
      const newTask = await createTask(user.id, {
        title: taskTitle,
        description: "",
        priority: taskPriority,
        status: "todo",
        due_date: new Date().toISOString().split("T")[0],
        category: "Geral",
      })

      setTasks([...tasks, newTask])
      setTaskTitle("")
      setTaskPriority("medium")
      setQuickAddType(null)
      setFabOpen(false)
    } catch (error) {
      console.error("[v0] Error creating task:", error)
    }
  }

  const handleAddExpense = async () => {
    if (!expenseDescription.trim() || !expenseValue || !user) return

    try {
      const newTransaction = await createTransaction(user.id, {
        type: "expense",
        description: expenseDescription,
        amount: Number.parseFloat(expenseValue),
        category: expenseCategory,
        date: new Date().toISOString().split("T")[0],
      })

      setTransactions([...transactions, newTransaction])
      setExpenseDescription("")
      setExpenseValue("")
      setExpenseCategory("Alimentação")
      setQuickAddType(null)
      setFabOpen(false)
    } catch (error) {
      console.error("[v0] Error creating transaction:", error)
    }
  }

  const handleAddNote = async () => {
    if (!noteContent.trim() || !user) return

    try {
      await createBrainDump(user.id, {
        content: noteContent,
        category: "geral",
      })

      setNoteContent("")
      setQuickAddType(null)
      setFabOpen(false)
    } catch (error) {
      console.error("[v0] Error creating note:", error)
    }
  }

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number.parseFloat(t.amount), 0)
  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number.parseFloat(t.amount), 0)
  const balance = income - expenses

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0A0E27]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#00D9FF] mx-auto mb-4" />
          <p className="text-[#F1F5F9]">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 p-8">
      <div className="bg-gradient-to-r from-[#00D9FF]/10 to-[#0891B2]/10 rounded-2xl p-8 border border-[#00D9FF]/20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-[#F1F5F9] mb-2">
              {getGreeting()}, {user?.nickname || user?.name || "Usuário"}!
            </h1>
            <p className="text-[#94A3B8] text-lg">Vamos fazer de hoje um dia incrível</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-[#131729] rounded-xl p-4 border border-[#1E293B]">
              <div className="flex items-center gap-3">
                {weather.icon}
                <div>
                  <p className="text-2xl font-bold text-[#F1F5F9]">{weather.temp}°C</p>
                  <p className="text-sm text-[#94A3B8]">{weather.condition}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[#131729] rounded-xl p-6 border border-[#1E293B] hover:border-[#00D9FF]/30 transition-all">
          <h3 className="text-sm font-medium text-[#94A3B8] mb-2">Projetos Ativos</h3>
          <p className="text-3xl font-bold text-[#F1F5F9]">{projects.length}</p>
          <p className="text-xs text-[#00D9FF] mt-2">Total de projetos</p>
        </div>

        <div className="bg-[#131729] rounded-xl p-6 border border-[#1E293B] hover:border-[#00D9FF]/30 transition-all">
          <h3 className="text-sm font-medium text-[#94A3B8] mb-2">Hábitos</h3>
          <p className="text-3xl font-bold text-[#F1F5F9]">{habits.length}</p>
          <p className="text-xs text-[#00D9FF] mt-2">{habitsCompleted} concluídos hoje</p>
        </div>

        <div className="bg-[#131729] rounded-xl p-6 border border-[#1E293B] hover:border-[#00D9FF]/30 transition-all">
          <h3 className="text-sm font-medium text-[#94A3B8] mb-2">Tarefas</h3>
          <p className="text-3xl font-bold text-[#F1F5F9]">{tasks.length}</p>
          <p className="text-xs text-[#64748B] mt-2">
            {tasks.filter((t: any) => t.status === "done").length} concluídas
          </p>
        </div>

        <div className="bg-[#131729] rounded-xl p-6 border border-[#1E293B] hover:border-[#00D9FF]/30 transition-all">
          <h3 className="text-sm font-medium text-[#94A3B8] mb-2">Produtividade</h3>
          <p className="text-3xl font-bold text-[#F1F5F9]">
            {tasks.length > 0
              ? Math.round((tasks.filter((t: any) => t.status === "done").length / tasks.length) * 100)
              : 0}
            %
          </p>
          <p className="text-xs text-[#00D9FF] mt-2">Taxa de conclusão</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-[#131729] border-[#1E293B] p-6 hover:border-[#00D9FF]/30 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[#00D9FF]/10 rounded-lg">
              <Target className="w-5 h-5 text-[#00D9FF]" />
            </div>
            <h3 className="text-lg font-semibold text-[#F1F5F9]">Foco do Dia</h3>
          </div>
          {topTask ? (
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#94A3B8] mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-[#F1F5F9] font-medium">{topTask.title}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge
                      className={`${
                        topTask.priority === "high"
                          ? "bg-red-500/10 text-red-400 border-red-500/20"
                          : topTask.priority === "medium"
                            ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                            : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                      }`}
                    >
                      {topTask.priority === "high" ? "Alta" : topTask.priority === "medium" ? "Média" : "Baixa"}{" "}
                      Prioridade
                    </Badge>
                    <Badge className="bg-[#00D9FF]/10 text-[#00D9FF] border-[#00D9FF]/20">Hoje</Badge>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-[#94A3B8] text-sm">Nenhuma tarefa pendente</p>
          )}
        </Card>

        <Card className="bg-[#131729] border-[#1E293B] p-6 hover:border-[#00D9FF]/30 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-[#F1F5F9]">Resumo Financeiro</h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowBalance(!showBalance)}
              className="hover:bg-[#1E293B]"
            >
              {showBalance ? <Eye className="w-4 h-4 text-[#94A3B8]" /> : <EyeOff className="w-4 h-4 text-[#94A3B8]" />}
            </Button>
          </div>
          <div className="space-y-2">
            <div>
              <p className="text-sm text-[#94A3B8]">Saldo Atual</p>
              <p className="text-2xl font-bold text-[#F1F5F9]">
                {showBalance ? `R$ ${balance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : "R$ •••••"}
              </p>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#94A3B8]">Receitas: R$ {income.toFixed(2)}</span>
              <span className="text-[#94A3B8]">Despesas: R$ {expenses.toFixed(2)}</span>
            </div>
          </div>
        </Card>

        <Card className="bg-[#131729] border-[#1E293B] p-6 hover:border-[#00D9FF]/30 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <Flame className="w-5 h-5 text-orange-400" />
            </div>
            <h3 className="text-lg font-semibold text-[#F1F5F9]">Progresso de Hábitos</h3>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle cx="40" cy="40" r="32" stroke="#1E293B" strokeWidth="8" fill="none" />
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${(habitsCompleted / habitsTotal) * 201} 201`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00D9FF" />
                    <stop offset="100%" stopColor="#06D6A0" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-[#F1F5F9]">
                  {habitsCompleted}/{habitsTotal}
                </span>
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#F1F5F9]">{Math.round((habitsCompleted / habitsTotal) * 100)}%</p>
              <p className="text-sm text-[#94A3B8]">Concluídos hoje</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="bg-gradient-to-br from-[#00D9FF]/10 to-[#0891B2]/10 rounded-xl p-8 border border-[#00D9FF]/30">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#F1F5F9] mb-2">Meta Financeira</h2>
            <p className="text-[#94A3B8]">Objetivo: R$ 100.000,00</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-[#F1F5F9]">R$ {balance.toLocaleString("pt-BR")}</p>
            <p className="text-sm text-[#00D9FF]">{((balance / 100000) * 100).toFixed(1)}% alcançado</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="w-full bg-[#1E293B] rounded-full h-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#00D9FF] via-[#0891B2] to-[#06D6A0] h-4 rounded-full transition-all duration-500 shadow-lg shadow-[#00D9FF]/30"
              style={{ width: `${Math.min((balance / 100000) * 100, 100)}%` }}
            />
          </div>

          <div className="flex justify-between text-sm text-[#94A3B8]">
            <span>Faltam R$ {(100000 - balance).toLocaleString("pt-BR")}</span>
            <span>Continue assim!</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#131729] rounded-xl p-6 border border-[#1E293B]">
          <h3 className="text-lg font-semibold text-[#F1F5F9] mb-4">Projetos Recentes</h3>
          <div className="space-y-3">
            {projects.slice(0, 3).map((project: any, i: number) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#F1F5F9]">{project.name}</span>
                  <span className="text-[#94A3B8]">{project.progress || 0}%</span>
                </div>
                <div className="w-full bg-[#0F1629] rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#00D9FF] to-[#0891B2] h-2 rounded-full"
                    style={{ width: `${project.progress || 0}%` }}
                  />
                </div>
              </div>
            ))}
            {projects.length === 0 && <p className="text-[#94A3B8] text-sm">Nenhum projeto criado ainda</p>}
          </div>
        </div>

        <div className="bg-[#131729] rounded-xl p-6 border border-[#1E293B]">
          <h3 className="text-lg font-semibold text-[#F1F5F9] mb-4">Transações Recentes</h3>
          <div className="space-y-3">
            {transactions.slice(0, 3).map((transaction: any, i: number) => (
              <div
                key={i}
                className="p-3 bg-[#0F1629] rounded-lg border border-[#1E293B] hover:border-[#00D9FF]/30 transition-all"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[#F1F5F9] text-sm font-medium">{transaction.description}</p>
                    <p className="text-[#64748B] text-xs">{new Date(transaction.date).toLocaleDateString("pt-BR")}</p>
                  </div>
                  <p
                    className={`text-sm font-bold ${transaction.type === "income" ? "text-green-400" : "text-red-400"}`}
                  >
                    {transaction.type === "income" ? "+" : "-"}R$ {Number.parseFloat(transaction.amount).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
            {transactions.length === 0 && <p className="text-[#94A3B8] text-sm">Nenhuma transação registrada</p>}
          </div>
        </div>
      </div>

      <div className="fixed bottom-8 right-8 z-50">
        <div className="relative">
          {fabOpen && (
            <div className="absolute bottom-20 right-0 space-y-3 mb-2">
              <Button
                onClick={() => setQuickAddType("task")}
                className="bg-[#131729] border border-[#00D9FF]/30 hover:bg-[#1E293B] text-[#F1F5F9] shadow-lg w-48 justify-start"
              >
                <CheckCircle2 className="w-4 h-4 mr-3" />
                Nova Tarefa
              </Button>
              <Button
                onClick={() => setQuickAddType("expense")}
                className="bg-[#131729] border border-[#00D9FF]/30 hover:bg-[#1E293B] text-[#F1F5F9] shadow-lg w-48 justify-start"
              >
                <TrendingUp className="w-4 h-4 mr-3" />
                Novo Gasto
              </Button>
              <Button
                onClick={() => setQuickAddType("note")}
                className="bg-[#131729] border border-[#00D9FF]/30 hover:bg-[#1E293B] text-[#F1F5F9] shadow-lg w-48 justify-start"
              >
                <Calendar className="w-4 h-4 mr-3" />
                Nova Nota
              </Button>
            </div>
          )}

          <Button
            onClick={() => setFabOpen(!fabOpen)}
            className="w-16 h-16 rounded-full bg-gradient-to-r from-[#00D9FF] to-[#06D6A0] hover:from-[#00C3E6] hover:to-[#05C399] shadow-2xl shadow-[#00D9FF]/50"
          >
            <Plus className={`w-8 h-8 transition-transform ${fabOpen ? "rotate-45" : ""}`} />
          </Button>
        </div>
      </div>

      <Dialog open={quickAddType !== null} onOpenChange={() => setQuickAddType(null)}>
        <DialogContent className="bg-[#0F1629] border-[#1E293B]">
          <DialogHeader>
            <DialogTitle className="text-[#F1F5F9]">
              {quickAddType === "task" && "Nova Tarefa Rápida"}
              {quickAddType === "expense" && "Novo Gasto"}
              {quickAddType === "note" && "Nova Nota"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {quickAddType === "task" && (
              <>
                <Input
                  placeholder="Título da tarefa..."
                  className="bg-[#131729] border-[#1E293B] text-[#F1F5F9]"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                />
                <Select value={taskPriority} onValueChange={setTaskPriority}>
                  <SelectTrigger className="bg-[#131729] border-[#1E293B] text-[#F1F5F9]">
                    <SelectValue placeholder="Prioridade" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#131729] border-[#1E293B]">
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="low">Baixa</SelectItem>
                  </SelectContent>
                </Select>
              </>
            )}
            {quickAddType === "expense" && (
              <>
                <Input
                  placeholder="Descrição..."
                  className="bg-[#131729] border-[#1E293B] text-[#F1F5F9]"
                  value={expenseDescription}
                  onChange={(e) => setExpenseDescription(e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Valor"
                  className="bg-[#131729] border-[#1E293B] text-[#F1F5F9]"
                  value={expenseValue}
                  onChange={(e) => setExpenseValue(e.target.value)}
                />
                <Select value={expenseCategory} onValueChange={setExpenseCategory}>
                  <SelectTrigger className="bg-[#131729] border-[#1E293B] text-[#F1F5F9]">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#131729] border-[#1E293B]">
                    <SelectItem value="Alimentação">Alimentação</SelectItem>
                    <SelectItem value="Transporte">Transporte</SelectItem>
                    <SelectItem value="Lazer">Lazer</SelectItem>
                    <SelectItem value="Saúde">Saúde</SelectItem>
                  </SelectContent>
                </Select>
              </>
            )}
            {quickAddType === "note" && (
              <Textarea
                placeholder="Escreva sua nota aqui..."
                className="bg-[#131729] border-[#1E293B] text-[#F1F5F9] min-h-[120px]"
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
              />
            )}
            <div className="flex gap-2">
              <Button
                onClick={
                  quickAddType === "task"
                    ? handleAddTask
                    : quickAddType === "expense"
                      ? handleAddExpense
                      : handleAddNote
                }
                className="flex-1 bg-gradient-to-r from-[#00D9FF] to-[#0891B2]"
              >
                Adicionar
              </Button>
              <Button variant="outline" onClick={() => setQuickAddType(null)} className="border-[#1E293B]">
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
