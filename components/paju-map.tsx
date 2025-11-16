"use client"

import { MapPin, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Map, MapMarker, useKakaoLoader } from "react-kakao-maps-sdk"

// 파주 출판단지 관광지 목록 (좌표)
const touristLocations = [
  { id: 1, name: "파주출판도시 Sbg파주사옥", lat: 37.7420, lng: 126.6920, category: "사옥" },
  { id: 2, name: "milkbook", lat: 37.707479, lng: 126.687637, category: "서점" },
  { id: 3, name: "김영사 사서점", lat: 37.712296, lng: 126.686404, category: "서점" },
  { id: 4, name: "문학동네", lat: 37.711471, lng: 126.688030, category: "출판사" },
  { id: 5, name: "출판단지 북카페눈", lat: 37.707651, lng: 126.687237, category: "카페" },
  { id: 6, name: "열화당", lat: 37.709045, lng: 126.684636, category: "서점" },
  { id: 7, name: "출판단지 은하수 출판사", lat: 37.709656, lng: 126.687104, category: "출판사" },
  { id: 8, name: "출판단지 음악세계", lat: 37.709936, lng: 126.685923, category: "음악" },
  { id: 9, name: "출판단지 지혜의숲", lat: 37.708473, lng: 126.686944, category: "서점" },
  { id: 10, name: "출판단지 어린이집", lat: 37.710973, lng: 126.684632, category: "시설" },
  { id: 11, name: "파인드아웃", lat: 37.7330, lng: 126.7010, category: "서점" },
]

const categories = ["전체", "서점", "출판사", "카페", "사옥", "음악", "시설"]

export function PajuMap() {
  const [selectedCategory, setSelectedCategory] = useState("전체")
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // 카카오맵 SDK 로드
  const apiKey = process.env.NEXT_PUBLIC_KAKAOMAP_KEY
  
  const [loading, error] = useKakaoLoader({
    appkey: apiKey || "",
    libraries: ["services", "clusterer"],
  })

  const filteredLocations = touristLocations.filter((loc) => {
    const matchesCategory = selectedCategory === "전체" || loc.category === selectedCategory
    const matchesSearch = loc.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const selectedLocationData = touristLocations.find((loc) => loc.id === selectedLocation)

  // API 키가 없을 때
  if (!apiKey) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 px-4">
        <p className="text-center text-destructive">카카오맵 API 키가 설정되지 않았습니다.</p>
        <p className="text-center text-xs text-muted-foreground">
          .env 파일에 NEXT_PUBLIC_KAKAOMAP_KEY를 설정하고 <br />
          개발 서버를 재시작해주세요.
        </p>
      </div>
    )
  }

  // 로딩 중일 때
  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-muted-foreground">지도를 불러오는 중...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 px-4">
        <p className="text-destructive font-semibold">지도를 불러오는데 실패했습니다</p>
        <div className="space-y-2 text-center">
          <p className="text-sm text-muted-foreground">
            다음 사항을 확인해주세요:
          </p>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>1. 카카오 개발자 콘솔에서 JavaScript 키 확인</li>
            <li>2. 플랫폼에 <code className="bg-muted px-1 py-0.5 rounded">http://localhost:3000</code> 등록</li>
            <li>3. 브라우저 Network 탭에서 dapi.kakao.com 요청 확인</li>
          </ul>
        </div>
        <p className="text-xs text-muted-foreground">
          현재 API 키: <code className="bg-muted px-1 py-0.5 rounded text-xs">{apiKey?.substring(0, 10)}...</code>
        </p>
      </div>
    )
  }

  return (
    <div className="relative h-full w-full">
      <div className="absolute left-0 right-0 top-0 z-20 bg-gradient-to-b from-background to-transparent px-3 pt-2">
        <div className="relative mb-2">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="장소 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 pl-9 pr-3"
          />
        </div>

        <div className="no-scrollbar flex gap-1.5 overflow-x-auto pb-1">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="h-8 shrink-0 text-xs"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <div className="h-full w-full">
        <Map
          center={{ lat: 37.7095, lng: 126.6865 }}
          style={{ width: "100%", height: "100%" }}
          level={4}
          onCreate={() => {}}
        >
        {filteredLocations.map((location) => (
          <MapMarker
            key={location.id}
            position={{ lat: location.lat, lng: location.lng }}
            onClick={() => setSelectedLocation(location.id)}
          />
        ))}
        </Map>
      </div>

      {selectedLocationData && (
        <div className="absolute bottom-3 left-3 right-3 z-20 rounded-lg border border-border bg-card p-3 shadow-lg">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-foreground">{selectedLocationData.name}</h3>
                <Badge variant="secondary" className="text-xs">
                  {selectedLocationData.category}
                </Badge>
              </div>
            </div>
            <button
              onClick={() => setSelectedLocation(null)}
              className="p-1 text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
