"use client"

import type React from "react"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  BookOpen,
  Calendar,
  Smile,
  Meh,
  Frown,
  Plus,
  Save,
  ImagePlus,
  Bold,
  Italic,
  List,
  Lightbulb,
} from "lucide-react"

export default function JournalPage() {
  const moods = [
    { value: "amazing", icon: "🤩", label: "Incrível", color: "from-green-400 to-emerald-400" },
    { value: "good", icon: "😊", label: "Bem", color: "from-blue-400 to-cyan-400" },
    { value: "okay", icon: "😐", label: "Normal", color: "from-yellow-400 to-orange-400" },
    { value: "bad", icon: "😔", label: "Mal", color: "from-orange-400 to-red-400" },
    { value: "terrible", icon: "😢", label: "Terrível", color: "from-red-400 to-pink-400" },
  ]

  const dailyPrompts = [
    "O que te deixou grato(a) hoje?",
    "Qual foi o seu maior aprendizado hoje?",
    "Como você se sentiu ao longo do dia?",
    "O que você poderia ter feito diferente?",
    "Qual foi o momento mais marcante do seu dia?",
    "O que você quer lembrar sobre hoje daqui a 10 anos?",
  ]

  const [entries, setEntries] = useState([
    {
      id: 1,
      date: "2025-01-10",
      mood: "happy",
      title: "Dia produtivo",
      content:
        "Consegui finalizar todos os projetos do dia. Me sinto realizado e motivado para continuar. A reunião com a equipe foi excelente e todos estão alinhados.",
      tags: ["Trabalho", "Produtividade"],
      images: [],
    },
    {
      id: 2,
      date: "2025-01-09",
      mood: "neutral",
      title: "Reflexões sobre o futuro",
      content:
        "Passei o dia pensando sobre meus objetivos de longo prazo. Preciso organizar melhor minhas prioridades e focar no que realmente importa.",
      tags: ["Reflexão", "Planejamento"],
      images: [],
    },
    {
      id: 3,
      date: "2025-01-08",
      mood: "happy",
      title: "Conquista pessoal",
      content:
        "Finalmente consegui manter minha rotina de exercícios por 30 dias seguidos! Me sinto mais energizado e saudável.",
      tags: ["Saúde", "Conquista"],
      images: [],
    },
  ])

  const [isWriting, setIsWriting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingEntry, setEditingEntry] = useState<any>(null)
  const [selectedMood, setSelectedMood] = useState("")
  const [todayPrompt] = useState(dailyPrompts[Math.floor(Math.random() * dailyPrompts.length)])
  const [entryTitle, setEntryTitle] = useState("")
  const [entryContent, setEntryContent] = useState("")
  const [uploadedImages, setUploadedImages] = useState<string[]>([])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const imageUrls = Array.from(files).map((file) => URL.createObjectURL(file))
      setUploadedImages([...uploadedImages, ...imageUrls])
    }
  }

  const saveEntry = () => {
    if (entryTitle.trim() && entryContent.trim() && selectedMood) {
      const newEntry = {
        id: Date.now(),
        date: new Date().toISOString().split("T")[0],
        mood: selectedMood,
        title: entryTitle,
        content: entryContent,
        tags: ["Diário"],
        images: uploadedImages,
      }
      setEntries([newEntry, ...entries])
      setEntryTitle("")
      setEntryContent("")
      setSelectedMood("")
      setUploadedImages([])
      setIsWriting(false)
    }
  }

  const handleSaveEdit = () => {
    if (editingEntry) {
      const updatedEntries = entries.map((e) => (e.id === editingEntry.id ? editingEntry : e))
      setEntries(updatedEntries)
      localStorage.setItem("arc360_journal_entries", JSON.stringify(updatedEntries))
      setIsEditing(false)
      setEditingEntry(null)
    }
  }

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case "happy":
        return <Smile className="w-5 h-5 text-green-400" />
      case "neutral":
        return <Meh className="w-5 h-5 text-yellow-400" />
      case "sad":
        return <Frown className="w-5 h-5 text-red-400" />
      default:
        return <Meh className="w-5 h-5 text-gray-400" />
    }
  }

  const getMoodLabel = (mood: string) => {
    switch (mood) {
      case "happy":
        return "Feliz"
      case "neutral":
        return "Neutro"
      case "sad":
        return "Triste"
      default:
        return mood
    }
  }

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case "happy":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      case "neutral":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
      case "sad":
        return "bg-red-500/10 text-red-400 border-red-500/20"
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20"
    }
  }

  const moodCounts = {
    happy: entries.filter((e) => e.mood === "happy").length,
    neutral: entries.filter((e) => e.mood === "neutral").length,
    sad: entries.filter((e) => e.mood === "sad").length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Diário
          </h1>
          <p className="text-muted-foreground mt-1">Registre seus pensamentos e reflexões diárias</p>
        </div>
        <Button
          onClick={() => setIsWriting(!isWriting)}
          className="bg-gradient-to-r from-blue-500 to-purple-500 btn-3d"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Entrada
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4 border-border/50 bg-gradient-to-br from-blue-500/5 to-blue-600/5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <BookOpen className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total de Entradas</p>
              <p className="text-2xl font-bold">{entries.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-border/50 bg-gradient-to-br from-green-500/5 to-green-600/5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <Smile className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Dias Felizes</p>
              <p className="text-2xl font-bold">{moodCounts.happy}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-border/50 bg-gradient-to-br from-yellow-500/5 to-yellow-600/5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-500/10">
              <Meh className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Dias Neutros</p>
              <p className="text-2xl font-bold">{moodCounts.neutral}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-border/50 bg-gradient-to-br from-red-500/5 to-red-600/5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/10">
              <Frown className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Dias Difíceis</p>
              <p className="text-2xl font-bold">{moodCounts.sad}</p>
            </div>
          </div>
        </Card>
      </div>

      {isWriting && (
        <Card className="p-6 border-border/50 bg-gradient-to-br from-blue-500/5 to-purple-500/5">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Como você está se sentindo hoje?</h3>
            <div className="flex gap-3">
              {moods.map((mood) => (
                <button
                  key={mood.value}
                  onClick={() => setSelectedMood(mood.value)}
                  className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                    selectedMood === mood.value
                      ? `border-cyan-500 bg-gradient-to-br ${mood.color} bg-opacity-10 scale-105`
                      : "border-border/50 hover:border-cyan-500/50 hover:scale-102"
                  }`}
                >
                  <div className="text-4xl mb-2">{mood.icon}</div>
                  <div className="text-sm font-medium">{mood.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6 p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-cyan-400 mb-1">Pergunta do Dia</p>
                <p className="text-base">{todayPrompt}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Título da entrada..."
              value={entryTitle}
              onChange={(e) => setEntryTitle(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />

            <div className="relative">
              <Textarea
                placeholder="Escreva seus pensamentos..."
                value={entryContent}
                onChange={(e) => setEntryContent(e.target.value)}
                className="min-h-[250px] resize-none focus:ring-2 focus:ring-cyan-500"
              />

              <div className="absolute bottom-3 left-3 flex gap-2">
                <label className="cursor-pointer">
                  <Button variant="ghost" size="sm" className="h-8 px-2" asChild>
                    <span>
                      <ImagePlus className="w-4 h-4" />
                    </span>
                  </Button>
                  <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                </label>
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  <Bold className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  <Italic className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {uploadedImages.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {uploadedImages.map((img, idx) => (
                  <div key={idx} className="relative">
                    <img src={img || "/placeholder.svg"} alt="Upload" className="w-20 h-20 object-cover rounded-lg" />
                    <button
                      onClick={() => setUploadedImages(uploadedImages.filter((_, i) => i !== idx))}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={saveEntry}
                disabled={!entryTitle || !entryContent || !selectedMood}
                className="bg-gradient-to-r from-blue-500 to-purple-500 disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
              <Button variant="outline" onClick={() => setIsWriting(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="space-y-4">
        {entries.map((entry) => (
          <Card key={entry.id} className="p-6 border-border/50 hover:border-blue-500/50 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  {new Date(entry.date).toLocaleDateString("pt-BR", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <Badge variant="outline" className={getMoodColor(entry.mood)}>
                  {getMoodIcon(entry.mood)}
                  <span className="ml-1">{getMoodLabel(entry.mood)}</span>
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditingEntry(JSON.parse(JSON.stringify(entry)))
                  setIsEditing(true)
                }}
                className="text-[#00D9FF] hover:text-[#00D9FF]/80"
              >
                Editar
              </Button>
            </div>
            <h3 className="text-xl font-semibold mb-2">{entry.title}</h3>
            <p className="text-muted-foreground mb-4">{entry.content}</p>
            <div className="flex gap-2">
              {entry.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                  {tag}
                </Badge>
              ))}
            </div>
            {entry.images.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {entry.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img || "/placeholder.svg"}
                    alt="Entry Image"
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-3xl bg-[#1E293B] border-[#334155] text-[#F1F5F9]">
          <DialogHeader>
            <DialogTitle className="text-2xl">Editar Entrada</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium text-[#94A3B8]">Humor</label>
              <div className="flex gap-2 mt-2">
                <Button
                  variant={editingEntry?.mood === "happy" ? "default" : "outline"}
                  onClick={() => setEditingEntry({ ...editingEntry, mood: "happy" })}
                >
                  😊 Feliz
                </Button>
                <Button
                  variant={editingEntry?.mood === "neutral" ? "default" : "outline"}
                  onClick={() => setEditingEntry({ ...editingEntry, mood: "neutral" })}
                >
                  😐 Neutro
                </Button>
                <Button
                  variant={editingEntry?.mood === "sad" ? "default" : "outline"}
                  onClick={() => setEditingEntry({ ...editingEntry, mood: "sad" })}
                >
                  😔 Triste
                </Button>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-[#94A3B8]">Título</label>
              <input
                type="text"
                value={editingEntry?.title || ""}
                onChange={(e) => setEditingEntry({ ...editingEntry, title: e.target.value })}
                className="w-full mt-1 px-4 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#94A3B8]">Conteúdo</label>
              <Textarea
                value={editingEntry?.content || ""}
                onChange={(e) => setEditingEntry({ ...editingEntry, content: e.target.value })}
                className="min-h-[200px] resize-none focus:ring-2 focus:ring-[#00D9FF]"
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleSaveEdit} className="bg-gradient-to-r from-[#00D9FF] to-[#0EA5E9] btn-3d flex-1">
                Salvar Alterações
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false)
                  setEditingEntry(null)
                }}
                className="border-[#334155]"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
