"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Target, Calendar } from "lucide-react"

export function GoalsView() {
  const [goals] = useState([
    {
      id: 1,
      title: "Ler 24 livros em 2025",
      description: "2 livros por mês sobre desenvolvimento pessoal e técnico",
      progress: 15,
      current: 3,
      target: 24,
      category: "Aprendizado",
      deadline: "2025-12-31",
    },
    {
      id: 2,
      title: "Economizar R$ 100.000",
      description: "Meta principal de economia para investimentos futuros",
      progress: 32.5,
      current: 32500,
      target: 100000,
      category: "Finanças",
      deadline: "2027-06-30",
    },
    {
      id: 3,
      title: "Completar 3 certificações",
      description: "AWS, React Advanced e Node.js Expert",
      progress: 33,
      current: 1,
      target: 3,
      category: "Carreira",
      deadline: "2025-08-31",
    },
    {
      id: 4,
      title: "Exercitar 200 dias",
      description: "Manter consistência com atividades físicas",
      progress: 8,
      current: 16,
      target: 200,
      category: "Saúde",
      deadline: "2025-12-31",
    },
    {
      id: 5,
      title: "Lançar 2 projetos pessoais",
      description: "SaaS e aplicativo mobile completos",
      progress: 50,
      current: 1,
      target: 2,
      category: "Projetos",
      deadline: "2025-09-30",
    },
  ])

  const [tasks] = useState([
    { id: 1, text: "Revisar plano financeiro mensal", completed: false },
    { id: 2, text: "Estudar capítulo 5 do livro atual", completed: false },
    { id: 3, text: "Treinar na academia", completed: true },
    { id: 4, text: "Trabalhar 2h no projeto SaaS", completed: false },
    { id: 5, text: "Revisar código do PR #234", completed: true },
  ])

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Finanças: "bg-green-500/20 text-green-500 border-green-500/30",
      Aprendizado: "bg-primary/20 text-primary border-primary/30",
      Carreira: "bg-purple-500/20 text-purple-500 border-purple-500/30",
      Saúde: "bg-red-500/20 text-red-500 border-red-500/30",
      Projetos: "bg-cyan-500/20 text-cyan-500 border-cyan-500/30",
    }
    return colors[category] || "bg-muted text-muted-foreground"
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Metas & Objetivos 🎯</h1>
          <p className="text-muted-foreground text-lg">Acompanhe seu progresso e conquiste seus objetivos</p>
        </div>
        <Button className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Nova Meta
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            Metas Principais
          </h2>

          <div className="space-y-4">
            {goals.map((goal) => (
              <Card key={goal.id} className="hover:border-primary/30 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <CardTitle className="text-lg text-balance">{goal.title}</CardTitle>
                      <CardDescription className="text-balance">{goal.description}</CardDescription>
                    </div>
                    <Badge variant="outline" className={getCategoryColor(goal.category)}>
                      {goal.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {typeof goal.current === "number" && goal.current > 1000
                          ? `R$ ${goal.current.toLocaleString("pt-BR")}`
                          : `${goal.current}`}{" "}
                        de{" "}
                        {typeof goal.target === "number" && goal.target > 1000
                          ? `R$ ${goal.target.toLocaleString("pt-BR")}`
                          : goal.target}
                      </span>
                      <span className="font-semibold text-primary">{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Prazo:{" "}
                      {new Date(goal.deadline).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>Tarefas de Hoje</CardTitle>
              <CardDescription>Ações para avançar suas metas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <Checkbox checked={task.completed} />
                  <span className={`text-sm flex-1 ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                    {task.text}
                  </span>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-4 bg-transparent">
                <PlusCircle className="h-4 w-4 mr-2" />
                Adicionar Tarefa
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estatísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Metas ativas</span>
                  <span className="font-semibold">5</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Concluídas este ano</span>
                  <span className="font-semibold text-green-500">12</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Taxa de sucesso</span>
                  <span className="font-semibold text-primary">75%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
