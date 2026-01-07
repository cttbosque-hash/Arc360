"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { ArrowRight, TrendingUp, CheckCircle2, Zap } from "lucide-react"

interface DashboardViewProps {
  onNavigate: (view: string) => void
}

export function DashboardView({ onNavigate }: DashboardViewProps) {
  const savingsGoal = 100000
  const currentSavings = 32500
  const progress = (currentSavings / savingsGoal) * 100

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2 text-balance">Bem-vindo de volta! 👋</h1>
        <p className="text-muted-foreground text-lg">Aqui está um resumo do seu progresso</p>
      </div>

      {/* Meta Principal */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 glow-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Meta de R$ 100.000,00
          </CardTitle>
          <CardDescription>Objetivo financeiro principal</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progresso atual</span>
              <span className="font-bold text-primary">R$ {currentSavings.toLocaleString("pt-BR")}</span>
            </div>
            <Progress value={progress} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{progress.toFixed(1)}% concluído</span>
              <span>R$ {(savingsGoal - currentSavings).toLocaleString("pt-BR")} restantes</span>
            </div>
          </div>
          <Button onClick={() => onNavigate("finance")} className="w-full">
            Ver Plano Completo
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      {/* Grid de Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card
          className="hover:border-primary/50 transition-colors cursor-pointer"
          onClick={() => onNavigate("projects")}
        >
          <CardHeader>
            <CardTitle className="text-lg">Projetos Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">5</div>
            <p className="text-sm text-muted-foreground mt-1">3 em andamento</p>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 transition-colors cursor-pointer" onClick={() => onNavigate("goals")}>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Metas Concluídas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">12/20</div>
            <p className="text-sm text-muted-foreground mt-1">60% de conclusão</p>
          </CardContent>
        </Card>

        <Card
          className="hover:border-primary/50 transition-colors cursor-pointer"
          onClick={() => onNavigate("insights")}
        >
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="h-5 w-5 text-accent" />
              Insights Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">8</div>
            <p className="text-sm text-muted-foreground mt-1">Esta semana</p>
          </CardContent>
        </Card>
      </div>

      {/* Atividade Recente */}
      <Card>
        <CardHeader>
          <CardTitle>Atividade Recente</CardTitle>
          <CardDescription>Suas últimas ações no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: "Adicionou nova meta", time: "Há 2 horas", type: "goals" },
              { action: "Atualizou projeto 'App Mobile'", time: "Há 5 horas", type: "projects" },
              { action: "Registrou transação financeira", time: "Ontem", type: "finance" },
              { action: "Salvou novo insight", time: "2 dias atrás", type: "insights" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <span className="text-sm">{item.action}</span>
                <span className="text-xs text-muted-foreground">{item.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
