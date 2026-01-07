import { getSupabaseServerClient } from "./supabase-server"
import bcrypt from "bcryptjs"

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  image_url?: string
  financial_goal: number
  monthly_income?: number
  currency: string
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const supabase = await getSupabaseServerClient()

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return null
    }

    const { data: user } = await supabase.from("users").select("*").eq("id", session.user.id).single()

    return user
  } catch (error) {
    console.error("[v0] Error getting current user:", error)
    return null
  }
}

export async function signUp(data: { email: string; password: string; name: string; phone?: string }) {
  const supabase = await getSupabaseServerClient()

  // Hash da senha
  const passwordHash = await bcrypt.hash(data.password, 10)

  // Criar usuário no Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
  })

  if (authError) {
    console.error("[v0] Auth signup error:", authError)
    throw new Error(authError.message)
  }

  if (!authData.user) {
    throw new Error("Failed to create user")
  }

  console.log("[v0] User created in auth, creating DB record...")

  // Criar registro na tabela users
  const { error: dbError } = await supabase.from("users").insert({
    id: authData.user.id,
    email: data.email,
    name: data.name,
    phone: data.phone,
    password_hash: passwordHash,
  })

  if (dbError) {
    console.error("[v0] Database insert error:", dbError)
    throw new Error(dbError.message)
  }

  console.log("[v0] User DB record created, creating preferences...")

  // Criar preferências padrão
  await supabase.from("user_preferences").insert({
    user_id: authData.user.id,
  })

  console.log("[v0] User signup completed successfully")

  return authData
}

export async function signIn(email: string, password: string) {
  const supabase = await getSupabaseServerClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function signOut() {
  const supabase = await getSupabaseServerClient()
  await supabase.auth.signOut()
}

export async function requestPasswordReset(email: string) {
  const supabase = await getSupabaseServerClient()

  // Gerar token de 6 dígitos
  const token = Math.floor(100000 + Math.random() * 900000).toString()

  // Buscar usuário
  const { data: user } = await supabase.from("users").select("id").eq("email", email).single()

  if (!user) {
    throw new Error("User not found")
  }

  // Salvar token
  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + 1) // 1 hora de validade

  await supabase.from("password_reset_tokens").insert({
    user_id: user.id,
    token,
    expires_at: expiresAt.toISOString(),
  })

  // Aqui você enviaria o email com o token
  console.log(`Password reset token for ${email}: ${token}`)

  return { success: true, token } // Apenas para desenvolvimento
}

export async function resetPassword(token: string, newPassword: string) {
  const supabase = await getSupabaseServerClient()

  // Verificar token
  const { data: resetToken } = await supabase
    .from("password_reset_tokens")
    .select("*, users(email)")
    .eq("token", token)
    .eq("used", false)
    .gt("expires_at", new Date().toISOString())
    .single()

  if (!resetToken) {
    throw new Error("Invalid or expired token")
  }

  // Hash da nova senha
  const passwordHash = await bcrypt.hash(newPassword, 10)

  // Atualizar senha no banco
  await supabase.from("users").update({ password_hash: passwordHash }).eq("id", resetToken.user_id)

  // Marcar token como usado
  await supabase.from("password_reset_tokens").update({ used: true }).eq("id", resetToken.id)

  // Atualizar senha no Supabase Auth
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (error) {
    throw new Error(error.message)
  }

  return { success: true }
}
