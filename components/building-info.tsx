"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Clock, MapPin, Star, CheckCircle2, Sparkles } from "lucide-react"
import { useState } from "react"

interface Building {
  id: number
  name: string
  category: string
  description: string
  features: string[]
  hours: string
  address: string
}

interface BuildingInfoProps {
  building: Building
  onClose: () => void
}

export function BuildingInfo({ building, onClose }: BuildingInfoProps) {
  const [stampCollected, setStampCollected] = useState(false)

  const handleCollectStamp = () => {
    setStampCollected(true)
    // Simulate stamp collection
    setTimeout(() => {
      onClose()
    }, 2000)
  }

  return (
    <div className="p-4 space-y-4">
      {/* Success Banner */}
      {stampCollected && (
        <Card className="bg-gradient-to-r from-primary to-accent p-6 text-center animate-in fade-in slide-in-from-top">
          <div className="flex flex-col items-center gap-3">
            <div className="rounded-full bg-background/20 p-4">
              <CheckCircle2 className="h-12 w-12 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-primary-foreground">스탬프 획득!</h3>
              <p className="text-sm text-primary-foreground/80">+10 포인트 적립</p>
            </div>
          </div>
        </Card>
      )}

      {/* Building Header */}
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-balance">{building.name}</h1>
            <Badge variant="secondary" className="text-xs">
              {building.category}
            </Badge>
          </div>
          <div className="rounded-full bg-primary/10 p-3">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
        </div>
      </div>

      {/* Building Image Placeholder */}
      <Card className="overflow-hidden">
        <div className="aspect-video bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 flex items-center justify-center">
          <Building2 className="h-16 w-16 text-muted-foreground/30" />
        </div>
      </Card>

      {/* Description */}
      <Card className="p-4">
        <h3 className="font-semibold mb-2 flex items-center gap-2">
          <Star className="h-4 w-4 text-primary" />
          소개
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed text-pretty">{building.description}</p>
      </Card>

      {/* Features */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          주요 특징
        </h3>
        <div className="flex flex-wrap gap-2">
          {building.features.map((feature, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {feature}
            </Badge>
          ))}
        </div>
      </Card>

      {/* Info Grid */}
      <div className="grid grid-cols-1 gap-3">
        <Card className="p-4">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-primary/10 p-2">
              <Clock className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-1">운영시간</p>
              <p className="text-sm font-medium">{building.hours}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-primary/10 p-2">
              <MapPin className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-1">주소</p>
              <p className="text-sm font-medium leading-relaxed">{building.address}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Collect Stamp Button */}
      {!stampCollected ? (
        <Button size="lg" className="w-full h-14 text-base font-semibold" onClick={handleCollectStamp}>
          <CheckCircle2 className="h-5 w-5 mr-2" />
          스탬프 수집하기
        </Button>
      ) : (
        <Button size="lg" variant="secondary" className="w-full h-14 text-base font-semibold" disabled>
          <CheckCircle2 className="h-5 w-5 mr-2" />
          수집 완료
        </Button>
      )}

      {/* Additional Tips */}
      <Card className="bg-muted/50 p-4">
        <p className="text-xs text-muted-foreground text-center leading-relaxed">
          💡 이 장소를 방문하면 특별 보상을 받을 수 있어요!
        </p>
      </Card>
    </div>
  )
}
