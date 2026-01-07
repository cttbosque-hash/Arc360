"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Bell, Mail, Smartphone, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { getSupabaseBrowserClient } from "@/lib/supabase-client"

interface NotificationSettingsProps {
  preferences: {
    notifications_enabled: boolean
    email_notifications: boolean
    sms_notifications: boolean
  } | null
}

export function NotificationSettings({ preferences }: NotificationSettingsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState({
    notifications_enabled: preferences?.notifications_enabled ?? true,
    email_notifications: preferences?.email_notifications ?? true,
    sms_notifications: preferences?.sms_notifications ?? false,
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

      const { error } = await supabase.from("user_preferences").update(settings).eq("user_id", user.id)

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error("Error updating notification settings:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-[#1E293B] border-[#334155] p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-[#7C3AED]/20 flex items-center justify-center">
          <Bell className="w-6 h-6 text-[#7C3AED]" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-[#F1F5F9]">Notificações</h3>
          <p className="text-sm text-[#64748B]">Gerencie como você recebe atualizações</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center justify-between p-4 rounded-lg bg-[#0F172A]/50">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-[#94A3B8]" />
            <div>
              <Label className="text-[#F1F5F9]">Ativar Notificações</Label>
              <p className="text-xs text-[#64748B]">Receba alertas e lembretes importantes</p>
            </div>
          </div>
          <Switch
            checked={settings.notifications_enabled}
            onCheckedChange={(checked) => setSettings({ ...settings, notifications_enabled: checked })}
          />
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg bg-[#0F172A]/50">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-[#94A3B8]" />
            <div>
              <Label className="text-[#F1F5F9]">Notificações por Email</Label>
              <p className="text-xs text-[#64748B]">Receba atualizações no seu email</p>
            </div>
          </div>
          <Switch
            checked={settings.email_notifications}
            onCheckedChange={(checked) => setSettings({ ...settings, email_notifications: checked })}
            disabled={!settings.notifications_enabled}
          />
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg bg-[#0F172A]/50">
          <div className="flex items-center gap-3">
            <Smartphone className="w-5 h-5 text-[#94A3B8]" />
            <div>
              <Label className="text-[#F1F5F9]">Notificações por SMS</Label>
              <p className="text-xs text-[#64748B]">Receba alertas via mensagem de texto</p>
            </div>
          </div>
          <Switch
            checked={settings.sms_notifications}
            onCheckedChange={(checked) => setSettings({ ...settings, sms_notifications: checked })}
            disabled={!settings.notifications_enabled}
          />
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={loading} className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED]">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar Configurações"
            )}
          </Button>
        </div>
      </form>
    </Card>
  )
}
