"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { PlusCircle, MoreVertical } from "lucide-react"

export function ProjectsView() {
  const [projects] = useState([
    {
      id: 1,
      name: "App Mobile de Finanças",
      description: "Desenvolvimento de aplicativo iOS e Android",
      status: "em-andamento",
      progress: 65,
      deadline: "2025-03-15",
    },
    {
      id: 2,
      name: "E-commerce Pessoal",
      description: "Loja online para venda de produtos digitais",
      status: "em-andamento",
      progress: 40,
      deadline: "2025-04-01",
    },
    {
      id: 3,
      name: "Curso Online",
      description: "Criação de curso sobre produtividade",
      status: "planejamento",
      progress: 15,
      deadline: "2025-05-20",
    },
    {
      id: 4,
      name: "Blog Profissional",
      description: "Website pessoal com artigos técnicos",
      status: "concluido",
      progress: 100,
      deadline: "2024-12-01",
    },
    {
      id: 5,
      name: "Automação de Tarefas",
      description: "Scripts para automatizar processos diários",
      status: "em-andamento",
      progress: 80,
      deadline: "2025-02-10",
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "em-andamento":
        return "bg-primary/20 text-primary border-primary/30"
      case "planejamento":
        return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30"
      case "concluido":
        return "bg-green-500/20 text-green-500 border-green-500/30"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "em-andamento":
        return "Em Andamento"
      case "planejamento":
        return "Planejamento"
      case "concluido":
        return "Concluído"
      default:
        return status
    }
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Projetos 🚀</h1>
          <p className="text-muted-foreground text-lg">Gerencie e acompanhe todos os seus projetos</p>
        </div>
        <Button className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Novo Projeto
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="hover:border-primary/50 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <CardTitle className="text-lg text-balance">{project.name}</CardTitle>
                  <CardDescription className="text-balance">{project.description}</CardDescription>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progresso</span>
                  <span className="font-semibold">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>

              <div className="flex items-center justify-between">
                <Badge variant="outline" className={getStatusColor(project.status)}>
                  {getStatusLabel(project.status)}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {new Date(project.deadline).toLocaleDateString("pt-BR")}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
