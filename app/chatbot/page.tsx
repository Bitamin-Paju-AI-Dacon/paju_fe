import { ChatInterface } from "@/components/chat-interface"
import { BottomNav } from "@/components/bottom-nav"

export default function ChatbotPage() {
  return (
    <main className="min-h-screen bg-background pb-20">
      <div className="mx-auto max-w-md">
        <ChatInterface />
      </div>
      <BottomNav currentPage="chatbot" />
    </main>
  )
}
