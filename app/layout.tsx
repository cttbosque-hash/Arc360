import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import "./globals.css"
// Se a linha abaixo der erro depois, podemos remover, mas vamos tentar manter
import { AuthProvider } from "@/lib/auth-context" 

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ARC 360 - Assistente Racional Completo",
  description: "Seu assistente pessoal inteligente 360° para finanças, projetos, metas e muito mais",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  )
}
