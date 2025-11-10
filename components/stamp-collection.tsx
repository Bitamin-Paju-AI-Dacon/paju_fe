"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Building2, Coffee, Landmark, Lock } from "lucide-react"

const stamps = [
  { id: 1, name: "지혜의숲", icon: BookOpen, collected: true, color: "bg-primary" },
  { id: 2, name: "아시아출판문화정보센터", icon: Building2, collected: true, color: "bg-accent" },
  { id: 3, name: "출판도시문화재단", icon: Landmark, collected: true, color: "bg-chart-3" },
  { id: 4, name: "북카페 거리", icon: Coffee, collected: false, color: "bg-muted" },
  { id: 5, name: "활판공방", icon: Building2, collected: false, color: "bg-muted" },
  { id: 6, name: "책마을", icon: BookOpen, collected: false, color: "bg-muted" },
]

export function StampCollection() {
  const collectedCount = stamps.filter((s) => s.collected).length

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">스탬프 컬렉션</h2>
        <Badge variant="secondary" className="text-sm">
          {collectedCount}/{stamps.length} 수집
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {stamps.map((stamp) => {
          const Icon = stamp.icon
          return (
            <Card
              key={stamp.id}
              className={`relative aspect-square p-4 transition-all ${
                stamp.collected ? "border-primary shadow-md" : "border-dashed opacity-50"
              }`}
            >
              <div className="flex h-full flex-col items-center justify-center gap-2">
                <div className={`rounded-full p-3 ${stamp.collected ? stamp.color : "bg-muted"}`}>
                  {stamp.collected ? (
                    <Icon className="h-6 w-6 text-primary-foreground" />
                  ) : (
                    <Lock className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <p className="text-center text-xs font-medium leading-tight text-balance">{stamp.name}</p>
              </div>
              {stamp.collected && (
                <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  ✓
                </div>
              )}
            </Card>
          )
        })}
      </div>

      {/* Progress Card */}
      <Card className="mt-6 bg-gradient-to-br from-primary/10 to-accent/10 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">다음 보상까지</p>
            <p className="text-2xl font-bold">{6 - collectedCount}개 남음</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">진행률</p>
            <p className="text-2xl font-bold text-primary">{Math.round((collectedCount / stamps.length) * 100)}%</p>
          </div>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent transition-all"
            style={{ width: `${(collectedCount / stamps.length) * 100}%` }}
          />
        </div>
      </Card>
    </div>
  )
}
