"use client"

import { User, Award, Gift, MapPin, Calendar, Settings, ImageIcon } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

const userRewards = [
  {
    id: 1,
    name: "지혜의숲 카페 아메리카노 무료",
    type: "쿠폰",
    expiryDate: "2025.12.31",
    status: "사용 가능",
  },
  {
    id: 2,
    name: "열화당 서점 입장료 무료",
    type: "입장권",
    expiryDate: "2025.11.30",
    status: "사용 가능",
  },
  {
    id: 3,
    name: "파주 장단콩 선물세트 응모권",
    type: "응모권",
    expiryDate: "2025.10.31",
    status: "응모 완료",
  },
]

const achievements = [
  { name: "첫 발걸음", description: "첫 스탬프 획득", unlocked: true },
  { name: "책 탐험가", description: "10개 스탬프 수집", unlocked: true },
  { name: "출판단지 마스터", description: "모든 스탬프 수집", unlocked: false },
]

const uploadedPhotos = [
  { id: 1, src: "/bookstore-alley.jpg", location: "지혜의숲", date: "2025.01.15" },
  { id: 2, src: "/publishing-culture.jpg", location: "아시아출판문화정보센터", date: "2025.01.18" },
  { id: 3, src: "/cafe-gallery.jpg", location: "카페 갤러리", date: "2025.01.20" },
  { id: 4, src: "/cozy-bookshop.jpg", location: "열화당 서점", date: "2025.01.22" },
  { id: 5, src: "/cultural-foundation-building.jpg", location: "파주출판도시문화재단", date: "2025.01.25" },
  { id: 6, src: "/book-museum.jpg", location: "활판공방", date: "2025.01.28" },
]

export function UserProfile() {
  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-balance text-3xl font-bold text-foreground">프로필</h1>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src="/abstract-profile.png" alt="프로필" />
            <AvatarFallback>
              <User className="h-10 w-10" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-foreground">김독서</h2>
            <p className="text-sm text-muted-foreground">book.lover@email.com</p>
            <Badge variant="secondary" className="mt-2 bg-primary/20 text-primary">
              레벨 3 탐험가
            </Badge>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">스탬프 수집 현황</h3>
            <span className="text-2xl font-bold text-primary">12 / 30</span>
          </div>
          <Progress value={40} className="h-3" />
          <p className="text-sm text-muted-foreground">다음 레벨까지 8개 남았어요!</p>
        </div>
      </Card>

      <Card className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <ImageIcon className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">업로드한 사진</h3>
          <Badge variant="secondary" className="ml-auto">
            {uploadedPhotos.length}장
          </Badge>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {uploadedPhotos.map((photo) => (
            <div key={photo.id} className="relative aspect-square overflow-hidden rounded-lg border border-border">
              <img
                src={photo.src || "/placeholder.svg"}
                alt={photo.location}
                className="h-full w-full object-cover transition-transform hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-2">
                  <p className="text-xs font-medium text-white">{photo.location}</p>
                  <p className="text-xs text-white/80">{photo.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">방문 통계</h3>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-foreground">12</p>
            <p className="text-sm text-muted-foreground">방문 장소</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">8</p>
            <p className="text-sm text-muted-foreground">이번 달</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">45</p>
            <p className="text-sm text-muted-foreground">총 거리(km)</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <Gift className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">받은 보상</h3>
        </div>
        <div className="space-y-3">
          {userRewards.map((reward) => (
            <div key={reward.id} className="flex items-start gap-3 rounded-lg border border-border p-3">
              <Gift className="mt-1 h-5 w-5 text-accent" />
              <div className="flex-1">
                <p className="font-medium text-foreground">{reward.name}</p>
                <div className="mt-1 flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {reward.type}
                  </Badge>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {reward.expiryDate}
                  </span>
                </div>
              </div>
              <Badge variant={reward.status === "사용 가능" ? "default" : "secondary"} className="shrink-0">
                {reward.status}
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">업적</h3>
        </div>
        <div className="space-y-3">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 rounded-lg border p-3 ${
                achievement.unlocked ? "border-primary/50 bg-primary/5" : "border-border bg-muted/30"
              }`}
            >
              <Award className={`h-6 w-6 ${achievement.unlocked ? "text-primary" : "text-muted-foreground"}`} />
              <div className="flex-1">
                <p className={`font-medium ${achievement.unlocked ? "text-foreground" : "text-muted-foreground"}`}>
                  {achievement.name}
                </p>
                <p className="text-sm text-muted-foreground">{achievement.description}</p>
              </div>
              {achievement.unlocked && (
                <Badge variant="secondary" className="bg-primary/20 text-primary">
                  달성
                </Badge>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
