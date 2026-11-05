// 공통 간격 토큰 (margin, padding, gap 등)
// 4의 배수 규칙을 사용합니다. 화면에서는 숫자를 직접 쓰지 말고 spacing.xxx 를 사용합니다.

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

// 모서리 둥글기
export const radius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

export type SpacingName = keyof typeof spacing;
export type RadiusName = keyof typeof radius;
