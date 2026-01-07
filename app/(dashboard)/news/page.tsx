"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Newspaper, ExternalLink, Clock, TrendingUp, Sparkles, Lightbulb, Zap, Timer, Crown } from "lucide-react"

export default function NewsPage() {
  const news = [
    {
      id: 1,
      type: "changelog",
      title: "ARC 360 v2.5 - Novos Recursos de IA",
      description: "Adicionamos chat contextual que acessa seus dados, sugestões inteligentes e muito mais.",
      category: "Atualização",
      date: "2025-01-10",
      readTime: "2 min",
      icon: Sparkles,
      color: "from-blue-500 to-cyan-500",
      trending: true,
    },
    {
      id: 2,
      type: "tip",
      title: "Dica: Use o Brain Dump diariamente",
      description:
        "Capture pensamentos soltos no Brain Dump e converta-os em tarefas acionáveis. Isso libera sua mente para focar no que importa.",
      category: "Produtividade",
      date: "2025-01-10",
      readTime: "1 min",
      icon: Lightbulb,
      color: "from-yellow-500 to-orange-500",
      trending: false,
    },
    {
      id: 3,
      type: "changelog",
      title: "Melhorias no Módulo de Hábitos",
      description: "Novo heatmap de 30 dias e streak counter animado para motivar você a manter a consistência.",
      category: "Atualização",
      date: "2025-01-09",
      readTime: "3 min",
      icon: Zap,
      color: "from-purple-500 to-pink-500",
      trending: true,
    },
    {
      id: 4,
      type: "tip",
      title: "Técnica Pomodoro para Produtividade",
      description:
        "Trabalhe por 25 minutos focado em uma tarefa, depois faça uma pausa de 5 minutos. Repita 4 vezes e faça uma pausa mais longa.",
      category: "Produtividade",
      date: "2025-01-08",
      readTime: "2 min",
      icon: Timer,
      color: "from-green-500 to-emerald-500",
      trending: false,
    },
    {
      id: 5,
      type: "changelog",
      title: "Sistema de Planos Implementado",
      description: "Escolha entre Free, Premium (R$ 29,90/mês) ou Pro Anual (R$ 299/ano) e desbloqueie recursos.",
      category: "Novidade",
      date: "2025-01-07",
      readTime: "4 min",
      icon: Crown,
      color: "from-orange-500 to-red-500",
      trending: true,
    },
  ]

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Atualização":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20"
      case "Produtividade":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20"
      case "Novidade":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Novidades
        </h1>
        <p className="text-muted-foreground mt-1">Fique por dentro das últimas atualizações e conteúdos</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 border-border/50 bg-gradient-to-br from-blue-500/5 to-blue-600/5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Newspaper className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Artigos</p>
              <p className="text-2xl font-bold">{news.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-border/50 bg-gradient-to-br from-orange-500/5 to-orange-600/5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-500/10">
              <TrendingUp className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Em Alta</p>
              <p className="text-2xl font-bold">{news.filter((n) => n.trending).length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-border/50 bg-gradient-to-br from-purple-500/5 to-purple-600/5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <Clock className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tempo de Leitura</p>
              <p className="text-2xl font-bold">{news.reduce((acc, n) => acc + Number.parseInt(n.readTime), 0)} min</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        {news.map((item, index) => (
          <Card
            key={item.id}
            className="overflow-hidden border-border/50 hover:border-cyan-500/50 transition-all relative"
          >
            {index < news.length - 1 && (
              <div className="absolute left-8 top-20 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500/50 to-transparent" />
            )}

            <div className="flex gap-6 p-6">
              <div
                className={`flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center relative z-10`}
              >
                <item.icon className="w-8 h-8 text-white" />
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getCategoryColor(item.category)}>
                      {item.category}
                    </Badge>
                    {item.trending && (
                      <Badge variant="outline" className="bg-orange-500/10 text-orange-400 border-orange-500/20">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Em Alta
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {item.readTime}
                    </span>
                    <span>{new Date(item.date).toLocaleDateString("pt-BR")}</span>
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-2">{item.title}</h2>
                <p className="text-muted-foreground mb-4">{item.description}</p>
                <Button variant="outline" className="group bg-transparent">
                  {item.type === "tip" ? "Ler dica completa" : "Ver detalhes"}
                  <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
