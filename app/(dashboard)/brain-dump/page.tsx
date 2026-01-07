"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Brain, Plus, Trash2, Archive, CheckCircle2, FolderPlus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function BrainDumpPage() {
  const [thoughts, setThoughts] = useState([
    {
      id: 1,
      content: "Desenvolver um sistema de notificações push para o app",
      timestamp: "2025-01-10 14:30",
      category: "tech",
    },
    {
      id: 2,
      content: "Ideia: Criar um podcast sobre produtividade e desenvolvimento pessoal",
      timestamp: "2025-01-10 11:15",
      category: "idea",
    },
    {
      id: 3,
      content: "Lembrar de revisar o orçamento mensal e ajustar as metas financeiras",
      timestamp: "2025-01-09 18:45",
      category: "finance",
    },
    {
      id: 4,
      content: "Pesquisar sobre técnicas de meditação mindfulness",
      timestamp: "2025-01-09 09:20",
      category: "personal",
    },
  ])

  const [newThought, setNewThought] = useState("")
  const [isAdding, setIsAdding] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingThought, setEditingThought] = useState<any>(null)

  const addThought = () => {
    if (newThought.trim()) {
      const newThoughtObj = {
        id: Date.now(),
        content: newThought,
        timestamp: new Date().toISOString().slice(0, 16).replace("T", " "),
        category: "general",
      }
      setThoughts([newThoughtObj, ...thoughts])
      localStorage.setItem("arc360_brain_dump", JSON.stringify([newThoughtObj, ...thoughts]))
      setNewThought("")
      setIsAdding(false)
    }
  }

  const deleteThought = (id: number) => {
    const updatedThoughts = thoughts.filter((t) => t.id !== id)
    setThoughts(updatedThoughts)
    localStorage.setItem("arc360_brain_dump", JSON.stringify(updatedThoughts))
  }

  const convertToTask = (thought: any) => {
    const tasks = JSON.parse(localStorage.getItem("arc360_tasks") || "[]")
    const newTask = {
      id: Date.now(),
      title: thought.content,
      completed: false,
      priority: "medium",
      createdAt: new Date().toISOString(),
    }
    localStorage.setItem("arc360_tasks", JSON.stringify([...tasks, newTask]))
    deleteThought(thought.id)
    alert("Pensamento convertido em tarefa!")
  }

  const moveToProject = (thought: any) => {
    const projects = JSON.parse(localStorage.getItem("arc360_projects") || "[]")
    if (projects.length === 0) {
      alert("Você ainda não tem projetos. Crie um primeiro!")
      return
    }
    // Simulado - em produção, abriria um modal de seleção
    alert("Selecione um projeto para vincular esta nota")
  }

  const handleSaveEdit = () => {
    if (editingThought && editingThought.content.trim()) {
      const updatedThoughts = thoughts.map((t) => (t.id === editingThought.id ? editingThought : t))
      setThoughts(updatedThoughts)
      localStorage.setItem("arc360_brain_dump", JSON.stringify(updatedThoughts))
      setIsEditing(false)
      setEditingThought(null)
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "tech":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20"
      case "idea":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20"
      case "finance":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      case "personal":
        return "bg-orange-500/10 text-orange-400 border-orange-500/20"
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20"
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "tech":
        return "Tecnologia"
      case "idea":
        return "Ideia"
      case "finance":
        return "Finanças"
      case "personal":
        return "Pessoal"
      default:
        return "Geral"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Brain Dump
          </h1>
          <p className="text-muted-foreground mt-1">Capture ideias e pensamentos rapidamente</p>
        </div>
        <Button onClick={() => setIsAdding(!isAdding)} className="bg-gradient-to-r from-blue-500 to-purple-500 btn-3d">
          <Plus className="w-4 h-4 mr-2" />
          Novo Pensamento
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4 border-border/50 bg-gradient-to-br from-purple-500/5 to-purple-600/5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <Brain className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold">{thoughts.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-border/50 bg-gradient-to-br from-blue-500/5 to-blue-600/5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Archive className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tecnologia</p>
              <p className="text-2xl font-bold">{thoughts.filter((t) => t.category === "tech").length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-border/50 bg-gradient-to-br from-purple-500/5 to-purple-600/5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <Brain className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ideias</p>
              <p className="text-2xl font-bold">{thoughts.filter((t) => t.category === "idea").length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-border/50 bg-gradient-to-br from-orange-500/5 to-orange-600/5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-500/10">
              <Brain className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pessoal</p>
              <p className="text-2xl font-bold">{thoughts.filter((t) => t.category === "personal").length}</p>
            </div>
          </div>
        </Card>
      </div>

      {isAdding && (
        <Card className="p-8 border-2 border-cyan-500/20 bg-gradient-to-br from-blue-500/5 to-purple-500/5">
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="text-center mb-6">
              <Brain className="w-12 h-12 text-cyan-400 mx-auto mb-3" />
              <h3 className="text-2xl font-bold">Capture seu pensamento</h3>
              <p className="text-muted-foreground mt-1">Escreva qualquer coisa que vier à mente</p>
            </div>
            <Textarea
              placeholder="Comece a escrever..."
              value={newThought}
              onChange={(e) => setNewThought(e.target.value)}
              className="min-h-[180px] text-lg border-2 focus:ring-4 focus:ring-cyan-500/20"
              autoFocus
            />
            <div className="flex gap-2 justify-center">
              <Button onClick={addThought} size="lg" className="bg-gradient-to-r from-blue-500 to-purple-500">
                <Plus className="w-5 h-5 mr-2" />
                Capturar
              </Button>
              <Button variant="outline" size="lg" onClick={() => setIsAdding(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="grid gap-3">
        {thoughts.map((thought) => (
          <Card key={thought.id} className="p-4 border-border/50 hover:border-cyan-500/50 transition-all group">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="text-base mb-2">{thought.content}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={getCategoryColor(thought.category)}>
                    {getCategoryLabel(thought.category)}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{thought.timestamp}</span>
                </div>
              </div>

              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditingThought(JSON.parse(JSON.stringify(thought)))
                    setIsEditing(true)
                  }}
                  className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                  title="Editar"
                >
                  <Plus className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => convertToTask(thought)}
                  className="text-green-400 hover:text-green-300 hover:bg-green-500/10"
                  title="Converter em Tarefa"
                >
                  <CheckCircle2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => moveToProject(thought)}
                  className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                  title="Mover para Projeto"
                >
                  <FolderPlus className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteThought(thought.id)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-2xl bg-[#1E293B] border-[#334155] text-[#F1F5F9]">
          <DialogHeader>
            <DialogTitle className="text-2xl">Editar Pensamento</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <Textarea
              value={editingThought?.content || ""}
              onChange={(e) => setEditingThought({ ...editingThought, content: e.target.value })}
              className="min-h-[180px] text-lg border-2 focus:ring-4 focus:ring-cyan-500/20"
            />
            <div>
              <label className="text-sm font-medium text-[#94A3B8]">Categoria</label>
              <select
                value={editingThought?.category || ""}
                onChange={(e) => setEditingThought({ ...editingThought, category: e.target.value })}
                className="w-full mt-1 px-4 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
              >
                <option value="general">Geral</option>
                <option value="tech">Tecnologia</option>
                <option value="idea">Ideia</option>
                <option value="finance">Finanças</option>
                <option value="personal">Pessoal</option>
              </select>
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleSaveEdit} className="bg-gradient-to-r from-[#00D9FF] to-[#0EA5E9] btn-3d flex-1">
                Salvar Alterações
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false)
                  setEditingThought(null)
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
