// S-30 이메일 인증 (피그마 시안 없음 — 약관 동의 화면 스타일로 구성)
// S-30-1 인증코드 발송(약관 화면에서 이미 보냄) / S-30-2 6자리 코드 확인 / S-30-3 만료·실패 시 재발송
// 인증에 성공하면 가입 완료 + 로그인 → 가드가 독서 취향 설정(S-03)으로 보냅니다.
//
// 목업 인증코드: 123456
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Screen } from "@/components/layout/Screen";
import { StateView } from "@/components/layout/StateView";
import { Button, TextField } from "@/components/ui";
import { useAuth } from "@/features/auth/AuthContext";
import { sendVerificationCode, verifyCodeAndSignUp } from "@/services/api/auth";
import { colors, spacing, typography } from "@/theme";
import { notify } from "@/utils/notify";

const CODE_LENGTH = 6;
const DEFAULT_EXPIRES_SEC = 180;

const mmss = (sec: number) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;

export default function VerifyEmail() {
  const router = useRouter();
  const { signupDraft, signIn } = useAuth();
  const [code, setCode] = useState("");
  const [errorText, setErrorText] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(DEFAULT_EXPIRES_SEC);

  // 남은 시간 카운트다운
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  if (!signupDraft) {
    return (
      <Screen edges={["bottom"]}>
        <StateView
          emptyMessage="가입 정보가 없어요. 처음부터 다시 진행해 주세요."
          action={<Button onPress={() => router.replace("/login")}>로그인 화면으로</Button>}
        />
      </Screen>
    );
  }

  const expired = secondsLeft <= 0;

  const handleVerify = async () => {
    if (expired) {
      setErrorText("인증코드가 만료되었어요. 다시 받아 주세요.");
      return;
    }
    setLoading(true);
    const res = await verifyCodeAndSignUp(signupDraft, code);
    setLoading(false);
    if (!res.success || !res.data) {
      setErrorText(res.error?.message ?? "인증하지 못했어요.");
      return;
    }
    signIn(res.data.user, res.data.accessToken, { needsOnboarding: true });
  };

  const handleResend = async () => {
    setResending(true);
    const res = await sendVerificationCode(signupDraft.email);
    setResending(false);
    if (!res.success || !res.data) {
      notify("다시 보내지 못했어요", res.error?.message);
      return;
    }
    setCode("");
    setErrorText(undefined);
    setSecondsLeft(res.data.expiresInSec);
    notify("인증코드를 다시 보냈어요", signupDraft.email);
  };

  return (
    <Screen
      edges={["bottom"]}
      footer={
        <Button size="large" disabled={code.length !== CODE_LENGTH} loading={loading} onPress={handleVerify}>
          인증하고 가입하기
        </Button>
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>메일로 받은{"\n"}인증코드를 입력해 주세요</Text>
        <Text style={styles.description}>
          <Text style={styles.email}>{signupDraft.email}</Text>로 6자리 코드를 보냈어요.
        </Text>
      </View>

      <View style={styles.codeArea}>
        <TextField
          value={code}
          onChangeText={(text) => {
            setCode(text.replace(/\D/g, "").slice(0, CODE_LENGTH));
            setErrorText(undefined);
          }}
          placeholder="000000"
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          autoComplete="one-time-code"
          maxLength={CODE_LENGTH}
          autoFocus
          errorText={errorText}
          inputStyle={styles.codeInput}
        />
        <View style={styles.timerRow}>
          <Text style={[styles.timer, expired && styles.timerExpired]}>
            {expired ? "인증코드가 만료되었어요" : `남은 시간 ${mmss(secondsLeft)}`}
          </Text>
          <Pressable accessibilityRole="button" onPress={handleResend} disabled={resending} hitSlop={spacing.sm}>
            <Text style={styles.resend}>{resending ? "보내는 중…" : "코드 다시 받기"}</Text>
          </Pressable>
        </View>
      </View>

      <Text style={styles.help}>메일이 오지 않았다면 스팸함을 확인하거나, 코드를 다시 받아 주세요.</Text>
      {__DEV__ ? <Text style={styles.help}>개발용 목업 코드: 123456</Text> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.sm,
  },
  title: {
    ...typography.uiTitleBold,
    color: colors.textPrimary,
  },
  description: {
    ...typography.uiBaseRegular,
    color: colors.textSecondary,
  },
  email: {
    ...typography.uiBaseSemiBold,
    color: colors.textPrimary,
  },
  codeArea: {
    gap: spacing.sm,
  },
  codeInput: {
    fontSize: 22,
    letterSpacing: 8,
    textAlign: "center",
  },
  timerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.xs,
  },
  timer: {
    ...typography.uiSmallRegular,
    color: colors.textSecondary,
  },
  timerExpired: {
    color: colors.error,
  },
  resend: {
    ...typography.uiSmallSemiBold,
    color: colors.textPrimary,
    textDecorationLine: "underline",
  },
  help: {
    ...typography.uiSmallRegular,
    color: colors.textSecondary,
  },
});
