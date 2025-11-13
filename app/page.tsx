"use client"

import { useState, useEffect } from "react"
import { BottomNav } from "@/components/bottom-nav"
import { WelcomeScreen } from "@/components/welcome-screen"
import { TravelCalendar } from "@/components/travel-calendar"
import { StampGallery } from "@/components/stamp-gallery"
import { AppHeader } from "@/components/app-header"

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // 로그인 상태 확인
  useEffect(() => {
    const checkLoginStatus = () => {
      const loginStatus = localStorage.getItem("isLoggedIn")
      if (loginStatus === "true") {
        setIsLoggedIn(true)
      } else {
        setIsLoggedIn(null)
      }
      setIsLoading(false)
    }

    checkLoginStatus()
  }, [])

  const handleLogin = () => {
    localStorage.setItem("isLoggedIn", "true")
    setIsLoggedIn(true)
  }

  const handleBrowse = () => {
    localStorage.setItem("isLoggedIn", "false")
    setIsLoggedIn(false)
  }

  // 로딩 중
  if (isLoading) {
    return null
  }

  // 로그인되지 않은 경우 welcome 화면
  if (isLoggedIn !== true) {
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
