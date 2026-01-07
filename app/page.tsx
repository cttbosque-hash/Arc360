"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRouter } from "next/navigation"
import { signIn, signUp, getCurrentUser } from "@/lib/supabaseClient"

function ArcLogo() {
  return (
    <div className="relative w-48 h-48 mx-auto mb-6">
      <img
        src="/images/api-attachments-k6hggwbdppsfww9bfh0te.jpg"
        alt="ARC 360 Logo"
        className="w-full h-full object-contain"
      />
    </div>
  )
}

export default function HomePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [checkingAuth, setCheckingAuth] = useState(true)

  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  const [registerName, setRegisterName] = useState("")
  const [registerNickname, setRegisterNickname] = useState("")
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("")

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await getCurrentUser()
        if (user) {
          router.push("/dashboard")
        }
      } catch (error) {
        console.error("[v0] Error checking auth:", error)
      } finally {
        setCheckingAuth(false)
      }
    }
    checkUser()
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      await signIn(loginEmail, loginPassword)
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message || "Erro ao fazer login. Verifique suas credenciais.")
      console.error("[v0] Login error:", err)
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (registerPassword !== registerConfirmPassword) {
      setError("As senhas não coincidem")
      setIsLoading(false)
      return
    }

    if (registerPassword.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres")
      setIsLoading(false)
      return
    }

    try {
      await signUp(registerEmail, registerPassword, registerName)
      // Após cadastro, fazer login automático
      await signIn(registerEmail, registerPassword)
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message || "Erro ao criar conta. Tente novamente.")
      console.error("[v0] Register error:", err)
      setIsLoading(false)
    }
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#0A0E27] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#00D9FF]" />
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-[#0A0E27] overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00D9FF] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#0891B2] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-[#06D6A0] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <ArcLogo />
            <h1 className="text-6xl font-bold mb-3">
              <span className="bg-gradient-to-r from-[#00D9FF] via-[#06D6A0] to-[#0891B2] bg-clip-text text-transparent drop-shadow-2xl">
                ARC 360
              </span>
            </h1>
            <p className="text-[#94A3B8] text-xl font-light">Assistente Racional Completo 360°</p>
          </div>

          <Card className="border-[#1E293B]/50 bg-[#131729]/95 backdrop-blur-2xl shadow-2xl shadow-[#00D9FF]/10">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Bem-vindo</CardTitle>
              <CardDescription className="text-[#94A3B8]">Faça login ou crie sua conta para começar</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-[#0F1629]">
                  <TabsTrigger
                    value="login"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00D9FF] data-[state=active]:to-[#0891B2] data-[state=active]:text-[#0A0E27] data-[state=active]:font-semibold"
                  >
                    Login
                  </TabsTrigger>
                  <TabsTrigger
                    value="register"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00D9FF] data-[state=active]:to-[#0891B2] data-[state=active]:text-[#0A0E27] data-[state=active]:font-semibold"
                  >
                    Cadastro
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email" className="text-white">
                        Email
                      </Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="seu@email.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                        className="bg-[#0F1629] border-[#334155] text-white focus:border-[#00D9FF] focus:ring-[#00D9FF]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password" className="text-white">
                        Senha
                      </Label>
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                        className="bg-[#0F1629] border-[#334155] text-white focus:border-[#00D9FF] focus:ring-[#00D9FF]"
                      />
                    </div>

                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-[#00D9FF] to-[#0891B2] hover:from-[#00C3E6] hover:to-[#077A8F] text-[#0A0E27] font-semibold shadow-lg shadow-[#00D9FF]/30"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Entrando...
                        </>
                      ) : (
                        "Entrar"
                      )}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="register">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-name" className="text-white">
                        Nome Completo
                      </Label>
                      <Input
                        id="register-name"
                        type="text"
                        placeholder="Seu nome"
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        required
                        className="bg-[#0F1629] border-[#334155] text-white focus:border-[#00D9FF] focus:ring-[#00D9FF]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-nickname" className="text-white">
                        Como quer ser chamado?
                      </Label>
                      <Input
                        id="register-nickname"
                        type="text"
                        placeholder="Ex: João, Maria, etc"
                        value={registerNickname}
                        onChange={(e) => setRegisterNickname(e.target.value)}
                        className="bg-[#0F1629] border-[#334155] text-white focus:border-[#00D9FF] focus:ring-[#00D9FF]"
                      />
                      <p className="text-xs text-[#94A3B8]">Opcional - será usado na saudação</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-email" className="text-white">
                        Email
                      </Label>
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="seu@email.com"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        required
                        className="bg-[#0F1629] border-[#334155] text-white focus:border-[#00D9FF] focus:ring-[#00D9FF]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password" className="text-white">
                        Senha
                      </Label>
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        required
                        className="bg-[#0F1629] border-[#334155] text-white focus:border-[#00D9FF] focus:ring-[#00D9FF]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-confirm-password" className="text-white">
                        Confirmar Senha
                      </Label>
                      <Input
                        id="register-confirm-password"
                        type="password"
                        placeholder="Digite a senha novamente"
                        value={registerConfirmPassword}
                        onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                        required
                        className="bg-[#0F1629] border-[#334155] text-white focus:border-[#00D9FF] focus:ring-[#00D9FF]"
                      />
                    </div>

                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-[#00D9FF] to-[#0891B2] hover:from-[#00C3E6] hover:to-[#077A8F] text-[#0A0E27] font-semibold shadow-lg shadow-[#00D9FF]/30"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Criando conta...
                        </>
                      ) : (
                        "Criar Conta"
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <footer className="mt-8 text-center text-[#64748B] text-sm">
          <p>© 2026 Arc360. Todos os direitos reservados.</p>
        </footer>
      </div>
    </div>
  )
}
