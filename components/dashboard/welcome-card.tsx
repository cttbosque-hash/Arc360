"use client"

import { Sparkles } from "lucide-react"

interface WelcomeCardProps {
  userName: string
}

export function WelcomeCard({ userName }: WelcomeCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#4F46E5] via-[#7C3AED] to-[#06D6A0] p-8 shadow-2xl">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-6 h-6 text-white" />
          <span className="text-sm font-medium text-white/80">ARC 360</span>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Olá, {userName.split(" ")[0]}!</h1>
        <p className="text-white/90 text-lg">Pronto para alcançar suas metas hoje?</p>
      </div>
    </div>
  )
}
