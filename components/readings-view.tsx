"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, BookOpen, CheckCircle2, Clock } from "lucide-react"

export function ReadingsView() {
  const [books] = useState([
    {
      id: 1,
      title: "Atomic Habits",
      author: "James Clear",
      status: "lendo",
      progress: 45,
      category: "Desenvolvimento Pessoal",
      startDate: "2025-01-01",
    },
    {
      id: 2,
      title: "Clean Code",
      author: "Robert C. Martin",
      status: "lendo",
      progress: 60,
      category: "Tecnologia",
      startDate: "2024-12-15",
    },
    {
      id: 3,
      title: "The Psychology of Money",
      author: "Morgan Housel",
      status: "concluido",
      progress: 100,
      category: "Finanças",
      startDate: "2024-11-01",
      endDate: "2024-12-20",
    },
    {
      id: 4,
      title: "Thinking, Fast and Slow",
      author: "Daniel Kahneman",
      status: "pendente",
      progress: 0,
      category: "Psicologia",
    },
    {
      id: 5,
      title: "Deep Work",
      author: "Cal Newport",
      status: "concluido",
      progress: 100,
      category: "Produtividade",
      startDate: "2024-10-01",
      endDate: "2024-11-15",
    },
  ])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "lendo":
        return <BookOpen className="h-4 w-4" />
      case "concluido":
        return <CheckCircle2 className="h-4 w-4" />
      case "pendente":
        return <Clock className="h-4 w-4" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "lendo":
        return "bg-primary/20 text-primary border-primary/30"
      case "concluido":
        return "bg-green-500/20 text-green-500 border-green-500/30"
      case "pendente":
        return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "lendo":
        return "Lendo"
      case "concluido":
        return "Concluído"
      case "pendente":
        return "Pendente"
      default:
        return status
    }
  }

  const readingBooks = books.filter((b) => b.status === "lendo")
  const completedBooks = books.filter((b) => b.status === "concluido")
  const pendingBooks = books.filter((b) => b.status === "pendente")

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Biblioteca de Leituras 📚</h1>
          <p className="text-muted-foreground text-lg">Organize e acompanhe suas leituras</p>
        </div>
        <Button className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Adicionar Livro
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de Livros</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{books.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{completedBooks.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Lendo Agora</CardTitle>
            <BookOpen className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{readingBooks.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">Todos ({books.length})</TabsTrigger>
          <TabsTrigger value="reading">Lendo ({readingBooks.length})</TabsTrigger>
          <TabsTrigger value="completed">Concluídos ({completedBooks.length})</TabsTrigger>
          <TabsTrigger value="pending">Pendentes ({pendingBooks.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid gap-4">
            {books.map((book) => (
              <Card key={book.id} className="hover:border-primary/30 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex gap-6">
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg text-balance">{book.title}</h3>
                        <p className="text-sm text-muted-foreground">{book.author}</p>
                      </div>

                      {book.status === "lendo" && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Progresso</span>
                            <span className="font-semibold">{book.progress}%</span>
                          </div>
                          <Progress value={book.progress} className="h-2" />
                        </div>
                      )}

                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className={getStatusColor(book.status)}>
                          {getStatusIcon(book.status)}
                          <span className="ml-1">{getStatusLabel(book.status)}</span>
                        </Badge>
                        <Badge variant="outline">{book.category}</Badge>
                        {book.startDate && (
                          <span className="text-xs text-muted-foreground">
                            Iniciado em {new Date(book.startDate).toLocaleDateString("pt-BR")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reading" className="mt-6">
          <div className="grid gap-4">
            {readingBooks.map((book) => (
              <Card key={book.id} className="hover:border-primary/30 transition-colors">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg text-balance">{book.title}</h3>
                      <p className="text-sm text-muted-foreground">{book.author}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progresso</span>
                        <span className="font-semibold text-primary">{book.progress}%</span>
                      </div>
                      <Progress value={book.progress} className="h-2" />
                    </div>
                    <Badge variant="outline">{book.category}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <div className="grid gap-4">
            {completedBooks.map((book) => (
              <Card key={book.id} className="hover:border-primary/30 transition-colors">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg text-balance">{book.title}</h3>
                      <p className="text-sm text-muted-foreground">{book.author}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getStatusColor(book.status)}>
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Concluído
                      </Badge>
                      <Badge variant="outline">{book.category}</Badge>
                    </div>
                    {book.endDate && (
                      <p className="text-xs text-muted-foreground">
                        Concluído em {new Date(book.endDate).toLocaleDateString("pt-BR")}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pending" className="mt-6">
          <div className="grid gap-4">
            {pendingBooks.map((book) => (
              <Card key={book.id} className="hover:border-primary/30 transition-colors">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg text-balance">{book.title}</h3>
                      <p className="text-sm text-muted-foreground">{book.author}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getStatusColor(book.status)}>
                        <Clock className="h-3 w-3 mr-1" />
                        Pendente
                      </Badge>
                      <Badge variant="outline">{book.category}</Badge>
                    </div>
                    <Button variant="outline" size="sm">
                      Começar a Ler
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
