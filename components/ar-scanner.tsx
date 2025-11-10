"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Camera, MapPin, Sparkles, X } from "lucide-react"
import { BuildingInfo } from "./building-info"

const buildings = [
  {
    id: 1,
    name: "지혜의숲",
    category: "도서관",
    description:
      "아시아 최대 규모의 서가를 자랑하는 복합문화공간입니다. 10만여 권의 책이 벽면을 가득 채우고 있으며, 독서와 휴식을 동시에 즐길 수 있습니다.",
    features: ["10만권 장서", "카페 운영", "전시 공간"],
    hours: "평일 10:00-18:00",
    address: "경기도 파주시 회동길 145",
  },
  {
    id: 2,
    name: "아시아출판문화정보센터",
    category: "문화센터",
    description:
      "출판문화의 중심지로, 다양한 전시와 세미나가 열리는 복합문화공간입니다. 출판 관련 정보와 자료를 제공합니다.",
    features: ["전시실", "세미나실", "출판정보"],
    hours: "평일 09:00-18:00",
    address: "경기도 파주시 회동길 230",
  },
  {
    id: 3,
    name: "출판도시문화재단",
    category: "문화재단",
    description:
      "파주 출판단지의 문화예술 활동을 지원하는 재단입니다. 다양한 문화 프로그램과 행사를 기획하고 운영합니다.",
    features: ["문화행사", "교육프로그램", "작가지원"],
    hours: "평일 09:00-18:00",
    address: "경기도 파주시 회동길 145",
  },
]

export function ARScanner() {
  const [isScanning, setIsScanning] = useState(false)
  const [capturedPhoto, setCapturedPhoto] = useState(false)
  const [recognizedBuilding, setRecognizedBuilding] = useState<(typeof buildings)[0] | null>(null)
  const [showBuildingInfo, setShowBuildingInfo] = useState(false)

  const handleCapture = () => {
    setCapturedPhoto(true)
    setIsScanning(false)

    // Simulate AI processing delay
    setTimeout(() => {
      // Randomly select a building for demo
      const randomBuilding = buildings[Math.floor(Math.random() * buildings.length)]
      setRecognizedBuilding(randomBuilding)
      setShowBuildingInfo(true)
    }, 1500)
  }

  const handleClose = () => {
    setShowBuildingInfo(false)
    setCapturedPhoto(false)
    setRecognizedBuilding(null)
  }

  return (
    <div className="relative h-[60vh] overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-background/80 to-transparent p-4 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-balance">파주 북시티</h1>
            <p className="text-sm text-muted-foreground">책의 도시를 탐험하세요</p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-primary px-4 py-2">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
            <span className="text-sm font-semibold text-primary-foreground">12/24</span>
          </div>
        </div>
      </div>

      {/* AR Camera View */}
      <div className="relative h-full w-full bg-gradient-to-br from-secondary/20 via-background to-accent/10">
        {capturedPhoto && !showBuildingInfo ? (
          // AI Processing State
          <div className="flex h-full items-center justify-center">
            <div className="text-center space-y-4">
              <div className="relative mx-auto">
                <div className="h-32 w-32 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="h-12 w-12 text-primary animate-pulse" />
                </div>
              </div>
              <div>
                <p className="text-lg font-semibold">AI 분석 중...</p>
                <p className="text-sm text-muted-foreground">건물을 인식하고 있습니다</p>
              </div>
            </div>
          </div>
        ) : isScanning ? (
          // Scanning State
          <div className="flex h-full items-center justify-center">
            <div className="relative">
              <div className="h-64 w-64 animate-pulse rounded-3xl border-4 border-dashed border-primary bg-primary/5" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Camera className="h-16 w-16 text-primary animate-bounce" />
              </div>
              <div className="absolute -bottom-12 left-0 right-0 text-center">
                <p className="text-sm font-medium">건물을 프레임 안에 맞춰주세요</p>
              </div>
            </div>
          </div>
        ) : (
          // Initial State
          <div className="flex h-full flex-col items-center justify-center gap-4 p-6">
            <div className="rounded-full bg-primary/10 p-8">
              <MapPin className="h-16 w-16 text-primary" />
            </div>
            <div className="text-center">
              <h2 className="text-xl font-bold text-balance mb-2">주변 장소를 찾아보세요</h2>
              <p className="text-sm text-muted-foreground text-pretty">
                카메라로 출판단지의 특별한 장소를 스캔하고 스탬프를 모아보세요
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Scan Button */}
      {!capturedPhoto && !showBuildingInfo && (
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4">
          {isScanning && (
            <Button size="lg" variant="secondary" className="h-14 px-8 rounded-full shadow-lg" onClick={handleCapture}>
              <Camera className="h-5 w-5 mr-2" />
              촬영하기
            </Button>
          )}
          {!isScanning && (
            <Button size="lg" className="h-16 w-16 rounded-full shadow-lg" onClick={() => setIsScanning(true)}>
              <Camera className="h-6 w-6" />
            </Button>
          )}
        </div>
      )}

      {showBuildingInfo && recognizedBuilding && (
        <div className="absolute inset-0 z-20 bg-background/95 backdrop-blur-sm">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-bold">건물 인식 완료</h2>
              <Button variant="ghost" size="icon" onClick={handleClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <BuildingInfo building={recognizedBuilding} onClose={handleClose} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
