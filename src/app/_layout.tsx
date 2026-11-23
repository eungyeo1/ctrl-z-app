import { useEffect } from "react";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
// 굵기별 경로로 가져와야 쓰는 굵기만 앱에 포함됩니다.
import { Hahmlet_300Light } from "@expo-google-fonts/hahmlet/300Light";
import { Hahmlet_400Regular } from "@expo-google-fonts/hahmlet/400Regular";
import { Hahmlet_600SemiBold } from "@expo-google-fonts/hahmlet/600SemiBold";
import { Hahmlet_700Bold } from "@expo-google-fonts/hahmlet/700Bold";

import { AuthProvider } from "@/features/auth/AuthContext";
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
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/login" options={{ headerShown: false, presentation: "modal" }} />
        <Stack.Screen name="books/[bookId]/index" options={{ title: "책 정보" }} />
        <Stack.Screen name="books/[bookId]/rooms" options={{ title: "" }} />
        <Stack.Screen name="rooms/[roomId]" options={{ title: "" }} />
      </Stack>
    </AuthProvider>
  );
}
