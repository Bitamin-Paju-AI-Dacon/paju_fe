import { BottomNav } from "@/components/bottom-nav"
import { RankingList } from "@/components/ranking-list"
import { redirect } from "next/navigation"

export default function RankingPage() {
  redirect("/rewards")

  return (
    <main className="min-h-screen bg-background pb-20">
      <div className="mx-auto max-w-md">
        <RankingList />
      </div>
      <BottomNav currentPage="ranking" />
    </main>
  )
}
