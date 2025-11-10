"use client"

import { MapPin, Navigation, Bookmark, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Map, MapMarker, useKakaoLoader } from "react-kakao-maps-sdk"

// 파주 출판단지 주요 스탬프 수집 장소 (실제 좌표)
const stampLocations = [
  { id: 1, name: "지혜의숲", lat: 37.7435, lng: 126.6920, collected: true, category: "서점" },
  { id: 2, name: "아시아출판문화정보센터", lat: 37.7405, lng: 126.6975, collected: true, category: "문화시설" },
  { id: 3, name: "활판공방", lat: 37.7380, lng: 126.6900, collected: false, category: "체험" },
  { id: 4, name: "파주출판도시 갤러리", lat: 37.7450, lng: 126.7000, collected: false, category: "갤러리" },
  { id: 5, name: "북소리", lat: 37.7360, lng: 126.6948, collected: true, category: "서점" },
  { id: 6, name: "출판도시문화재단", lat: 37.7420, lng: 126.6880, collected: false, category: "문화시설" },
  { id: 7, name: "열화당책박물관", lat: 37.7460, lng: 126.6955, collected: false, category: "박물관" },
  { id: 8, name: "파주출판단지 카페거리", lat: 37.7340, lng: 126.6970, collected: false, category: "카페" },
]

const categories = ["전체", "서점", "문화시설", "체험", "갤러리", "박물관", "카페"]

export function PajuMap() {
  const [selectedCategory, setSelectedCategory] = useState("전체")
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // 카카오맵 SDK 로드
  const apiKey = process.env.NEXT_PUBLIC_KAKAOMAP_KEY
  console.log("🔑 카카오맵 API 키:", apiKey)
  
  const [loading, error] = useKakaoLoader({
    appkey: apiKey || "",
    libraries: ["services", "clusterer"],
  })

  console.log("📍 카카오맵 로딩 상태:", { loading, error })
  
  // 에러 발생 시 더 자세한 정보 출력
  if (error) {
    console.error("❌ 카카오맵 로딩 실패!")
    console.error("에러 타입:", error.type)
    console.error("에러 타겟:", error.target)
    console.log("💡 해결 방법:")
    console.log("1. 카카오 개발자 콘솔 (https://developers.kakao.com) 접속")
    console.log("2. 내 애플리케이션 > 앱 설정 > 플랫폼")
    console.log("3. Web 플랫폼 추가 > http://localhost:3000 등록")
    console.log("4. 브라우저 Network 탭에서 dapi.kakao.com 요청 확인")
  }

  const filteredLocations = stampLocations.filter((loc) => {
    const matchesCategory = selectedCategory === "전체" || loc.category === selectedCategory
    const matchesSearch = loc.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const selectedLocationData = stampLocations.find((loc) => loc.id === selectedLocation)

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

  // 로딩 중이거나 에러가 있을 때
  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-muted-foreground">지도를 불러오는 중...</p>
      </div>
    )
  }

  if (error) {
    console.error("카카오맵 에러:", error)
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

  console.log("카카오맵 렌더링 시작")

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
          center={{ lat: 37.7405, lng: 126.6948 }}
          style={{ width: "100%", height: "100%" }}
          level={4}
          onCreate={() => console.log("카카오맵 생성 완료!")}
        >
        {filteredLocations.map((location) => (
          <MapMarker
            key={location.id}
            position={{ lat: location.lat, lng: location.lng }}
            onClick={() => setSelectedLocation(location.id)}
            image={{
              src: location.collected 
                ? "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzAwN2JmZiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMkM4LjEzIDIgNSA1LjEzIDUgOWMwIDUuMjUgNyAxMyA3IDEzczctNy43NSA3LTEzYzAtMy44Ny0zLjEzLTctNy03em0wIDkuNWMtMS4zOCAwLTIuNS0xLjEyLTIuNS0yLjVzMS4xMi0yLjUgMi41LTIuNSAyLjUgMS4xMiAyLjUgMi41LTEuMTIgMi41LTIuNSAyLjV6Ii8+PC9zdmc+"
                : "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzk5OTk5OSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMkM4LjEzIDIgNSA1LjEzIDUgOWMwIDUuMjUgNyAxMyA3IDEzczctNy43NSA3LTEzYzAtMy44Ny0zLjEzLTctNy03em0wIDkuNWMtMS4zOCAwLTIuNS0xLjEyLTIuNS0yLjVzMS4xMi0yLjUgMi41LTIuNSAyLjUgMS4xMiAyLjUgMi41LTEuMTIgMi41LTIuNSAyLjV6Ii8+PC9zdmc+",
              size: { width: 32, height: 32 },
            }}
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
              <p className="mt-1 text-xs text-muted-foreground">
                {selectedLocationData.collected ? "방문 완료" : "아직 방문하지 않은 장소입니다"}
              </p>
            </div>
            <button
              onClick={() => setSelectedLocation(null)}
              className="p-1 text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          </div>
          {!selectedLocationData.collected && (
            <Button className="mt-2 w-full" size="sm">
              <Navigation className="mr-2 h-4 w-4" />
              길찾기
            </Button>
          )}
        </div>
      )}

      <Button size="icon" className="absolute bottom-20 right-3 z-20 h-11 w-11 rounded-full shadow-lg">
        <Navigation className="h-5 w-5" />
      </Button>

      <div className="absolute right-3 top-14 z-20 rounded-lg border border-border bg-card/95 p-2 text-xs backdrop-blur-sm">
        <div className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 fill-primary text-primary" />
          <span className="text-muted-foreground">방문 완료</span>
        </div>
        <div className="mt-1 flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 fill-accent text-accent-foreground" />
          <span className="text-muted-foreground">미방문</span>
        </div>
      </div>
    </div>
  )
}
