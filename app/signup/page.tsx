"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BookOpen, ArrowLeft, AlertCircle, Loader2, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { signup, login } from "@/lib/auth-api"

export default function SignupPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // 비밀번호 확인
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.")
      return
    }

    // 비밀번호 길이 확인
    if (password.length < 6) {
      setError("비밀번호는 최소 6자 이상이어야 합니다.")
      return
    }

    setIsLoading(true)

    try {
      // 회원가입
      await signup({ username, email, password })
      setSuccess(true)
      
      // 잠시 성공 메시지를 보여준 후 자동 로그인 시도
      setTimeout(async () => {
        try {
          await login({ username, password })
          localStorage.setItem("isLoggedIn", "true")
          router.push("/home")
        } catch (loginErr) {
          // 자동 로그인 실패 시 로그인 페이지로 이동
          router.push("/login")
        }
      }, 1500)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "회원가입에 실패했습니다."
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="mx-auto w-full max-w-md min-h-screen bg-gradient-to-b from-primary/20 to-background flex items-center justify-center p-4">
        <Card className="w-full space-y-6 p-8">
        <Button variant="ghost" size="sm" className="mb-2" onClick={() => router.push("/")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          돌아가기
        </Button>

        <div className="text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-balance">회원가입</h1>
            <p className="text-muted-foreground text-balance text-sm">새로운 계정을 만들어보세요</p>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-500 bg-green-50 text-green-900">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription>회원가입이 완료되었습니다! 로그인 중...</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">사용자명</Label>
            <Input
              id="username"
              type="text"
              placeholder="testuser"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading || success}
              required
              minLength={1}
            />
            <p className="text-xs text-muted-foreground">최소 1자 이상</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading || success}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading || success}
              required
              minLength={6}
            />
            <p className="text-xs text-muted-foreground">최소 6자 이상</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">비밀번호 확인</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading || success}
              required
              minLength={6}
            />
          </div>

          <Button type="submit" className="w-full h-11" size="lg" disabled={isLoading || success}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                회원가입 중...
              </>
            ) : success ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                완료
              </>
            ) : (
              "회원가입"
            )}
          </Button>
        </form>

        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            이미 계정이 있으신가요?{" "}
            <Link href="/login" className="text-primary font-medium hover:underline">
              로그인
            </Link>
          </p>
        </div>
        </Card>
      </div>
    </div>
  )
}
