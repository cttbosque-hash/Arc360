import { getCurrentUser } from "@/lib/auth"
import { getSupabaseServerClient } from "@/lib/supabase-server"
import { PreferencesForm } from "@/components/settings/preferences-form"
import { FinancialGoalForm } from "@/components/settings/financial-goal-form"
import { NotificationSettings } from "@/components/settings/notification-settings"
import { DangerZone } from "@/components/settings/danger-zone"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function SettingsPage() {
  const user = await getCurrentUser()

  if (!user) {
    return null
  }

  const supabase = await getSupabaseServerClient()

  const { data: preferences } = await supabase.from("user_preferences").select("*").eq("user_id", user.id).single()

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#F1F5F9]">Configurações</h1>
        <p className="text-[#64748B] mt-1">Personalize sua experiência no ARC 360</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="bg-[#1E293B] border border-[#334155]">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="financial">Financeiro</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="danger">Zona de Perigo</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6 mt-6">
          <PreferencesForm preferences={preferences} />
        </TabsContent>

        <TabsContent value="financial" className="space-y-6 mt-6">
          <FinancialGoalForm user={user} />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6 mt-6">
          <NotificationSettings preferences={preferences} />
        </TabsContent>

        <TabsContent value="danger" className="space-y-6 mt-6">
          <DangerZone />
        </TabsContent>
      </Tabs>
    </div>
  )
}
