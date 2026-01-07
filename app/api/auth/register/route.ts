import { NextResponse } from "next/server"
import { signUp } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, password } = body

    console.log("[v0] Registration request received for:", email)

    // Validações
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Todos os campos obrigatórios devem ser preenchidos" }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "A senha deve ter no mínimo 8 caracteres" }, { status: 400 })
    }

    console.log("[v0] Validation passed, creating user...")

    // Criar usuário
    const result = await signUp({ name, email, phone, password })

    console.log("[v0] User created successfully")

    return NextResponse.json({ success: true, user: result.user })
  } catch (error: any) {
    console.error("[v0] Registration error:", error)
    return NextResponse.json({ error: error.message || "Erro ao criar conta" }, { status: 500 })
  }
}
