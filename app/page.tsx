"use client"

import { useState } from "react"
import { BottomNav } from "@/components/bottom-nav"
import { WelcomeScreen } from "@/components/welcome-screen"
import { TravelCalendar } from "@/components/travel-calendar"
import { StampGallery } from "@/components/stamp-gallery"
import { AppHeader } from "@/components/app-header"

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)

  const handleLogin = () => {
    localStorage.setItem("isLoggedIn", "true")
    setIsLoggedIn(true)
  }

  const handleBrowse = () => {
    localStorage.setItem("isLoggedIn", "false")
    setIsLoggedIn(false)
  }

  if (isLoggedIn === null) {
    return <WelcomeScreen onLogin={handleLogin} onBrowse={handleBrowse} />
  }

  return (
    <main className="min-h-screen bg-background pb-20">
      <AppHeader />
      <div className="mx-auto max-w-md">
        <TravelCalendar />
        <StampGallery />
      </div>
      <BottomNav currentPage="home" />
    </main>
  )
}
