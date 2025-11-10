"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BookOpen, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem("isLoggedIn", "true")
    localStorage.setItem("userEmail", email)
    router.push("/")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-primary/20 to-background p-4">
      <Card className="mx-auto w-full max-w-md space-y-6 p-8">
        <Button variant="ghost" size="sm" className="mb-2" onClick={() => router.push("/")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          돌아가기
        </Button>

        <div className="text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-balance">로그인</h1>
            <p className="text-muted-foreground text-balance text-sm">파주 북시티 탐험을 시작하세요</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              required
            />
          </div>

          <Button type="submit" className="w-full h-11" size="lg">
            로그인
          </Button>
        </form>

        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            계정이 없으신가요?{" "}
            <Link href="/signup" className="text-primary font-medium hover:underline">
              회원가입
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}
