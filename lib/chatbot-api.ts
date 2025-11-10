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
  confidence: number;
  response: string;
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
 * 텍스트로 챗봇과 대화
 */
export async function sendTextMessage(
  message: string,
  sessionId: string = 'default'
): Promise<ChatTextResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat/text`, {
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
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Text message error:', error);
    if (error instanceof Error && error.message.includes('Failed to fetch')) {
      throw new Error('서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
    }
    throw new Error('메시지 전송 중 오류가 발생했습니다. 다시 시도해주세요.');
  }
}

/**
 * 이미지 업로드 및 장소 인식
 */
export async function uploadImage(
  file: File,
  sessionId: string = 'default'
): Promise<ChatImageResponse> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('session_id', sessionId);

    const response = await fetch(`${API_BASE_URL}/api/chat/image`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Image upload error:', error);
    if (error instanceof Error && error.message.includes('Failed to fetch')) {
      throw new Error('서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
    }
    throw new Error('이미지 업로드 중 오류가 발생했습니다. 다시 시도해주세요.');
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
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Event search error:', error);
    if (error instanceof Error && error.message.includes('Failed to fetch')) {
      throw new Error('서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
    }
    throw new Error('행사 검색 중 오류가 발생했습니다. 다시 시도해주세요.');
  }
}

/**
 * 세션 삭제 (대화 히스토리 초기화)
 */
export async function clearSession(sessionId: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat/session/${sessionId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data.message);
  } catch (error) {
    console.error('Clear session error:', error);
    if (error instanceof Error && error.message.includes('Failed to fetch')) {
      throw new Error('서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
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

