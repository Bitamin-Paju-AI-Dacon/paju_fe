"use client"

import { Award, Coffee, Ticket, Package, Sparkles, Lock, Check } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

const userStamps = 12 // Current user's stamp count

const achievements = [
  {
    id: 1,
    stamps: 5,
    title: "첫 걸음",
    description: "파주 출판단지 탐험 시작",
    icon: Coffee,
    rewards: ["지혜의숲 카페 아메리카노 무료", "북카페 더북 음료 10% 할인"],
    nft: "브론즈 탐험가 배지",
    color: "from-amber-500/20 to-orange-500/20",
    iconColor: "text-amber-600",
  },
  {
    id: 2,
    stamps: 10,
    title: "열정적인 탐험가",
    description: "출판단지의 매력에 빠지다",
    icon: Award,
    rewards: [
      "파주 북카페 음료 + 디저트 세트 20% 할인",
      "출판도시 카페거리 음료 무료 쿠폰",
      "지혜의숲 베이커리 빵 1개 무료",
    ],
    nft: "실버 탐험가 배지",
    color: "from-blue-500/20 to-cyan-500/20",
    iconColor: "text-blue-600",
  },
  {
    id: 3,
    stamps: 15,
    title: "문화 애호가",
    description: "출판문화의 진정한 이해자",
    icon: Ticket,
    rewards: ["열화당 서점 입장료 무료", "활판공방 체험 프로그램 30% 할인", "파주출판도시 투어 프로그램 무료 참가"],
    nft: "골드 탐험가 배지",
    color: "from-purple-500/20 to-pink-500/20",
    iconColor: "text-purple-600",
  },
  {
    id: 4,
    stamps: 20,
    title: "마스터 컬렉터",
    description: "출판단지의 모든 곳을 섭렵",
    icon: Package,
    rewards: [
      "파주 장단콩 선물세트 응모권",
      "파주 쌀 2kg 증정 응모권",
      "출판도시 도서 상품권 1만원권",
      "파주 특산품 세트 추첨 (월 10명)",
    ],
    nft: "플래티넘 탐험가 배지",
    color: "from-emerald-500/20 to-teal-500/20",
    iconColor: "text-emerald-600",
  },
  {
    id: 5,
    stamps: 25,
    title: "전설의 탐험가",
    description: "파주 출판단지의 전설이 되다",
    icon: Sparkles,
    rewards: [
      "파주 프리미엄 숙박권 (1박)",
      "출판도시 서점 도서 구매권 5만원",
      "파주 맛집 5만원 식사권",
      "한정판 파주 출판단지 NFT 아트",
    ],
    nft: "레전드 탐험가 배지 + 특별 NFT",
    color: "from-yellow-500/20 to-amber-500/20",
    iconColor: "text-yellow-600",
  },
]

const collectedNFTs = [
  { id: 1, name: "브론즈 탐험가", image: "/bronze-explorer-badge.jpg" },
  { id: 2, name: "실버 탐험가", image: "/silver-explorer-badge.png" },
]

export function AchievementProgress() {
  const nextAchievement = achievements.find((a) => a.stamps > userStamps)
  const progress = nextAchievement ? (userStamps / nextAchievement.stamps) * 100 : 100

  return (
    <div className="space-y-6 p-4">
      <div className="space-y-2">
        <h1 className="text-balance text-3xl font-bold text-foreground">나의 달성 현황</h1>
        <p className="text-pretty text-sm text-muted-foreground">스탬프를 모아 특별한 보상과 NFT 배지를 획득하세요</p>
      </div>

      <Card className="bg-gradient-to-br from-primary/10 to-accent/10 p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">현재 스탬프</p>
              <p className="text-balance text-4xl font-bold text-foreground">{userStamps}개</p>
            </div>
            <Award className="h-12 w-12 text-primary" />
          </div>

          {nextAchievement && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">다음 달성까지</span>
                <span className="font-semibold text-foreground">{nextAchievement.stamps - userStamps}개 남음</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </div>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-foreground">달성 단계</h2>

        {achievements.map((achievement) => {
          const IconComponent = achievement.icon
          const isUnlocked = userStamps >= achievement.stamps
          const isCurrent = achievement.stamps === nextAchievement?.stamps

          return (
            <Card
              key={achievement.id}
              className={`relative overflow-hidden p-5 transition-all ${
                isUnlocked ? "border-primary/50 shadow-md" : isCurrent ? "border-primary/30" : "opacity-60"
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${achievement.color} opacity-50`} />

              <div className="relative space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`rounded-full p-3 ${isUnlocked ? "bg-primary/20" : "bg-muted"}`}>
                      {isUnlocked ? (
                        <IconComponent className={`h-6 w-6 ${achievement.iconColor}`} />
                      ) : (
                        <Lock className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-foreground">{achievement.title}</h3>
                        {isUnlocked && (
                          <Badge variant="secondary" className="bg-primary/20 text-primary">
                            <Check className="mr-1 h-3 w-3" />
                            달성
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      <p className="text-xs font-semibold text-primary">스탬프 {achievement.stamps}개</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-card/80 p-3 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <p className="text-sm font-semibold text-foreground">NFT 배지</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{achievement.nft}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-semibold text-foreground">보상 내역</p>
                  <ul className="space-y-1">
                    {achievement.rewards.map((reward, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <span className="text-primary mt-0.5">•</span>
                        <span className={isUnlocked ? "text-foreground" : "text-muted-foreground"}>{reward}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-foreground">획득한 NFT 배지</h2>

        <div className="grid grid-cols-3 gap-3">
          {collectedNFTs.map((nft) => (
            <Card key={nft.id} className="aspect-square overflow-hidden p-2">
              <img
                src={nft.image || "/placeholder.svg"}
                alt={nft.name}
                className="h-full w-full rounded-lg object-cover"
              />
              <p className="mt-2 text-center text-xs font-medium text-foreground">{nft.name}</p>
            </Card>
          ))}

          {Array.from({ length: 3 - collectedNFTs.length }).map((_, idx) => (
            <Card key={`locked-${idx}`} className="aspect-square flex items-center justify-center bg-muted/50">
              <Lock className="h-8 w-8 text-muted-foreground" />
            </Card>
          ))}
        </div>
      </div>

      <Card className="bg-muted/50 p-4">
        <p className="text-xs text-muted-foreground text-center">
          보상은 달성 즉시 프로필에서 확인 가능하며, NFT 배지는 블록체인에 영구 저장됩니다.
        </p>
      </Card>
    </div>
  )
}
