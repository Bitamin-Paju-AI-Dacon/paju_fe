"use client"

import { Home, MessageCircle, Trophy, User } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface BottomNavProps {
  currentPage?: "home" | "chatbot" | "rewards" | "profile"
}

export function BottomNav({ currentPage = "home" }: BottomNavProps) {
  const navItems = [
    { icon: Home, label: "홈", href: "/", page: "home" as const },
    { icon: MessageCircle, label: "챗봇", href: "/chatbot", page: "chatbot" as const },
    { icon: Trophy, label: "보상", href: "/rewards", page: "rewards" as const },
    { icon: User, label: "프로필", href: "/profile", page: "profile" as const },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-border bg-card/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-md items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPage === item.page
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-2 py-1 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
