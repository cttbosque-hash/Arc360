"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Sparkles, Zap, Crown } from "lucide-react"

export default function PlansPage() {
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const plans = [
    {
      id: "free",
      name: "ARC 360 Free",
      price: "Grátis",
      priceValue: 0,
      icon: Sparkles,
      color: "from-gray-600 to-gray-700",
      features: [
        "Dashboard básico",
        "Até 3 projetos",
        "Até 10 tarefas por projeto",
        "Até 5 hábitos",
        "Chat IA limitado (10 msgs/dia)",
        "Sem relatórios avançados",
        "Armazenamento: 100 MB",
        "Suporte via email (48h)",
      ],
    },
    {
      id: "premium",
      name: "ARC 360 Premium",
      price: "R$ 39,90",
      priceValue: 39.9,
      period: "/mês",
      icon: Zap,
      color: "from-[#4F46E5] to-[#7C3AED]",
      popular: true,
      features: [
        "Tudo do plano Free",
        "Projetos ilimitados",
        "Tarefas ilimitadas",
        "Hábitos ilimitados",
        "Chat IA ilimitado",
        "Insights com IA",
        "Relatórios avançados",
        "Integração com calendário",
        "Armazenamento: 5 GB",
        "Suporte prioritário (4h)",
      ],
    },
    {
      id: "pro",
      name: "ARC 360 Pro",
      price: "R$ 349,90",
      priceValue: 349.9,
      period: "/ano",
      icon: Crown,
      color: "from-[#06D6A0] to-[#10B981]",
      savings: "Economize R$ 128,90",
      features: [
        "Tudo do plano Premium",
        "Análise preditiva com IA",
        "Automações personalizadas",
        "API de integração",
        "Backup automático diário",
        "Armazenamento ilimitado",
        "Suporte 24/7 (1h)",
        "Sessão de consultoria mensal",
        "Acesso antecipado a novos recursos",
      ],
    },
  ]

  const handleSelectPlan = async (planId: string) => {
    console.log("[v0] Iniciando seleção do plano:", planId)
    setSelectedPlan(planId)
    setIsLoading(true)

    try {
      const userDataStr = localStorage.getItem("user")
      if (!userDataStr) {
        console.error("[v0] No user data found in localStorage")
        // If no user data, redirect to login
        window.location.href = "/"
        return
      }

      const userData = JSON.parse(userDataStr)
      console.log("[v0] Current user data:", userData)

      // Update user data with selected plan
      userData.subscription_plan = planId
      console.log("[v0] Updated user data with plan:", userData)

      // Save updated data back to localStorage
      localStorage.setItem("user", JSON.stringify(userData))
      console.log("[v0] User data saved with plan")

      await new Promise((resolve) => setTimeout(resolve, 500))

      console.log("[v0] Redirecionando para dashboard com plano:", planId)

      // Redirect to dashboard for all plans
      window.location.href = "/dashboard"
    } catch (error) {
      console.error("[v0] Erro ao selecionar plano:", error)
      setIsLoading(false)
      setSelectedPlan(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Escolha seu plano ARC 360</h1>
          <p className="text-xl text-[#94A3B8] max-w-2xl mx-auto">
            Comece gratuitamente ou escolha um plano premium para desbloquear todos os recursos
          </p>
        </div>

        {/* Grid de Planos */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {plans.map((plan) => {
            const Icon = plan.icon
            const isSelected = selectedPlan === plan.id
            return (
              <Card
                key={plan.id}
                className={`relative border-[#334155] bg-[#1E293B]/80 backdrop-blur transition-all duration-300 hover:scale-105 ${
                  plan.popular ? "ring-2 ring-[#4F46E5] shadow-2xl shadow-[#4F46E5]/20" : ""
                } ${isSelected ? "ring-2 ring-[#06D6A0]" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Mais Popular
                  </div>
                )}
                <CardHeader>
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-white text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="text-[#94A3B8]">
                    <div className="flex items-baseline gap-1 mt-4">
                      <span className="text-4xl font-bold text-white">{plan.price}</span>
                      {plan.period && <span className="text-[#94A3B8]">{plan.period}</span>}
                    </div>
                    {plan.savings && <div className="mt-2 text-[#06D6A0] text-sm font-semibold">{plan.savings}</div>}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3 text-[#94A3B8]">
                        <Check className="w-5 h-5 text-[#06D6A0] flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() => handleSelectPlan(plan.id)}
                    disabled={isLoading}
                    className={`w-full bg-gradient-to-r ${plan.color} hover:opacity-90 transition-opacity disabled:opacity-50`}
                  >
                    {isLoading && isSelected
                      ? "Processando..."
                      : plan.id === "free"
                        ? "Começar Gratuitamente"
                        : "Selecionar Plano"}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Dúvidas sobre os planos?</h2>
          <p className="text-[#94A3B8] mb-6">
            Entre em contato conosco e teremos prazer em ajudar você a escolher o melhor plano
          </p>
          <Button variant="outline" className="border-[#334155] text-white hover:bg-[#1E293B] bg-transparent">
            Falar com Suporte
          </Button>
        </div>
      </div>
    </div>
  )
}
