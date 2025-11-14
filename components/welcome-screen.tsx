"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { BookOpen, Sparkles, MapPin, Camera } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

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
    <div className="flex min-h-screen items-center justify-center">
      <div className="mx-auto w-full max-w-md min-h-screen bg-gradient-to-b from-primary/20 to-background flex items-center justify-center px-4">
        <Card className="w-full space-y-4 p-6 sm:p-8">
          <div className="text-center space-y-4">
            <div className="space-y-2">
              <div className="flex justify-center">
                <Image
                  src="/logo3.png"
                  alt="파주 북길 로고"
                  width={240}
                  height={72}
                  className="h-auto object-contain"
                  priority
                />
              </div>
            </div>
          </div>

          {/* 앱 스크린샷 이미지 */}
          <div className="relative w-full max-w-[200px] mx-auto rounded-lg overflow-hidden border border-border -mt-6 -mb-3">
            <Image
              src="/scshot2.png"
              alt="파주 북길 앱 화면"
              width={200}
              height={150}
              className="w-full h-auto object-cover"
              priority
            />
          </div>

          <div className="space-y-4 pt-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">스탬프 적립</p>
                  <p className="text-xs text-muted-foreground">장소를 방문해 사진으로 인증하고 스탬프를 통해 보상을 받아보세요!</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Camera className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">파주 출판단지 챗봇</p>
                  <p className="text-xs text-muted-foreground">파주 출판단지의 다양한 건축물과 장소를 챗봇에게 물어보세요!</p>
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
        </Card>
      </div>
    </div>
  )
}
