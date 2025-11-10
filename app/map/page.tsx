import { BottomNav } from "@/components/bottom-nav"
import { PajuMap } from "@/components/paju-map"

export default function MapPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-lg font-bold text-foreground">파주 출판단지 지도</h1>
        </div>
      </header>

      <main className="flex-1 pb-20">
        <PajuMap />
      </main>

      <BottomNav currentPage="map" />
    </div>
  )
}
