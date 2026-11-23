// 서버 통신 공통 설정
// 지금은 목업 모드(USE_MOCK = true)로 목업 데이터를 서버 응답 형식에 맞춰 돌려줍니다.
// 백엔드 연결 시 USE_MOCK 을 false 로 바꾸고, 각 api 파일의 TODO 부분을 request() 호출로 교체하세요.

import type { ApiError, ApiResponse } from "@/types/models";

export const API_BASE_URL = "http://43.203.57.41:8000/api";
export const USE_MOCK = true;

// 목업 응답에 넣는 가짜 지연 시간 (로딩 화면 확인용)
const MOCK_DELAY_MS = 300;

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function ok<T>(data: T): ApiResponse<T> {
  return { success: true, data, error: null };
}

export function fail<T = never>(code: string, message: string): ApiResponse<T> {
  return { success: false, data: null, error: { code, message } };
}

// 목업 응답을 실제 네트워크처럼 약간 늦게 돌려줍니다.
export function mockResponse<T>(response: ApiResponse<T>): Promise<ApiResponse<T>> {
  return new Promise((resolve) => setTimeout(() => resolve(response), MOCK_DELAY_MS));
}

// 실제 서버 요청 (백엔드 연결 후 사용)
export async function request<T>(
  path: string,
  init: RequestInit = {},
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...init.headers,
      },
    });
    return (await res.json()) as ApiResponse<T>;
  } catch {
    const error: ApiError = { code: "NETWORK_ERROR", message: "네트워크 연결을 확인해 주세요." };
    return { success: false, data: null, error };
  }
}
