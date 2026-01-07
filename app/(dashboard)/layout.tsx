"use client"

import type React from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/supabaseClient"
import { Loader2 } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [userProfile, setUserProfile] = useState<any>(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser()

        if (!currentUser) {
          router.push("/")
          return
        }

        setUser(currentUser)
        setUserProfile({
          id: currentUser.id,
          name: currentUser.user_metadata?.full_name || currentUser.email?.split("@")[0] || "Usuário",
          nickname:
            currentUser.user_metadata?.nickname || currentUser.user_metadata?.full_name?.split(" ")[0] || "Usuário",
          email: currentUser.email,
          image_url: currentUser.user_metadata?.avatar_url || "",
          subscription_plan: "premium",
        })
      } catch (error) {
        console.error("[v0] Auth error:", error)
        router.push("/")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (loading || !user || !userProfile) {
    return (
      <div className="min-h-screen bg-[#0A0E27] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-[#00D9FF] animate-spin mx-auto mb-4" />
          <div className="text-[#F1F5F9] text-xl">Carregando...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0E27] flex">
      <DashboardSidebar user={userProfile} />

      <div className="flex-1 flex flex-col">
        <DashboardHeader user={userProfile} />

        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
