"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Mic, MicOff, ImageIcon, Volume2, Loader2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  imageUrl?: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Olá! Sou seu assistente pessoal ARC 360 com acesso contextual às suas informações. Como posso ajudá-lo hoje? Posso ver imagens, ouvir áudios, conversar naturalmente e acessar suas tarefas, projetos e finanças.",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  const quickSuggestions = ["Resumir meu dia", "Planejar semana", "Analisar gastos", "Ver tarefas pendentes"]

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const getContextualResponse = async (userMessage: string) => {
    // Simulate RAG by checking localStorage data
    const tasks = JSON.parse(localStorage.getItem("arc360_tasks") || "[]")
    const habits = JSON.parse(localStorage.getItem("arc360_habits") || "[]")
    const user = JSON.parse(localStorage.getItem("arc360_user") || "{}")

    let contextPrompt = `Você é o assistente pessoal ARC 360 do usuário ${user.name || ""}. `

    if (userMessage.toLowerCase().includes("hoje") || userMessage.toLowerCase().includes("dia")) {
      contextPrompt += `O usuário tem ${tasks.filter((t: any) => !t.completed).length} tarefas pendentes hoje. `
    }

    return contextPrompt
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() && !selectedImage) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
      imageUrl: selectedImage || undefined,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setSelectedImage(null)
    setIsLoading(true)

    const contextPrompt = await getContextualResponse(inputMessage)

    try {
      const apiMessages = []

      if (selectedImage) {
        // Convert image to base64 if needed
        const base64Image = selectedImage.startsWith("data:") ? selectedImage.split(",")[1] : selectedImage

        apiMessages.push({
          role: "user",
          content: [
            { type: "text", text: inputMessage || "O que você vê nesta imagem?" },
            {
              type: "image_url",
              image_url: { url: `data:image/jpeg;base64,${base64Image}` },
            },
          ],
        })
      } else {
        apiMessages.push({
          role: "user",
          content: inputMessage,
        })
      }

      const response = await fetch("https://llm.blackbox.ai/chat/completions", {
        method: "POST",
        headers: {
          customerId: "cus_T6M7guvcfbQL1M",
          "Content-Type": "application/json",
          Authorization: "Bearer xxx",
        },
        body: JSON.stringify({
          model: "openrouter/claude-sonnet-4",
          messages: [
            {
              role: "system",
              content:
                contextPrompt +
                "Ajude o usuário a organizar tarefas, projetos, metas e finanças. Seja prestativo, conciso e amigável.",
            },
            ...apiMessages,
          ],
        }),
      })

      const data = await response.json()
      const aiResponse = data.choices[0].message.content

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      if (aiResponse) {
        speakText(aiResponse)
      }
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const speakText = async (text: string) => {
    setIsSpeaking(true)
    try {
      const response = await fetch(
        "https://elevenlabs-proxy-server-lipn.onrender.com/v1/text-to-speech/JBFqnCBsd6RMkjVDRZzb",
        {
          method: "POST",
          headers: {
            customerId: "cus_T6M7guvcfbQL1M",
            "Content-Type": "application/json",
            Authorization: "Bearer xxx",
            Accept: "audio/mpeg",
          },
          body: JSON.stringify({
            text: text,
            model_id: "eleven_multilingual_v2",
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.8,
            },
          }),
        },
      )

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)
      audio.play()

      audio.onended = () => {
        setIsSpeaking(false)
        URL.revokeObjectURL(audioUrl)
      }
    } catch (error) {
      console.error("Error speaking text:", error)
      setIsSpeaking(false)
    }
  }

  const toggleRecording = async () => {
    if (isRecording) {
      // Stop recording
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop()
      }
      setIsRecording(false)
    } else {
      // Start recording
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const mediaRecorder = new MediaRecorder(stream)
        mediaRecorderRef.current = mediaRecorder
        audioChunksRef.current = []

        mediaRecorder.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data)
        }

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
          await transcribeAudio(audioBlob)
          stream.getTracks().forEach((track) => track.stop())
        }

        mediaRecorder.start()
        setIsRecording(true)
      } catch (error) {
        console.error("Error accessing microphone:", error)
        alert("Não foi possível acessar o microfone. Verifique as permissões.")
      }
    }
  }

  const transcribeAudio = async (audioBlob: Blob) => {
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append("file", audioBlob, "audio.wav")
      formData.append("model_id", "scribe_v1")

      const response = await fetch("https://elevenlabs-proxy-server-lipn.onrender.com/v1/speech-to-text", {
        method: "POST",
        headers: {
          customerId: "cus_T6M7guvcfbQL1M",
          Authorization: "Bearer xxx",
        },
        body: formData,
      })

      const data = await response.json()
      const transcription = data.text || data.transcription

      if (transcription) {
        setInputMessage(transcription)
      }
    } catch (error) {
      console.error("Error transcribing audio:", error)
      alert("Erro ao transcrever áudio. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-[#1E293B] p-6 bg-[#0F1629]">
        <h1 className="text-2xl font-bold text-white mb-1">Chat IA</h1>
        <p className="text-[#94A3B8]">Converse naturalmente, envie imagens e use comandos de voz</p>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-6" ref={scrollRef}>
        <div className="space-y-4 max-w-4xl mx-auto">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              {message.role === "assistant" && (
                <Avatar className="w-8 h-8 mt-1">
                  <AvatarFallback className="bg-gradient-to-br from-[#00D9FF] to-[#0891B2] text-[#0A0E27]">
                    AI
                  </AvatarFallback>
                </Avatar>
              )}

              <div className={`flex flex-col gap-2 max-w-[70%]`}>
                <Card
                  className={`p-4 ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-[#00D9FF] to-[#0891B2] text-[#0A0E27] border-none"
                      : "bg-[#131729] border-[#1E293B] text-[#F1F5F9]"
                  }`}
                >
                  {message.imageUrl && (
                    <img
                      src={message.imageUrl || "/placeholder.svg"}
                      alt="Uploaded"
                      className="rounded-lg mb-2 max-w-full h-auto"
                    />
                  )}
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </Card>
                <span className="text-xs text-[#64748B] px-2">{message.timestamp.toLocaleTimeString()}</span>
              </div>

              {message.role === "user" && (
                <Avatar className="w-8 h-8 mt-1">
                  <AvatarFallback className="bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] text-white">
                    VÉ
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <Avatar className="w-8 h-8 mt-1">
                <AvatarFallback className="bg-gradient-to-br from-[#00D9FF] to-[#0891B2] text-[#0A0E27]">
                  AI
                </AvatarFallback>
              </Avatar>
              <Card className="p-4 bg-[#131729] border-[#1E293B]">
                <Loader2 className="w-5 h-5 animate-spin text-[#00D9FF]" />
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="border-t border-[#1E293B] p-4 bg-[#0F1629]">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs text-[#64A3B8] mb-2">Sugestões Rápidas</p>
          <div className="flex gap-2 flex-wrap">
            {quickSuggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => {
                  setInputMessage(suggestion)
                  sendMessage()
                }}
                className="bg-[#131729] border-[#1E293B] text-[#94A3B8] hover:text-[#00D9FF] hover:border-[#00D9FF]/30"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Image Preview */}
      {selectedImage && (
        <div className="px-6 pb-2">
          <div className="relative inline-block">
            <img
              src={selectedImage || "/placeholder.svg"}
              alt="Preview"
              className="h-20 rounded-lg border border-[#1E293B]"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-[#1E293B] p-6 bg-[#0F1629]">
        <div className="max-w-4xl mx-auto flex gap-3">
          <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />

          <Button
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            className="bg-[#131729] border-[#1E293B] text-[#94A3B8] hover:text-[#00D9FF] hover:bg-[#1E293B]"
          >
            <ImageIcon className="w-5 h-5" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={toggleRecording}
            className={`bg-[#131729] border-[#1E293B] hover:bg-[#1E293B] ${
              isRecording ? "text-red-500 animate-pulse" : "text-[#94A3B8] hover:text-[#00D9FF]"
            }`}
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </Button>

          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua mensagem ou use o microfone..."
            className="flex-1 bg-[#131729] border-[#1E293B] text-white placeholder:text-[#64748B] focus:border-[#00D9FF]"
            disabled={isLoading}
          />

          <Button
            onClick={sendMessage}
            disabled={isLoading || (!inputMessage.trim() && !selectedImage)}
            className="bg-gradient-to-r from-[#00D9FF] to-[#0891B2] hover:from-[#00C3E6] hover:to-[#077A8F] text-[#0A0E27]"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>

        <div className="max-w-4xl mx-auto mt-3 flex items-center justify-between">
          <p className="text-xs text-[#64748B]">Pressione Enter para enviar, Shift+Enter para nova linha</p>
          {isSpeaking && (
            <div className="flex items-center gap-2 text-xs text-[#00D9FF]">
              <Volume2 className="w-4 h-4 animate-pulse" />
              Falando...
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
