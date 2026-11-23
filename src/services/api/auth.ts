// 인증 API (S-01 로그인/회원가입)
import { MOCK_PASSWORD, MOCK_VERIFICATION_CODE, mockUsers } from "@/mocks/data";
import type { ApiResponse, SignupDraft, User } from "@/types/models";

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

// ───────── 회원가입 (S-31 → S-30 → S-03) ─────────

// S-30-1 / S-30-3 인증코드 발송·재발송 (목업 코드: 123456)
export function sendVerificationCode(email: string): Promise<ApiResponse<{ expiresInSec: number }>> {
  // TODO(API): request("/auth/email/code", { method: "POST", body: JSON.stringify({ email }) })
  void email;
  return mockResponse(ok({ expiresInSec: 180 }));
}

// S-30-2 인증코드 확인 → 가입 완료 후 바로 로그인
export function verifyCodeAndSignUp(draft: SignupDraft, code: string): Promise<ApiResponse<LoginResult>> {
  // TODO(API): request("/auth/signup", { method: "POST", body: JSON.stringify({ ...draft, code }) })
  if (code !== MOCK_VERIFICATION_CODE) {
    return mockResponse(fail("INVALID_CODE", "인증코드가 맞지 않아요. 다시 확인해 주세요."));
  }
  const user: User = {
    id: `u${mockUsers.length + 1}`,
    email: draft.email.trim().toLowerCase(),
    nickname: draft.email.split("@")[0],
    favoriteGenres: [],
    readingPurposes: [],
    joinedAt: new Date().toISOString().slice(0, 10),
  };
  mockUsers.push(user);
  return mockResponse(ok({ user, accessToken: "mock-access-token" }));
}

// S-03-1 독서 취향 저장
export function savePreferences(genres: string[], purposes: string[]): Promise<ApiResponse<{ saved: true }>> {
  // TODO(API): request("/users/me/preferences", { method: "PUT", body: JSON.stringify({ genres, purposes }) })
  void genres;
  void purposes;
  return mockResponse(ok({ saved: true }));
}

// ───────── 비밀번호 재설정 (S-02 → 메일 링크 → S-32) ─────────

// S-02-1 재설정 메일 발송 (가입 여부와 상관없이 같은 안내를 보여줍니다)
export function requestPasswordReset(email: string): Promise<ApiResponse<{ sent: true }>> {
  // TODO(API): request("/auth/password/reset-request", { method: "POST", body: JSON.stringify({ email }) })
  void email;
  return mockResponse(ok({ sent: true }));
}

// S-32-1 새 비밀번호 저장 → S-32-2 자동 로그인
export function resetPassword(token: string, newPassword: string): Promise<ApiResponse<LoginResult>> {
  // TODO(API): request("/auth/password/reset", { method: "POST", body: JSON.stringify({ token, newPassword }) })
  if (!token) return mockResponse(fail("INVALID_TOKEN", "링크가 만료되었어요. 재설정 메일을 다시 요청해 주세요."));
  void newPassword;
  return mockResponse(ok({ user: mockUsers[0], accessToken: "mock-access-token" }));
}
