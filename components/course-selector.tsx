"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Users, Sparkles } from "lucide-react"

interface CourseSelectorProps {
  selections: {
    duration: string | null
    group: string | null
    concept: string | null
  }
  onSelectionsChange: (selections: any) => void
}

const durations = [
  { id: "day", label: "당일치기", icon: "☀️" },
  { id: "overnight", label: "1박2일", icon: "🌙" },
]

const groups = [
  { id: "solo", label: "혼자", icon: "🚶" },
  { id: "couple", label: "애인과", icon: "💑" },
  { id: "family", label: "가족과", icon: "👨‍👩‍👧‍👦" },
  { id: "friends", label: "친구들과", icon: "👥" },
]

const concepts = [
  { id: "culture", label: "문화 체험", icon: "🎨" },
  { id: "reading", label: "독서 힐링", icon: "📚" },
  { id: "photo", label: "사진 명소", icon: "📸" },
  { id: "cafe", label: "카페 투어", icon: "☕" },
  { id: "history", label: "역사 탐방", icon: "🏛️" },
]

export function CourseSelector({ selections, onSelectionsChange }: CourseSelectorProps) {
  const handleSelect = (category: "duration" | "group" | "concept", value: string) => {
    onSelectionsChange({
      ...selections,
      [category]: value,
    })
  }

  const isComplete = selections.duration && selections.group && selections.concept

  return (
    <div className="px-6 py-6 space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold mb-2">나만의 여행 코스 찾기</h2>
        <p className="text-sm text-muted-foreground">3가지를 선택하면 맞춤 코스를 추천해드려요</p>
      </div>

      {/* Duration Selection */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">여행 기간</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {durations.map((duration) => (
            <Card
              key={duration.id}
              className={`p-4 cursor-pointer transition-all ${
                selections.duration === duration.id
                  ? "border-primary bg-primary/5 ring-2 ring-primary"
                  : "hover:border-primary/50"
              }`}
              onClick={() => handleSelect("duration", duration.id)}
            >
              <div className="text-center">
                <div className="text-2xl mb-1">{duration.icon}</div>
                <div className="font-medium">{duration.label}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Group Selection */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Users className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">누구와 함께</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {groups.map((group) => (
            <Card
              key={group.id}
              className={`p-4 cursor-pointer transition-all ${
                selections.group === group.id
                  ? "border-primary bg-primary/5 ring-2 ring-primary"
                  : "hover:border-primary/50"
              }`}
              onClick={() => handleSelect("group", group.id)}
            >
              <div className="text-center">
                <div className="text-2xl mb-1">{group.icon}</div>
                <div className="font-medium">{group.label}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Concept Selection */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">원하는 컨셉</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {concepts.map((concept) => (
            <Card
              key={concept.id}
              className={`p-4 cursor-pointer transition-all ${
                selections.concept === concept.id
                  ? "border-primary bg-primary/5 ring-2 ring-primary"
                  : "hover:border-primary/50"
              }`}
              onClick={() => handleSelect("concept", concept.id)}
            >
              <div className="text-center">
                <div className="text-2xl mb-1">{concept.icon}</div>
                <div className="font-medium text-sm">{concept.label}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Complete Button */}
      {isComplete && (
        <Button className="w-full" size="lg">
          맞춤 코스 추천받기
        </Button>
      )}
    </div>
  )
}
