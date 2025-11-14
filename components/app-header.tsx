"use client"

import Link from "next/link"
import Image from "next/image"

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-md items-center justify-between px-4">
        <Link href="/home" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <Image
            src="/logo3.png"
            alt="파주 북길 로고"
            width={140}
            height={42}
            className="h-auto object-contain"
            priority
          />
        </Link>
      </div>
    </header>
  )
}

