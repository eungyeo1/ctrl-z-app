// 인증 API (S-01 로그인/회원가입)
import { MOCK_PASSWORD, MOCK_VERIFICATION_CODE, mockUsers } from "@/mocks/data";
import type { ApiResponse, SignupDraft, SocialProvider, User } from "@/types/models";

import { fail, mockResponse, ok, request } from "./client";

export interface LoginResult {
  user: User;
  accessToken: string;
  refreshToken?: string; // TODO: 저장해서 자동 로그인·토큰 갱신(/auth/token/refresh)에 사용
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

// ───────── 소셜 로그인 (실서버) ─────────
// 서버가 카카오·구글 토큰을 직접 확인하기 때문에 목업 없이 항상 실제 서버로 요청합니다.
// 서버 코드: ezhye0n/31th_2_CtrlZ_odumak_back app/domains/auth (social_login, signup)

const REQUIRED_AGREEMENTS = ["TERMS_OF_SERVICE", "PRIVACY_POLICY"];
const MARKETING_AGREEMENT = "MARKETING";

interface ServerTokens {
  member_id: number;
  access_token: string;
  refresh_token: string;
}

interface ServerSocialLogin {
  is_new_user: boolean;
  has_email?: boolean;
  member_id?: number;
  access_token?: string;
  refresh_token?: string;
}

export type SocialLoginResult =
  | { isNewUser: false; login: LoginResult }
  | { isNewUser: true; hasEmail: boolean };

// 서버에 아직 내 정보(닉네임 등) API가 없어서, 로그인 직후에는 최소 정보로 사용자를 만듭니다.
// TODO(API): 프로필 조회 API 가 생기면 그 응답으로 교체
const userFromMember = (memberId: number, email?: string): User => ({
  id: String(memberId),
  email: email ?? "",
  nickname: email ? email.split("@")[0] : "새 회원",
  favoriteGenres: [],
  readingPurposes: [],
  joinedAt: new Date().toISOString().slice(0, 10),
});

const toLoginResult = (tokens: ServerTokens, email?: string): LoginResult => ({
  user: userFromMember(tokens.member_id, email),
  accessToken: tokens.access_token,
  refreshToken: tokens.refresh_token,
});

// S-01-2 소셜 로그인: 기존 회원이면 토큰, 처음이면 is_new_user
export async function socialLogin(
  provider: SocialProvider,
  socialToken: string,
): Promise<ApiResponse<SocialLoginResult>> {
  const res = await request<ServerSocialLogin>(`/auth/social/${provider}`, {
    method: "POST",
    body: JSON.stringify({ social_token: socialToken }),
  });
  if (!res.success || !res.data) return { success: false, data: null, error: res.error };
  const data = res.data;
  if (data.is_new_user) return ok({ isNewUser: true, hasEmail: !!data.has_email });
  if (!data.member_id || !data.access_token || !data.refresh_token) {
    return fail("INVALID_RESPONSE", "로그인 응답이 올바르지 않아요. 잠시 후 다시 시도해 주세요.");
  }
  return ok({
    isNewUser: false,
    login: toLoginResult({
      member_id: data.member_id,
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    }),
  });
}

// S-31-2 소셜 회원가입 (약관 동의 후)
// 카카오에서 이메일을 못 받은 경우(hasEmail=false)에는 이메일 인증으로 받은 verificationToken 을 함께 보냅니다.
export async function signupSocial(
  draft: SignupDraft,
  verified?: { email: string; verificationToken: string },
): Promise<ApiResponse<LoginResult>> {
  const res = await request<ServerTokens>("/auth/signup", {
    method: "POST",
    body: JSON.stringify({
      signup_type: "social",
      provider: draft.provider,
      social_token: draft.socialToken,
      email: verified?.email,
      verification_token: verified?.verificationToken,
      required_agreements: REQUIRED_AGREEMENTS,
      optional_agreements: draft.agreements.marketing ? [MARKETING_AGREEMENT] : [],
    }),
  });
  if (!res.success || !res.data) return { success: false, data: null, error: res.error };
  return ok(toLoginResult(res.data, verified?.email));
}

// S-30-1 인증코드 발송 (실서버) — 소셜 가입에서 이메일이 없을 때 사용
export async function sendVerificationCodeServer(email: string): Promise<ApiResponse<{ expiresInSec: number }>> {
  const res = await request<{ expires_in: number }>("/auth/email/verification-code", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
  if (!res.success || !res.data) return { success: false, data: null, error: res.error };
  return ok({ expiresInSec: res.data.expires_in });
}

// S-30-3 인증코드 재발송 (실서버)
export async function resendVerificationCodeServer(email: string): Promise<ApiResponse<null>> {
  return request<null>("/auth/email/verification-code/resend", { method: "POST", body: JSON.stringify({ email }) });
}

// S-30-2 인증코드 확인 (실서버) → 가입에 쓸 verification_token
export async function confirmVerificationCodeServer(
  email: string,
  code: string,
): Promise<ApiResponse<{ verificationToken: string }>> {
  const res = await request<{ verification_token: string }>("/auth/email/verification-code/confirm", {
    method: "POST",
    body: JSON.stringify({ email, code }),
  });
  if (!res.success || !res.data) return { success: false, data: null, error: res.error };
  return ok({ verificationToken: res.data.verification_token });
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

// S-03-1 독서 취향 저장 (서버 형식: 장르 1개 이상 + 독서 목적 1개)
export function savePreferences(genres: string[], purpose: string): Promise<ApiResponse<{ saved: true }>> {
  // TODO(API): request("/users/me/preferences", { method: "POST", body: JSON.stringify({ genres, purpose }) })
  void genres;
  void purpose;
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
