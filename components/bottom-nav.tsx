"use client"

import { Home, MessageCircle, User } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface BottomNavProps {
  currentPage?: "home" | "chatbot" | "profile"
}

export function BottomNav({ currentPage = "home" }: BottomNavProps) {
  const navItems = [
    { icon: Home, label: "홈", href: "/home", page: "home" as const },
    { icon: MessageCircle, label: "챗봇", href: "/chatbot", page: "chatbot" as const },
    { icon: User, label: "프로필", href: "/profile", page: "profile" as const },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-border bg-card/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-md items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPage === item.page
          const isChatbot = item.page === "chatbot"
          
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 transition-all",
                isChatbot
                  ? "relative -mt-6"
                  : "px-2 py-1",
                !isChatbot && (isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"),
              )}
            >
              {isChatbot ? (
                <div className="flex flex-col items-center gap-1">
                  <div className={cn(
                    "flex h-14 w-14 items-center justify-center rounded-full bg-blue-500 shadow-lg transition-all hover:bg-blue-600 hover:shadow-xl",
                    isActive && "bg-blue-600 shadow-xl"
                  )}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xs font-medium text-blue-500">{item.label}</span>
                </div>
              ) : (
                <>
                  <Icon className="h-5 w-5" />
                  <span className="text-xs font-medium">{item.label}</span>
                </>
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
