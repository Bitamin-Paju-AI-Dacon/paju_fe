/**
 * 파주 인증 API 통신 유틸리티
 * JWT 토큰 기반 인증 시스템
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://parangee.store';

// ===== Types =====

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
  created_at: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface AuthError {
  detail: string;
}

// ===== Token Management =====

/**
 * 로컬스토리지에 토큰 저장
 */
export function saveToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', token);
  }
}

/**
 * 로컬스토리지에서 토큰 가져오기
 */
export function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
}

/**
 * 토큰 삭제
 */
export function removeToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  }
}

/**
 * 사용자 정보 저장
 */
export function saveUser(user: User): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user));
  }
}

/**
 * 사용자 정보 가져오기
 */
export function getUser(): User | null {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
  }
  return null;
}

/**
 * 로그인 여부 확인
 */
export function isAuthenticated(): boolean {
  return getToken() !== null;
}

// ===== API Functions =====

/**
 * 회원가입
 */
export async function signup(data: SignupRequest): Promise<User> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/signup/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.detail || '회원가입에 실패했습니다.');
    }

    return responseData;
  } catch (error) {
    console.error('Signup error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('회원가입 중 오류가 발생했습니다.');
  }
}

/**
 * 로그인
 */
export async function login(data: LoginRequest): Promise<LoginResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.detail || '로그인에 실패했습니다.');
    }

    // 토큰과 사용자 정보 저장
    saveToken(responseData.access_token);
    saveUser(responseData.user);

    return responseData;
  } catch (error) {
    console.error('Login error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('로그인 중 오류가 발생했습니다.');
  }
}

/**
 * 현재 사용자 정보 조회 (인증 필요)
 */
export async function getCurrentUser(): Promise<User> {
  const token = getToken();
  
  if (!token) {
    throw new Error('인증 토큰이 없습니다. 로그인해주세요.');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/me/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      // 토큰이 만료되었거나 유효하지 않은 경우
      if (response.status === 401) {
        removeToken();
        throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
      }
      throw new Error(responseData.detail || '사용자 정보를 가져올 수 없습니다.');
    }

    // 최신 사용자 정보 저장
    saveUser(responseData);

    return responseData;
  } catch (error) {
    console.error('Get current user error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('사용자 정보 조회 중 오류가 발생했습니다.');
  }
}

/**
 * 로그아웃
 */
export function logout(): void {
  removeToken();
}

