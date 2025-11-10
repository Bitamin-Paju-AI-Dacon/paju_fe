"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { BookOpen, Sparkles, MapPin } from "lucide-react"
import { useRouter } from "next/navigation"

interface WelcomeScreenProps {
  onLogin: () => void
  onBrowse: () => void
}

export function WelcomeScreen({ onLogin, onBrowse }: WelcomeScreenProps) {
  const router = useRouter()

  const handleLoginClick = () => {
    router.push("/login")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-primary/20 to-background p-4">
      <Card className="mx-auto w-full max-w-md space-y-6 p-8">
        <div className="text-center space-y-4">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <BookOpen className="h-10 w-10 text-primary" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-balance">파주 북시티 탐험</h1>
            <p className="text-muted-foreground text-balance">
              책과 문화가 살아 숨쉬는 파주 출판단지를 탐험하고 스탬프를 모아보세요
            </p>
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">AR 스탬프 수집</p>
                <p className="text-xs text-muted-foreground">장소를 방문하고 사진으로 인증하세요</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">맞춤 코스 추천</p>
                <p className="text-xs text-muted-foreground">취향에 맞는 여행 코스를 추천받으세요</p>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <Button className="w-full h-12" size="lg" onClick={handleLoginClick}>
              로그인하고 시작하기
            </Button>
            <Button className="w-full h-12 bg-transparent" variant="outline" size="lg" onClick={onBrowse}>
              둘러보기
            </Button>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground">로그인하면 스탬프 수집과 보상을 받을 수 있어요</p>
      </Card>
    </div>
  )
}
