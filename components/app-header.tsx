"use client"

import { Book, Bookmark } from "lucide-react"
import Link from "next/link"

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-md items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div className="relative flex items-center justify-center">
            <div className="absolute h-10 w-10 rounded-full bg-blue-500/20" />
            <Book className="relative h-6 w-6 text-blue-500" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-foreground">북파주</h1>
            <p className="text-[10px] text-muted-foreground leading-none">책으로 떠나는 파주 여행</p>
          </div>
        </Link>
        <Bookmark className="h-5 w-5 text-primary" />
      </div>
    </header>
  )
}

