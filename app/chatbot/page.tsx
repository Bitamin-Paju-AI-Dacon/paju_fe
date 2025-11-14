import { ChatInterface } from "@/components/chat-interface"
import { BottomNav } from "@/components/bottom-nav"
import { AppHeader } from "@/components/app-header"

export default function ChatbotPage() {
  return (
    <div className="flex min-h-screen">
      <div className="mx-auto w-full max-w-md min-h-screen bg-gradient-to-b from-primary/20 to-background flex flex-col">
        <AppHeader />
        <main className="flex-1 pb-20">
          <ChatInterface />
        </main>
        <BottomNav currentPage="chatbot" />
      </div>
    </div>
  )
}
