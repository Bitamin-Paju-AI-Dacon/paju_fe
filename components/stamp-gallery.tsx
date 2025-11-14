"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, LayoutGrid } from "lucide-react"
import { useState } from "react"
import { PajuMap } from "@/components/paju-map"

const stamps = [
  {
    id: 1,
    name: "지혜의숲",
    category: "서점",
    collected: true,
    image: "/modern-bookstore-interior.jpg",
    description: "아시아 최대 규모의 서점으로 100만 권이 넘는 책을 소장하고 있으며, 독특한 건축 디자인과 아늑한 독서 공간이 어우러진 문화 복합 공간입니다",
    address: "경기도 파주시 회동길 145",
    hours: "10:00 - 22:00",
    mapPosition: { x: 25, y: 20 },
  },
  {
    id: 2,
    name: "아시아출판문화정보센터",
    category: "문화시설",
    collected: true,
    image: "/cultural-center-building.jpg",
    description: "출판 문화의 중심지로 출판 관련 전시와 세미나가 열리며, 국내외 출판 산업의 교류와 발전을 위한 다양한 프로그램을 진행합니다",
    address: "경기도 파주시 회동길 230",
    hours: "09:00 - 18:00",
    mapPosition: { x: 55, y: 25 },
  },
  {
    id: 3,
    name: "활판공방",
    category: "체험",
    collected: false,
    image: "/letterpress-workshop.jpg",
    description: "전통 활판 인쇄 체험을 통해 옛 인쇄 기술을 직접 배워보고, 나만의 엽서나 책갈피를 만들어볼 수 있는 특별한 문화 체험 공간입니다",
    address: "경기도 파주시 회동길 352",
    hours: "10:00 - 18:00",
    mapPosition: { x: 70, y: 45 },
  },
  {
    id: 4,
    name: "파주출판도시 갤러리",
    category: "갤러리",
    collected: false,
    image: "/art-gallery-exhibition.jpg",
    description: "다양한 현대미술 전시를 만나보실 수 있으며, 책과 예술이 조화를 이루는 복합문화공간으로 계절마다 새로운 기획전시가 열립니다",
    address: "경기도 파주시 회동길 210",
    hours: "10:00 - 19:00",
    mapPosition: { x: 40, y: 60 },
  },
  {
    id: 5,
    name: "북소리",
    category: "서점",
    collected: true,
    image: "/cozy-bookshop.jpg",
    description: "감성 가득한 독립 서점으로 엄선된 인문학 도서와 작은 공연이 열리는 문화 살롱입니다. 책을 사랑하는 사람들의 아늑한 만남의 장소입니다",
    address: "경기도 파주시 회동길 145-30",
    hours: "11:00 - 20:00",
    mapPosition: { x: 30, y: 75 },
  },
  {
    id: 6,
    name: "출판도시문화재단",
    category: "문화시설",
    collected: false,
    image: "/cultural-foundation-building.jpg",
    description: "출판 문화 진흥의 산실로 다양한 문학 강연과 작가 초청 행사가 열리며, 지역 주민과 방문객을 위한 문화 교육 프로그램을 운영합니다",
    address: "경기도 파주시 회동길 145",
    hours: "09:00 - 18:00",
    mapPosition: { x: 65, y: 70 },
  },
  {
    id: 7,
    name: "열화당책박물관",
    category: "박물관",
    collected: false,
    image: "/book-museum.jpg",
    description: "책의 역사를 만나다. 고서부터 현대 출판물까지 책의 변천사를 한눈에 볼 수 있으며, 출판 역사와 문화를 체험할 수 있는 박물관입니다",
    address: "경기도 파주시 회동길 145-6",
    hours: "10:00 - 18:00",
    mapPosition: { x: 50, y: 40 },
  },
  {
    id: 8,
    name: "파주출판단지 카페거리",
    category: "카페",
    collected: false,
    image: "/cafe-street.jpg",
    description: "책과 함께하는 여유로운 시간을 보낼 수 있는 카페들이 모여있는 거리입니다. 독서와 커피의 조화로 힐링의 시간을 제공합니다",
    address: "경기도 파주시 회동길 일대",
    hours: "10:00 - 22:00",
    mapPosition: { x: 80, y: 30 },
  },
]

const categories = ["전체", "서점", "문화시설", "체험", "갤러리", "박물관", "카페"]

export function StampGallery() {
  const [selectedCategory, setSelectedCategory] = useState("전체")
  const [showMap, setShowMap] = useState(false)

  const filteredStamps =
    selectedCategory === "전체" ? stamps : stamps.filter((stamp) => stamp.category === selectedCategory)

  const collectedCount = stamps.filter((s) => s.collected).length
  const totalCount = stamps.length

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">파주 관광지</h1>
          <p className="text-sm text-muted-foreground">여행할 파주 관광지를 확인하세요</p>
        </div>
        <div className="flex gap-2">
          <Button variant={showMap ? "outline" : "default"} size="icon" onClick={() => setShowMap(false)}>
            <LayoutGrid className="h-5 w-5" />
          </Button>
          <Button variant={showMap ? "default" : "outline"} size="icon" onClick={() => setShowMap(true)}>
            <MapPin className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {showMap ? (
        <div className="space-y-4">
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
              <Card key={stamp.id} className="overflow-hidden">
                <div className="relative aspect-square w-full overflow-hidden bg-muted">
                  <img
                    src={stamp.image || "/placeholder.svg"}
                    alt={stamp.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-3 space-y-2">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-foreground">{stamp.name}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{stamp.description}</p>
                  </div>
                  <div className="flex items-center justify-start">
                    <Badge variant="secondary" className="text-xs">
                      {stamp.category}
                    </Badge>
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
