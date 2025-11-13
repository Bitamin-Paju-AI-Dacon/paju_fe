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
  getGreeting,
  getStamps,
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

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  // localStorage에서 메시지 불러오기
  const loadMessagesFromStorage = (sessionId: string): Message[] => {
    if (typeof window === 'undefined') return []
    try {
      const stored = localStorage.getItem(`chat_messages_${sessionId}`)
      if (stored) {
        const parsed = JSON.parse(stored)
        // imageData의 imageUrl이 base64인 경우 그대로 유지
        return parsed.map((msg: any) => ({
          ...msg,
          imageData: msg.imageData || undefined,
        }))
      }
    } catch (error) {
      console.error("Failed to load messages from storage:", error)
    }
    return []
  }

  // localStorage에 메시지 저장
  const saveMessagesToStorage = (sessionId: string, messages: Message[]) => {
    if (typeof window === 'undefined') return
    try {
      // imageData의 imageUrl이 base64인 경우 그대로 저장
      localStorage.setItem(`chat_messages_${sessionId}`, JSON.stringify(messages))
    } catch (error) {
      console.error("Failed to save messages to storage:", error)
    }
  }

  // 세션 ID 초기화 및 메시지 불러오기
  useEffect(() => {
    const initializeChat = async () => {
      // 세션 ID 설정
      const storedSessionId = localStorage.getItem("chatbot_session_id")
      let currentSessionId: string
      
      if (storedSessionId) {
        currentSessionId = storedSessionId
        setSessionId(storedSessionId)
      } else {
        currentSessionId = generateSessionId()
        setSessionId(currentSessionId)
        localStorage.setItem("chatbot_session_id", currentSessionId)
      }

      // 저장된 메시지 불러오기
      const savedMessages = loadMessagesFromStorage(currentSessionId)
      
      if (savedMessages.length > 0) {
        // 저장된 메시지가 있으면 불러오기
        setMessages(savedMessages)
      } else {
        // 저장된 메시지가 없으면 인삿말 가져오기
        try {
          const greetingData = await getGreeting()
          const greetingMessage: Message = {
            id: Date.now(),
            sender: "bot",
            text: greetingData.greeting,
            time: getCurrentTime(),
          }
          setMessages([greetingMessage])
          // 인삿말도 저장
          saveMessagesToStorage(currentSessionId, [greetingMessage])
        } catch (err) {
          // 인삿말 로드 실패 시 기본 메시지 사용
          console.error("Failed to load greeting:", err)
          const defaultMessage: Message = {
            id: Date.now(),
            sender: "bot",
            text: "안녕하세요! 파주 챗봇입니다. 무엇을 도와드릴까요?",
            time: getCurrentTime(),
          }
          setMessages([defaultMessage])
          saveMessagesToStorage(currentSessionId, [defaultMessage])
        }
      }
    }

    initializeChat()
  }, [])

  // 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // 메시지가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    if (sessionId && messages.length > 0) {
      saveMessagesToStorage(sessionId, messages)
    }
  }, [messages, sessionId])

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
    // 이미지와 텍스트가 모두 없으면 전송 불가
    if ((!input.trim() && !selectedFile) || isLoading) return
    
    setError(null)
    const userMessage = input.trim()
    const hasImage = !!selectedFile
    const hasText = !!userMessage
    
    // 사용자 메시지 추가 (이미지와 텍스트 모두 포함)
    if (hasImage && hasText) {
      addMessage("user", userMessage, {
        place: "",
        confidence: 0,
        imageUrl: imagePreview || "",
      })
    } else if (hasImage) {
      addMessage("user", "이미지를 업로드했습니다.", {
        place: "",
        confidence: 0,
        imageUrl: imagePreview || "",
      })
    } else {
      addMessage("user", userMessage)
    }
    
    // 로딩 시작
    setIsLoading(true)
    
    try {
      // 이미지가 있으면 먼저 이미지 업로드
      if (hasImage && selectedFile) {
        const imageResponse = await uploadImage(selectedFile, sessionId, 'stamp')
        
        let botMessage = `📍 **장소**: ${imageResponse.predicted_place}\n\n${imageResponse.description}`
        
        if (imageResponse.stamp_added) {
          botMessage += "\n\n✅ 스탬프가 추가되었습니다!"
        }
        
        // 텍스트도 있으면 텍스트 메시지도 전송
        if (hasText) {
          try {
            const textResponse = await sendTextMessage(userMessage, sessionId)
            botMessage += `\n\n💬 **질문에 대한 답변**:\n${textResponse.response}`
          } catch (textErr) {
            console.error("텍스트 메시지 전송 실패:", textErr)
            // 텍스트 전송 실패해도 이미지 응답은 표시
          }
        }
        
        // 이미지 URL 우선 사용 (서버에서 반환된 URL이 있으면 사용, 없으면 미리보기 사용)
        const imageUrl = imageResponse.image_url || imagePreview || ""
        
        addMessage("bot", botMessage, {
          place: imageResponse.predicted_place,
          confidence: 100,
          imageUrl: imageUrl,
        })
      } else if (hasText) {
        // 텍스트만 있는 경우
        const response = await sendTextMessage(userMessage, sessionId)
        addMessage("bot", response.response)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      setError(errorMessage)
      addMessage("bot", "죄송합니다. 메시지 전송 중 오류가 발생했습니다. 다시 시도해주세요.")
    } finally {
      setIsLoading(false)
      // 전송 후 입력 필드 초기화
      setInput("")
      setImagePreview(null)
      setSelectedFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ""
      if (imageInputRef.current) imageInputRef.current.value = ""
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

  // handleImageUpload는 이제 handleSend로 통합됨
  // 이미지 전송 버튼은 handleSend를 호출하도록 변경

  const handleClearSession = async () => {
    if (isLoading) return
    
    const confirmed = confirm("대화 내역을 모두 삭제하시겠습니까?")
    if (!confirmed) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      await clearSession(sessionId)
      
      // 기존 세션의 메시지 삭제
      if (sessionId) {
        localStorage.removeItem(`chat_messages_${sessionId}`)
      }
      
      // 새로운 세션 ID 생성
      const newSessionId = generateSessionId()
      setSessionId(newSessionId)
      localStorage.setItem("chatbot_session_id", newSessionId)
      
      // 인삿말 다시 가져오기
      try {
        const greetingData = await getGreeting()
        const greetingMessage: Message = {
          id: Date.now(),
          sender: "bot",
          text: greetingData.greeting,
          time: getCurrentTime(),
        }
        setMessages([greetingMessage])
        saveMessagesToStorage(newSessionId, [greetingMessage])
      } catch {
        // 인삿말 로드 실패 시 기본 메시지
        const defaultMessage: Message = {
          id: Date.now(),
          sender: "bot",
          text: "안녕하세요! 파주 챗봇입니다. 무엇을 도와드릴까요?",
          time: getCurrentTime(),
        }
        setMessages([defaultMessage])
        saveMessagesToStorage(newSessionId, [defaultMessage])
      }
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
          <div className="flex items-start gap-3">
            <div className="relative">
              <img
                src={imagePreview}
                alt="미리보기"
                className="h-24 w-24 rounded-lg object-cover"
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
                disabled={isLoading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-2">
                이미지가 선택되었습니다. 텍스트를 입력하고 전송 버튼을 눌러주세요.
              </p>
            </div>
          </div>
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
            placeholder={selectedFile ? "이미지와 함께 메시지를 입력하세요..." : "메시지를 입력하세요..."}
            className="flex-1"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            size="icon"
            className="shrink-0"
            disabled={isLoading || (!input.trim() && !selectedFile)}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
