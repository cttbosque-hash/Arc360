"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Plus,
  CalendarIcon,
  List,
  Kanban,
  ChevronDown,
  ChevronRight,
  Edit2,
  Trash2,
  Star,
  X,
  Loader2,
} from "lucide-react"
import { getTasks, createTask, updateTask, deleteTask } from "@/lib/supabase-helpers"
import { useAuth } from "@/lib/auth-context"
import { TaskListView } from "@/components/tasks/task-list-view"

export default function TasksPage() {
  const { user } = useAuth()
  const [view, setView] = useState<"list" | "kanban" | "calendar">("list")
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<any>(null)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    due_date: new Date().toISOString().split("T")[0],
    category: "Geral",
    subtasks: [] as { id: string; title: string; completed: boolean }[],
  })
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("")
  const [expandedTasks, setExpandedTasks] = useState<string[]>([])

  useEffect(() => {
    if (!user) return

    const loadTasks = async () => {
      try {
        setLoading(true)
        const data = await getTasks(user.id)
        setTasks(data)
      } catch (error) {
        console.error("[Tasks] Error loading tasks:", error)
      } finally {
        setLoading(false)
      }
    }

    loadTasks()
  }, [user])

  const handleAddTask = async () => {
    if (!user || !newTask.title.trim()) return

    try {
      const taskData = {
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority as "high" | "medium" | "low",
        due_date: newTask.due_date,
        category: newTask.category,
        status: "todo" as "todo" | "doing" | "done",
        is_favorite: false,
        subtasks: newTask.subtasks,
      }

      const createdTask = await createTask(user.id, taskData)
      setTasks([...tasks, createdTask])
      setNewTask({
        title: "",
        description: "",
        priority: "medium",
        due_date: new Date().toISOString().split("T")[0],
        category: "Geral",
        subtasks: [],
      })
      setNewSubtaskTitle("")
      setIsAddDialogOpen(false)
    } catch (error) {
      console.error("[Tasks] Error creating task:", error)
    }
  }

  const handleEditTask = async () => {
    if (!editingTask || !editingTask.title.trim()) return

    try {
      const updatedTask = await updateTask(editingTask.id, {
        title: editingTask.title,
        description: editingTask.description,
        priority: editingTask.priority,
        due_date: editingTask.due_date,
        category: editingTask.category,
        subtasks: editingTask.subtasks,
      })

      setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)))
      setIsEditDialogOpen(false)
      setEditingTask(null)
    } catch (error) {
      console.error("[Tasks] Error updating task:", error)
    }
  }

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id)
      setTasks(tasks.filter((t) => t.id !== id))
    } catch (error) {
      console.error("[Tasks] Error deleting task:", error)
    }
  }

  const handleToggleComplete = async (id: string) => {
    const task = tasks.find((t) => t.id === id)
    if (!task) return

    try {
      const updatedTask = await updateTask(id, {
        status: task.status === "done" ? "todo" : "done",
      })
      setTasks(tasks.map((t) => (t.id === id ? updatedTask : t)))
    } catch (error) {
      console.error("[Tasks] Error toggling task:", error)
    }
  }

  const handleToggleFavorite = async (id: string) => {
    const task = tasks.find((t) => t.id === id)
    if (!task) return

    try {
      const updatedTask = await updateTask(id, {
        is_favorite: !task.is_favorite,
      })
      setTasks(tasks.map((t) => (t.id === id ? updatedTask : t)))
    } catch (error) {
      console.error("[Tasks] Error toggling favorite:", error)
    }
  }

  const handleAddSubtask = () => {
    if (newSubtaskTitle.trim()) {
      setNewTask({
        ...newTask,
        subtasks: [
          ...newTask.subtasks,
          {
            id: Date.now().toString(),
            title: newSubtaskTitle,
            completed: false,
          },
        ],
      })
      setNewSubtaskTitle("")
    }
  }

  const handleRemoveSubtask = (subtaskId: string) => {
    setNewTask({
      ...newTask,
      subtasks: newTask.subtasks.filter((st) => st.id !== subtaskId),
    })
  }

  const toggleTaskExpansion = (taskId: string) => {
    setExpandedTasks((prev) => (prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0A0E27]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#00D9FF] mx-auto mb-4" />
          <p className="text-[#F1F5F9]">Carregando tarefas...</p>
        </div>
      </div>
    )
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/10 text-red-400 border-red-500/20"
      case "medium":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
      case "low":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20"
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20"
    }
  }

  const getSubtaskProgress = (subtasks: any[]) => {
    if (!subtasks || subtasks.length === 0) return 0
    const completed = subtasks.filter((s) => s.completed).length
    return (completed / subtasks.length) * 100
  }

  const pendingTasks = tasks.filter((t) => t.status !== "done")
  const completedTasks = tasks.filter((t) => t.status === "done")

  const TaskCard = ({ task }: { task: any }) => {
    const hasSubtasks = task.subtasks && task.subtasks.length > 0
    const isExpanded = expandedTasks.includes(task.id)
    const subtaskProgress = getSubtaskProgress(task.subtasks)

    return (
      <Card className="p-4 border-border/50 hover:border-blue-500/50 transition-all group">
        <div className="space-y-3">
          <div className="flex items-start gap-4">
            <Checkbox
              checked={task.status === "done"}
              onCheckedChange={() => handleToggleComplete(task.id)}
              className="border-blue-500 mt-1"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => handleToggleFavorite(task.id)}>
                  <Star
                    className={`w-4 h-4 ${task.is_favorite ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`}
                  />
                </Button>
                <p className={`font-medium ${task.status === "done" ? "line-through opacity-60" : ""}`}>{task.title}</p>
                {hasSubtasks && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleTaskExpansion(task.id)}
                    className="h-6 w-6 p-0"
                  >
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </Button>
                )}
                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => {
                      setEditingTask(task)
                      setIsEditDialogOpen(true)
                    }}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 hover:bg-red-500/10 hover:text-red-400"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
              {task.description && <p className="text-sm text-muted-foreground mt-1">{task.description}</p>}
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <Badge variant="outline" className={getPriorityColor(task.priority)}>
                  {task.priority === "high" ? "Alta" : task.priority === "medium" ? "Média" : "Baixa"}
                </Badge>
                <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                  {task.category}
                </Badge>
                {task.tags &&
                  task.tags.map((tag: string) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="bg-purple-500/10 text-purple-400 border-purple-500/20"
                    >
                      {tag}
                    </Badge>
                  ))}
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <CalendarIcon className="w-3 h-3" />
                  {new Date(task.due_date).toLocaleDateString("pt-BR")}
                </span>
              </div>

              {hasSubtasks && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                    <span>
                      {task.subtasks.filter((s: any) => s.completed).length}/{task.subtasks.length} subtarefas
                    </span>
                  </div>
                  <Progress value={subtaskProgress} className="h-1" />
                </div>
              )}
            </div>
          </div>

          {isExpanded && hasSubtasks && (
            <div className="ml-10 space-y-2 pt-2 border-t border-border/50">
              {task.subtasks.map((subtask: any) => (
                <div key={subtask.id} className="flex items-center gap-2">
                  <Checkbox
                    checked={subtask.completed}
                    onCheckedChange={() => {
                      // Handle subtask completion update
                    }}
                    className="border-blue-400"
                  />
                  <span className={`text-sm ${subtask.completed ? "line-through opacity-60" : ""}`}>
                    {subtask.title}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    )
  }

  const KanbanView = () => {
    const todoTasks = tasks.filter((t) => t.status === "todo" && !t.completed)
    const doingTasks = tasks.filter((t) => t.status === "doing" && !t.completed)
    const doneTasks = tasks.filter((t) => t.status === "done" || t.completed)

    return (
      <div className="grid grid-cols-3 gap-4">
        {[
          { title: "A Fazer", tasks: todoTasks, color: "blue" },
          { title: "Fazendo", tasks: doingTasks, color: "yellow" },
          { title: "Feito", tasks: doneTasks, color: "green" },
        ].map((column) => (
          <div key={column.title}>
            <div className={`mb-4 p-3 rounded-lg bg-${column.color}-500/10 border border-${column.color}-500/20`}>
              <h3 className="font-semibold">{column.title}</h3>
              <p className="text-sm text-muted-foreground">{column.tasks.length} tarefas</p>
            </div>
            <div className="space-y-3">
              {column.tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  const CalendarView = () => {
    const today = new Date()
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay()

    const days = []
    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }

    const getTasksForDay = (day: number) => {
      const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
      return tasks.filter((t) => t.due_date === dateStr)
    }

    return (
      <div>
        <div className="grid grid-cols-7 gap-2 mb-2">
          {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
            <div key={day} className="text-center text-sm font-semibold text-muted-foreground py-2">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => {
            const dayTasks = day ? getTasksForDay(day) : []
            return (
              <Card
                key={index}
                className={`p-2 min-h-[100px] ${!day ? "opacity-30" : ""} ${day === today.getDate() ? "border-blue-500" : "border-border/50"}`}
              >
                {day && (
                  <>
                    <div className="text-sm font-semibold mb-1">{day}</div>
                    <div className="space-y-1">
                      {dayTasks.map((task) => (
                        <div
                          key={task.id}
                          className={`text-xs p-1 rounded ${getPriorityColor(task.priority)} truncate`}
                        >
                          {task.title}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </Card>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 bg-[#0A0E27] min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#F1F5F9]">Tarefas</h1>
          <p className="text-[#64748B] mt-1">Organize suas tarefas e projetos</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-[#1E293B] rounded-lg p-1 border border-[#334155]">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setView("list")}
              className={view === "list" ? "bg-[#00D9FF]/10 text-[#00D9FF]" : "text-[#94A3B8]"}
            >
              <List className="w-4 h-4 mr-2" />
              Lista
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setView("kanban")}
              className={view === "kanban" ? "bg-[#00D9FF]/10 text-[#00D9FF]" : "text-[#94A3B8]"}
            >
              <Kanban className="w-4 h-4 mr-2" />
              Kanban
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setView("calendar")}
              className={view === "calendar" ? "bg-[#00D9FF]/10 text-[#00D9FF]" : "text-[#94A3B8]"}
            >
              <CalendarIcon className="w-4 h-4 mr-2" />
              Calendário
            </Button>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] btn-3d">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#1E293B] border-[#334155] text-[#F1F5F9]">
              <DialogHeader>
                <DialogTitle className="text-2xl">Nova Tarefa</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label>Título</Label>
                  <Input
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    placeholder="Digite o título da tarefa"
                    className="bg-[#0F172A] border-[#334155] text-[#F1F5F9]"
                  />
                </div>

                <div>
                  <Label>Descrição (opcional)</Label>
                  <Textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    placeholder="Adicione uma descrição..."
                    className="bg-[#0F172A] border-[#334155] text-[#F1F5F9] min-h-[80px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Prioridade</Label>
                    <Select
                      value={newTask.priority}
                      onValueChange={(value) => setNewTask({ ...newTask, priority: value })}
                    >
                      <SelectTrigger className="bg-[#0F172A] border-[#334155] text-[#F1F5F9]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1E293B] border-[#334155]">
                        <SelectItem value="low">Baixa</SelectItem>
                        <SelectItem value="medium">Média</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Data de Vencimento</Label>
                    <Input
                      type="date"
                      value={newTask.due_date}
                      onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                      className="bg-[#0F172A] border-[#334155] text-[#F1F5F9]"
                    />
                  </div>
                </div>

                <div>
                  <Label>Categoria</Label>
                  <Select
                    value={newTask.category}
                    onValueChange={(value) => setNewTask({ ...newTask, category: value })}
                  >
                    <SelectTrigger className="bg-[#0F172A] border-[#334155] text-[#F1F5F9]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1E293B] border-[#334155]">
                      <SelectItem value="Geral">Geral</SelectItem>
                      <SelectItem value="Trabalho">Trabalho</SelectItem>
                      <SelectItem value="Pessoal">Pessoal</SelectItem>
                      <SelectItem value="Desenvolvimento">Desenvolvimento</SelectItem>
                      <SelectItem value="Estudos">Estudos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Subtarefas (opcional)</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={newSubtaskTitle}
                      onChange={(e) => setNewSubtaskTitle(e.target.value)}
                      placeholder="Adicionar subtarefa..."
                      className="bg-[#0F172A] border-[#334155] text-[#F1F5F9]"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleAddSubtask()
                        }
                      }}
                    />
                    <Button onClick={handleAddSubtask} type="button" className="bg-[#00D9FF] text-[#0F172A]">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {newTask.subtasks.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {newTask.subtasks.map((subtask) => (
                        <div
                          key={subtask.id}
                          className="flex items-center justify-between p-2 bg-[#0F172A] rounded-lg border border-[#334155]"
                        >
                          <span className="text-sm text-[#F1F5F9]">{subtask.title}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveSubtask(subtask.id)}
                            className="h-6 w-6 p-0 text-red-400 hover:bg-red-400/10"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={handleAddTask}
                    className="bg-gradient-to-r from-[#00D9FF] to-[#0EA5E9] btn-3d flex-1"
                  >
                    Criar Tarefa
                  </Button>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="border-[#334155]">
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#1E293B] border-[#334155] text-[#F1F5F9]">
              <DialogHeader>
                <DialogTitle className="text-2xl">Editar Tarefa</DialogTitle>
              </DialogHeader>
              {editingTask && (
                <div className="space-y-4 mt-4">
                  <div>
                    <Label>Título</Label>
                    <Input
                      value={editingTask.title}
                      onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                      className="bg-[#0F172A] border-[#334155] text-[#F1F5F9]"
                    />
                  </div>

                  <div>
                    <Label>Descrição</Label>
                    <Textarea
                      value={editingTask.description || ""}
                      onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                      className="bg-[#0F172A] border-[#334155] text-[#F1F5F9] min-h-[80px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Prioridade</Label>
                      <Select
                        value={editingTask.priority}
                        onValueChange={(value) => setEditingTask({ ...editingTask, priority: value })}
                      >
                        <SelectTrigger className="bg-[#0F172A] border-[#334155] text-[#F1F5F9]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1E293B] border-[#334155]">
                          <SelectItem value="low">Baixa</SelectItem>
                          <SelectItem value="medium">Média</SelectItem>
                          <SelectItem value="high">Alta</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Data</Label>
                      <Input
                        type="date"
                        value={editingTask.due_date}
                        onChange={(e) => setEditingTask({ ...editingTask, due_date: e.target.value })}
                        className="bg-[#0F172A] border-[#334155] text-[#F1F5F9]"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Categoria</Label>
                    <Select
                      value={editingTask.category}
                      onValueChange={(value) => setEditingTask({ ...editingTask, category: value })}
                    >
                      <SelectTrigger className="bg-[#0F172A] border-[#334155] text-[#F1F5F9]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1E293B] border-[#334155]">
                        <SelectItem value="Geral">Geral</SelectItem>
                        <SelectItem value="Trabalho">Trabalho</SelectItem>
                        <SelectItem value="Pessoal">Pessoal</SelectItem>
                        <SelectItem value="Desenvolvimento">Desenvolvimento</SelectItem>
                        <SelectItem value="Estudos">Estudos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Subtarefas</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        value={newSubtaskTitle}
                        onChange={(e) => setNewSubtaskTitle(e.target.value)}
                        placeholder="Adicionar subtarefa..."
                        className="bg-[#0F172A] border-[#334155] text-[#F1F5F9]"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            handleAddSubtask()
                          }
                        }}
                      />
                      <Button onClick={handleAddSubtask} type="button" className="bg-[#00D9FF] text-[#0F172A]">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {editingTask.subtasks && editingTask.subtasks.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {editingTask.subtasks.map((subtask: any) => (
                          <div
                            key={subtask.id}
                            className="flex items-center justify-between p-2 bg-[#0F172A] rounded-lg border border-[#334155]"
                          >
                            <span className="text-sm text-[#F1F5F9]">{subtask.title}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                // Handle subtask removal update
                              }}
                              className="h-6 w-6 p-0 text-red-400 hover:bg-red-400/10"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={handleEditTask}
                      className="bg-gradient-to-r from-[#00D9FF] to-[#0EA5E9] btn-3d flex-1"
                    >
                      Salvar Alterações
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="border-[#334155]">
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {view === "list" && (
        <TaskListView
          tasks={tasks}
          expandedTasks={expandedTasks}
          onToggleComplete={handleToggleComplete}
          onToggleFavorite={handleToggleFavorite}
          onEdit={(task) => {
            setEditingTask(task)
            setIsEditDialogOpen(true)
          }}
          onDelete={handleDeleteTask}
          onToggleExpansion={toggleTaskExpansion}
        />
      )}

      {view === "kanban" && (
        <div className="text-center py-20 text-[#64748B]">Visualização Kanban em desenvolvimento...</div>
      )}

      {view === "calendar" && (
        <div className="text-center py-20 text-[#64748B]">Visualização de Calendário em desenvolvimento...</div>
      )}
    </div>
  )
}
