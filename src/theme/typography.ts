// 공통 글자 스타일 토큰 (피그마 텍스트 스타일 기준)
// 사용 예: <Text style={typography.baseBold}>오두막 책방</Text>
//
// - 텍스트 스타일 글꼴: Hahmlet (Light 300 / Regular 400 / SemiBold 600 / Bold 700)
// - Pretendard 도 디자인 시스템에 있어서 폰트는 불러와 두었습니다. (fontFamily.pretendardXxx 로 사용)
// 폰트는 src/app/_layout.tsx 에서 앱 시작 시 불러옵니다.
//
// 굵기는 fontWeight 가 아니라 fontFamily 로 구분합니다.
// (커스텀 폰트에 fontWeight 를 같이 쓰면 안드로이드에서 기본 폰트로 바뀌는 문제가 있음)
//
// 크기는 피그마 값입니다.
// 행간: 피그마는 "100%" 지만, RN 에서 lineHeight 를 글자 크기와 같게 주면 Hahmlet 글자 위가 잘립니다.
// Hahmlet 폰트 자체의 기본 행간이 글자 크기의 약 1.45배라서, 그 값으로 맞췄습니다.
// (피그마에서 24px 글씨 박스 높이가 35px 로 나오는 것과 같은 값)

import type { TextStyle } from "react-native";

// 폰트 이름 (_layout.tsx 에서 이 이름으로 폰트를 등록함)
export const fontFamily = {
  pretendardRegular: "Pretendard-Regular",
  pretendardSemiBold: "Pretendard-SemiBold",
  pretendardBold: "Pretendard-Bold",
  hahmletLight: "Hahmlet-Light",
  hahmletRegular: "Hahmlet-Regular",
  hahmletSemiBold: "Hahmlet-SemiBold",
  hahmletBold: "Hahmlet-Bold",
} as const;

const size = {
  large: { fontSize: 24, lineHeight: 35 },
  base: { fontSize: 16, lineHeight: 23 },
  small: { fontSize: 14, lineHeight: 20 },
  xsmall: { fontSize: 12, lineHeight: 17 },
} as const;

// 피그마 텍스트 스타일 이름과 1:1 대응 (예: large/bold → largeBold)
export const typography = {
  // Pretendard is used for interface copy; Hahmlet remains available for editorial text.
  uiBaseRegular: { ...size.small, fontFamily: fontFamily.pretendardRegular },
  uiBaseSemiBold: { ...size.small, fontFamily: fontFamily.pretendardSemiBold },
  uiSmallRegular: { ...size.xsmall, fontFamily: fontFamily.pretendardRegular },
  uiSmallSemiBold: { ...size.xsmall, fontFamily: fontFamily.pretendardSemiBold },
  largeRegular: { ...size.large, fontFamily: fontFamily.hahmletRegular },
  largeBold: { ...size.large, fontFamily: fontFamily.hahmletBold },
  baseRegular: { ...size.base, fontFamily: fontFamily.hahmletRegular },
  baseBold: { ...size.base, fontFamily: fontFamily.hahmletBold },
  smallRegular: { ...size.small, fontFamily: fontFamily.hahmletRegular },
  smallBold: { ...size.small, fontFamily: fontFamily.hahmletBold },
  xsmallRegular: { ...size.xsmall, fontFamily: fontFamily.hahmletLight }, // 피그마: Light 300
  xsmallSemiBold: { ...size.xsmall, fontFamily: fontFamily.hahmletSemiBold },
} as const satisfies Record<string, TextStyle>;

export type TypographyName = keyof typeof typography;
