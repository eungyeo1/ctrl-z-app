// S-01 로그인 / 회원가입 (피그마 "온보딩")
// S-01-1 이메일·비밀번호 입력 후 "이메일로 계속하기"
//        → 가입된 이메일이면 로그인, 처음 보는 이메일이면 약관 동의(S-31)로 분기
// S-01-2 카카오 / Apple 소셜 로그인 진입
//
// 목업 테스트 계정: test@ctrlz.com / password1!
import { useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { Logo } from "@/components/layout/Logo";
import { Screen } from "@/components/layout/Screen";
import { Button, TextField } from "@/components/ui";
import { Icon } from "@/components/ui/Icon";
import { useAuth } from "@/features/auth/AuthContext";
import { checkEmail, login, socialLogin, type LoginResult } from "@/services/api/auth";
import { colors, radius, spacing, typography } from "@/theme";
import type { ApiResponse } from "@/types/models";
import { notify } from "@/utils/notify";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// TODO: S-31 약관 동의 화면 생기면 router.push({ pathname: "/terms", params: { email } }) 로 교체
const goSignUp = () => notify("처음 오셨네요!", "회원가입(약관 동의 S-31) 화면은 준비 중이에요.");

export default function Login() {
  const router = useRouter();
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string>();
  const [passwordError, setPasswordError] = useState<string>();
  const [loading, setLoading] = useState(false);

  const close = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/");
  };

  const finishLogin = (res: ApiResponse<LoginResult>) => {
    if (!res.success || !res.data) {
      setPasswordError(res.error?.message ?? "로그인하지 못했어요.");
      return;
    }
    signIn(res.data.user, res.data.accessToken);
    close();
  };

  const handleSubmit = async () => {
    const trimmed = email.trim();
    if (!EMAIL_PATTERN.test(trimmed)) {
      setEmailError("이메일 형식을 확인해 주세요.");
      return;
    }
    setLoading(true);
    const check = await checkEmail(trimmed);
    if (!check.success || !check.data) {
      setLoading(false);
      setEmailError(check.error?.message);
      return;
    }
    if (!check.data.exists) {
      setLoading(false);
      goSignUp();
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

  const handleSocial = async (provider: "kakao" | "apple") => {
    setLoading(true);
    const res = await socialLogin(provider);
    setLoading(false);
    finishLogin(res);
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <Screen edges={["top", "bottom"]} contentStyle={styles.content}>
        {router.canGoBack() ? (
          <Pressable accessibilityRole="button" accessibilityLabel="닫기" onPress={close} hitSlop={spacing.sm} style={styles.close}>
            <Icon name="close" size={22} color={colors.textSecondary} />
          </Pressable>
        ) : null}

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
        </View>

        <View style={styles.divider} />

        {/* S-01-2 소셜 로그인 */}
        <View style={styles.socials}>
          <Button variant="secondary" size="large" disabled={loading} onPress={() => handleSocial("kakao")}>
            카카오로 계속하기
          </Button>
          <Button variant="secondary" size="large" disabled={loading} onPress={() => handleSocial("apple")}>
            Apple로 계속하기
          </Button>
        </View>

        <View style={styles.signUpRow}>
          <Text style={styles.signUpText}>아직 계정이 없으신가요?</Text>
          <Pressable accessibilityRole="button" onPress={goSignUp} hitSlop={spacing.sm}>
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
  close: {
    alignSelf: "flex-start",
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
