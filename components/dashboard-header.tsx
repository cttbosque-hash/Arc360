"use client"

import { Bell, Search, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface DashboardHeaderProps {
  user: {
    name: string
  }
}

interface Notification {
  id: string
  title: string
  message: string
  time: string
  read: boolean
  type: "info" | "success" | "warning" | "error"
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [briefingOpen, setBriefingOpen] = useState(false)
  const [briefingData, setBriefingData] = useState<any>(null)

  useEffect(() => {
    const savedNotifications = localStorage.getItem("arc360_notifications")
    if (savedNotifications) {
      const parsed = JSON.parse(savedNotifications)
      setNotifications(parsed)
      setUnreadCount(parsed.filter((n: Notification) => !n.read).length)
    } else {
      // Notificações de exemplo
      const exampleNotifications: Notification[] = [
        {
          id: "1",
          title: "Tarefa concluída",
          message: "Você completou 'Revisar relatório financeiro'",
          time: "Há 5 minutos",
          read: false,
          type: "success",
        },
        {
          id: "2",
          title: "Novo hábito registrado",
          message: "Parabéns! Você manteve sua sequência de 7 dias",
          time: "Há 1 hora",
          read: false,
          type: "info",
        },
        {
          id: "3",
          title: "Meta financeira atualizada",
          message: "Você está 25% mais próximo da sua meta",
          time: "Há 3 horas",
          read: false,
          type: "success",
        },
        {
          id: "4",
          title: "Lembrete próximo",
          message: "Reunião às 15:00 hoje",
          time: "Há 2 horas",
          read: true,
          type: "warning",
        },
      ]
      setNotifications(exampleNotifications)
      setUnreadCount(exampleNotifications.filter((n) => !n.read).length)
      localStorage.setItem("arc360_notifications", JSON.stringify(exampleNotifications))
    }
  }, [])

  const markAsRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    setNotifications(updated)
    setUnreadCount(updated.filter((n) => !n.read).length)
    localStorage.setItem("arc360_notifications", JSON.stringify(updated))
  }

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }))
    setNotifications(updated)
    setUnreadCount(0)
    localStorage.setItem("arc360_notifications", JSON.stringify(updated))
  }

  const clearNotifications = () => {
    setNotifications([])
    setUnreadCount(0)
    localStorage.removeItem("arc360_notifications")
  }

  const generateBriefing = () => {
    const tasks = JSON.parse(localStorage.getItem("arc360_tasks") || "[]")
    const habits = JSON.parse(localStorage.getItem("arc360_habits") || "[]")
    const projects = JSON.parse(localStorage.getItem("arc360_projects") || "[]")
    const transactions = JSON.parse(localStorage.getItem("arc360_transactions") || "[]")
    const reminders = JSON.parse(localStorage.getItem("arc360_reminders") || "[]")
    const journalEntries = JSON.parse(localStorage.getItem("arc360_journal_entries") || "[]")
    const braindump = JSON.parse(localStorage.getItem("arc360_braindump") || "[]")

    const userData = JSON.parse(localStorage.getItem("user") || "{}")

    // Calculate statistics
    const completedTasks = tasks.filter((t: any) => t.completed).length
    const totalTasks = tasks.length
    const pendingTasks = totalTasks - completedTasks

    const todayHabits = habits.filter((h: any) => {
      const today = new Date().toISOString().split("T")[0]
      return h.completedDates?.includes(today)
    }).length

    const activeProjects = projects.filter((p: any) => p.status === "active").length

    const totalIncome = transactions
      .filter((t: any) => t.type === "income")
      .reduce((sum: number, t: any) => sum + Number(t.amount), 0)

    const totalExpenses = transactions
      .filter((t: any) => t.type === "expense")
      .reduce((sum: number, t: any) => sum + Number(t.amount), 0)

    const balance = totalIncome - totalExpenses

    const urgentReminders = reminders.filter((r: any) => r.category === "urgent").length

    const recentJournalEntry = journalEntries[journalEntries.length - 1]

    const briefing = {
      summary: `Olá ${userData.nickname || userData.name}! Aqui está um resumo completo da sua conta ARC 360.`,
      tasks: {
        total: totalTasks,
        completed: completedTasks,
        pending: pendingTasks,
        completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      },
      habits: {
        total: habits.length,
        completedToday: todayHabits,
      },
      projects: {
        total: projects.length,
        active: activeProjects,
      },
      finance: {
        totalIncome,
        totalExpenses,
        balance,
        status: balance >= 0 ? "positive" : "negative",
      },
      reminders: {
        total: reminders.length,
        urgent: urgentReminders,
      },
      journal: {
        totalEntries: journalEntries.length,
        lastEntry: recentJournalEntry?.date || "Nenhuma entrada ainda",
        lastMood: recentJournalEntry?.mood || null,
      },
      braindump: {
        total: braindump.length,
      },
    }

    setBriefingData(briefing)
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "success":
        return "text-green-400"
      case "warning":
        return "text-yellow-400"
      case "error":
        return "text-red-400"
      default:
        return "text-[#00D9FF]"
    }
  }

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Bom dia"
    if (hour < 18) return "Boa tarde"
    return "Boa noite"
  }

  return (
    <header className="h-16 bg-[#1E293B]/50 backdrop-blur-xl border-b border-[#334155] px-6 flex items-center justify-between">
      <div className="flex-1" />

      <div className="flex items-center gap-4">
        <div className="relative w-80 hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#64748B]" />
          <Input
            placeholder="Buscar em tudo..."
            className="pl-10 bg-[#0F172A]/50 border-[#334155] text-[#F1F5F9] placeholder:text-[#64748B]"
          />
        </div>

        <Dialog open={briefingOpen} onOpenChange={setBriefingOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={generateBriefing}
              className="btn-3d bg-gradient-to-r from-[#00D9FF] to-[#06D6A0] hover:from-[#00C3E6] hover:to-[#05C390] text-[#0A0E27] font-semibold shadow-lg"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Briefing Inteligente
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#131729] border-[#1E293B] text-[#F1F5F9] max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl bg-gradient-to-r from-[#00D9FF] to-[#06D6A0] bg-clip-text text-transparent flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-[#00D9FF]" />
                Briefing Inteligente
              </DialogTitle>
            </DialogHeader>

            {briefingData && (
              <div className="space-y-6 py-4">
                <p className="text-[#94A3B8] text-lg">{briefingData.summary}</p>

                <Separator className="bg-[#1E293B]" />

                {/* Tasks Summary */}
                <Card className="bg-[#0F172A] border-[#1E293B]">
                  <CardHeader>
                    <CardTitle className="text-[#00D9FF] flex items-center gap-2">📋 Tarefas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-[#94A3B8]">Total de tarefas:</span>
                      <span className="text-[#F1F5F9] font-semibold">{briefingData.tasks.total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#94A3B8]">Concluídas:</span>
                      <span className="text-green-400 font-semibold">{briefingData.tasks.completed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#94A3B8]">Pendentes:</span>
                      <span className="text-yellow-400 font-semibold">{briefingData.tasks.pending}</span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-[#1E293B]">
                      <div className="flex justify-between items-center">
                        <span className="text-[#94A3B8]">Taxa de conclusão:</span>
                        <Badge className="bg-[#00D9FF]/20 text-[#00D9FF]">{briefingData.tasks.completionRate}%</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Habits Summary */}
                <Card className="bg-[#0F172A] border-[#1E293B]">
                  <CardHeader>
                    <CardTitle className="text-[#06D6A0] flex items-center gap-2">🎯 Hábitos</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-[#94A3B8]">Total de hábitos:</span>
                      <span className="text-[#F1F5F9] font-semibold">{briefingData.habits.total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#94A3B8]">Completados hoje:</span>
                      <span className="text-[#06D6A0] font-semibold">{briefingData.habits.completedToday}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Projects Summary */}
                <Card className="bg-[#0F172A] border-[#1E293B]">
                  <CardHeader>
                    <CardTitle className="text-purple-400 flex items-center gap-2">📁 Projetos</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-[#94A3B8]">Total de projetos:</span>
                      <span className="text-[#F1F5F9] font-semibold">{briefingData.projects.total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#94A3B8]">Projetos ativos:</span>
                      <span className="text-purple-400 font-semibold">{briefingData.projects.active}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Finance Summary */}
                <Card className="bg-[#0F172A] border-[#1E293B]">
                  <CardHeader>
                    <CardTitle className="text-emerald-400 flex items-center gap-2">💰 Finanças</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-[#94A3B8]">Receitas:</span>
                      <span className="text-green-400 font-semibold">
                        R$ {briefingData.finance.totalIncome.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#94A3B8]">Despesas:</span>
                      <span className="text-red-400 font-semibold">
                        R$ {briefingData.finance.totalExpenses.toFixed(2)}
                      </span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-[#1E293B]">
                      <div className="flex justify-between items-center">
                        <span className="text-[#94A3B8] font-semibold">Saldo:</span>
                        <span
                          className={`font-bold text-lg ${briefingData.finance.status === "positive" ? "text-green-400" : "text-red-400"}`}
                        >
                          R$ {briefingData.finance.balance.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Other Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-[#0F172A] border-[#1E293B]">
                    <CardHeader>
                      <CardTitle className="text-orange-400 text-sm">🔔 Lembretes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-[#94A3B8] text-sm">Total: {briefingData.reminders.total}</p>
                      <p className="text-red-400 text-sm font-semibold">Urgentes: {briefingData.reminders.urgent}</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-[#0F172A] border-[#1E293B]">
                    <CardHeader>
                      <CardTitle className="text-blue-400 text-sm">📖 Diário</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-[#94A3B8] text-sm">Entradas: {briefingData.journal.totalEntries}</p>
                      {briefingData.journal.lastMood && (
                        <p className="text-sm">Último humor: {briefingData.journal.lastMood}</p>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-gradient-to-r from-[#00D9FF]/10 to-[#06D6A0]/10 border-[#00D9FF]/30">
                  <CardContent className="p-4">
                    <p className="text-[#00D9FF] text-center font-medium">
                      Continue assim! Você está no caminho certo para alcançar seus objetivos. 🚀
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#334155] relative"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-[#06D6A0] rounded-full text-xs flex items-center justify-center text-white font-semibold">
                  {unreadCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-96 bg-[#131729] border-[#1E293B] p-0" align="end">
            <div className="p-4 border-b border-[#1E293B] flex items-center justify-between">
              <h3 className="font-semibold text-[#F1F5F9]">Notificações</h3>
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs text-[#00D9FF] hover:text-[#00D9FF] hover:bg-[#1E293B]"
                  >
                    Marcar todas como lidas
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearNotifications}
                  className="text-xs text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#1E293B]"
                >
                  Limpar
                </Button>
              </div>
            </div>
            <ScrollArea className="h-[400px]">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-[#64748B]">
                  <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Nenhuma notificação</p>
                </div>
              ) : (
                <div className="divide-y divide-[#1E293B]">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-[#1E293B] cursor-pointer transition-colors ${!notification.read ? "bg-[#0F172A]" : ""}`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-2 h-2 rounded-full mt-2 ${!notification.read ? "bg-[#06D6A0]" : "bg-transparent"}`}
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-1">
                            <h4 className={`font-medium ${getTypeColor(notification.type)}`}>{notification.title}</h4>
                            {!notification.read && (
                              <Badge className="bg-[#06D6A0]/10 text-[#06D6A0] border-[#06D6A0]/20 text-xs">Nova</Badge>
                            )}
                          </div>
                          <p className="text-sm text-[#94A3B8] mb-2">{notification.message}</p>
                          <p className="text-xs text-[#64748B]">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  )
}
