"use client"

import { Button } from "@/components/ui/button"
import { Shield, Zap, Star, Globe } from "lucide-react"

interface LandingScreenProps {
  onStart: () => void
}

export default function LandingScreen({ onStart }: LandingScreenProps) {
  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-950 to-black overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-blue-500 opacity-10 blur-xl"></div>
        <div className="absolute bottom-40 right-40 w-40 h-40 rounded-full bg-yellow-500 opacity-10 blur-xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 rounded-full bg-red-500 opacity-10 blur-xl"></div>

        {/* World map silhouette */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <Globe className="w-[800px] h-[800px] text-blue-600" />
        </div>
      </div>

      {/* Logo and title */}
      <div className="z-10 flex flex-col items-center mb-12">
        <div className="flex items-center justify-center mb-6">
          <Shield className="text-yellow-400 w-20 h-20 mr-2" />
          <Zap className="text-blue-400 w-20 h-20" />
          <Star className="text-red-400 w-20 h-20 ml-2" />
        </div>
        <h1 className="text-7xl font-bold text-white mb-4 tracking-tight">
          <span className="text-yellow-400">SUPER</span>
          <span className="text-blue-400">HERO</span>
          <span className="text-red-400">TACTICS</span>
        </h1>
        <p className="text-2xl text-blue-200 max-w-md text-center">
          Command your heroes. Save the world. Change the future.
        </p>
      </div>

      {/* Game start button */}
      <Button
        onClick={onStart}
        className="z-10 bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-bold text-2xl px-16 py-8 rounded-lg shadow-lg hover:shadow-xl transition-all"
      >
        START GAME
      </Button>

      {/* Version info */}
      <div className="absolute bottom-4 right-4 text-blue-300 text-sm">v1.0.0 BETA</div>
    </div>
  )
}

