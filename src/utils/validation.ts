// 입력값 검사 (로그인·회원가입·비밀번호 재설정에서 같이 씀)
// TODO: 비밀번호 정책은 백엔드와 맞춰 확정
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const PASSWORD_RULE_TEXT = "영문과 숫자를 섞어 8자 이상";

export function checkEmail(email: string): string | undefined {
  return EMAIL_PATTERN.test(email.trim()) ? undefined : "이메일 형식을 확인해 주세요.";
}

export function checkPassword(password: string): string | undefined {
  if (password.length < 8) return `비밀번호는 ${PASSWORD_RULE_TEXT}로 만들어 주세요.`;
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) return `비밀번호는 ${PASSWORD_RULE_TEXT}로 만들어 주세요.`;
  return undefined;
}
