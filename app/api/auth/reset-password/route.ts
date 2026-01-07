import { NextResponse } from "next/server"
import { resetPassword } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { token, newPassword } = body

    if (!token || !newPassword) {
      return NextResponse.json({ error: "Token e nova senha são obrigatórios" }, { status: 400 })
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: "A senha deve ter no mínimo 8 caracteres" }, { status: 400 })
    }

    await resetPassword(token, newPassword)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Password reset error:", error)
    return NextResponse.json({ error: error.message || "Erro ao redefinir senha" }, { status: 500 })
  }
}
