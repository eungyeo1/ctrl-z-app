// 공통 색상 토큰
// ⚠️ 임시 값입니다. 디자인 최종 확정(11/8) 후 피그마 값으로 교체해 주세요.
// 화면에서는 hex 값을 직접 쓰지 말고 반드시 colors.xxx 를 사용합니다.

const palette = {
  primary500: "#208AEF",
  primary100: "#E6F4FE",

  gray900: "#1A1A1A",
  gray700: "#4A4A4A",
  gray500: "#8A8A8A",
  gray300: "#D4D4D4",
  gray100: "#F5F5F5",
  white: "#FFFFFF",

  red500: "#E5484D",
  green500: "#30A46C",
} as const;

// 화면에서는 아래 "의미 기반" 이름을 사용합니다.
// 나중에 색이 바뀌어도 이 파일만 고치면 앱 전체에 반영됩니다.
export const colors = {
  primary: palette.primary500,
  primaryLight: palette.primary100,

  background: palette.white,
  surface: palette.gray100,
  border: palette.gray300,

  textPrimary: palette.gray900,
  textSecondary: palette.gray700,
  textDisabled: palette.gray500,
  textOnPrimary: palette.white,

  error: palette.red500,
  success: palette.green500,
} as const;

export type ColorName = keyof typeof colors;
