import { BottomNav } from "@/components/bottom-nav"
import { UserProfile } from "@/components/user-profile"
import { AppHeader } from "@/components/app-header"

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-background pb-20">
      <AppHeader />
      <div className="mx-auto max-w-md">
        <UserProfile />
      </div>
      <BottomNav currentPage="profile" />
    </main>
  )
}
