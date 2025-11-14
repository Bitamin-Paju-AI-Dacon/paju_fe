"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { BottomNav } from "@/components/bottom-nav"
import { TravelCalendar } from "@/components/travel-calendar"
import { StampGallery } from "@/components/stamp-gallery"
import { AppHeader } from "@/components/app-header"

export default function HomePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  // 로그인 상태 확인
  useEffect(() => {
    const checkLoginStatus = () => {
      const loginStatus = localStorage.getItem("isLoggedIn")
      // 로그인 상태가 없으면 welcome 화면으로 리다이렉트
      if (loginStatus === null) {
        router.push("/")
      }
      setIsLoading(false)
    }

    checkLoginStatus()
  }, [router])

  // 로딩 중
  if (isLoading) {
    return null
  }

  return (
    <div className="flex min-h-screen">
      <div className="mx-auto w-full max-w-md min-h-screen bg-gradient-to-b from-primary/20 to-background flex flex-col">
        <AppHeader />
        <main className="flex-1 pb-20">
          <StampGallery />
          <TravelCalendar />
        </main>
        <BottomNav currentPage="home" />
      </div>
    </div>
  )
}

