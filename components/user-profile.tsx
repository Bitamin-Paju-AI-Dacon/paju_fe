"use client"

import { User, Gift, Calendar, ImageIcon, LogOut, CheckCircle2, Trash2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"
import { logout, getUser, isAuthenticated } from "@/lib/auth-api"
import { useState, useEffect } from "react"
import { 
  getUserStamps, 
  getAvailableRewards, 
  claimReward as claimRewardAPI, 
  getClaimedRewards as getClaimedRewardsAPI,
  getUserImages,
  deleteUserImage,
  type AvailableReward,
  type ClaimedReward as APIClaimedReward,
  type UserImage
} from "@/lib/rewards-api"
import { Alert, AlertDescription } from "@/components/ui/alert"

// 보상 정의
const REWARDS = [
  {
    id: 1,
    name: "지혜의숲 카페 아메리카노 무료",
    type: "쿠폰",
    requiredStamps: 10,
    expiryDays: 90, // 90일 후 만료
  },
  {
    id: 2,
    name: "열화당 서점 입장료 무료",
    type: "입장권",
    requiredStamps: 20,
    expiryDays: 60, // 60일 후 만료
  },
  {
    id: 3,
    name: "파주 장단콩 선물세트 응모권",
    type: "응모권",
    requiredStamps: 30,
    expiryDays: 30, // 30일 후 만료
  },
]

interface ClaimedReward {
  id: number
  claimedDate: string
}

// localStorage에서 받은 보상 목록 가져오기
function getClaimedRewards(): ClaimedReward[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem('claimed_rewards')
  if (!stored) return []
  try {
    return JSON.parse(stored)
  } catch {
    return []
  }
}

// 보상 받기
function claimReward(rewardId: number): void {
  if (typeof window === 'undefined') return
  const claimed = getClaimedRewards()
  const alreadyClaimed = claimed.some(r => r.id === rewardId)
  
  if (!alreadyClaimed) {
    const newClaimed: ClaimedReward = {
      id: rewardId,
      claimedDate: new Date().toISOString(),
    }
    localStorage.setItem('claimed_rewards', JSON.stringify([...claimed, newClaimed]))
  }
}

// 보상 만료일 계산
function getExpiryDate(claimedDate: string, expiryDays: number): string {
  const date = new Date(claimedDate)
  date.setDate(date.getDate() + expiryDays)
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\./g, '.').replace(/\s/g, '')
}

export function UserProfile() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [stampCount, setStampCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [availableRewards, setAvailableRewards] = useState<AvailableReward[]>([])
  const [claimedRewards, setClaimedRewards] = useState<APIClaimedReward[]>([])
  const [userImages, setUserImages] = useState<UserImage[]>([])
  const [showSuccess, setShowSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const userData = getUser()
    setUser(userData)
    
    // 로그인한 경우 API에서 데이터 가져오기
    if (isAuthenticated()) {
      loadData()
    } else {
      // 비로그인 사용자는 localStorage에서만 가져오기
      setClaimedRewards(getClaimedRewards().map(cr => ({
        id: cr.id,
        reward_id: cr.id,
        reward_name: REWARDS.find(r => r.id === cr.id)?.name || '',
        reward_type: REWARDS.find(r => r.id === cr.id)?.type || '',
        claimed_date: cr.claimedDate,
        expiry_date: getExpiryDate(cr.claimedDate, REWARDS.find(r => r.id === cr.id)?.expiryDays || 30),
        status: '사용 가능',
        code: null,
      })))
      setIsLoading(false)
    }
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // 병렬로 데이터 가져오기
      const [stampsData, rewardsData, claimedData, imagesData] = await Promise.all([
        getUserStamps().catch(() => ({ total_stamps: 0, stamps: [] })),
        getAvailableRewards().catch(() => ({ available_rewards: [], total_stamps: 0 })),
        getClaimedRewardsAPI().catch(() => ({ claimed_rewards: [], count: 0 })),
        getUserImages().catch(() => ({ images: [], count: 0 })),
      ])

      setStampCount(stampsData.total_stamps)
      setAvailableRewards(rewardsData.available_rewards)
      setClaimedRewards(claimedData.claimed_rewards)
      setUserImages(imagesData.images)
    } catch (err) {
      console.error("데이터 로드 실패:", err)
      setError(err instanceof Error ? err.message : "데이터를 불러오는 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    if (confirm("로그아웃 하시겠습니까?")) {
      logout()
      localStorage.removeItem("isLoggedIn")
      router.push("/")
    }
  }

  const handleClaimReward = async (rewardId: number, rewardName: string) => {
    if (!confirm(`${rewardName}을(를) 받으시겠습니까?`)) return

    if (isAuthenticated()) {
      // API를 통한 보상 받기
      try {
        const response = await claimRewardAPI(rewardId)
        setShowSuccess(response.reward.reward_name)
        setTimeout(() => setShowSuccess(null), 3000)
        // 데이터 다시 불러오기
        loadData()
      } catch (err) {
        setError(err instanceof Error ? err.message : "보상을 받는 중 오류가 발생했습니다.")
        setTimeout(() => setError(null), 5000)
      }
    } else {
      // 비로그인 사용자는 localStorage에 저장
      claimReward(rewardId)
      setClaimedRewards(getClaimedRewards().map(cr => ({
        id: cr.id,
        reward_id: cr.id,
        reward_name: REWARDS.find(r => r.id === cr.id)?.name || '',
        reward_type: REWARDS.find(r => r.id === cr.id)?.type || '',
        claimed_date: cr.claimedDate,
        expiry_date: getExpiryDate(cr.claimedDate, REWARDS.find(r => r.id === cr.id)?.expiryDays || 30),
        status: '사용 가능',
        code: null,
      })))
      setShowSuccess(rewardName)
      setTimeout(() => setShowSuccess(null), 3000)
    }
  }

  const handleDeleteImage = async (imageId: number) => {
    if (!confirm("이미지를 삭제하시겠습니까?")) return

    try {
      await deleteUserImage(imageId)
      // 이미지 목록 다시 불러오기
      const imagesData = await getUserImages()
      setUserImages(imagesData.images)
    } catch (err) {
      setError(err instanceof Error ? err.message : "이미지를 삭제하는 중 오류가 발생했습니다.")
      setTimeout(() => setError(null), 5000)
    }
  }

  // 모든 보상 목록 (API 또는 로컬 데이터 사용)
  const allRewards = isAuthenticated() && availableRewards.length > 0
    ? REWARDS.map(reward => {
        const apiReward = availableRewards.find(ar => ar.id === reward.id)
        const isClaimed = claimedRewards.some(cr => cr.reward_id === reward.id)
        const canClaim = apiReward?.can_claim || false
        
        return {
          ...reward,
          isClaimed,
          canClaim,
          remaining: Math.max(0, reward.requiredStamps - stampCount),
        }
      })
    : REWARDS.map(reward => {
        const isClaimed = claimedRewards.some(cr => cr.reward_id === reward.id)
        const canClaim = !isClaimed && stampCount >= reward.requiredStamps
        
        return {
          ...reward,
          isClaimed,
          canClaim,
          remaining: Math.max(0, reward.requiredStamps - stampCount),
        }
      })

  // 받은 보상 목록 (API 데이터 사용)
  const claimedRewardsList = claimedRewards.map(claimed => {
    const reward = REWARDS.find(r => r.id === claimed.reward_id)
    return {
      ...reward!,
      claimedDate: claimed.claimed_date,
      expiryDate: claimed.expiry_date,
      code: claimed.code,
      status: claimed.status,
    }
  })

  // 다음 보상까지 필요한 스탬프 개수 계산
  const getNextRewardInfo = () => {
    const unclaimedRewards = REWARDS.filter(reward => 
      !claimedRewards.some(cr => cr.reward_id === reward.id)
    ).sort((a, b) => a.requiredStamps - b.requiredStamps)
    
    if (unclaimedRewards.length === 0) return null
    const nextReward = unclaimedRewards[0]
    const remaining = Math.max(0, nextReward.requiredStamps - stampCount)
    return { reward: nextReward, remaining }
  }

  const nextRewardInfo = getNextRewardInfo()

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-balance text-3xl font-bold text-foreground">프로필</h1>
        <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
          <LogOut className="h-4 w-4" />
          로그아웃
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src="/abstract-profile.png" alt="프로필" />
            <AvatarFallback>
              <User className="h-10 w-10" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-foreground">
              {user?.username || "김독서"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {user?.email || "book.lover@email.com"}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">스탬프 수집 현황</h3>
            <span className="text-2xl font-bold text-primary">
              {isLoading ? "..." : `${stampCount} / 30`}
            </span>
          </div>
          <Progress value={isLoading ? 0 : (stampCount / 30) * 100} className="h-3" />
          <p className="text-sm text-muted-foreground">
            {isLoading 
              ? "로딩 중..." 
              : stampCount >= 30 
                ? "모든 스탬프를 수집했습니다! 🎉" 
                : nextRewardInfo
                  ? `다음 보상(${nextRewardInfo.reward.name})까지 ${nextRewardInfo.remaining}개 남았어요!`
                  : "스탬프를 모아보세요!"}
          </p>
        </div>
      </Card>

      {/* 모든 보상 목록 */}
      <Card className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <Gift className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">보상 목록</h3>
        </div>
        <div className="space-y-3">
          {allRewards.map((reward) => (
            <div 
              key={reward.id} 
              className={`flex items-start gap-3 rounded-lg border p-3 ${
                reward.canClaim 
                  ? 'border-primary/30 bg-primary/5' 
                  : reward.isClaimed
                    ? 'border-green-200 bg-green-50/50'
                    : 'border-border bg-muted/30'
              }`}
            >
              <Gift className={`mt-1 h-5 w-5 shrink-0 ${
                reward.canClaim 
                  ? 'text-primary' 
                  : reward.isClaimed
                    ? 'text-green-600'
                    : 'text-muted-foreground'
              }`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className={`font-medium ${
                      reward.isClaimed ? 'text-green-700' : 'text-foreground'
                    }`}>
                      {reward.name}
                    </p>
                    <div className="mt-1 flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className="text-xs">
                        {reward.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        스탬프 {reward.requiredStamps}개 필요
                      </span>
                      {!reward.canClaim && !reward.isClaimed && (
                        <span className="text-xs text-muted-foreground">
                          (현재: {stampCount}개, 필요: {reward.remaining}개)
                        </span>
                      )}
                    </div>
                  </div>
                  {reward.canClaim && (
                    <Button
                      size="sm"
                      onClick={() => handleClaimReward(reward.id, reward.name)}
                      className="shrink-0"
                    >
                      보상 받기
                    </Button>
                  )}
                  {reward.isClaimed && (
                    <Badge variant="default" className="shrink-0 bg-green-600">
                      받음
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 받은 보상 */}
      <Card className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <Gift className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">받은 보상</h3>
          {claimedRewardsList.length === 0 && (
            <Badge variant="secondary" className="ml-auto text-xs">
              아직 받은 보상이 없습니다
            </Badge>
          )}
        </div>
        {claimedRewardsList.length > 0 ? (
          <div className="space-y-3">
            {claimedRewardsList.map((reward) => {
              const expiryDate = new Date(reward.expiryDate.replace(/\./g, '/'))
              const isExpired = expiryDate < new Date()
              
              return (
                <div key={reward.id} className="flex items-start gap-3 rounded-lg border border-border p-3">
                  <Gift className="mt-1 h-5 w-5 text-accent" />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{reward.name}</p>
                    <div className="mt-1 flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className="text-xs">
                        {reward.type}
                      </Badge>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        받은 날짜: {new Date(reward.claimedDate).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\./g, '.').replace(/\s/g, '')}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        만료일: {reward.expiryDate}
                      </span>
                    </div>
                  </div>
                  <Badge variant={isExpired ? "destructive" : "default"} className="shrink-0">
                    {isExpired ? "만료됨" : "사용 가능"}
                  </Badge>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            스탬프를 모아서 보상을 받아보세요!
          </p>
        )}
      </Card>

      {/* 업로드한 이미지 */}
      {isAuthenticated() && (
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">업로드한 사진</h3>
            <Badge variant="secondary" className="ml-auto">
              {userImages.length}장
            </Badge>
          </div>
          {userImages.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {userImages.map((image) => (
                <div key={image.id} className="relative aspect-square overflow-hidden rounded-lg border border-border group">
                  <img
                    src={image.image_url}
                    alt={image.place_name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-2">
                      <p className="text-xs font-medium text-white">{image.place_name}</p>
                      <p className="text-xs text-white/80">
                        {new Date(image.uploaded_at).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDeleteImage(image.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              아직 업로드한 사진이 없습니다. 챗봇에서 이미지를 업로드해보세요!
            </p>
          )}
        </Card>
      )}

      {/* 에러 메시지 */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* 성공 메시지 */}
      {showSuccess && (
        <Alert className="border-green-500 bg-green-50 text-green-900">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription>
            {showSuccess} 보상을 받았습니다! 🎉
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
