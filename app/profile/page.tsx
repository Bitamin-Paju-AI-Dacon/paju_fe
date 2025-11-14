"use client"

import { BottomNav } from "@/components/bottom-nav"
import { UserProfile } from "@/components/user-profile"
import { AppHeader } from "@/components/app-header"

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen">
      <div className="mx-auto w-full max-w-md min-h-screen bg-gradient-to-b from-primary/20 to-background flex flex-col">
        <AppHeader />
        <main className="flex-1 pb-20">
          <UserProfile />
        </main>
        <BottomNav currentPage="profile" />
      </div>
    </div>
  )
}
