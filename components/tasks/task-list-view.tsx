"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronRight, Edit2, Trash2, Star } from "lucide-react"

interface Task {
  id: number
  title: string
  description?: string
  completed: boolean
  priority: string
  dueDate: string
  category: string
  favorite?: boolean
  subtasks?: { id: number; title: string; completed: boolean }[]
}

interface TaskListViewProps {
  tasks: Task[]
  expandedTasks: number[]
  onToggleTask: (id: number) => void
  onToggleSubtask: (taskId: number, subtaskId: number) => void
  onToggleExpand: (taskId: number) => void
  onEditTask: (task: Task) => void
  onDeleteTask: (id: number) => void
  onToggleFavorite: (id: number) => void
}

export function TaskListView({
  tasks,
  expandedTasks,
  onToggleTask,
  onToggleSubtask,
  onToggleExpand,
  onEditTask,
  onDeleteTask,
  onToggleFavorite,
}: TaskListViewProps) {
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

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "high":
        return "Alta"
      case "medium":
        return "Média"
      case "low":
        return "Baixa"
      default:
        return "Normal"
    }
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => {
        const hasSubtasks = task.subtasks && task.subtasks.length > 0
        const completedSubtasks = task.subtasks?.filter((st) => st.completed).length || 0
        const totalSubtasks = task.subtasks?.length || 0
        const progress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0
        const isExpanded = expandedTasks.includes(task.id)

        return (
          <div
            key={task.id}
            className="p-4 bg-[#1E293B] rounded-lg border border-[#334155] hover:border-[#00D9FF]/30 transition-all group"
          >
            <div className="flex items-start gap-3">
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => onToggleTask(task.id)}
                className="mt-1 border-[#00D9FF] data-[state=checked]:bg-[#00D9FF]"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className={`font-medium text-[#F1F5F9] ${task.completed ? "line-through text-[#64748B]" : ""}`}>
                    {task.title}
                  </h3>
                  <Button size="sm" variant="ghost" onClick={() => onToggleFavorite(task.id)} className="h-6 w-6 p-0">
                    <Star
                      className={`w-4 h-4 ${task.favorite ? "fill-yellow-400 text-yellow-400" : "text-[#64748B]"}`}
                    />
                  </Button>
                </div>

                {task.description && <p className="text-sm text-[#94A3B8] mb-2">{task.description}</p>}

                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className={getPriorityColor(task.priority)}>
                    {getPriorityText(task.priority)}
                  </Badge>
                  <Badge variant="outline" className="border-[#334155] text-[#94A3B8]">
                    {task.category}
                  </Badge>
                  <span className="text-xs text-[#64748B]">{new Date(task.dueDate).toLocaleDateString("pt-BR")}</span>
                </div>

                {hasSubtasks && (
                  <div className="mt-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onToggleExpand(task.id)}
                        className="h-6 px-1 text-[#94A3B8] hover:text-[#F1F5F9]"
                      >
                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </Button>
                      <span className="text-sm text-[#94A3B8]">
                        {completedSubtasks}/{totalSubtasks} subtarefas
                      </span>
                    </div>
                    <Progress value={progress} className="h-2 bg-[#334155]" />

                    {isExpanded && (
                      <div className="mt-3 space-y-2 pl-6 border-l-2 border-[#334155]">
                        {task.subtasks?.map((subtask) => (
                          <div key={subtask.id} className="flex items-center gap-2">
                            <Checkbox
                              checked={subtask.completed}
                              onCheckedChange={() => onToggleSubtask(task.id, subtask.id)}
                              className="border-[#00D9FF] data-[state=checked]:bg-[#00D9FF]"
                            />
                            <span
                              className={`text-sm ${
                                subtask.completed ? "line-through text-[#64748B]" : "text-[#F1F5F9]"
                              }`}
                            >
                              {subtask.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onEditTask(task)}
                  className="h-8 px-2 text-[#00D9FF] hover:bg-[#00D9FF]/10"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDeleteTask(task.id)}
                  className="h-8 px-2 text-red-400 hover:bg-red-400/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
