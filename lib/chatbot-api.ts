/**
 * 파주 챗봇 API 통신 유틸리티
 * FastAPI 서버와 통신하여 챗봇 기능을 제공합니다.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface ChatTextRequest {
  message: string;
  session_id?: string;
}

export interface ChatTextResponse {
  response: string;
  session_id: string;
}

export interface ChatImageResponse {
  predicted_place: string;
  description: string;
  stamp_added?: boolean;
  session_id: string;
  image_url?: string; // 로그인한 사용자의 경우 이미지 URL
  image_id?: number; // 로그인한 사용자의 경우 이미지 ID
}

export interface GreetingResponse {
  greeting: string;
}

export interface Stamp {
  place: string;
  timestamp: string;
}

export interface StampsResponse {
  stamps: Stamp[];
  count: number;
  session_id: string;
}

export interface EventSearchRequest {
  query: string;
  top_k?: number;
}

export interface EventMetadata {
  date?: string;
  location?: string;
  category?: string;
}

export interface Event {
  content: string;
  metadata: EventMetadata;
}

export interface EventSearchResponse {
  events: Event[];
  response: string;
}

/**
 * 서버 헬스체크
 */
export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    const data = await response.json();
    return data.status === 'healthy';
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
}

/**
 * 인삿말 조회
 */
export async function getGreeting(): Promise<GreetingResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat/greeting/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Greeting error:', error);
    if (error instanceof Error && error.message.includes('Failed to fetch')) {
      throw new Error('서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
    }
    throw new Error('인삿말을 가져오는 중 오류가 발생했습니다.');
  }
}

/**
 * 텍스트로 챗봇과 대화
 */
export async function sendTextMessage(
  message: string,
  sessionId: string = 'default'
): Promise<ChatTextResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat/text/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        session_id: sessionId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Text message error:', error);
    if (error instanceof Error && error.message.includes('Failed to fetch')) {
      throw new Error('서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('메시지 전송 중 오류가 발생했습니다. 다시 시도해주세요.');
  }
}

/**
 * 이미지 업로드 및 장소 인식
 * @param action - 'description': 이미지 설명만, 'stamp': 이미지 설명 + 스탬프 추가
 * @param includeAuth - 로그인한 사용자의 경우 인증 토큰 포함 (기본값: true)
 */
export async function uploadImage(
  file: File,
  sessionId: string = 'default',
  action: 'description' | 'stamp' = 'stamp',
  includeAuth: boolean = true
): Promise<ChatImageResponse> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('session_id', sessionId);
    formData.append('action', action);

    // 인증 토큰이 있으면 헤더에 추가 (로그인한 사용자의 경우 이미지 저장)
    const headers: HeadersInit = {};
    if (includeAuth && typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const response = await fetch(`${API_BASE_URL}/api/chat/image/`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Image upload error:', error);
    if (error instanceof Error && error.message.includes('Failed to fetch')) {
      throw new Error('서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('이미지 업로드 중 오류가 발생했습니다. 다시 시도해주세요.');
  }
}

/**
 * 스탬프 목록 조회
 */
export async function getStamps(sessionId: string): Promise<StampsResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat/stamps/${sessionId}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Get stamps error:', error);
    if (error instanceof Error && error.message.includes('Failed to fetch')) {
      throw new Error('서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('스탬프 목록을 가져오는 중 오류가 발생했습니다.');
  }
}

/**
 * 행사 정보 검색 (RAG)
 */
export async function searchEvents(
  query: string,
  topK: number = 2
): Promise<EventSearchResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/events/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        top_k: topK,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Event search error:', error);
    if (error instanceof Error && error.message.includes('Failed to fetch')) {
      throw new Error('서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('행사 검색 중 오류가 발생했습니다. 다시 시도해주세요.');
  }
}

/**
 * 세션 삭제 (대화 히스토리 초기화)
 */
export async function clearSession(sessionId: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat/session/${sessionId}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data.message);
  } catch (error) {
    console.error('Clear session error:', error);
    if (error instanceof Error && error.message.includes('Failed to fetch')) {
      throw new Error('서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('세션 초기화 중 오류가 발생했습니다. 다시 시도해주세요.');
  }
}

/**
 * 세션 ID 생성 헬퍼 함수
 */
export function generateSessionId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

