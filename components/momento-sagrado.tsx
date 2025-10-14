"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Share2, Loader2, Send, Download, Sparkles, Home, Settings, Copy, Filter } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getRandomThemes, type Theme } from "@/lib/themes"
import { SettingsPanel } from "@/components/settings-panel"
import { loadPreferences, savePreferences, type UserPreferences } from "@/lib/preferences"
import { getGreeting } from "@/lib/greetings"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface ShareContent {
  verse: string
  summary: string
}

interface EmotionOption {
  label: string
  emoji: string
  prompt: string
}

const emotionOptions: EmotionOption[] = [
  { label: "Fé", emoji: "🙏", prompt: "Preciso fortalecer minha fé" },
  { label: "Esperança", emoji: "🌅", prompt: "Preciso de esperança" },
  { label: "Medo", emoji: "😟", prompt: "Estou com medo" },
  { label: "Amor", emoji: "❤️", prompt: "Preciso sentir o amor de Deus" },
  { label: "Solidão", emoji: "🌧️", prompt: "Estou me sentindo sozinho" },
  { label: "Gratidão", emoji: "🌻", prompt: "Quero expressar gratidão" },
  { label: "Ansiedade", emoji: "😰", prompt: "Estou ansioso" },
  { label: "Alegria", emoji: "😊", prompt: "Quero celebrar com alegria" },
  { label: "Cansaço", emoji: "😴", prompt: "Estou cansado" },
]

export function MomentoSagrado() {
  const [quickActions, setQuickActions] = useState<Theme[]>(() => getRandomThemes(4))
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: getGreeting().message,
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [shareContent, setShareContent] = useState<ShareContent | null>(null)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [currentBgImage, setCurrentBgImage] = useState(`https://picsum.photos/1080/1920?random=${Date.now()}`)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const [showHome, setShowHome] = useState(true)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [preferences, setPreferences] = useState<UserPreferences>(loadPreferences())
  const [showEmotionFilter, setShowEmotionFilter] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    const root = document.documentElement

    if (preferences.theme === "dark") {
      root.classList.add("dark")
    } else if (preferences.theme === "light") {
      root.classList.remove("dark")
    } else {
      // System preference
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      if (isDark) {
        root.classList.add("dark")
      } else {
        root.classList.remove("dark")
      }
    }
  }, [preferences.theme])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const extractShareContent = (text: string): ShareContent | null => {
    const start = "[INICIAR RESUMO PARA IMAGEM]"
    const end = "[FIM RESUMO PARA IMAGEM]"
    const startIdx = text.indexOf(start)
    const endIdx = text.indexOf(end)

    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      const raw = text.substring(startIdx + start.length, endIdx).trim()
      const lines = raw
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
      if (lines.length > 0) {
        return {
          verse: lines[0] || "",
          summary: lines.slice(1).join(" ") || "",
        }
      }
    }
    return null
  }

  const formatMessageContent = (content: string) => {
    const lines = content.split("\n")

    return lines.map((line, lineIndex) => {
      if (!line.trim()) {
        return <br key={lineIndex} />
      }

      const parts = line.split(/(".*?")/g)

      return (
        <div key={lineIndex} className="mb-2">
          {parts.map((part, index) => {
            if (part.startsWith('"') && part.endsWith('"')) {
              return (
                <span key={index} className="font-serif italic text-primary/90 block my-3">
                  {part}
                </span>
              )
            }

            const referencePattern = /([1-3]?\s?[A-Za-zÀ-ÿ]+\s+\d+:\d+(-\d+)?)/g
            const withReferences = part.split(referencePattern)

            return withReferences.map((subPart, subIndex) => {
              if (referencePattern.test(subPart)) {
                return (
                  <span key={`${index}-${subIndex}`} className="font-serif italic text-primary/90">
                    {subPart}
                  </span>
                )
              }
              return <span key={`${index}-${subIndex}`}>{subPart}</span>
            })
          })}
        </div>
      )
    })
  }

  const handleQuickAction = (prompt: string) => {
    setInput(prompt)
    setShowHome(false)
    setTimeout(() => handleSend(prompt, true), 100)
  }

  const handleDailyMessage = () => {
    const dailyPrompt = "Quero receber minha mensagem diária de inspiração"
    setInput(dailyPrompt)
    setShowHome(false)
    setTimeout(() => handleSend(dailyPrompt, true), 100)
  }

  const handleSend = async (customMessage?: string, isCardSelection = false) => {
    const messageToSend = customMessage || input.trim()
    if (!messageToSend || isLoading) return

    if (!customMessage) setInput("")
    setMessages((prev) => [...prev, { role: "user", content: messageToSend }])
    setIsLoading(true)
    setShowHome(false)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageToSend,
          conversationHistory: messages,
          isCardSelection,
        }),
      })

      if (!response.ok) {
        throw new Error("Erro na API")
      }

      const data = await response.json()
      const aiResponse = data.response

      const extracted = extractShareContent(aiResponse)
      if (extracted) {
        setShareContent(extracted)
      }

      const cleanedResponse = aiResponse
        .replace(/\[INICIAR RESUMO PARA IMAGEM\][\s\S]*?\[FIM RESUMO PARA IMAGEM\]/g, "")
        .trim()

      setMessages((prev) => [...prev, { role: "assistant", content: cleanedResponse }])
    } catch (error) {
      console.error("[v0] Error calling chat API:", error)
      toast({
        title: "Erro",
        description: "Não foi possível enviar a mensagem. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoHome = () => {
    setShowHome(true)
    setMessages([
      {
        role: "assistant",
        content: getGreeting().message,
      },
    ])
    setShareContent(null)
    setQuickActions(getRandomThemes(4))
  }

  const generateShareImage = async () => {
    if (!shareContent || !canvasRef.current) return

    setIsGeneratingImage(true)
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) {
      setIsGeneratingImage(false)
      return
    }

    canvas.width = 1080
    canvas.height = 1920

    return new Promise<void>((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = "anonymous"

      img.onload = () => {
        const cw = canvas.width
        const ch = canvas.height

        ctx.clearRect(0, 0, cw, ch)

        const arImg = img.width / img.height
        const arCanvas = cw / ch
        let drawW = cw,
          drawH = ch,
          dx = 0,
          dy = 0

        if (arImg > arCanvas) {
          drawH = ch
          drawW = ch * arImg
          dx = -(drawW - cw) / 2
        } else {
          drawW = cw
          drawH = cw / arImg
          dy = -(drawH - ch) / 2
        }

        ctx.drawImage(img, dx, dy, drawW, drawH)

        ctx.fillStyle = "rgba(0, 0, 0, 0.55)"
        ctx.fillRect(0, 0, cw, ch)

        ctx.textAlign = "center"
        ctx.shadowColor = "rgba(0, 0, 0, 0.9)"
        ctx.shadowBlur = 8

        const margin = cw * 0.08
        const maxW = cw - margin * 2

        ctx.fillStyle = "#FFD700"
        ctx.font = `bold ${Math.round(cw * 0.035)}px Inter, sans-serif`
        let y = ch * 0.12
        y = wrapText(ctx, shareContent.verse, cw / 2, y, maxW, Math.round(cw * 0.048))

        const reflectionStartY = ch * 0.42
        ctx.fillStyle = "#FFFFFF"
        ctx.font = `bold ${Math.round(cw * 0.065)}px Inter, sans-serif`
        ctx.shadowBlur = 6
        wrapText(ctx, shareContent.summary, cw / 2, reflectionStartY, maxW, Math.round(cw * 0.085))

        ctx.font = `${Math.round(cw * 0.04)}px Inter, sans-serif`
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
        ctx.shadowBlur = 4
        ctx.fillText("- Momento Sagrado -", cw / 2, ch * 0.92)

        setIsGeneratingImage(false)
        resolve()
      }

      img.onerror = () => {
        setIsGeneratingImage(false)
        reject(new Error("Failed to load image"))
      }

      img.src = currentBgImage
    })
  }

  const wrapText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number,
  ): number => {
    const words = text.split(" ")
    let line = ""

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " "
      const metrics = ctx.measureText(testLine)

      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line.trim(), x, y)
        line = words[n] + " "
        y += lineHeight
      } else {
        line = testLine
      }
    }
    ctx.fillText(line.trim(), x, y)
    return y + lineHeight
  }

  const openShareModal = async () => {
    if (!shareContent) {
      toast({
        title: "Nenhum conteúdo",
        description: "Nenhum trecho para compartilhar ainda.",
        variant: "destructive",
      })
      return
    }

    setIsShareModalOpen(true)
    setTimeout(() => generateShareImage(), 100)
  }

  const changeBackground = () => {
    const newImage = `https://picsum.photos/1080/1920?random=${Date.now()}`
    setCurrentBgImage(newImage)
    setTimeout(() => generateShareImage(), 100)
  }

  const handleShareImage = async () => {
    if (!canvasRef.current) return

    try {
      const blob = await new Promise<Blob | null>((resolve) => canvasRef.current!.toBlob(resolve, "image/png"))

      if (!blob) throw new Error("Failed to create image")

      const file = new File([blob], "momento_sagrado.png", { type: "image/png" })

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "Momento Sagrado",
          text: "Uma palavra de conforto e esperança",
        })
        toast({
          title: "Compartilhado!",
          description: "Imagem compartilhada com sucesso.",
        })
      } else {
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "momento_sagrado.png"
        document.body.appendChild(a)
        a.click()
        a.remove()
        URL.revokeObjectURL(url)
        toast({
          title: "Download concluído",
          description: "Imagem salva com sucesso.",
        })
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível compartilhar a imagem.",
        variant: "destructive",
      })
    }
  }

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
    toast({
      title: "Copiado!",
      description: "Mensagem copiada para a área de transferência.",
    })
  }

  const handleEmotionSelect = (prompt: string) => {
    setShowEmotionFilter(false)
    setInput(prompt)
    setShowHome(false)
    setTimeout(() => handleSend(prompt, true), 100)
  }

  const getFontSizeClass = () => {
    switch (preferences.fontSize) {
      case "small":
        return "text-xs"
      case "large":
        return "text-base"
      default:
        return "text-sm"
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md h-full flex flex-col shadow-2xl bg-background">
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-border/50 bg-background/95 backdrop-blur-sm">
          <div className="flex items-center justify-between p-4">
            {!showHome && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleGoHome}
                className="shrink-0 hover:bg-primary/5"
                aria-label="Voltar para início"
              >
                <Home className="w-5 h-5" />
              </Button>
            )}
            {showHome && <div className="w-10" />}
            <div className="text-center flex-1">
              <h1 className="text-lg font-semibold text-foreground tracking-tight">Momento Sagrado</h1>
              <p className="text-xs text-muted-foreground">Seu momento de reflexão</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSettingsOpen(true)}
              className="shrink-0 hover:bg-primary/5"
              aria-label="Configurações"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 pt-6 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="flex items-start gap-3 mb-6">
            <div className="w-10 h-10 shrink-0 rounded-full bg-primary/5 flex items-center justify-center border border-primary/10">
              <Sparkles className="w-6 h-6 text-primary" strokeWidth={1.5} />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-muted-foreground">Momento Sagrado</span>
              <div className="rounded-2xl bg-muted/50 px-4 py-3 text-foreground border border-border/50">
                <p className={getFontSizeClass()}>{messages[0].content}</p>
              </div>
            </div>
          </div>

          {messages.length === 1 && showHome && (
            <>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {quickActions.map((action, index) => {
                  const IconComponent = action.icon
                  return (
                    <button
                      key={index}
                      onClick={() => handleQuickAction(action.prompt)}
                      className={`flex flex-col items-center justify-center gap-3 rounded-xl p-5 text-center transition-all hover:scale-[1.02] ${action.color}`}
                    >
                      <IconComponent className="w-6 h-6" strokeWidth={1.5} />
                      <span className="text-xs font-medium leading-tight">{action.label}</span>
                    </button>
                  )
                })}
              </div>

              <div className="flex flex-col items-center gap-4 mb-6">
                <div className="relative w-full">
                  <button
                    onClick={() => setShowEmotionFilter(!showEmotionFilter)}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-muted/50 hover:bg-muted border border-border/50 px-4 py-2.5 text-foreground font-medium shadow-sm hover:shadow transition-all"
                  >
                    <Filter className="w-4 h-4" strokeWidth={1.5} />
                    <span className="text-sm">Filtrar por Emoção</span>
                  </button>

                  {showEmotionFilter && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowEmotionFilter(false)} />
                      <div className="absolute top-full mt-2 left-0 right-0 bg-background border border-border rounded-xl shadow-xl p-2 z-20 max-h-80 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        {emotionOptions.map((emotion, index) => (
                          <button
                            key={index}
                            onClick={() => handleEmotionSelect(emotion.prompt)}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted/70 transition-colors text-left"
                          >
                            <span className="text-2xl">{emotion.emoji}</span>
                            <span className="text-sm font-medium text-foreground">{emotion.label}</span>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <div className="w-full flex justify-center">
                  <button
                    onClick={handleDailyMessage}
                    className="relative flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/15 to-primary/10 hover:from-primary/25 hover:via-primary/20 hover:to-primary/15 border-[3px] border-primary/40 px-10 py-6 text-primary font-bold shadow-lg hover:shadow-xl transition-all hover:scale-[1.03] active:scale-[0.98] min-w-[280px]"
                  >
                    <Sparkles className="w-7 h-7 animate-pulse" strokeWidth={2.5} />
                    <span className="text-lg tracking-wide">Minha Mensagem Diária</span>
                    <Sparkles className="w-7 h-7 animate-pulse" strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Conversation Messages */}
          {messages.slice(1).map((message, index) => (
            <div
              key={index + 1}
              className={`flex gap-3 mb-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.role === "assistant" && (
                <div className="w-10 h-10 shrink-0 rounded-full bg-primary/5 flex items-center justify-center border border-primary/10">
                  <Sparkles className="w-6 h-6 text-primary" strokeWidth={1.5} />
                </div>
              )}
              <div className="flex flex-col gap-2 max-w-[75%]">
                <div
                  className={`rounded-2xl px-4 py-3 border ${
                    message.role === "user"
                      ? "bg-primary/10 text-foreground border-primary/20"
                      : "bg-muted/50 text-foreground border-border/50"
                  }`}
                >
                  <div className={`${getFontSizeClass()} leading-relaxed`}>
                    {message.role === "assistant" ? formatMessageContent(message.content) : message.content}
                  </div>
                </div>
                {message.role === "assistant" && (
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyMessage(message.content)}
                      className="h-8 px-2 hover:bg-primary/5"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                    {shareContent && index === messages.length - 2 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={openShareModal}
                        className="h-8 px-2 hover:bg-primary/5"
                      >
                        <Share2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 mb-4">
              <div className="w-10 h-10 shrink-0 rounded-full bg-primary/5 flex items-center justify-center border border-primary/10">
                <Sparkles className="w-6 h-6 text-primary" strokeWidth={1.5} />
              </div>
              <div className="rounded-2xl bg-muted/50 px-4 py-3 border border-border/50">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Pensando...
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="sticky bottom-0 z-10 bg-background/95 backdrop-blur-sm pb-6 border-t border-border/50">
          <div className="flex items-center gap-2 px-4 pt-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              placeholder="Ou digite sua mensagem..."
              className="flex-1 rounded-full border border-border/50 bg-muted/30 px-4 py-3 text-sm text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all"
              disabled={isLoading}
            />
            <Button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              size="icon"
              className="h-12 w-12 rounded-full shrink-0 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      <SettingsPanel
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        onPreferencesChange={(prefs) => {
          setPreferences(prefs)
          savePreferences(prefs)
        }}
      />

      {/* Share Modal */}
      <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Compartilhar Momento</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {isGeneratingImage && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg z-10">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            )}
            <canvas ref={canvasRef} className="w-full rounded-lg bg-muted" style={{ aspectRatio: "9/16" }} />
            <div className="flex gap-2">
              <Button onClick={handleShareImage} className="flex-1 gap-2">
                <Download className="w-4 h-4" />
                Baixar / Compartilhar
              </Button>
              <Button onClick={changeBackground} variant="outline" disabled={isGeneratingImage}>
                Novo Fundo
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
