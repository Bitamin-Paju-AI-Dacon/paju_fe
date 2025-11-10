"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, MapPin, RotateCcw } from "lucide-react"

interface RecommendedCoursesProps {
  selections: {
    duration: string | null
    group: string | null
    concept: string | null
  }
  onReset: () => void
}

const coursesBySelection: Record<string, any[]> = {
  "day-solo-reading": [
    {
      id: 1,
      title: "혼자만의 독서 힐링 코스",
      duration: "4시간",
      spots: 4,
      difficulty: "쉬움",
      image: "/bookstore-alley.jpg",
      description: "조용한 서점과 카페에서 책과 함께하는 시간",
    },
  ],
  "day-couple-cafe": [
    {
      id: 2,
      title: "연인과 함께하는 카페 투어",
      duration: "3시간",
      spots: 5,
      difficulty: "쉬움",
      image: "/cafe-street.jpg",
      description: "감성 넘치는 북카페 데이트 코스",
    },
  ],
  "overnight-family-culture": [
    {
      id: 3,
      title: "가족과 함께하는 문화 체험",
      duration: "1박2일",
      spots: 8,
      difficulty: "보통",
      image: "/publishing-culture.jpg",
      description: "출판 문화와 역사를 배우는 가족 여행",
    },
  ],
  default: [
    {
      id: 4,
      title: "파주 북시티 베스트 코스",
      duration: "3시간",
      spots: 6,
      difficulty: "쉬움",
      image: "/bookstore-alley.jpg",
      description: "파주 출판단지 필수 명소 투어",
    },
    {
      id: 5,
      title: "책과 예술의 만남",
      duration: "4시간",
      spots: 7,
      difficulty: "보통",
      image: "/cafe-gallery.jpg",
      description: "서점, 갤러리, 카페를 아우르는 문화 코스",
    },
  ],
}

export function RecommendedCourses({ selections, onReset }: RecommendedCoursesProps) {
  const courseKey = `${selections.duration}-${selections.group}-${selections.concept}`
  const courses = coursesBySelection[courseKey] || coursesBySelection.default

  return (
    <div className="px-6 pb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">맞춤 추천 코스</h2>
          <p className="text-sm text-muted-foreground">선택하신 조건에 맞는 코스예요</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onReset}>
          <RotateCcw className="h-4 w-4 mr-1" />
          다시 선택
        </Button>
      </div>
      <div className="space-y-4">
        {courses.map((course) => (
          <Card key={course.id} className="overflow-hidden">
            <div className="aspect-video w-full bg-muted">
              <img
                src={`${course.image}?height=200&width=400`}
                alt={course.title}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-4">
              <div className="mb-2 flex items-start justify-between">
                <h3 className="font-semibold text-balance">{course.title}</h3>
                <Badge variant="secondary">{course.difficulty}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{course.description}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{course.spots}개 장소</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
