// 인증 API (S-01 로그인/회원가입)
import { MOCK_PASSWORD, mockUsers } from "@/mocks/data";
import type { ApiResponse, User } from "@/types/models";

import { fail, mockResponse, ok } from "./client";

export interface LoginResult {
  user: User;
  accessToken: string;
}

// S-01-1 로그인·가입 자동분기: 가입된 이메일인지 확인
export function checkEmail(email: string): Promise<ApiResponse<{ exists: boolean }>> {
  // TODO(API): request("/auth/email/check", { method: "POST", body: JSON.stringify({ email }) })
  const exists = mockUsers.some((user) => user.email === email.trim().toLowerCase());
  return mockResponse(ok({ exists }));
}

export function login(email: string, password: string): Promise<ApiResponse<LoginResult>> {
  // TODO(API): request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) })
  const user = mockUsers.find((item) => item.email === email.trim().toLowerCase());
  if (!user || password !== MOCK_PASSWORD) {
    return mockResponse(fail("INVALID_CREDENTIALS", "이메일 또는 비밀번호가 맞지 않아요."));
  }
  return mockResponse(ok({ user, accessToken: "mock-access-token" }));
}

// S-01-2 소셜 로그인 진입 (목업: 테스트 계정으로 바로 로그인)
export function socialLogin(provider: "kakao" | "apple"): Promise<ApiResponse<LoginResult>> {
  // TODO(API): 소셜 로그인 방식 백엔드와 확정 후 교체
  void provider;
  return mockResponse(ok({ user: mockUsers[0], accessToken: "mock-access-token" }));
}
