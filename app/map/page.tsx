import { BottomNav } from "@/components/bottom-nav"
import { PajuMap } from "@/components/paju-map"
import { AppHeader } from "@/components/app-header"

export default function MapPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-gradient-to-b from-primary/20 to-background">
      <AppHeader />

      <main className="flex-1 pb-20">
        <PajuMap />
      </main>

      <BottomNav currentPage="map" />
    </div>
  )
}
