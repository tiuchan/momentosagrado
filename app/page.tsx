"use client"

import { useState } from "react"
import { MomentoSagrado } from "@/components/momento-sagrado"
import { SplashScreen } from "@/components/splash-screen"

export default function Home() {
  const [showSplash, setShowSplash] = useState(true)

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />
  }

  return <MomentoSagrado />
}
