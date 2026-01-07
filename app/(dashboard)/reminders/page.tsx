"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Calendar, Clock, Plus, Trash2, MapPin, AlarmClock, Repeat } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function RemindersPage() {
  const [reminders, setReminders] = useState([
    {
      id: 1,
      title: "Reunião com equipe",
      description: "Discutir o progresso do projeto Q1",
      date: "2025-01-15",
      time: "14:00",
      category: "work",
      priority: "high",
      geolocation: false,
    },
    {
      id: 2,
      title: "Pagar conta de luz",
      description: "Vencimento da fatura",
      date: "2025-01-20",
      time: "10:00",
      category: "urgent",
      priority: "high",
      geolocation: false,
    },
    {
      id: 3,
      title: "Aniversário da Maria",
      description: "Comprar presente",
      date: "2025-01-25",
      time: "09:00",
      category: "home",
      priority: "medium",
      geolocation: true,
    },
    {
      id: 4,
      title: "Renovar assinatura",
      description: "Licença expira hoje",
      date: "2025-01-12",
      time: "16:00",
      category: "work",
      priority: "medium",
      geolocation: false,
    },
  ])

  const [isAddingReminder, setIsAddingReminder] = useState(false)
  const [isEditingReminder, setIsEditingReminder] = useState(false)
  const [editingReminder, setEditingReminder] = useState<any>(null)
  const [newReminder, setNewReminder] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    category: "work",
    priority: "medium",
    geolocation: false,
  })

  const deleteReminder = (id: number) => {
    setReminders(reminders.filter((r) => r.id !== id))
  }

  const snoozeReminder = (id: number, hours: number) => {
    setReminders(
      reminders.map((r) => {
        if (r.id === id) {
          const currentDate = new Date(`${r.date}T${r.time}`)
          currentDate.setHours(currentDate.getHours() + hours)
          return {
            ...r,
            date: currentDate.toISOString().split("T")[0],
            time: currentDate.toTimeString().slice(0, 5),
          }
        }
        return r
      }),
    )
  }

  const handleAddReminder = () => {
    if (newReminder.title.trim() && newReminder.date && newReminder.time) {
      const reminder = {
        id: Date.now(),
        ...newReminder,
      }
      setReminders([...reminders, reminder])
      localStorage.setItem("arc360_reminders", JSON.stringify([...reminders, reminder]))
      setNewReminder({
        title: "",
        description: "",
        date: "",
        time: "",
        category: "work",
        priority: "medium",
        geolocation: false,
      })
      setIsAddingReminder(false)
    }
  }

  const handleSaveEdit = () => {
    if (editingReminder) {
      const updatedReminders = reminders.map((r) => (r.id === editingReminder.id ? editingReminder : r))
      setReminders(updatedReminders)
      localStorage.setItem("arc360_reminders", JSON.stringify(updatedReminders))
      setIsEditingReminder(false)
      setEditingReminder(null)
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "urgent":
        return "bg-red-500/10 text-red-400 border-red-500/20"
      case "home":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20"
      case "work":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20"
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20"
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "urgent":
        return "Urgente"
      case "home":
        return "Casa"
      case "work":
        return "Trabalho"
      default:
        return category
    }
  }

  const ReminderCard = ({ reminder }: any) => (
    <Card
      onClick={() => {
        setEditingReminder(JSON.parse(JSON.stringify(reminder)))
        setIsEditingReminder(true)
      }}
      className="p-4 border-[#334155] hover:border-[#00D9FF] transition-all bg-[#1E293B] cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div className="flex gap-4 flex-1">
          <div className="p-3 rounded-lg bg-[#00D9FF]/10">
            <Bell className="w-6 h-6 text-[#00D9FF]" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-[#F1F5F9]">{reminder.title}</h3>
            <p className="text-sm text-[#94A3B8] mt-1">{reminder.description}</p>
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <Badge variant="outline" className={getCategoryColor(reminder.category)}>
                {getCategoryLabel(reminder.category)}
              </Badge>
              {reminder.priority === "high" && (
                <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/20">
                  Alta Prioridade
                </Badge>
              )}
              {reminder.geolocation && (
                <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
                  <MapPin className="w-3 h-3 mr-1" />
                  Geolocalização
                </Badge>
              )}
              <div className="flex items-center gap-1 text-sm text-[#64748B] ml-2">
                <Calendar className="w-4 h-4" />
                {new Date(reminder.date).toLocaleDateString("pt-BR")}
              </div>
              <div className="flex items-center gap-1 text-sm text-[#64748B]">
                <Clock className="w-4 h-4" />
                {reminder.time}
              </div>
            </div>

            <div className="flex items-center gap-2 mt-3">
              <Button
                size="sm"
                variant="outline"
                className="text-xs border-[#334155] hover:bg-[#00D9FF]/10 hover:border-[#00D9FF] bg-transparent"
                onClick={() => snoozeReminder(reminder.id, 1)}
              >
                <AlarmClock className="w-3 h-3 mr-1" />
                Adiar 1h
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-xs border-[#334155] hover:bg-[#00D9FF]/10 hover:border-[#00D9FF] bg-transparent"
                onClick={() => snoozeReminder(reminder.id, 24)}
              >
                <Repeat className="w-3 h-3 mr-1" />
                Adiar para amanhã
              </Button>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => deleteReminder(reminder.id)}
          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  )

  const urgentReminders = reminders.filter((r) => r.category === "urgent")
  const homeReminders = reminders.filter((r) => r.category === "home")
  const workReminders = reminders.filter((r) => r.category === "work")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Lembretes
          </h1>
          <p className="text-muted-foreground mt-1">Nunca esqueça de compromissos importantes</p>
        </div>
        <Dialog open={isAddingReminder} onOpenChange={setIsAddingReminder}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-500 btn-3d">
              <Plus className="w-4 h-4 mr-2" />
              Novo Lembrete
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-[#1E293B] border-[#334155] text-[#F1F5F9]">
            <DialogHeader>
              <DialogTitle className="text-2xl">Criar Novo Lembrete</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium text-[#94A3B8]">Título</label>
                <input
                  type="text"
                  value={newReminder.title}
                  onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                  className="w-full mt-1 px-4 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
                  placeholder="Ex: Reunião com equipe"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#94A3B8]">Descrição</label>
                <textarea
                  value={newReminder.description}
                  onChange={(e) => setNewReminder({ ...newReminder, description: e.target.value })}
                  className="w-full mt-1 px-4 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#00D9FF] resize-none"
                  rows={2}
                  placeholder="Detalhes do lembrete..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-[#94A3B8]">Data</label>
                  <input
                    type="date"
                    value={newReminder.date}
                    onChange={(e) => setNewReminder({ ...newReminder, date: e.target.value })}
                    className="w-full mt-1 px-4 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-[#94A3B8]">Hora</label>
                  <input
                    type="time"
                    value={newReminder.time}
                    onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
                    className="w-full mt-1 px-4 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-[#94A3B8]">Categoria</label>
                  <select
                    value={newReminder.category}
                    onChange={(e) => setNewReminder({ ...newReminder, category: e.target.value })}
                    className="w-full mt-1 px-4 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
                  >
                    <option value="work">Trabalho</option>
                    <option value="home">Casa</option>
                    <option value="urgent">Urgente</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-[#94A3B8]">Prioridade</label>
                  <select
                    value={newReminder.priority}
                    onChange={(e) => setNewReminder({ ...newReminder, priority: e.target.value })}
                    className="w-full mt-1 px-4 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
                  >
                    <option value="low">Baixa</option>
                    <option value="medium">Média</option>
                    <option value="high">Alta</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newReminder.geolocation}
                  onChange={(e) => setNewReminder({ ...newReminder, geolocation: e.target.checked })}
                  className="w-5 h-5 rounded border-[#334155] bg-[#0F172A] checked:bg-[#00D9FF]"
                />
                <label className="text-sm text-[#94A3B8]">Ativar Geolocalização</label>
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleAddReminder}
                  className="bg-gradient-to-r from-[#00D9FF] to-[#0EA5E9] btn-3d flex-1"
                >
                  Criar Lembrete
                </Button>
                <Button variant="outline" onClick={() => setIsAddingReminder(false)} className="border-[#334155]">
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="bg-[#1E293B] border border-[#334155]">
          <TabsTrigger value="all" className="data-[state=active]:bg-[#00D9FF] data-[state=active]:text-[#0F172A]">
            Todos ({reminders.length})
          </TabsTrigger>
          <TabsTrigger value="urgent" className="data-[state=active]:bg-[#00D9FF] data-[state=active]:text-[#0F172A]">
            Urgente ({urgentReminders.length})
          </TabsTrigger>
          <TabsTrigger value="home" className="data-[state=active]:bg-[#00D9FF] data-[state=active]:text-[#0F172A]">
            Casa ({homeReminders.length})
          </TabsTrigger>
          <TabsTrigger value="work" className="data-[state=active]:bg-[#00D9FF] data-[state=active]:text-[#0F172A]">
            Trabalho ({workReminders.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-3">
          {reminders
            .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime())
            .map((reminder) => (
              <ReminderCard key={reminder.id} reminder={reminder} />
            ))}
        </TabsContent>

        <TabsContent value="urgent" className="space-y-3">
          {urgentReminders.map((reminder) => (
            <ReminderCard key={reminder.id} reminder={reminder} />
          ))}
        </TabsContent>

        <TabsContent value="home" className="space-y-3">
          {homeReminders.map((reminder) => (
            <ReminderCard key={reminder.id} reminder={reminder} />
          ))}
        </TabsContent>

        <TabsContent value="work" className="space-y-3">
          {workReminders.map((reminder) => (
            <ReminderCard key={reminder.id} reminder={reminder} />
          ))}
        </TabsContent>
      </Tabs>

      <Dialog open={isEditingReminder} onOpenChange={setIsEditingReminder}>
        <DialogContent className="max-w-2xl bg-[#1E293B] border-[#334155] text-[#F1F5F9]">
          <DialogHeader>
            <DialogTitle className="text-2xl">Editar Lembrete</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium text-[#94A3B8]">Título</label>
              <input
                type="text"
                value={editingReminder?.title || ""}
                onChange={(e) => setEditingReminder({ ...editingReminder, title: e.target.value })}
                className="w-full mt-1 px-4 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#94A3B8]">Descrição</label>
              <textarea
                value={editingReminder?.description || ""}
                onChange={(e) => setEditingReminder({ ...editingReminder, description: e.target.value })}
                className="w-full mt-1 px-4 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#00D9FF] resize-none"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-[#94A3B8]">Data</label>
                <input
                  type="date"
                  value={editingReminder?.date || ""}
                  onChange={(e) => setEditingReminder({ ...editingReminder, date: e.target.value })}
                  className="w-full mt-1 px-4 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#94A3B8]">Hora</label>
                <input
                  type="time"
                  value={editingReminder?.time || ""}
                  onChange={(e) => setEditingReminder({ ...editingReminder, time: e.target.value })}
                  className="w-full mt-1 px-4 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-[#94A3B8]">Categoria</label>
                <select
                  value={editingReminder?.category || ""}
                  onChange={(e) => setEditingReminder({ ...editingReminder, category: e.target.value })}
                  className="w-full mt-1 px-4 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
                >
                  <option value="work">Trabalho</option>
                  <option value="home">Casa</option>
                  <option value="urgent">Urgente</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-[#94A3B8]">Prioridade</label>
                <select
                  value={editingReminder?.priority || ""}
                  onChange={(e) => setEditingReminder({ ...editingReminder, priority: e.target.value })}
                  className="w-full mt-1 px-4 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
                >
                  <option value="low">Baixa</option>
                  <option value="medium">Média</option>
                  <option value="high">Alta</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={editingReminder?.geolocation || false}
                onChange={(e) => setEditingReminder({ ...editingReminder, geolocation: e.target.checked })}
                className="w-5 h-5 rounded border-[#334155] bg-[#0F172A] checked:bg-[#00D9FF]"
              />
              <label className="text-sm text-[#94A3B8]">Ativar Geolocalização</label>
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleSaveEdit} className="bg-gradient-to-r from-[#00D9FF] to-[#0EA5E9] btn-3d flex-1">
                Salvar Alterações
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditingReminder(false)
                  setEditingReminder(null)
                }}
                className="border-[#334155]"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
