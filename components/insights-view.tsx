"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Lightbulb, Tag } from "lucide-react"

export function InsightsView() {
  const [insights] = useState([
    {
      id: 1,
      content:
        "Identificar oportunidades de reduzir gastos recorrentes pode acelerar em 3 meses o atingimento da meta financeira.",
      category: "Finanças",
      date: "2025-01-15",
    },
    {
      id: 2,
      content: "Aplicar a técnica Pomodoro aumentou minha produtividade em 40% nos projetos de desenvolvimento.",
      category: "Produtividade",
      date: "2025-01-14",
    },
    {
      id: 3,
      content: "Fazer exercícios pela manhã melhora significativamente meu foco durante o dia todo.",
      category: "Saúde",
      date: "2025-01-12",
    },
    {
      id: 4,
      content: "Reservar 30 minutos diários para leitura técnica está acelerando meu aprendizado em novas tecnologias.",
      category: "Aprendizado",
      date: "2025-01-10",
    },
    {
      id: 5,
      content: "Automatizar tarefas repetitivas está economizando cerca de 5 horas por semana.",
      category: "Tecnologia",
      date: "2025-01-08",
    },
    {
      id: 6,
      content: "Networking em eventos online gerou 3 novas oportunidades de freelance este mês.",
      category: "Carreira",
      date: "2025-01-05",
    },
  ])

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Finanças: "bg-green-500/20 text-green-500 border-green-500/30",
      Produtividade: "bg-primary/20 text-primary border-primary/30",
      Saúde: "bg-red-500/20 text-red-500 border-red-500/30",
      Aprendizado: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
      Tecnologia: "bg-cyan-500/20 text-cyan-500 border-cyan-500/30",
      Carreira: "bg-purple-500/20 text-purple-500 border-purple-500/30",
    }
    return colors[category] || "bg-muted text-muted-foreground"
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Insights & Pensamentos 💡</h1>
          <p className="text-muted-foreground text-lg">Capture suas ideias e aprendizados importantes</p>
        </div>
        <Button className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Novo Insight
        </Button>
      </div>

      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>Adicionar Novo Insight</CardTitle>
          <CardDescription>Registre uma nova ideia ou aprendizado</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea placeholder="Descreva seu insight, pensamento ou aprendizado..." className="min-h-[100px]" />
          <div className="flex gap-2">
            <Button>Salvar Insight</Button>
            <Button variant="outline">Adicionar Tags</Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Lightbulb className="h-6 w-6 text-accent" />
          Insights Recentes
        </h2>

        <div className="grid gap-4">
          {insights.map((insight) => (
            <Card key={insight.id} className="hover:border-primary/30 transition-colors">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <p className="text-foreground leading-relaxed text-balance">{insight.content}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className={getCategoryColor(insight.category)}>
                      <Tag className="h-3 w-3 mr-1" />
                      {insight.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(insight.date).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
