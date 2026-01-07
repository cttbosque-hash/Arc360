import { getCurrentUser } from "@/lib/auth"
import { getSupabaseServerClient } from "@/lib/supabase-server"
import { ProfileForm } from "@/components/profile/profile-form"
import { AccountSecurity } from "@/components/profile/account-security"
import { AdditionalContacts } from "@/components/profile/additional-contacts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function ProfilePage() {
  const user = await getCurrentUser()

  if (!user) {
    return null
  }

  const supabase = await getSupabaseServerClient()

  // Buscar preferências e contatos adicionais
  const [{ data: preferences }, { data: emails }, { data: phones }] = await Promise.all([
    supabase.from("user_preferences").select("*").eq("user_id", user.id).single(),
    supabase.from("user_emails").select("*").eq("user_id", user.id),
    supabase.from("user_phones").select("*").eq("user_id", user.id),
  ])

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#F1F5F9]">Perfil</h1>
        <p className="text-[#64748B] mt-1">Gerencie suas informações pessoais e preferências</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="bg-[#1E293B] border border-[#334155]">
          <TabsTrigger value="profile">Informações Pessoais</TabsTrigger>
          <TabsTrigger value="contacts">Contatos</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6 mt-6">
          <ProfileForm user={user} />
        </TabsContent>

        <TabsContent value="contacts" className="space-y-6 mt-6">
          <AdditionalContacts emails={emails || []} phones={phones || []} />
        </TabsContent>

        <TabsContent value="security" className="space-y-6 mt-6">
          <AccountSecurity />
        </TabsContent>
      </Tabs>
    </div>
  )
}
