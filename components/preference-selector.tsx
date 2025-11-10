"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { BookOpen, Coffee, Camera, Palette } from "lucide-react"

const preferences = [
  { id: "books", label: "책 탐험", icon: BookOpen },
  { id: "cafe", label: "카페 투어", icon: Coffee },
  { id: "photo", label: "포토 스팟", icon: Camera },
  { id: "art", label: "예술 문화", icon: Palette },
]

export function PreferenceSelector() {
  const [selected, setSelected] = useState<string[]>([])

  const togglePreference = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]))
  }

  return (
    <div className="p-6">
      <h2 className="mb-4 text-lg font-semibold">취향을 선택하세요</h2>
      <div className="grid grid-cols-2 gap-3">
        {preferences.map(({ id, label, icon: Icon }) => (
          <Button
            key={id}
            variant={selected.includes(id) ? "default" : "outline"}
            className="h-24 flex-col gap-2"
            onClick={() => togglePreference(id)}
          >
            <Icon className="h-6 w-6" />
            <span className="text-sm">{label}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}
