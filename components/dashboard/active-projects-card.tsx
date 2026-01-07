"use client"

import Link from "next/link"
import { ArrowRight, Calendar, AlertCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface Project {
  id: string
  title: string
  status: string
  priority: string
  progress: number
  deadline: string | null
}

interface ActiveProjectsCardProps {
  projects: Project[]
}

export function ActiveProjectsCard({ projects }: ActiveProjectsCardProps) {
  const statusColors = {
    todo: "bg-[#64748B]",
    "in-progress": "bg-[#4F46E5]",
    done: "bg-[#06D6A0]",
  }

  const priorityColors = {
    low: "text-[#64748B]",
    medium: "text-[#7C3AED]",
    high: "text-red-400",
  }

  return (
    <Card className="bg-[#1E293B] border-[#334155] p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-[#F1F5F9]">Projetos Ativos</h3>
        <Link href="/projects">
          <Button variant="ghost" size="sm" className="text-[#4F46E5] hover:text-[#7C3AED]">
            Ver todos
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {projects.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-[#64748B] mx-auto mb-3" />
            <p className="text-[#64748B]">Nenhum projeto ativo</p>
            <Link href="/projects">
              <Button variant="outline" size="sm" className="mt-4 bg-transparent">
                Criar projeto
              </Button>
            </Link>
          </div>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              className="p-4 rounded-lg bg-[#0F172A]/50 border border-[#334155] hover:border-[#4F46E5]/50 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="text-[#F1F5F9] font-medium mb-1">{project.title}</h4>
                  <div className="flex items-center gap-2">
                    <Badge className={statusColors[project.status as keyof typeof statusColors]}>
                      {project.status === "in-progress" ? "Em Andamento" : project.status}
                    </Badge>
                    <span
                      className={`text-xs font-medium ${priorityColors[project.priority as keyof typeof priorityColors]}`}
                    >
                      {project.priority === "high" ? "Alta" : project.priority === "medium" ? "Média" : "Baixa"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#64748B]">Progresso</span>
                  <span className="text-[#F1F5F9] font-medium">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />

                {project.deadline && (
                  <div className="flex items-center gap-1 text-xs text-[#64748B] mt-2">
                    <Calendar className="w-3 h-3" />
                    {new Date(project.deadline).toLocaleDateString("pt-BR")}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}
