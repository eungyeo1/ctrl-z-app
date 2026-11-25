// 카카오·구글 SDK 로 로그인해서 서버에 보낼 토큰을 받아옵니다.
// - 카카오: access token  (서버가 kapi.kakao.com/v2/user/me 로 확인)
// - 구글:   id token      (서버가 aud == 웹 클라이언트 ID 인지 확인)
//
// ⚠️ 네이티브 SDK 라서 Expo Go 에서는 동작하지 않아요. 개발용 빌드(npx expo run:android / run:ios)가 필요해요.
//    Expo Go 에서 버튼을 누르면 안내만 띄우고, 앱이 죽지 않도록 SDK 는 누를 때 불러옵니다(dynamic import).
import Constants, { ExecutionEnvironment } from "expo-constants";
import { Platform } from "react-native";

import { GOOGLE_IOS_CLIENT_ID, GOOGLE_WEB_CLIENT_ID, KAKAO_NATIVE_APP_KEY } from "@/config/auth";
import type { SocialProvider } from "@/types/models";

export type SocialSdkResult =
  | { status: "success"; token: string }
  | { status: "cancelled" }
  | { status: "error"; message: string };

const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

let kakaoInitialized = false;
let googleConfigured = false;

const errorMessage = (e: unknown) => (e instanceof Error ? e.message : String(e));
const looksCancelled = (e: unknown) => /cancel/i.test(errorMessage(e));

async function kakaoAccessToken(): Promise<SocialSdkResult> {
  const { initializeKakaoSDK } = await import("@react-native-kakao/core");
  const { login } = await import("@react-native-kakao/user");
  if (!kakaoInitialized) {
    await initializeKakaoSDK(KAKAO_NATIVE_APP_KEY);
    kakaoInitialized = true;
  }
  // 카카오톡 앱이 있으면 카카오톡으로, 없으면 카카오계정 웹 로그인으로 진행돼요.
  const result = await login();
  return { status: "success", token: result.accessToken };
}

async function googleIdToken(): Promise<SocialSdkResult> {
  const { GoogleSignin, isSuccessResponse } = await import("@react-native-google-signin/google-signin");
  if (!googleConfigured) {
    GoogleSignin.configure({ webClientId: GOOGLE_WEB_CLIENT_ID, iosClientId: GOOGLE_IOS_CLIENT_ID });
    googleConfigured = true;
  }
  if (Platform.OS === "android") await GoogleSignin.hasPlayServices();
  const response = await GoogleSignin.signIn();
  if (!isSuccessResponse(response)) return { status: "cancelled" };
  const idToken = response.data.idToken;
  if (!idToken) return { status: "error", message: "구글 인증 정보를 받지 못했어요. 다시 시도해 주세요." };
  return { status: "success", token: idToken };
}

export async function getSocialToken(provider: SocialProvider): Promise<SocialSdkResult> {
  if (Platform.OS === "web") {
    return { status: "error", message: "웹에서는 소셜 로그인을 지원하지 않아요. 앱에서 시도해 주세요." };
  }
  if (isExpoGo) {
    return {
      status: "error",
      message: "소셜 로그인은 Expo Go 에서 테스트할 수 없어요. 개발용 빌드(npx expo run:android)로 실행해 주세요.",
    };
  }
  try {
    return provider === "kakao" ? await kakaoAccessToken() : await googleIdToken();
  } catch (e) {
    if (looksCancelled(e)) return { status: "cancelled" };
    return { status: "error", message: `${provider === "kakao" ? "카카오" : "구글"} 로그인 중 문제가 생겼어요. (${errorMessage(e)})` };
  }
}
