"use client"

import type React from "react"

import { useState } from "react"
import { Key, Smartphone, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function AccountSecurity() {
  const [loading, setLoading] = useState(false)
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  })

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Implementar mudança de senha
      await new Promise((resolve) => setTimeout(resolve, 1000))
    } catch (error) {
      console.error("Error changing password:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-[#1E293B] border-[#334155] p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-[#4F46E5]/20 flex items-center justify-center">
            <Key className="w-6 h-6 text-[#4F46E5]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#F1F5F9]">Alterar Senha</h3>
            <p className="text-sm text-[#64748B]">Mantenha sua conta segura</p>
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <Label htmlFor="current" className="text-[#F1F5F9]">
              Senha Atual
            </Label>
            <Input
              id="current"
              type="password"
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
              className="mt-2 bg-[#0F172A] border-[#334155] text-[#F1F5F9]"
              required
            />
          </div>

          <div>
            <Label htmlFor="new" className="text-[#F1F5F9]">
              Nova Senha
            </Label>
            <Input
              id="new"
              type="password"
              value={passwords.new}
              onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
              className="mt-2 bg-[#0F172A] border-[#334155] text-[#F1F5F9]"
              required
            />
          </div>

          <div>
            <Label htmlFor="confirm" className="text-[#F1F5F9]">
              Confirmar Nova Senha
            </Label>
            <Input
              id="confirm"
              type="password"
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
              className="mt-2 bg-[#0F172A] border-[#334155] text-[#F1F5F9]"
              required
            />
          </div>

          <Button type="submit" disabled={loading} className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED]">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Alterando...
              </>
            ) : (
              "Alterar Senha"
            )}
          </Button>
        </form>
      </Card>

      <Card className="bg-[#1E293B] border-[#334155] p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#06D6A0]/20 flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-[#06D6A0]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#F1F5F9]">Autenticação em Dois Fatores</h3>
              <p className="text-sm text-[#64748B]">Adicione uma camada extra de segurança</p>
            </div>
          </div>
          <Badge className="bg-[#64748B]/20 text-[#64748B]">Em Breve</Badge>
        </div>

        <p className="text-sm text-[#94A3B8]">
          A autenticação em dois fatores adiciona uma camada extra de proteção à sua conta, exigindo um código adicional
          além da sua senha.
        </p>
      </Card>
    </div>
  )
}
