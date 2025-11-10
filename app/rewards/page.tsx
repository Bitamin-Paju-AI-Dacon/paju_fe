"use client"

import { BottomNav } from "@/components/bottom-nav"
import { AchievementProgress } from "@/components/achievement-progress"

export default function RewardsPage() {
  return (
    <main className="min-h-screen bg-background pb-20">
      <div className="mx-auto max-w-md">
        <AchievementProgress />
      </div>
      <BottomNav currentPage="rewards" />
    </main>
  )
}
