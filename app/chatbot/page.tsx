import { ChatInterface } from "@/components/chat-interface"
import { BottomNav } from "@/components/bottom-nav"
import { AppHeader } from "@/components/app-header"

export default function ChatbotPage() {
  return (
    <main className="min-h-screen bg-background pb-20">
      <AppHeader />
      <div className="mx-auto max-w-md">
        <ChatInterface />
      </div>
      <BottomNav currentPage="chatbot" />
    </main>
  )
}
