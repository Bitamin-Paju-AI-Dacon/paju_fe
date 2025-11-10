"use client"

import { Sparkles } from "lucide-react"

interface HomeHeaderProps {
  isLoggedIn: boolean
}

export function HomeHeader({ isLoggedIn }: HomeHeaderProps) {
  return (
    <header className="bg-primary px-6 py-8 text-primary-foreground">
      <div className="flex items-center gap-3">
        <Sparkles className="h-8 w-8" />
        <div>
          <h1 className="text-2xl font-bold text-balance">파주 북시티 탐험</h1>
          <p className="text-sm opacity-90">{isLoggedIn ? "당신만의 책 여행을 시작하세요" : "둘러보기 모드"}</p>
        </div>
      </div>
    </header>
  )
}
