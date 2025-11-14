"use client"

import { WelcomeScreen } from "@/components/welcome-screen"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { logout, getUser } from "@/lib/auth-api"

export default function Home() {
  const router = useRouter()

  // 루트 경로 접근 시 모든 로그인 정보 및 사용자 데이터 제거
  useEffect(() => {
    // 먼저 사용자 정보 가져오기 (로그아웃 전에)
    const user = getUser()
    const userId = user?.id
    
    // 사용자별 채팅 기록 및 세션 ID 제거
    if (userId) {
      // 사용자별 채팅 기록 키 패턴으로 모든 키 찾아서 제거
      const keysToRemove: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key) {
          // 사용자별 채팅 기록 제거
          if (key.startsWith(`chat_messages_user_${userId}_`)) {
            keysToRemove.push(key)
          }
          // 사용자별 세션 ID 제거
          if (key === `chatbot_session_id_user_${userId}`) {
            keysToRemove.push(key)
          }
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key))
    }
    
    // 게스트 세션 ID 제거
    localStorage.removeItem("chatbot_session_id_guest")
    localStorage.removeItem("chatbot_session_id")
    
    // 로그아웃 처리 (토큰, 사용자 정보 제거)
    logout()
    
    // isLoggedIn 제거
    localStorage.removeItem("isLoggedIn")
  }, [])

  const handleLogin = () => {
    localStorage.setItem("isLoggedIn", "true")
    router.push("/home")
  }

  const handleBrowse = () => {
    localStorage.setItem("isLoggedIn", "false")
    router.push("/home")
  }

  return <WelcomeScreen onLogin={handleLogin} onBrowse={handleBrowse} />
}
