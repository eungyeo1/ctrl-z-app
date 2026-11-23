import { useEffect } from "react";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
// 굵기별 경로로 가져와야 쓰는 굵기만 앱에 포함됩니다.
import { Hahmlet_300Light } from "@expo-google-fonts/hahmlet/300Light";
import { Hahmlet_400Regular } from "@expo-google-fonts/hahmlet/400Regular";
import { Hahmlet_600SemiBold } from "@expo-google-fonts/hahmlet/600SemiBold";
import { Hahmlet_700Bold } from "@expo-google-fonts/hahmlet/700Bold";

import { AuthProvider, useAuth } from "@/features/auth/AuthContext";
import { colors, fontFamily, typography } from "@/theme";

// 폰트를 다 불러올 때까지 스플래시 화면을 유지합니다.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    [fontFamily.pretendardRegular]: require("@/assets/fonts/Pretendard-Regular.otf"),
    [fontFamily.pretendardSemiBold]: require("@/assets/fonts/Pretendard-SemiBold.otf"),
    [fontFamily.pretendardBold]: require("@/assets/fonts/Pretendard-Bold.otf"),
    [fontFamily.hahmletLight]: Hahmlet_300Light,
    [fontFamily.hahmletRegular]: Hahmlet_400Regular,
    [fontFamily.hahmletSemiBold]: Hahmlet_600SemiBold,
    [fontFamily.hahmletBold]: Hahmlet_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // 폰트 로딩 중에는 아무것도 그리지 않습니다. (실패하면 기본 폰트로 진행)
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}

// 로그인 여부에 따라 열 수 있는 화면을 나눕니다 (Stack.Protected).
// - 로그아웃 상태: 로그인·회원가입·비밀번호 재설정 화면만
// - 방금 가입: 독서 취향 설정(S-03)만 → 완료/건너뛰기 하면 홈으로
// - 로그인 상태: 탭과 나머지 화면
// 조건이 바뀌면 열 수 있는 첫 화면으로 자동 이동하므로, 로그인/로그아웃 후 따로 router 이동을 하지 않아도 됩니다.
function RootNavigator() {
  const { user, needsOnboarding } = useAuth();
  const loggedIn = !!user;

  return (
    <Stack
      screenOptions={{
        headerTintColor: colors.primary,
        headerTitleStyle: {
          fontFamily: typography.uiBaseSemiBold.fontFamily,
          fontSize: 16,
          color: colors.textPrimary,
        },
        headerStyle: { backgroundColor: colors.background },
        headerShadowVisible: false,
        headerBackButtonDisplayMode: "minimal",
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Protected guard={!loggedIn}>
        <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/terms" options={{ title: "" }} />
        <Stack.Screen name="(auth)/verify-email" options={{ title: "" }} />
        <Stack.Screen name="(auth)/password-reset" options={{ title: "" }} />
        <Stack.Screen name="(auth)/password-reset-complete" options={{ title: "" }} />
      </Stack.Protected>

      <Stack.Protected guard={loggedIn && needsOnboarding}>
        <Stack.Screen name="onboarding/preferences" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Protected guard={loggedIn && !needsOnboarding}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="books/[bookId]/index" options={{ title: "책 정보" }} />
        <Stack.Screen name="books/[bookId]/rooms" options={{ title: "" }} />
        <Stack.Screen name="books/request" options={{ title: "" }} />
        <Stack.Screen name="books/request-result" options={{ title: "" }} />
        <Stack.Screen name="rooms/[roomId]/preview" options={{ title: "" }} />
        <Stack.Screen name="archive/index" options={{ title: "" }} />
        <Stack.Screen name="archive/[roomId]" options={{ title: "" }} />
        <Stack.Screen name="notifications" options={{ title: "" }} />
      </Stack.Protected>
    </Stack>
  );
}
