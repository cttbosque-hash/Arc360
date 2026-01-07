import { NextResponse } from "next/server"
import { requestPasswordReset } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json({ error: "Email é obrigatório" }, { status: 400 })
    }

    const result = await requestPasswordReset(email)

    return NextResponse.json({ success: true, token: result.token })
  } catch (error: any) {
    console.error("Password reset request error:", error)
    return NextResponse.json({ error: error.message || "Erro ao solicitar redefinição de senha" }, { status: 500 })
  }
}
