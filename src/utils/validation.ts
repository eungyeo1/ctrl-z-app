// 입력값 검사 (로그인·회원가입·비밀번호 재설정에서 같이 씀)
// 비밀번호 정책은 서버와 같음: 영문+숫자 포함 8~20자 (app/domains/auth/service.py PASSWORD_POLICY)
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const PASSWORD_RULE_TEXT = "영문과 숫자를 섞어 8~20자";

export function checkEmail(email: string): string | undefined {
  return EMAIL_PATTERN.test(email.trim()) ? undefined : "이메일 형식을 확인해 주세요.";
}

export function checkPassword(password: string): string | undefined {
  if (password.length < 8 || password.length > 20) return `비밀번호는 ${PASSWORD_RULE_TEXT}로 만들어 주세요.`;
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) return `비밀번호는 ${PASSWORD_RULE_TEXT}로 만들어 주세요.`;
  return undefined;
}
