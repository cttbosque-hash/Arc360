"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, BookOpen, BookMarked, TrendingUp } from "lucide-react"

export default function ReadingsPage() {
  const [books, setBooks] = useState<any[]>([])

  useEffect(() => {
    // Dados mockados de leituras
    setBooks([
      {
        id: 1,
        title: "Atomic Habits",
        author: "James Clear",
        status: "reading",
        progress: 65,
        totalPages: 320,
        currentPage: 208,
        rating: 0,
        notes: "Excelente livro sobre formação de hábitos",
      },
      {
        id: 2,
        title: "Deep Work",
        author: "Cal Newport",
        status: "completed",
        progress: 100,
        totalPages: 296,
        currentPage: 296,
        rating: 5,
        notes: "Mudou minha forma de trabalhar",
      },
      {
        id: 3,
        title: "The Lean Startup",
        author: "Eric Ries",
        status: "want_to_read",
        progress: 0,
        totalPages: 336,
        currentPage: 0,
        rating: 0,
        notes: "",
      },
    ])
  }, [])

  const statusColors: any = {
    reading: "bg-[#4F46E5] text-white",
    completed: "bg-[#06D6A0] text-white",
    want_to_read: "bg-[#64748B] text-white",
  }

  const statusLabels: any = {
    reading: "Lendo",
    completed: "Concluído",
    want_to_read: "Quero Ler",
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#F1F5F9]">Leituras</h1>
          <p className="text-[#64748B] mt-1">Organize sua biblioteca e acompanhe seu progresso</p>
        </div>
        <Button className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED]">
          <PlusCircle className="w-4 h-4 mr-2" />
          Adicionar Livro
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-[#1E293B] border-[#334155]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#94A3B8]">Total de Livros</CardTitle>
            <BookOpen className="w-4 h-4 text-[#4F46E5]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#F1F5F9]">{books.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-[#1E293B] border-[#334155]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#94A3B8]">Lendo Agora</CardTitle>
            <BookMarked className="w-4 h-4 text-[#F59E0B]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#F1F5F9]">
              {books.filter((b) => b.status === "reading").length}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1E293B] border-[#334155]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#94A3B8]">Concluídos</CardTitle>
            <TrendingUp className="w-4 h-4 text-[#06D6A0]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#F1F5F9]">
              {books.filter((b) => b.status === "completed").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {books.map((book) => (
          <Card key={book.id} className="bg-[#1E293B] border-[#334155] hover:border-[#4F46E5] transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-[#F1F5F9] text-lg">{book.title}</CardTitle>
                  <p className="text-sm text-[#94A3B8] mt-1">{book.author}</p>
                </div>
                <Badge className={statusColors[book.status]}>{statusLabels[book.status]}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {book.status !== "want_to_read" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#64748B]">Progresso</span>
                    <span className="text-[#F1F5F9] font-medium">
                      {book.currentPage} / {book.totalPages} páginas ({book.progress}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#334155] rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] h-2 rounded-full transition-all"
                      style={{ width: `${book.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {book.status === "completed" && book.rating > 0 && (
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < book.rating ? "text-[#F59E0B]" : "text-[#334155]"}>
                      ★
                    </span>
                  ))}
                </div>
              )}

              {book.notes && <p className="text-sm text-[#94A3B8] pt-2 border-t border-[#334155]">{book.notes}</p>}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
