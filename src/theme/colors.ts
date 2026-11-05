// 공통 색상 토큰 (피그마 디자인 규칙 기준)
// 화면에서는 hex 값을 직접 쓰지 말고 반드시 colors.xxx 를 사용합니다.

// 피그마에 정의된 원본 색상 (이름도 피그마와 동일하게 유지)
export const palette = {
  primaryBrown: "#56493F",
  primaryCream: "#FCFCF4",

  neutral100: "#FFFFFF",
  neutral90: "#E6E6E6",
  neutral80: "#CCCCCC",
  neutral70: "#B3B3B3",
  neutral50: "#7F7F7F",
  neutral10: "#1A1A1A",

  // ⚠️ 피그마에 아직 없는 색 (임시). 디자인에서 정해지면 교체해 주세요.
  red: "#E5484D",
} as const;

// 화면에서는 아래 "용도 이름"을 사용합니다.
// 나중에 색이 바뀌어도 이 파일만 고치면 앱 전체에 반영됩니다.
export const colors = {
  // 브랜드
  primary: palette.primaryBrown, // 메인 버튼, 강조, 로고
  onPrimary: palette.primaryCream, // primary 배경 위의 글자·아이콘

  // 배경
  background: palette.primaryCream, // 화면 기본 배경
  surface: palette.neutral100, // 카드, 입력창 등 흰 영역

  // 글자
  textPrimary: palette.neutral10, // 기본 글자
  textSecondary: palette.neutral50, // 보조 설명, 날짜 등
  textDisabled: palette.neutral70, // 비활성 글자, placeholder

  // 선·구분
  border: palette.neutral80, // 입력창·카드 테두리
  divider: palette.neutral90, // 구분선

  // 상태
  disabled: palette.neutral90, // 비활성 버튼 배경
  error: palette.red, // ⚠️ 임시
} as const;

export type ColorName = keyof typeof colors;
