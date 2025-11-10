"use client"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar } from "@/components/ui/avatar"
import { Send, Camera, ImageIcon, RefreshCw, X, AlertCircle } from "lucide-react"
import { 
  sendTextMessage, 
  uploadImage, 
  clearSession, 
  generateSessionId,
  type ChatImageResponse 
} from "@/lib/chatbot-api"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Message {
  id: number
  sender: "user" | "bot"
  text: string
  time: string
  imageData?: {
    place: string
    confidence: number
    imageUrl: string
  }
}

const initialMessages: Message[] = [
  {
    id: 1,
    sender: "bot",
    text: "안녕하세요! 파주 북시티 가이드 북이에요.\n\n텍스트 입력이나 이미지 업로드를 통해 원하시는 장소의 정보를 안내받을 수 있습니다.\n\n또한 출판단지에서 예정된 다양한 행사 일정도 함께 확인하실 수 있습니다.\n\n1. 텍스트 질문: 메시지를 입력해주세요\n2. 이미지 업로드: 카메라 또는 갤러리 버튼을 눌러주세요\n\n궁금한 점이 있으시면 언제든 물어보세요!",
    time: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
  },
]

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  // 세션 ID 초기화
  useEffect(() => {
    const storedSessionId = localStorage.getItem("chatbot_session_id")
    if (storedSessionId) {
      setSessionId(storedSessionId)
    } else {
      const newSessionId = generateSessionId()
      setSessionId(newSessionId)
      localStorage.setItem("chatbot_session_id", newSessionId)
    }
  }, [])

  // 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // 에러 자동 제거
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })
  }

  const addMessage = (sender: "user" | "bot", text: string, imageData?: Message["imageData"]) => {
    const newMessage: Message = {
      id: Date.now(),
      sender,
      text,
      time: getCurrentTime(),
      imageData,
    }
    setMessages((prev) => [...prev, newMessage])
    return newMessage
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return
    
    setError(null)
    const userMessage = input
    setInput("")
    
    // 사용자 메시지 추가
    addMessage("user", userMessage)
    
    // 로딩 시작
    setIsLoading(true)
    
    try {
      const response = await sendTextMessage(userMessage, sessionId)
      addMessage("bot", response.response)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      setError(errorMessage)
      addMessage("bot", "죄송합니다. 응답을 생성하는 중 오류가 발생했습니다. 다시 시도해주세요.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageUpload = async () => {
    if (!selectedFile || isLoading) return
    
    setError(null)
    setIsLoading(true)
    
    // 이미지 미리보기를 사용자 메시지로 추가
    addMessage("user", "이미지를 업로드했습니다.")
    
    try {
      const response = await uploadImage(selectedFile, sessionId)
      
      const botMessage = `📍 **장소**: ${response.predicted_place}\n🎯 **신뢰도**: ${response.confidence.toFixed(1)}%\n\n${response.response}`
      
      addMessage("bot", botMessage, {
        place: response.predicted_place,
        confidence: response.confidence,
        imageUrl: imagePreview || "",
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      setError(errorMessage)
      addMessage("bot", "죄송합니다. 이미지 인식 중 오류가 발생했습니다. 다시 시도해주세요.")
    } finally {
      setIsLoading(false)
      setImagePreview(null)
      setSelectedFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ""
      if (imageInputRef.current) imageInputRef.current.value = ""
    }
  }

  const handleClearSession = async () => {
    if (isLoading) return
    
    const confirmed = confirm("대화 내역을 모두 삭제하시겠습니까?")
    if (!confirmed) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      await clearSession(sessionId)
      setMessages(initialMessages)
      
      // 새로운 세션 ID 생성
      const newSessionId = generateSessionId()
      setSessionId(newSessionId)
      localStorage.setItem("chatbot_session_id", newSessionId)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen flex-col">
      {/* 헤더 */}
      <header className="border-b border-border bg-card px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-xG61nZ3jH7uaHYwW3J08QfU9XwNyFa.png"
                alt="파주 북이"
                className="h-full w-full object-cover"
              />
            </Avatar>
            <div>
              <h2 className="font-semibold">파주 북이</h2>
              <p className="text-xs text-muted-foreground">
                {isLoading ? "응답 중..." : "파주 출판단지 가이드"}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClearSession}
            disabled={isLoading}
            title="대화 초기화"
          >
            <RefreshCw className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </header>

      {/* 에러 알림 */}
      {error && (
        <div className="px-4 pt-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}

      {/* 메시지 영역 */}
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`flex max-w-[80%] gap-2 ${message.sender === "user" ? "flex-row-reverse" : ""}`}>
              {message.sender === "bot" && (
                <Avatar className="h-8 w-8 shrink-0">
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-xG61nZ3jH7uaHYwW3J08QfU9XwNyFa.png"
                    alt="파주 북이"
                    className="h-full w-full object-cover"
                  />
                </Avatar>
              )}
              <div>
                <Card
                  className={`p-3 ${message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                >
                  {message.imageData && (
                    <div className="mb-2">
                      <img
                        src={message.imageData.imageUrl}
                        alt="업로드된 이미지"
                        className="max-w-full rounded-lg"
                      />
                    </div>
                  )}
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                </Card>
                <p className={`mt-1 text-xs text-muted-foreground ${message.sender === "user" ? "text-right" : ""}`}>
                  {message.time}
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {/* 로딩 인디케이터 */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex max-w-[80%] gap-2">
              <Avatar className="h-8 w-8 shrink-0">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-xG61nZ3jH7uaHYwW3J08QfU9XwNyFa.png"
                  alt="파주 북이"
                  className="h-full w-full object-cover"
                />
              </Avatar>
              <Card className="p-3 bg-muted">
                <div className="flex gap-1">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]"></div>
                  <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]"></div>
                  <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground"></div>
                </div>
              </Card>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* 이미지 미리보기 */}
      {imagePreview && (
        <div className="border-t border-border bg-card p-4">
          <div className="relative inline-block">
            <img
              src={imagePreview}
              alt="미리보기"
              className="h-32 w-32 rounded-lg object-cover"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute -right-2 -top-2 h-6 w-6 rounded-full"
              onClick={() => {
                setImagePreview(null)
                setSelectedFile(null)
                if (fileInputRef.current) fileInputRef.current.value = ""
                if (imageInputRef.current) imageInputRef.current.value = ""
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <Button
            onClick={handleImageUpload}
            disabled={isLoading}
            className="ml-2"
            size="sm"
          >
            이미지 전송
          </Button>
        </div>
      )}

      {/* 입력 영역 */}
      <div className="border-t border-border bg-card p-4">
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleImageSelect}
          />
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageSelect}
          />
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 bg-transparent"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            title="카메라로 촬영"
          >
            <Camera className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 bg-transparent"
            onClick={() => imageInputRef.current?.click()}
            disabled={isLoading}
            title="갤러리에서 선택"
          >
            <ImageIcon className="h-5 w-5" />
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="메시지를 입력하세요..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            size="icon"
            className="shrink-0"
            disabled={isLoading || !input.trim()}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
