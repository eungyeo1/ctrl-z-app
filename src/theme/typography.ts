// 공통 글자 스타일 토큰
// ⚠️ 임시 값입니다. 디자인 확정 후 폰트 크기·굵기를 맞춰 주세요.
// 사용 예: <Text style={typography.title}>제목</Text>

import type { TextStyle } from "react-native";

export const typography = {
  heading: { fontSize: 24, lineHeight: 32, fontWeight: "700" },
  title: { fontSize: 20, lineHeight: 28, fontWeight: "600" },
  subtitle: { fontSize: 16, lineHeight: 24, fontWeight: "600" },
  body: { fontSize: 16, lineHeight: 24, fontWeight: "400" },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: "400" },
} as const satisfies Record<string, TextStyle>;

export type TypographyName = keyof typeof typography;
