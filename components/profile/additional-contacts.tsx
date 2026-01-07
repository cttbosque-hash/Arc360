"use client"
import { Plus, Mail, Phone, Trash2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface AdditionalContactsProps {
  emails: Array<{
    id: string
    email: string
    is_primary: boolean
    verified: boolean
  }>
  phones: Array<{
    id: string
    phone: string
    country_code: string
    is_primary: boolean
    verified: boolean
  }>
}

export function AdditionalContacts({ emails, phones }: AdditionalContactsProps) {
  return (
    <div className="space-y-6">
      <Card className="bg-[#1E293B] border-[#334155] p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#F1F5F9]">Emails Adicionais</h3>
          <Button size="sm" className="bg-[#4F46E5]">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Email
          </Button>
        </div>

        {emails.length === 0 ? (
          <p className="text-[#64748B] text-center py-6">Nenhum email adicional cadastrado</p>
        ) : (
          <div className="space-y-3">
            {emails.map((email) => (
              <div
                key={email.id}
                className="flex items-center justify-between p-3 rounded-lg bg-[#0F172A]/50 border border-[#334155]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#4F46E5]/20 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-[#4F46E5]" />
                  </div>
                  <div>
                    <p className="text-[#F1F5F9] font-medium">{email.email}</p>
                    <div className="flex gap-2 mt-1">
                      {email.is_primary && <Badge className="bg-[#06D6A0]/20 text-[#06D6A0]">Principal</Badge>}
                      {email.verified ? (
                        <Badge className="bg-[#4F46E5]/20 text-[#4F46E5]">Verificado</Badge>
                      ) : (
                        <Badge className="bg-[#64748B]/20 text-[#64748B]">Não verificado</Badge>
                      )}
                    </div>
                  </div>
                </div>
                {!email.is_primary && (
                  <Button variant="ghost" size="icon">
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card className="bg-[#1E293B] border-[#334155] p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#F1F5F9]">Telefones Adicionais</h3>
          <Button size="sm" className="bg-[#4F46E5]">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Telefone
          </Button>
        </div>

        {phones.length === 0 ? (
          <p className="text-[#64748B] text-center py-6">Nenhum telefone adicional cadastrado</p>
        ) : (
          <div className="space-y-3">
            {phones.map((phone) => (
              <div
                key={phone.id}
                className="flex items-center justify-between p-3 rounded-lg bg-[#0F172A]/50 border border-[#334155]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#7C3AED]/20 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-[#7C3AED]" />
                  </div>
                  <div>
                    <p className="text-[#F1F5F9] font-medium">
                      {phone.country_code} {phone.phone}
                    </p>
                    <div className="flex gap-2 mt-1">
                      {phone.is_primary && <Badge className="bg-[#06D6A0]/20 text-[#06D6A0]">Principal</Badge>}
                      {phone.verified ? (
                        <Badge className="bg-[#4F46E5]/20 text-[#4F46E5]">Verificado</Badge>
                      ) : (
                        <Badge className="bg-[#64748B]/20 text-[#64748B]">Não verificado</Badge>
                      )}
                    </div>
                  </div>
                </div>
                {!phone.is_primary && (
                  <Button variant="ghost" size="icon">
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
