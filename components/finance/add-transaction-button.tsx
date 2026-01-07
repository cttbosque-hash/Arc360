"use client"

import type React from "react"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { getSupabaseBrowserClient } from "@/lib/supabase-client"
import { useRouter } from "next/navigation"

export function AddTransactionButton() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState({
    type: "income",
    category: "",
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
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

      const { error } = await supabase.from("transactions").insert({
        user_id: user.id,
        type: formData.type,
        category: formData.category,
        amount: Number.parseFloat(formData.amount),
        description: formData.description,
        date: formData.date,
      })

      if (error) throw error

      setOpen(false)
      setFormData({
        type: "income",
        category: "",
        amount: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
      })
      router.refresh()
    } catch (error) {
      console.error("Error adding transaction:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED]">
          <Plus className="w-4 h-4 mr-2" />
          Nova Transação
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#1E293B] border-[#334155]">
        <DialogHeader>
          <DialogTitle className="text-[#F1F5F9]">Adicionar Transação</DialogTitle>
          <DialogDescription className="text-[#64748B]">Registre uma nova transação financeira</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="type" className="text-[#F1F5F9]">
              Tipo
            </Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
              <SelectTrigger className="mt-2 bg-[#0F172A] border-[#334155] text-[#F1F5F9]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1E293B] border-[#334155]">
                <SelectItem value="income">Receita</SelectItem>
                <SelectItem value="expense">Despesa</SelectItem>
                <SelectItem value="investment">Investimento</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="category" className="text-[#F1F5F9]">
              Categoria
            </Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="Ex: Salário, Alimentação, Ações"
              className="mt-2 bg-[#0F172A] border-[#334155] text-[#F1F5F9]"
              required
            />
          </div>

          <div>
            <Label htmlFor="amount" className="text-[#F1F5F9]">
              Valor
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="0,00"
              className="mt-2 bg-[#0F172A] border-[#334155] text-[#F1F5F9]"
              required
            />
          </div>

          <div>
            <Label htmlFor="date" className="text-[#F1F5F9]">
              Data
            </Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="mt-2 bg-[#0F172A] border-[#334155] text-[#F1F5F9]"
              required
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-[#F1F5F9]">
              Descrição (opcional)
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Adicione detalhes sobre a transação"
              className="mt-2 bg-[#0F172A] border-[#334155] text-[#F1F5F9]"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="flex-1 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED]">
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
