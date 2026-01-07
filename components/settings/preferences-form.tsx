"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Globe, Clock, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getSupabaseBrowserClient } from "@/lib/supabase-client"

interface PreferencesFormProps {
  preferences: {
    theme: string
    language: string
    timezone: string
  } | null
}

export function PreferencesForm({ preferences }: PreferencesFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    theme: preferences?.theme || "dark",
    language: preferences?.language || "pt-BR",
    timezone: preferences?.timezone || "America/Sao_Paulo",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = getSupabaseBrowserClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("Not authenticated")

      const { error } = await supabase.from("user_preferences").update(formData).eq("user_id", user.id)

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error("Error updating preferences:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-[#1E293B] border-[#334155] p-6">
      <h3 className="text-lg font-semibold text-[#F1F5F9] mb-6">Preferências Gerais</h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="theme" className="text-[#F1F5F9] flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Tema
          </Label>
          <Select value={formData.theme} onValueChange={(value) => setFormData({ ...formData, theme: value })}>
            <SelectTrigger className="mt-2 bg-[#0F172A] border-[#334155] text-[#F1F5F9]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1E293B] border-[#334155]">
              <SelectItem value="dark">Escuro</SelectItem>
              <SelectItem value="light">Claro</SelectItem>
              <SelectItem value="auto">Automático</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="language" className="text-[#F1F5F9] flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Idioma
          </Label>
          <Select value={formData.language} onValueChange={(value) => setFormData({ ...formData, language: value })}>
            <SelectTrigger className="mt-2 bg-[#0F172A] border-[#334155] text-[#F1F5F9]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1E293B] border-[#334155]">
              <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
              <SelectItem value="en-US">English (US)</SelectItem>
              <SelectItem value="es-ES">Español</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="timezone" className="text-[#F1F5F9] flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Fuso Horário
          </Label>
          <Select value={formData.timezone} onValueChange={(value) => setFormData({ ...formData, timezone: value })}>
            <SelectTrigger className="mt-2 bg-[#0F172A] border-[#334155] text-[#F1F5F9]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1E293B] border-[#334155]">
              <SelectItem value="America/Sao_Paulo">São Paulo (GMT-3)</SelectItem>
              <SelectItem value="America/New_York">New York (GMT-5)</SelectItem>
              <SelectItem value="Europe/London">London (GMT+0)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading} className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED]">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar Preferências"
            )}
          </Button>
        </div>
      </form>
    </Card>
  )
}
