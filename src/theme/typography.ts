// 공통 글자 스타일 토큰 (피그마 디자인 규칙 기준)
// 사용 예: <Text style={typography.baseBold}>오두막 책방</Text>
//
// - 본문 폰트: Pretendard (Regular / SemiBold / Bold) — assets/fonts
// - 제목·로고 폰트: Hahmlet (Light / Regular / Bold) — @expo-google-fonts/hahmlet
// 폰트는 src/app/_layout.tsx 에서 앱 시작 시 불러옵니다.
//
// 굵기는 fontWeight 가 아니라 fontFamily 로 구분합니다.
// (커스텀 폰트에 fontWeight 를 같이 쓰면 안드로이드에서 기본 폰트로 바뀌는 문제가 있음)
//
// ⚠️ 글자 크기(fontSize)는 피그마 캡처에서 추정한 값입니다. 디자인 담당께 정확한 값을 받아 수정해 주세요.

import type { TextStyle } from "react-native";

// 폰트 이름 (_layout.tsx 에서 이 이름으로 폰트를 등록함)
export const fontFamily = {
  pretendardRegular: "Pretendard-Regular",
  pretendardSemiBold: "Pretendard-SemiBold",
  pretendardBold: "Pretendard-Bold",
  hahmletLight: "Hahmlet-Light",
  hahmletRegular: "Hahmlet-Regular",
  hahmletBold: "Hahmlet-Bold",
} as const;

// 피그마 텍스트 스타일: large / base / small / xsmall × regular / bold
const size = {
  large: { fontSize: 18, lineHeight: 26 },
  base: { fontSize: 16, lineHeight: 24 },
  small: { fontSize: 14, lineHeight: 20 },
  xsmall: { fontSize: 12, lineHeight: 16 },
} as const;

export const typography = {
  // 본문 (Pretendard)
  largeRegular: { ...size.large, fontFamily: fontFamily.pretendardRegular },
  largeBold: { ...size.large, fontFamily: fontFamily.pretendardBold },
  baseRegular: { ...size.base, fontFamily: fontFamily.pretendardRegular },
  baseBold: { ...size.base, fontFamily: fontFamily.pretendardBold },
  smallRegular: { ...size.small, fontFamily: fontFamily.pretendardRegular },
  smallBold: { ...size.small, fontFamily: fontFamily.pretendardBold },
  xsmallRegular: { ...size.xsmall, fontFamily: fontFamily.pretendardRegular },
  xsmallSemiBold: { ...size.xsmall, fontFamily: fontFamily.pretendardSemiBold },

  // 제목·로고 (Hahmlet) — 피그마 견본: 64 Bold / 48 Regular / 32 Light
  displayBold: { fontSize: 32, lineHeight: 40, fontFamily: fontFamily.hahmletBold },
  displayRegular: { fontSize: 24, lineHeight: 32, fontFamily: fontFamily.hahmletRegular },
  displayLight: { fontSize: 20, lineHeight: 28, fontFamily: fontFamily.hahmletLight },
} as const satisfies Record<string, TextStyle>;

export type TypographyName = keyof typeof typography;
