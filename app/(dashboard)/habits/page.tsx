"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Check, Flame, Target, TrendingUp, Sparkles, Plus, Pencil } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { storage, STORAGE_KEYS } from "@/lib/storage"

export default function HabitsPage() {
  const [habits, setHabits] = useState([
    {
      id: 1,
      name: "Meditar",
      icon: "🧘",
      streak: 15,
      goal: 30,
      completedToday: false,
      frequency: "Diário",
      category: "Bem-estar",
      weekProgress: [true, true, true, true, true, false, true],
      completedDates: [], // Array de datas no formato ISO
    },
    {
      id: 2,
      name: "Exercício Físico",
      icon: "💪",
      streak: 8,
      goal: 21,
      completedToday: false,
      frequency: "Diário",
      category: "Saúde",
      weekProgress: [true, false, true, true, true, false, false],
      completedDates: [],
    },
    {
      id: 3,
      name: "Ler 30 minutos",
      icon: "📚",
      streak: 22,
      goal: 30,
      completedToday: false,
      frequency: "Diário",
      category: "Desenvolvimento",
      weekProgress: [true, true, true, true, true, true, true],
      completedDates: [],
    },
    {
      id: 4,
      name: "Beber 2L de água",
      icon: "💧",
      streak: 12,
      goal: 30,
      completedToday: false,
      frequency: "Diário",
      category: "Saúde",
      weekProgress: [true, true, false, true, true, true, false],
      completedDates: [],
    },
  ])

  useEffect(() => {
    const loadedHabits = storage.get(STORAGE_KEYS.HABITS, [])
    const today = new Date().toISOString().split("T")[0]

    if (loadedHabits.length > 0) {
      const updated = loadedHabits.map((habit: any) => ({
        ...habit,
        completedToday: habit.completedDates?.includes(today) || false,
      }))
      setHabits(updated)
    }
  }, [])

  useEffect(() => {
    if (habits.length > 0) {
      storage.set(STORAGE_KEYS.HABITS, habits)
    }
  }, [habits])

  const [celebratingId, setCelebratingId] = useState<number | null>(null)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingHabit, setEditingHabit] = useState<number | null>(null)
  const [habitForm, setHabitForm] = useState({
    name: "",
    icon: "🎯",
    goal: 30,
    frequency: "Diário",
    category: "Bem-estar",
  })

  const toggleHabit = (id: number) => {
    const today = new Date().toISOString().split("T")[0]

    setHabits(
      habits.map((habit) => {
        if (habit.id !== id) return habit

        const isCompleting = !habit.completedToday
        let newCompletedDates = [...(habit.completedDates || [])]

        if (isCompleting) {
          if (!newCompletedDates.includes(today)) {
            newCompletedDates.push(today)
          }
          setCelebratingId(id)
          setTimeout(() => setCelebratingId(null), 1000)
        } else {
          newCompletedDates = newCompletedDates.filter((date) => date !== today)
        }

        const sortedDates = newCompletedDates.sort().reverse()
        let newStreak = 0

        if (sortedDates.length > 0) {
          const todayDate = new Date()
          const checkDate = new Date(todayDate)

          if (!isCompleting) {
            checkDate.setDate(checkDate.getDate() - 1)
          }

          while (true) {
            const dateStr = checkDate.toISOString().split("T")[0]
            if (sortedDates.includes(dateStr)) {
              newStreak++
              checkDate.setDate(checkDate.getDate() - 1)
            } else {
              break
            }
          }
        }

        const newWeekProgress = []
        const todayDate = new Date()
        const currentDayOfWeek = todayDate.getDay() // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado

        // Calcular o início da semana (segunda-feira)
        const startOfWeek = new Date(todayDate)
        const daysToMonday = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1
        startOfWeek.setDate(todayDate.getDate() - daysToMonday)

        // Verificar cada dia da semana de segunda a domingo
        for (let i = 0; i < 7; i++) {
          const date = new Date(startOfWeek)
          date.setDate(startOfWeek.getDate() + i)
          const dateStr = date.toISOString().split("T")[0]
          newWeekProgress.push(newCompletedDates.includes(dateStr))
        }

        return {
          ...habit,
          completedToday: isCompleting,
          completedDates: newCompletedDates,
          streak: newStreak,
          weekProgress: newWeekProgress,
        }
      }),
    )
  }

  const openAddDialog = () => {
    setEditingHabit(null)
    setHabitForm({
      name: "",
      icon: "🎯",
      goal: 30,
      frequency: "Diário",
      category: "Bem-estar",
    })
    setIsDialogOpen(true)
  }

  const openEditDialog = (habit: any) => {
    setEditingHabit(habit.id)
    setHabitForm({
      name: habit.name,
      icon: habit.icon,
      goal: habit.goal,
      frequency: habit.frequency,
      category: habit.category,
    })
    setIsDialogOpen(true)
  }

  const saveHabit = () => {
    if (!habitForm.name.trim()) return

    if (editingHabit) {
      setHabits(habits.map((h) => (h.id === editingHabit ? { ...h, ...habitForm } : h)))
    } else {
      const newHabit = {
        id: Math.max(...habits.map((h) => h.id), 0) + 1,
        ...habitForm,
        streak: 0,
        completedToday: false,
        weekProgress: [false, false, false, false, false, false, false],
        completedDates: [],
      }
      setHabits([...habits, newHabit])
    }

    setIsDialogOpen(false)
  }

  const generateHeatmapData = () => {
    const days = []
    const allCompletedDates = habits.flatMap((h) => h.completedDates || [])

    for (let i = 29; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split("T")[0]

      const completedCount = allCompletedDates.filter((d) => d === dateStr).length
      const intensity = Math.min(Math.floor((completedCount / habits.length) * 4), 3)

      days.push({
        date: dateStr,
        completed: completedCount > 0,
        intensity: intensity,
      })
    }
    return days
  }

  const heatmapData = generateHeatmapData()

  const totalHabits = habits.length
  const completedToday = habits.filter((h) => h.completedToday).length
  const avgStreak = Math.round(habits.reduce((acc, h) => acc + h.streak, 0) / habits.length)
  const longestStreak = Math.max(...habits.map((h) => h.streak))

  const iconOptions = ["🎯", "🧘", "💪", "📚", "💧", "🏃", "🍎", "😴", "🎨", "💼", "🎵", "🌱"]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Hábitos
          </h1>
          <p className="text-muted-foreground mt-1">Construa uma rotina consistente e alcance seus objetivos</p>
        </div>
        <Button
          onClick={openAddDialog}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Hábito
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingHabit ? "Editar Hábito" : "Novo Hábito"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Hábito</Label>
              <Input
                id="name"
                value={habitForm.name}
                onChange={(e) => setHabitForm({ ...habitForm, name: e.target.value })}
                placeholder="Ex: Meditar 10 minutos"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon">Ícone</Label>
              <Select value={habitForm.icon} onValueChange={(value) => setHabitForm({ ...habitForm, icon: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((icon) => (
                    <SelectItem key={icon} value={icon}>
                      <span className="text-2xl">{icon}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select
                value={habitForm.category}
                onValueChange={(value) => setHabitForm({ ...habitForm, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bem-estar">Bem-estar</SelectItem>
                  <SelectItem value="Saúde">Saúde</SelectItem>
                  <SelectItem value="Desenvolvimento">Desenvolvimento</SelectItem>
                  <SelectItem value="Produtividade">Produtividade</SelectItem>
                  <SelectItem value="Financeiro">Financeiro</SelectItem>
                  <SelectItem value="Social">Social</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="frequency">Frequência</Label>
              <Select
                value={habitForm.frequency}
                onValueChange={(value) => setHabitForm({ ...habitForm, frequency: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Diário">Diário</SelectItem>
                  <SelectItem value="Semanal">Semanal</SelectItem>
                  <SelectItem value="Mensal">Mensal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="goal">Meta (dias)</Label>
              <Input
                id="goal"
                type="number"
                value={habitForm.goal}
                onChange={(e) => setHabitForm({ ...habitForm, goal: Number.parseInt(e.target.value) || 30 })}
                min="1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={saveHabit} className="bg-gradient-to-r from-blue-500 to-purple-500">
              {editingHabit ? "Salvar Alterações" : "Adicionar Hábito"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4 border-border/50 bg-gradient-to-br from-blue-500/5 to-blue-600/5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Target className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Hoje</p>
              <p className="text-2xl font-bold">
                {completedToday}/{totalHabits}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-border/50 bg-gradient-to-br from-orange-500/5 to-orange-600/5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-500/10">
              <Flame className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Maior Sequência</p>
              <p className="text-2xl font-bold">{longestStreak} dias</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-border/50 bg-gradient-to-br from-purple-500/5 to-purple-600/5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Média Sequência</p>
              <p className="text-2xl font-bold">{avgStreak} dias</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-border/50 bg-gradient-to-br from-green-500/5 to-green-600/5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <Check className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Taxa de Conclusão</p>
              <p className="text-2xl font-bold">{Math.round((completedToday / totalHabits) * 100)}%</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6 border-border/50">
        <h3 className="text-lg font-semibold mb-4">Consistência dos Últimos 30 Dias</h3>
        <div className="flex gap-1 flex-wrap">
          {heatmapData.map((day, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-sm ${
                day.intensity === 0
                  ? "bg-gray-800"
                  : day.intensity === 1
                    ? "bg-green-900/50"
                    : day.intensity === 2
                      ? "bg-green-600/70"
                      : "bg-green-500"
              }`}
              title={`${day.date}: ${day.completed ? "Completo" : "Incompleto"}`}
            />
          ))}
        </div>
        <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
          <span>Menos</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-sm bg-gray-800" />
            <div className="w-3 h-3 rounded-sm bg-green-900/50" />
            <div className="w-3 h-3 rounded-sm bg-green-600/70" />
            <div className="w-3 h-3 rounded-sm bg-green-500" />
          </div>
          <span>Mais</span>
        </div>
      </Card>

      <div className="grid gap-4">
        {habits.map((habit) => (
          <Card
            key={habit.id}
            className="p-6 border-border/50 hover:border-blue-500/50 transition-all relative overflow-hidden"
          >
            {celebratingId === habit.id && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-green-500/20 animate-ping" />
                {[...Array(20)].map((_, i) => (
                  <Sparkles
                    key={i}
                    className="absolute text-yellow-400 animate-bounce"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 0.5}s`,
                    }}
                  />
                ))}
              </div>
            )}

            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="text-4xl">{habit.icon}</div>
                <div>
                  <h3 className="text-xl font-semibold">{habit.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                      {habit.category}
                    </Badge>
                    <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/20">
                      {habit.frequency}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => openEditDialog(habit)}
                  variant="ghost"
                  size="icon"
                  className="hover:bg-blue-500/10"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => toggleHabit(habit.id)}
                  variant={habit.completedToday ? "default" : "outline"}
                  className={`transition-all ${habit.completedToday ? "bg-green-500 hover:bg-green-600 scale-105" : ""}`}
                >
                  {habit.completedToday ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Concluído
                    </>
                  ) : (
                    "Marcar como feito"
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Progresso da meta</span>
                  <span className="text-sm font-medium">
                    {habit.streak} / {habit.goal} dias
                  </span>
                </div>
                <Progress value={(habit.streak / habit.goal) * 100} className="h-2" />
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Semana atual (Seg - Dom)</p>
                <div className="flex gap-2">
                  {["S", "T", "Q", "Q", "S", "S", "D"].map((day, index) => (
                    <div key={index} className="flex flex-col items-center gap-1">
                      <span className="text-xs text-muted-foreground">{day}</span>
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                          habit.weekProgress[index]
                            ? "bg-green-500/20 border border-green-500/30 scale-105"
                            : "bg-gray-500/10 border border-gray-500/20"
                        }`}
                      >
                        {habit.weekProgress[index] && <Check className="w-5 h-5 text-green-400" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <div className="relative">
                  <Flame
                    className={`w-6 h-6 ${habit.streak > 7 ? "text-orange-500 animate-pulse" : "text-orange-400"}`}
                  />
                  {habit.streak > 14 && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full animate-ping" />
                  )}
                </div>
                <span className="text-sm">
                  <span className="font-semibold text-orange-400 text-lg">{habit.streak} dias</span>
                  <span className="text-muted-foreground"> de sequência!</span>
                  {habit.streak > 21 && <span className="ml-1 text-yellow-400">🔥 Em chamas!</span>}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
