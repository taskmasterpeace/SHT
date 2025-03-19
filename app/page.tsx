"use client"

import { useState } from "react"
import GameOverlay from "@/components/game-overlay"
import LandingScreen from "@/components/landing-screen"

export default function Home() {
  const [showLanding, setShowLanding] = useState(true)

  const startGame = () => {
    setShowLanding(false)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      {showLanding ? <LandingScreen onStart={startGame} /> : <GameOverlay />}
    </main>
  )
}

