import { useEffect } from "react";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
// 굵기별 경로로 가져와야 쓰는 굵기만 앱에 포함됩니다.
import { Hahmlet_300Light } from "@expo-google-fonts/hahmlet/300Light";
import { Hahmlet_400Regular } from "@expo-google-fonts/hahmlet/400Regular";
import { Hahmlet_700Bold } from "@expo-google-fonts/hahmlet/700Bold";

import { fontFamily } from "@/theme";

// 폰트를 다 불러올 때까지 스플래시 화면을 유지합니다.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    [fontFamily.pretendardRegular]: require("@/assets/fonts/Pretendard-Regular.otf"),
    [fontFamily.pretendardSemiBold]: require("@/assets/fonts/Pretendard-SemiBold.otf"),
    [fontFamily.pretendardBold]: require("@/assets/fonts/Pretendard-Bold.otf"),
    [fontFamily.hahmletLight]: Hahmlet_300Light,
    [fontFamily.hahmletRegular]: Hahmlet_400Regular,
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

  return <Stack />;
}
