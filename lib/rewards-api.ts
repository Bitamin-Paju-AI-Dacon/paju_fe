/**
 * 파주 보상 시스템 API 통신 유틸리티
 * 사용자별 스탬프 및 보상 관리
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// ===== Types =====

export interface UserStamp {
  id: number;
  place: string;
  timestamp: string;
}

export interface UserStampsResponse {
  total_stamps: number;
  stamps: UserStamp[];
}

export interface AvailableReward {
  id: number;
  name: string;
  type: string;
  required_stamps: number;
  expiry_days: number;
  can_claim: boolean;
}

export interface AvailableRewardsResponse {
  available_rewards: AvailableReward[];
  total_stamps: number;
}

export interface ClaimRewardRequest {
  reward_id: number;
}

export interface ClaimedReward {
  id: number;
  reward_id: number;
  reward_name: string;
  reward_type: string;
  claimed_date: string;
  expiry_date: string;
  status: string;
  code: string | null;
}

export interface ClaimRewardResponse {
  success: boolean;
  reward: ClaimedReward;
  message: string;
}

export interface ClaimedRewardsResponse {
  claimed_rewards: ClaimedReward[];
  count: number;
}

export interface UserImage {
  id: number;
  image_url: string;
  place_name: string;
  uploaded_at: string;
}

export interface UserImagesResponse {
  images: UserImage[];
  count: number;
}

// ===== Helper Functions =====

/**
 * 인증 토큰 가져오기
 */
function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
}

/**
 * 인증 헤더 생성
 */
function getAuthHeaders(): HeadersInit {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

// ===== API Functions =====

/**
 * 사용자별 스탬프 개수 조회
 */
export async function getUserStamps(): Promise<UserStampsResponse> {
  const token = getToken();
  if (!token) {
    throw new Error('로그인이 필요합니다.');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/chat/rewards/stamps/`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
      }
      const errorData = await response.json();
      throw new Error(errorData.detail || '스탬프 정보를 가져올 수 없습니다.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Get user stamps error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('스탬프 정보를 가져오는 중 오류가 발생했습니다.');
  }
}

/**
 * 받을 수 있는 보상 목록 조회
 */
export async function getAvailableRewards(): Promise<AvailableRewardsResponse> {
  const token = getToken();
  if (!token) {
    throw new Error('로그인이 필요합니다.');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/chat/rewards/available/`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
      }
      const errorData = await response.json();
      throw new Error(errorData.detail || '보상 목록을 가져올 수 없습니다.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Get available rewards error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('보상 목록을 가져오는 중 오류가 발생했습니다.');
  }
}

/**
 * 보상 받기
 */
export async function claimReward(rewardId: number): Promise<ClaimRewardResponse> {
  const token = getToken();
  if (!token) {
    throw new Error('로그인이 필요합니다.');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/chat/rewards/claim/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ reward_id: rewardId }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
      }
      const errorData = await response.json();
      throw new Error(errorData.detail || '보상을 받을 수 없습니다.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Claim reward error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('보상을 받는 중 오류가 발생했습니다.');
  }
}

/**
 * 받은 보상 목록 조회
 */
export async function getClaimedRewards(): Promise<ClaimedRewardsResponse> {
  const token = getToken();
  if (!token) {
    throw new Error('로그인이 필요합니다.');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/chat/rewards/claimed/`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
      }
      const errorData = await response.json();
      throw new Error(errorData.detail || '받은 보상 목록을 가져올 수 없습니다.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Get claimed rewards error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('받은 보상 목록을 가져오는 중 오류가 발생했습니다.');
  }
}

/**
 * 업로드한 이미지 목록 조회
 */
export async function getUserImages(): Promise<UserImagesResponse> {
  const token = getToken();
  if (!token) {
    throw new Error('로그인이 필요합니다.');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/chat/images/`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
      }
      const errorData = await response.json();
      throw new Error(errorData.detail || '이미지 목록을 가져올 수 없습니다.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Get user images error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('이미지 목록을 가져오는 중 오류가 발생했습니다.');
  }
}

/**
 * 이미지 삭제
 */
export async function deleteUserImage(imageId: number): Promise<void> {
  const token = getToken();
  if (!token) {
    throw new Error('로그인이 필요합니다.');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/chat/images/${imageId}/`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
      }
      const errorData = await response.json();
      throw new Error(errorData.detail || '이미지를 삭제할 수 없습니다.');
    }
  } catch (error) {
    console.error('Delete user image error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('이미지를 삭제하는 중 오류가 발생했습니다.');
  }
}

