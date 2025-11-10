"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bookmark, Lock, Calendar, Camera, Upload, MapPin, X, CheckCircle2 } from "lucide-react"
import { useState } from "react"
import { PajuMap } from "@/components/paju-map"

const stamps = [
  {
    id: 1,
    name: "지혜의숲",
    category: "서점",
    collected: true,
    date: "2024.01.15",
    image: "/modern-bookstore-interior.jpg",
    description: "아시아 최대 규모의 서점",
    address: "경기도 파주시 회동길 145",
    hours: "10:00 - 22:00",
    mapPosition: { x: 25, y: 20 },
  },
  {
    id: 2,
    name: "아시아출판문화정보센터",
    category: "문화시설",
    collected: true,
    date: "2024.01.15",
    image: "/cultural-center-building.jpg",
    description: "출판 문화의 중심지",
    address: "경기도 파주시 회동길 230",
    hours: "09:00 - 18:00",
    mapPosition: { x: 55, y: 25 },
  },
  {
    id: 3,
    name: "활판공방",
    category: "체험",
    collected: false,
    date: null,
    image: "/letterpress-workshop.jpg",
    description: "전통 활판 인쇄 체험",
    address: "경기도 파주시 회동길 352",
    hours: "10:00 - 18:00",
    mapPosition: { x: 70, y: 45 },
  },
  {
    id: 4,
    name: "파주출판도시 갤러리",
    category: "갤러리",
    collected: false,
    date: null,
    image: "/art-gallery-exhibition.jpg",
    description: "다양한 전시를 만나보세요",
    address: "경기도 파주시 회동길 210",
    hours: "10:00 - 19:00",
    mapPosition: { x: 40, y: 60 },
  },
  {
    id: 5,
    name: "북소리",
    category: "서점",
    collected: true,
    date: "2024.01.20",
    image: "/cozy-bookshop.jpg",
    description: "감성 가득한 독립 서점",
    address: "경기도 파주시 회동길 145-30",
    hours: "11:00 - 20:00",
    mapPosition: { x: 30, y: 75 },
  },
  {
    id: 6,
    name: "출판도시문화재단",
    category: "문화시설",
    collected: false,
    date: null,
    image: "/cultural-foundation-building.jpg",
    description: "출판 문화 진흥의 산실",
    address: "경기도 파주시 회동길 145",
    hours: "09:00 - 18:00",
    mapPosition: { x: 65, y: 70 },
  },
  {
    id: 7,
    name: "열화당책박물관",
    category: "박물관",
    collected: false,
    date: null,
    image: "/book-museum.jpg",
    description: "책의 역사를 만나다",
    address: "경기도 파주시 회동길 145-6",
    hours: "10:00 - 18:00",
    mapPosition: { x: 50, y: 40 },
  },
  {
    id: 8,
    name: "파주출판단지 카페거리",
    category: "카페",
    collected: false,
    date: null,
    image: "/cafe-street.jpg",
    description: "책과 함께하는 여유",
    address: "경기도 파주시 회동길 일대",
    hours: "10:00 - 22:00",
    mapPosition: { x: 80, y: 30 },
  },
]

const categories = ["전체", "서점", "문화시설", "체험", "갤러리", "박물관", "카페"]

export function StampGallery() {
  const [selectedCategory, setSelectedCategory] = useState("전체")
  const [showUpload, setShowUpload] = useState(false)
  const [showMap, setShowMap] = useState(false)

  const filteredStamps =
    selectedCategory === "전체" ? stamps : stamps.filter((stamp) => stamp.category === selectedCategory)

  const collectedCount = stamps.filter((s) => s.collected).length
  const totalCount = stamps.length

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">스탬프 컬렉션</h1>
          <p className="text-sm text-muted-foreground">수집한 스탬프를 확인하세요</p>
        </div>
        <div className="flex gap-2">
          <Button variant={showMap ? "outline" : "default"} size="icon" onClick={() => setShowMap(false)}>
            <Bookmark className="h-5 w-5" />
          </Button>
          <Button variant={showMap ? "default" : "outline"} size="icon" onClick={() => setShowMap(true)}>
            <MapPin className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <Button size="lg" className="w-full gap-2" onClick={() => setShowUpload(true)}>
        <Camera className="h-5 w-5" />
        사진 인증
      </Button>

      {showUpload && (
        <Card className="border-2 border-primary p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">사진 업로드</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowUpload(false)}>
                닫기
              </Button>
            </div>
            <div className="flex aspect-square w-full items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted">
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">사진을 업로드하세요</p>
              </div>
            </div>
            <Button className="w-full">스탬프 인증하기</Button>
          </div>
        </Card>
      )}

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">수집 진행률</p>
        <Badge variant="default" className="text-sm">
          {collectedCount}/{totalCount}
        </Badge>
      </div>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">수집 진행률</p>
            <p className="text-2xl font-bold text-foreground">{Math.round((collectedCount / totalCount) * 100)}%</p>
          </div>
          <Bookmark className="h-12 w-12 text-primary" />
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${(collectedCount / totalCount) * 100}%` }}
          />
        </div>
      </Card>

      {showMap ? (
        <div className="space-y-4">
          <h3 className="font-semibold">수집한 장소 지도</h3>
          <Card className="overflow-hidden">
            <div className="h-[600px]">
              <PajuMap />
            </div>
          </Card>
        </div>
      ) : (
        <>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="shrink-0"
              >
                {category}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {filteredStamps.map((stamp) => (
              <Card key={stamp.id} className={`overflow-hidden ${!stamp.collected ? "opacity-60" : ""}`}>
                <div className="relative aspect-square w-full overflow-hidden bg-muted">
                  <img
                    src={stamp.image || "/placeholder.svg"}
                    alt={stamp.name}
                    className={`h-full w-full object-cover ${!stamp.collected ? "grayscale" : ""}`}
                  />
                  {stamp.collected ? (
                    <div className="absolute right-2 top-2">
                      <Bookmark className="h-5 w-5 fill-primary text-primary drop-shadow-lg" />
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <Lock className="h-8 w-8 text-white" />
                    </div>
                  )}
                </div>
                <div className="p-3 space-y-2">
                  <div>
                    <h3 className="text-sm font-bold text-foreground line-clamp-1">{stamp.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-1">{stamp.description}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      {stamp.category}
                    </Badge>
                    {stamp.collected && stamp.date && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {stamp.date}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
