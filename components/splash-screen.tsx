"use client"

import { useEffect, useState } from "react"
import { Sparkles } from "lucide-react"

interface SplashScreenProps {
  onComplete: () => void
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onComplete, 500)
    }, 2500)

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-background transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="flex flex-col items-center gap-8 animate-fade-in px-8">
        <div className="relative">
          <div className="absolute inset-0 animate-ping opacity-20">
            <Sparkles className="w-24 h-24 text-primary" strokeWidth={1.5} />
          </div>
          <Sparkles className="w-24 h-24 text-primary animate-pulse" strokeWidth={1.5} />
        </div>

        {/* App Name */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-semibold text-foreground tracking-tight animate-fade-in-up">Momento Sagrado</h1>
          <p className="text-sm text-muted-foreground animate-fade-in-up animation-delay-200">
            Seu momento de reflexão
          </p>
        </div>

        {/* Verse */}
        <div className="max-w-md text-center animate-fade-in-up animation-delay-400">
          <p className="text-sm text-primary/70 italic leading-relaxed">
            "Vinde a mim, todos os que estais cansados e oprimidos, e eu vos aliviarei."
          </p>
          <p className="text-xs text-muted-foreground mt-3 font-medium">Mateus 11:28</p>
        </div>

        <div className="flex gap-2 mt-4 animate-fade-in-up animation-delay-600">
          <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  )
}
