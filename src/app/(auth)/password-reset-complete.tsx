// S-32 비밀번호 재설정 완료 (피그마 시안 없음)
// 재설정 메일 속 링크로 열립니다: ctrlzapp://password-reset-complete?token=...
// S-32-1 새 비밀번호 입력 + 정책 검증 / S-32-2 저장하면 자동 로그인 → 가드가 홈으로 보냅니다.
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Screen } from "@/components/layout/Screen";
import { StateView } from "@/components/layout/StateView";
import { Button, TextField } from "@/components/ui";
import { useAuth } from "@/features/auth/AuthContext";
import { resetPassword } from "@/services/api/auth";
import { colors, spacing, typography } from "@/theme";
import { checkPassword, PASSWORD_RULE_TEXT } from "@/utils/validation";

export default function PasswordResetComplete() {
  const router = useRouter();
  const { token } = useLocalSearchParams<{ token?: string }>();
  const { signIn } = useAuth();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [passwordError, setPasswordError] = useState<string>();
  const [confirmError, setConfirmError] = useState<string>();
  const [loading, setLoading] = useState(false);

  if (!token) {
    return (
      <Screen edges={["bottom"]}>
        <StateView
          emptyMessage="링크가 올바르지 않거나 만료되었어요. 재설정 메일을 다시 요청해 주세요."
          action={<Button onPress={() => router.replace("/password-reset")}>다시 요청하기</Button>}
        />
      </Screen>
    );
  }

  const handleSave = async () => {
    const problem = checkPassword(password);
    const mismatch = password !== confirm ? "비밀번호가 서로 달라요." : undefined;
    setPasswordError(problem);
    setConfirmError(mismatch);
    if (problem || mismatch) return;

    setLoading(true);
    const res = await resetPassword(token, password);
    setLoading(false);
    if (!res.success || !res.data) {
      setPasswordError(res.error?.message ?? "비밀번호를 바꾸지 못했어요.");
      return;
    }
    signIn(res.data.user, res.data.accessToken);
  };

  return (
    <Screen
      edges={["bottom"]}
      footer={
        <Button size="large" disabled={!password || !confirm} loading={loading} onPress={handleSave}>
          저장하고 로그인하기
        </Button>
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>새 비밀번호를 정해 주세요</Text>
        <Text style={styles.description}>{PASSWORD_RULE_TEXT}로 만들어 주세요.</Text>
      </View>
      <TextField
        label="새 비밀번호"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          setPasswordError(undefined);
        }}
        placeholder="새 비밀번호"
        secureTextEntry
        autoComplete="new-password"
        errorText={passwordError}
      />
      <TextField
        label="새 비밀번호 확인"
        value={confirm}
        onChangeText={(text) => {
          setConfirm(text);
          setConfirmError(undefined);
        }}
        placeholder="한 번 더 입력"
        secureTextEntry
        autoComplete="new-password"
        returnKeyType="done"
        onSubmitEditing={handleSave}
        errorText={confirmError}
      />
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
});
