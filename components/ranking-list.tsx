"use client"

import { Trophy, Medal, Award, Gift, Coffee, Ticket, Package } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const rankings = [
  { rank: 1, name: "김서연", stamps: 24, avatar: "/abstract-geometric-shapes.png" },
  { rank: 2, name: "이준호", stamps: 22, avatar: "/abstract-geometric-shapes.png" },
  { rank: 3, name: "박지민", stamps: 20, avatar: "/diverse-group-collaborating.png" },
  { rank: 4, name: "최민수", stamps: 18, avatar: "/abstract-geometric-shapes.png" },
  { rank: 5, name: "정수아", stamps: 16, avatar: "/abstract-geometric-shapes.png" },
  { rank: 6, name: "강태양", stamps: 15, avatar: "/abstract-geometric-shapes.png" },
  { rank: 7, name: "윤하늘", stamps: 14, avatar: "/abstract-geometric-shapes.png" },
  { rank: 8, name: "임별", stamps: 12, avatar: "/abstract-geometric-shapes.png" },
]

const rewardTiers = [
  {
    tier: "5개 이상",
    icon: Coffee,
    rewards: ["지혜의숲 카페 아메리카노 무료", "북카페 더북 음료 10% 할인"],
  },
  {
    tier: "10개 이상",
    icon: Coffee,
    rewards: [
      "파주 북카페 음료 + 디저트 세트 20% 할인",
      "출판도시 카페거리 음료 무료 쿠폰",
      "지혜의숲 베이커리 빵 1개 무료",
    ],
  },
  {
    tier: "15개 이상",
    icon: Ticket,
    rewards: ["열화당 서점 입장료 무료", "활판공방 체험 프로그램 30% 할인", "파주출판도시 투어 프로그램 무료 참가"],
  },
  {
    tier: "20개 이상",
    icon: Package,
    rewards: [
      "파주 장단콩 선물세트 응모권",
      "파주 쌀 2kg 증정 응모권",
      "출판도시 도서 상품권 1만원권",
      "파주 특산품 세트 추첨 (월 10명)",
    ],
  },
  {
    tier: "월간 1-3위",
    icon: Trophy,
    rewards: ["파주 맛집 3만원 식사권", "출판도시 서점 도서 구매권 5만원", "파주 프리미엄 숙박권 (1박)"],
  },
]

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Trophy className="h-6 w-6 text-yellow-500" />
    case 2:
      return <Medal className="h-6 w-6 text-gray-400" />
    case 3:
      return <Award className="h-6 w-6 text-amber-700" />
    default:
      return <span className="text-lg font-bold text-muted-foreground">{rank}</span>
  }
}

export function RankingList() {
  return (
    <div className="space-y-4 p-4">
      <div className="space-y-2">
        <h1 className="text-balance text-3xl font-bold text-foreground">랭킹</h1>
        <p className="text-pretty text-sm text-muted-foreground">가장 많은 스탬프를 모은 탐험가들을 확인하세요</p>
      </div>

      <Card className="bg-gradient-to-br from-primary/10 to-accent/10 p-4">
        <div className="flex items-center gap-3">
          <Trophy className="h-8 w-8 text-primary" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">이번 달 보상</p>
            <p className="text-balance text-lg font-bold text-foreground">파주 맛집 할인 쿠폰 & 특별 입장권</p>
          </div>
        </div>
      </Card>

      <div className="space-y-2">
        {rankings.map((user) => (
          <Card
            key={user.rank}
            className={`p-4 transition-all hover:shadow-md ${user.rank <= 3 ? "border-primary/50 bg-primary/5" : ""}`}
          >
            <div className="flex items-center gap-4">
              <div className="flex w-8 items-center justify-center">{getRankIcon(user.rank)}</div>

              <Avatar className="h-12 w-12">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <p className="font-semibold text-foreground">{user.name}</p>
                <p className="text-sm text-muted-foreground">스탬프 {user.stamps}개 수집</p>
              </div>

              {user.rank <= 3 && (
                <Badge variant="secondary" className="bg-primary/20 text-primary">
                  보상 대상
                </Badge>
              )}
            </div>
          </Card>
        ))}
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <Gift className="h-5 w-5 text-primary" />
          보상 상세 안내
        </h3>

        {rewardTiers.map((tier, index) => {
          const IconComponent = tier.icon
          return (
            <Card key={index} className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <IconComponent className="h-5 w-5 text-primary" />
                <h4 className="font-semibold text-foreground">{tier.tier}</h4>
              </div>
              <ul className="space-y-2">
                {tier.rewards.map((reward, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <span className="text-primary mt-1">•</span>
                    <span className="text-muted-foreground">{reward}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )
        })}
      </div>

      <Card className="bg-muted/50 p-4">
        <p className="text-xs text-muted-foreground text-center">
          * 보상은 매월 1일에 지급되며, 응모권은 추첨을 통해 당첨자에게 개별 연락드립니다.
        </p>
      </Card>
    </div>
  )
}
