"use client"

import { BottomNav } from "@/components/bottom-nav"
import { AchievementProgress } from "@/components/achievement-progress"
import { AppHeader } from "@/components/app-header"

export default function RewardsPage() {
  return (
    <div className="flex min-h-screen">
      <div className="mx-auto w-full max-w-md min-h-screen bg-gradient-to-b from-primary/20 to-background flex flex-col">
        <AppHeader />
        <main className="flex-1 pb-20">
          <AchievementProgress />
        </main>
        <BottomNav currentPage="rewards" />
      </div>
    </div>
  )
}
