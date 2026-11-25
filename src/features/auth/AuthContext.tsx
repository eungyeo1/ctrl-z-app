// 로그인 상태를 앱 전체에서 공유합니다.
// - user: 로그인한 사용자 (없으면 인증 화면만 열림)
// - needsOnboarding: 방금 가입해서 취향 설정(S-03)을 아직 안 거친 상태
// - signupDraft: 회원가입 중 이메일·비밀번호·약관 동의를 화면 사이에 들고 다니는 값
// TODO: 토큰 저장(expo-secure-store)과 앱 재실행 시 자동 로그인
import { createContext, useContext, useState, type ReactNode } from "react";

import { setAccessToken } from "@/services/api/client";
import type { SignupDraft, User } from "@/types/models";

interface AuthContextValue {
  user: User | null;
  needsOnboarding: boolean;
  signupDraft: SignupDraft | null;
  signIn: (user: User, token: string, options?: { needsOnboarding?: boolean }) => void;
  signOut: () => void;
  completeOnboarding: (patch?: Partial<User>) => void;
  setSignupDraft: (draft: SignupDraft | null) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [signupDraft, setSignupDraft] = useState<SignupDraft | null>(null);

  const signIn: AuthContextValue["signIn"] = (nextUser, token, options) => {
    setAccessToken(token);
    setSignupDraft(null);
    setNeedsOnboarding(!!options?.needsOnboarding);
    setUser(nextUser);
  };

  const signOut = () => {
    setAccessToken(null);
    setNeedsOnboarding(false);
    setUser(null);
  };

  const completeOnboarding = (patch?: Partial<User>) => {
    if (patch) setUser((prev) => (prev ? { ...prev, ...patch } : prev));
    setNeedsOnboarding(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, needsOnboarding, signupDraft, signIn, signOut, completeOnboarding, setSignupDraft }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth 는 AuthProvider 안에서만 사용할 수 있어요.");
  return value;
}
