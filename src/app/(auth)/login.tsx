// S-01 로그인 / 회원가입 (피그마 "온보딩")
// S-01-1 이메일·비밀번호 입력 후 "이메일로 계속하기"
//        → 가입된 이메일이면 로그인, 처음 보는 이메일이면 약관 동의(S-31)로 분기
// S-01-2 카카오 / 구글 소셜 로그인 진입 (실서버 연동, 개발용 빌드에서만 동작)
//        기존 회원이면 바로 로그인, 처음이면 약관 동의(S-31)로
// 로그인에 성공하면 루트 레이아웃의 가드가 홈으로 보내줍니다. (router 이동 필요 없음)
//
// 목업 테스트 계정: test@ctrlz.com / password1!
import { useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { Logo } from "@/components/layout/Logo";
import { Screen } from "@/components/layout/Screen";
import { Button, TextField } from "@/components/ui";
import { useAuth } from "@/features/auth/AuthContext";
import { getSocialToken } from "@/features/auth/socialSdk";
import { checkEmail as checkEmailExists, login, socialLogin, type LoginResult } from "@/services/api/auth";
import { colors, radius, spacing, typography } from "@/theme";
import type { ApiResponse, SocialProvider } from "@/types/models";
import { notify } from "@/utils/notify";
import { checkEmail, checkPassword, PASSWORD_RULE_TEXT } from "@/utils/validation";

export default function Login() {
  const router = useRouter();
  const { signIn, setSignupDraft } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string>();
  const [passwordError, setPasswordError] = useState<string>();
  const [loading, setLoading] = useState(false);

  const finishLogin = (res: ApiResponse<LoginResult>) => {
    if (!res.success || !res.data) {
      setPasswordError(res.error?.message ?? "로그인하지 못했어요.");
      return;
    }
    signIn(res.data.user, res.data.accessToken);
  };

  // 처음 보는 이메일 → 입력한 이메일·비밀번호를 들고 약관 동의(S-31)로
  const startSignUp = () => {
    const emailProblem = checkEmail(email);
    const passwordProblem = checkPassword(password);
    setEmailError(emailProblem);
    setPasswordError(passwordProblem);
    if (emailProblem || passwordProblem) return;
    setSignupDraft({
      method: "email",
      email: email.trim().toLowerCase(),
      password,
      agreements: { terms: false, privacy: false, marketing: false },
    });
    router.push("/terms");
  };

  const handleSubmit = async () => {
    const trimmed = email.trim();
    const emailProblem = checkEmail(trimmed);
    if (emailProblem) {
      setEmailError(emailProblem);
      return;
    }
    setLoading(true);
    const check = await checkEmailExists(trimmed);
    if (!check.success || !check.data) {
      setLoading(false);
      setEmailError(check.error?.message);
      return;
    }
    if (!check.data.exists) {
      setLoading(false);
      startSignUp();
      return;
    }
    if (!password) {
      setLoading(false);
      setPasswordError("비밀번호를 입력해 주세요.");
      return;
    }
    const res = await login(trimmed, password);
    setLoading(false);
    finishLogin(res);
  };

  const handleSocial = async (provider: SocialProvider) => {
    setLoading(true);
    const sdk = await getSocialToken(provider);
    if (sdk.status !== "success") {
      setLoading(false);
      if (sdk.status === "error") notify("로그인하지 못했어요", sdk.message);
      return;
    }
    const res = await socialLogin(provider, sdk.token);
    setLoading(false);
    if (!res.success || !res.data) {
      notify("로그인하지 못했어요", res.error?.message);
      return;
    }
    if (!res.data.isNewUser) {
      signIn(res.data.login.user, res.data.login.accessToken);
      return;
    }
    // 처음 오는 소셜 계정 → 소셜 토큰을 들고 약관 동의로
    setSignupDraft({
      method: "social",
      provider,
      socialToken: sdk.token,
      hasEmail: res.data.hasEmail,
      email: "",
      password: "",
      agreements: { terms: false, privacy: false, marketing: false },
    });
    router.push("/terms");
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <Screen edges={["top", "bottom"]} contentStyle={styles.content}>
        <View style={styles.logo}>
          <Logo size="large" />
        </View>

        <View style={styles.formCard}>
          <TextField
            label="이메일"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setEmailError(undefined);
            }}
            placeholder="example@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            returnKeyType="next"
            errorText={emailError}
            shadowPosition="none"
            inputStyle={styles.input}
          />
          <TextField
            label="비밀번호"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setPasswordError(undefined);
            }}
            placeholder="비밀번호"
            helperText={passwordError ? undefined : `처음이라면 ${PASSWORD_RULE_TEXT}로 정해 주세요.`}
            secureTextEntry
            autoComplete="current-password"
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
            errorText={passwordError}
            shadowPosition="none"
            inputStyle={styles.input}
          />
          <Button size="large" loading={loading} disabled={!email.trim()} onPress={handleSubmit} style={styles.submit}>
            이메일로 계속하기
          </Button>
          {/* S-02 비밀번호 재설정 (피그마에 위치 없음 — 디자인 확인 필요) */}
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push({ pathname: "/password-reset", params: { email: email.trim() } })}
            hitSlop={spacing.sm}
            style={styles.forgot}
          >
            <Text style={styles.forgotText}>비밀번호를 잊으셨나요?</Text>
          </Pressable>
        </View>

        <View style={styles.divider} />

        {/* S-01-2 소셜 로그인 */}
        <View style={styles.socials}>
          <Button variant="secondary" size="large" disabled={loading} onPress={() => handleSocial("kakao")}>
            카카오로 계속하기
          </Button>
          <Button variant="secondary" size="large" disabled={loading} onPress={() => handleSocial("google")}>
            구글로 계속하기
          </Button>
        </View>

        <View style={styles.signUpRow}>
          <Text style={styles.signUpText}>아직 계정이 없으신가요?</Text>
          <Pressable accessibilityRole="button" onPress={startSignUp} hitSlop={spacing.sm}>
            <Text style={styles.signUpLink}>가입하기</Text>
          </Pressable>
        </View>
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingTop: spacing.xl,
    gap: spacing.xl,
  },
  forgot: {
    alignSelf: "center",
  },
  forgotText: {
    ...typography.uiSmallRegular,
    color: colors.textSecondary,
    textDecorationLine: "underline",
  },
  logo: {
    alignItems: "center",
    marginVertical: spacing.xl,
  },
  formCard: {
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.xl,
    backgroundColor: colors.textBackground,
  },
  input: {
    backgroundColor: colors.surface,
  },
  submit: {
    marginTop: spacing.sm,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
  socials: {
    gap: spacing.md,
  },
  signUpRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.xs,
  },
  signUpText: {
    ...typography.uiSmallRegular,
    color: colors.textSecondary,
  },
  signUpLink: {
    ...typography.uiSmallSemiBold,
    color: colors.textPrimary,
  },
});
