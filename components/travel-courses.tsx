"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, Star } from "lucide-react"
import { useState } from "react"

const courses = [
  {
    id: 1,
    title: "출판단지 입문 코스",
    description: "파주 출판단지의 주요 명소를 둘러보는 기본 코스",
    duration: "2-3시간",
    difficulty: "쉬움",
    spots: 5,
    distance: "2.5km",
    image: "/bookstore-district.jpg",
    completed: false,
  },
  {
    id: 2,
    title: "책과 예술의 향연",
    description: "갤러리와 박물관을 중심으로 한 문화 탐방 코스",
    duration: "3-4시간",
    difficulty: "보통",
    spots: 7,
    distance: "3.8km",
    image: "/art-gallery-books.jpg",
    completed: true,
  },
  {
    id: 3,
    title: "북 카페 투어",
    description: "출판단지의 숨은 카페와 서점을 찾아가는 여유로운 코스",
    duration: "4-5시간",
    difficulty: "쉬움",
    spots: 8,
    distance: "4.2km",
    image: "/cozy-book-cafe.jpg",
    completed: false,
  },
  {
    id: 4,
    title: "출판 역사 탐방",
    description: "한국 출판의 역사를 따라가는 심화 코스",
    duration: "5-6시간",
    difficulty: "어려움",
    spots: 10,
    distance: "6.5km",
    image: "/publishing-history-museum.jpg",
    completed: false,
  },
]

export function TravelCourses() {
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null)

  return (
    <div className="space-y-4 p-4">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">여행 코스</h1>
        <p className="text-sm text-muted-foreground">파주 출판단지를 즐기는 다양한 방법을 소개합니다</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        <Button variant="default" size="sm">
          전체
        </Button>
        <Button variant="outline" size="sm">
          쉬움
        </Button>
        <Button variant="outline" size="sm">
          보통
        </Button>
        <Button variant="outline" size="sm">
          어려움
        </Button>
      </div>

      <div className="space-y-4">
        {courses.map((course) => (
          <Card key={course.id} className="overflow-hidden">
            <div className="relative h-40 w-full overflow-hidden bg-muted">
              <img src={course.image || "/placeholder.svg"} alt={course.title} className="h-full w-full object-cover" />
              {course.completed && (
                <div className="absolute right-2 top-2">
                  <Badge className="bg-primary">완료</Badge>
                </div>
              )}
            </div>
            <div className="p-4 space-y-3">
              <div>
                <h3 className="text-lg font-bold text-foreground">{course.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{course.description}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {course.duration}
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {course.spots}개 장소
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  {course.difficulty}
                </Badge>
              </div>

              <Button className="w-full" variant={course.completed ? "outline" : "default"}>
                {course.completed ? "다시 보기" : "코스 시작하기"}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
