"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AlertTriangle, Trash2, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { getSupabaseBrowserClient } from "@/lib/supabase-client"

export function DangerZone() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDeleteAccount = async () => {
    setLoading(true)

    try {
      const supabase = getSupabaseBrowserClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("Not authenticated")

      // Deletar usuário (cascade deleta todos os dados relacionados)
      const { error } = await supabase.from("users").delete().eq("id", user.id)

      if (error) throw error

      // Fazer logout
      await supabase.auth.signOut()
      router.push("/login")
    } catch (error) {
      console.error("Error deleting account:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-red-500/5 border-red-500/20 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 text-red-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-[#F1F5F9]">Zona de Perigo</h3>
          <p className="text-sm text-[#64748B]">Ações irreversíveis da conta</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="p-4 rounded-lg border border-red-500/20 bg-[#0F172A]/50">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-[#F1F5F9] font-medium mb-1">Excluir Conta</h4>
              <p className="text-sm text-[#64748B] mb-4">
                Ao excluir sua conta, todos os seus dados serão permanentemente removidos. Esta ação não pode ser
                desfeita.
              </p>
            </div>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="bg-red-500 hover:bg-red-600">
                <Trash2 className="w-4 h-4 mr-2" />
                Excluir Minha Conta
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-[#1E293B] border-[#334155]">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-[#F1F5F9]">Tem certeza absoluta?</AlertDialogTitle>
                <AlertDialogDescription className="text-[#64748B]">
                  Esta ação não pode ser desfeita. Isso excluirá permanentemente sua conta e removerá todos os seus
                  dados de nossos servidores, incluindo:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Todas as suas transações financeiras</li>
                    <li>Todos os seus projetos</li>
                    <li>Todos os seus insights e metas</li>
                    <li>Todas as suas leituras</li>
                  </ul>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-[#334155] text-[#F1F5F9] hover:bg-[#475569]">
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  disabled={loading}
                  className="bg-red-500 hover:bg-red-600"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Excluindo...
                    </>
                  ) : (
                    "Sim, excluir minha conta"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </Card>
  )
}
