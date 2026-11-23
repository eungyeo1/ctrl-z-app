// 로그인 상태를 앱 전체에서 공유합니다.
// TODO: 토큰 저장(expo-secure-store)과 자동 로그인은 인증 화면(S-30~S-32) 작업 때 추가
import { createContext, useContext, useState, type ReactNode } from "react";

import { setAccessToken } from "@/services/api/client";
import type { User } from "@/types/models";

interface AuthContextValue {
  user: User | null;
  signIn: (user: User, token: string) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const signIn = (nextUser: User, token: string) => {
    setAccessToken(token);
    setUser(nextUser);
  };

  const signOut = () => {
    setAccessToken(null);
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, signIn, signOut }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth 는 AuthProvider 안에서만 사용할 수 있어요.");
  return value;
}
