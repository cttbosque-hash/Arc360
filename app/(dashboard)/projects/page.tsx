"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PlusCircle, FolderKanban, Clock, CheckCircle2, ListChecks, Trash2, Plus } from "lucide-react"

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [isAddingProject, setIsAddingProject] = useState(false)
  const [isEditingProject, setIsEditingProject] = useState(false)
  const [editingProject, setEditingProject] = useState<any>(null)
  const [newSubtask, setNewSubtask] = useState("")
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    deadline: "",
    category: "",
    budget: 0,
  })

  useEffect(() => {
    const storedProjects = localStorage.getItem("arc360_projects")
    if (storedProjects) {
      setProjects(JSON.parse(storedProjects))
    } else {
      setProjects([
        {
          id: 1,
          title: "Website Redesign",
          description: "Redesenhar o site corporativo com novo layout",
          status: "in_progress",
          priority: "high",
          progress: 65,
          deadline: "2024-02-15",
          category: "tech",
          tasks: [
            { id: 1, title: "Criar wireframes", completed: true },
            { id: 2, title: "Design de UI", completed: true },
            { id: 3, title: "Desenvolvimento frontend", completed: false },
            { id: 4, title: "Testes", completed: false },
          ],
          notes: [
            { id: 1, title: "Cores do tema", content: "Usar paleta cyan e azul escuro" },
            { id: 2, title: "Fontes", content: "Inter para texto, JetBrains Mono para código" },
          ],
          budget: { allocated: 50000, spent: 32500 },
        },
        {
          id: 2,
          title: "App Mobile",
          description: "Desenvolver aplicativo mobile para iOS e Android",
          status: "in_progress",
          priority: "medium",
          progress: 40,
          deadline: "2024-03-20",
          category: "tech",
          tasks: [
            { id: 1, title: "Setup do projeto React Native", completed: true },
            { id: 2, title: "Criar telas principais", completed: false },
            { id: 3, title: "Integrar APIs", completed: false },
          ],
          notes: [{ id: 1, title: "APIs necessárias", content: "Firebase Auth, REST API backend" }],
          budget: { allocated: 80000, spent: 31000 },
        },
        {
          id: 3,
          title: "Sistema de CRM",
          description: "Implementar sistema de gestão de relacionamento com clientes",
          status: "planning",
          priority: "low",
          progress: 10,
          deadline: "2024-04-30",
          category: "business",
          tasks: [
            { id: 1, title: "Levantamento de requisitos", completed: true },
            { id: 2, title: "Escolher tecnologia", completed: false },
          ],
          notes: [],
          budget: { allocated: 120000, spent: 5000 },
        },
      ])
    }
  }, [])

  const statusColors: any = {
    planning: "bg-[#64748B]",
    in_progress: "bg-[#4F46E5]",
    completed: "bg-[#06D6A0]",
  }

  const statusLabels: any = {
    planning: "Planejamento",
    in_progress: "Em Progresso",
    completed: "Concluído",
  }

  const priorityColors: any = {
    low: "border-[#06D6A0] text-[#06D6A0]",
    medium: "border-[#F59E0B] text-[#F59E0B]",
    high: "border-[#EF4444] text-[#EF4444]",
  }

  const handleAddProject = () => {
    if (newProject.title.trim()) {
      const project = {
        id: Date.now(),
        ...newProject,
        status: "planning",
        priority: "medium",
        progress: 0,
        tasks: [],
        notes: [],
        budget: { allocated: newProject.budget, spent: 0 },
      }
      setProjects([...projects, project])
      localStorage.setItem("arc360_projects", JSON.stringify([...projects, project]))
      setNewProject({ title: "", description: "", deadline: "", category: "", budget: 0 })
      setIsAddingProject(false)
    }
  }

  const handleSaveEdit = () => {
    if (editingProject) {
      const updatedProjects = projects.map((p) => (p.id === editingProject.id ? editingProject : p))
      setProjects(updatedProjects)
      localStorage.setItem("arc360_projects", JSON.stringify(updatedProjects))
      setIsEditingProject(false)
      setEditingProject(null)
    }
  }

  const handleAddSubtask = () => {
    if (newSubtask.trim() && editingProject) {
      const newTask = {
        id: Date.now(),
        title: newSubtask,
        completed: false,
      }
      setEditingProject({
        ...editingProject,
        tasks: [...(editingProject.tasks || []), newTask],
      })
      setNewSubtask("")
    }
  }

  const handleToggleSubtask = (taskId: number) => {
    if (editingProject) {
      setEditingProject({
        ...editingProject,
        tasks: editingProject.tasks.map((task: any) =>
          task.id === taskId ? { ...task, completed: !task.completed } : task,
        ),
      })
    }
  }

  const handleRemoveSubtask = (taskId: number) => {
    if (editingProject) {
      setEditingProject({
        ...editingProject,
        tasks: editingProject.tasks.filter((task: any) => task.id !== taskId),
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#F1F5F9]">Projetos</h1>
          <p className="text-[#64748B] mt-1">Gerencie seus projetos e acompanhe o progresso</p>
        </div>
        <Dialog open={isAddingProject} onOpenChange={setIsAddingProject}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] btn-3d">
              <PlusCircle className="w-4 h-4 mr-2" />
              Novo Projeto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-[#1E293B] border-[#334155] text-[#F1F5F9]">
            <DialogHeader>
              <DialogTitle className="text-2xl">Criar Novo Projeto</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium text-[#94A3B8]">Nome do Projeto</label>
                <input
                  type="text"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  className="w-full mt-1 px-4 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
                  placeholder="Ex: Website Redesign"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#94A3B8]">Descrição</label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full mt-1 px-4 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#00D9FF] resize-none"
                  rows={3}
                  placeholder="Descreva o projeto..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-[#94A3B8]">Data de Conclusão</label>
                  <input
                    type="date"
                    value={newProject.deadline}
                    onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
                    className="w-full mt-1 px-4 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-[#94A3B8]">Categoria</label>
                  <select
                    value={newProject.category}
                    onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                    className="w-full mt-1 px-4 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
                  >
                    <option value="">Selecione...</option>
                    <option value="tech">Tecnologia</option>
                    <option value="business">Negócios</option>
                    <option value="personal">Pessoal</option>
                    <option value="marketing">Marketing</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-[#94A3B8]">Orçamento (R$)</label>
                <input
                  type="number"
                  value={newProject.budget}
                  onChange={(e) => setNewProject({ ...newProject, budget: Number(e.target.value) })}
                  className="w-full mt-1 px-4 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
                  placeholder="0"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleAddProject}
                  className="bg-gradient-to-r from-[#00D9FF] to-[#0EA5E9] btn-3d flex-1"
                >
                  Criar Projeto
                </Button>
                <Button variant="outline" onClick={() => setIsAddingProject(false)} className="border-[#334155]">
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-[#1E293B] border-[#334155]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#94A3B8]">Total de Projetos</CardTitle>
            <FolderKanban className="w-4 h-4 text-[#4F46E5]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#F1F5F9]">{projects.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-[#1E293B] border-[#334155]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#94A3B8]">Em Progresso</CardTitle>
            <Clock className="w-4 h-4 text-[#F59E0B]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#F1F5F9]">
              {projects.filter((p) => p.status === "in_progress").length}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1E293B] border-[#334155]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#94A3B8]">Concluídos</CardTitle>
            <CheckCircle2 className="w-4 h-4 text-[#06D6A0]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#F1F5F9]">
              {projects.filter((p) => p.status === "completed").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => {
          const completedTasks = project.tasks.filter((t: any) => t.completed).length
          const totalTasks = project.tasks.length
          const taskProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

          return (
            <Dialog key={project.id}>
              <DialogTrigger asChild>
                <Card
                  onClick={() => {
                    setEditingProject(JSON.parse(JSON.stringify(project)))
                    setIsEditingProject(true)
                  }}
                  className="bg-[#1E293B] border-[#334155] hover:border-[#00D9FF] transition-all cursor-pointer group"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-[#F1F5F9] text-lg group-hover:text-[#00D9FF] transition-colors">
                        {project.title}
                      </CardTitle>
                      <Badge className={`${priorityColors[project.priority]} bg-transparent border`}>
                        {project.priority}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-[#94A3B8] text-sm">{project.description}</p>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#64748B]">
                          Progresso ({completedTasks}/{totalTasks} tarefas)
                        </span>
                        <span className="text-[#F1F5F9] font-medium">{taskProgress}%</span>
                      </div>
                      <div className="w-full bg-[#334155] rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-[#00D9FF] to-[#0EA5E9] h-2 rounded-full transition-all"
                          style={{ width: `${taskProgress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#334155]">
                      <Badge className={`${statusColors[project.status]} text-white`}>
                        {statusLabels[project.status]}
                      </Badge>
                      <span className="text-sm text-[#64748B]">{project.deadline}</span>
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>

              <DialogContent className="max-w-3xl bg-[#1E293B] border-[#334155] text-[#F1F5F9] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl">Editar Projeto</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                  <div>
                    <label className="text-sm font-medium text-[#94A3B8]">Nome do Projeto</label>
                    <input
                      type="text"
                      value={editingProject?.title || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                      className="w-full mt-1 px-4 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-[#94A3B8]">Descrição</label>
                    <textarea
                      value={editingProject?.description || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                      className="w-full mt-1 px-4 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#00D9FF] resize-none"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-[#94A3B8]">Status</label>
                      <select
                        value={editingProject?.status || ""}
                        onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value })}
                        className="w-full mt-1 px-4 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
                      >
                        <option value="planning">Planejamento</option>
                        <option value="in_progress">Em Progresso</option>
                        <option value="completed">Concluído</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-[#94A3B8]">Prioridade</label>
                      <select
                        value={editingProject?.priority || ""}
                        onChange={(e) => setEditingProject({ ...editingProject, priority: e.target.value })}
                        className="w-full mt-1 px-4 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
                      >
                        <option value="low">Baixa</option>
                        <option value="medium">Média</option>
                        <option value="high">Alta</option>
                      </select>
                    </div>
                  </div>

                  <div className="border-t border-[#334155] pt-4 mt-4">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <ListChecks className="w-5 h-5 text-[#00D9FF]" />
                      Tarefas / Etapas do Projeto
                    </h3>

                    <div className="space-y-2 mb-3">
                      {editingProject?.tasks?.map((task: any) => (
                        <div key={task.id} className="flex items-center gap-3 p-3 bg-[#0F172A] rounded-lg">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => handleToggleSubtask(task.id)}
                            className="w-5 h-5 rounded border-[#334155] bg-[#1E293B] checked:bg-[#00D9FF]"
                          />
                          <span
                            className={task.completed ? "line-through text-[#64748B] flex-1" : "text-[#F1F5F9] flex-1"}
                          >
                            {task.title}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveSubtask(task.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newSubtask}
                        onChange={(e) => setNewSubtask(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleAddSubtask()}
                        placeholder="Nova tarefa..."
                        className="flex-1 px-4 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
                      />
                      <Button onClick={handleAddSubtask} className="bg-gradient-to-r from-[#00D9FF] to-[#0EA5E9]">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={handleSaveEdit}
                      className="bg-gradient-to-r from-[#00D9FF] to-[#0EA5E9] btn-3d flex-1"
                    >
                      Salvar Alterações
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditingProject(false)
                        setEditingProject(null)
                      }}
                      className="border-[#334155]"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )
        })}
      </div>
    </div>
  )
}
