"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Camera, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getSupabaseBrowserClient } from "@/lib/supabase-client"

interface ProfileFormProps {
  user: {
    id: string
    name: string
    email: string
    phone?: string
    image_url?: string
  }
}

export function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = getSupabaseBrowserClient()

      const { error } = await supabase
        .from("users")
        .update({
          name: formData.name,
          phone: formData.phone,
        })
        .eq("id", user.id)

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <Card className="bg-[#1E293B] border-[#334155] p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center gap-6">
          <div className="relative">
            <Avatar className="w-24 h-24">
              <AvatarImage src={user.image_url || "/placeholder.svg"} />
              <AvatarFallback className="bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] text-white text-2xl">
                {initials}
              </AvatarFallback>
            </Avatar>
            <button
              type="button"
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#4F46E5] flex items-center justify-center hover:bg-[#4338CA] transition-colors"
            >
              <Camera className="w-4 h-4 text-white" />
            </button>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#F1F5F9]">{user.name}</h3>
            <p className="text-sm text-[#64748B]">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name" className="text-[#F1F5F9]">
              Nome Completo
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-2 bg-[#0F172A] border-[#334155] text-[#F1F5F9]"
              required
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-[#F1F5F9]">
              Email Principal
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              disabled
              className="mt-2 bg-[#0F172A] border-[#334155] text-[#64748B]"
            />
            <p className="text-xs text-[#64748B] mt-1">O email principal não pode ser alterado</p>
          </div>

          <div>
            <Label htmlFor="phone" className="text-[#F1F5F9]">
              Telefone
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+55 11 99999-9999"
              className="mt-2 bg-[#0F172A] border-[#334155] text-[#F1F5F9]"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading} className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED]">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar Alterações"
            )}
          </Button>
        </div>
      </form>
    </Card>
  )
}
