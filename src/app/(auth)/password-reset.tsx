// S-02 비밀번호 재설정 요청 (피그마 시안 없음)
// S-02-1 가입 이메일로 재설정 링크 발송 → 메일 링크가 앱의 S-32 화면을 엽니다.
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Screen } from "@/components/layout/Screen";
import { Button, TextField } from "@/components/ui";
import { Icon } from "@/components/ui/Icon";
import { requestPasswordReset } from "@/services/api/auth";
import { colors, spacing, typography } from "@/theme";
import { notify } from "@/utils/notify";
import { checkEmail } from "@/utils/validation";

export default function PasswordReset() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string }>();
  const [email, setEmail] = useState(params.email ?? "");
  const [errorText, setErrorText] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    const problem = checkEmail(email);
    if (problem) {
      setErrorText(problem);
      return;
    }
    setLoading(true);
    const res = await requestPasswordReset(email.trim());
    setLoading(false);
    if (!res.success) {
      notify("메일을 보내지 못했어요", res.error?.message);
      return;
    }
    setSent(true);
  };

  if (sent) {
    return (
      <Screen
        edges={["bottom"]}
        footer={
          <Button size="large" onPress={() => router.replace("/login")}>
            로그인 화면으로
          </Button>
        }
      >
        <View style={styles.sent}>
          <Icon name="mail-outline" size={44} color={colors.primary} />
          <Text style={styles.title}>메일을 보냈어요</Text>
          <Text style={styles.description}>
            {email.trim()}로 비밀번호 재설정 링크를 보냈어요.{"\n"}메일의 링크를 누르면 새 비밀번호를 정할 수 있어요.
          </Text>
          <Button variant="tertiary" size="small" onPress={() => setSent(false)}>
            메일이 안 왔어요 · 다시 보내기
          </Button>
          {/* 실제로는 메일 속 링크(딥링크)로 열리는 화면이라, 개발 중 확인용 버튼을 둡니다. */}
          {__DEV__ ? (
            <Button
              variant="secondary"
              size="small"
              onPress={() => router.push({ pathname: "/password-reset-complete", params: { token: "mock-reset-token" } })}
            >
              (개발용) 메일 속 링크 열기
            </Button>
          ) : null}
        </View>
      </Screen>
    );
  }

  return (
    <Screen
      edges={["bottom"]}
      footer={
        <Button size="large" disabled={!email.trim()} loading={loading} onPress={handleSend}>
          재설정 메일 받기
        </Button>
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>비밀번호를 잊으셨나요?</Text>
        <Text style={styles.description}>가입한 이메일을 입력하면 비밀번호를 다시 정할 수 있는 링크를 보내드려요.</Text>
      </View>
      <TextField
        label="이메일"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setErrorText(undefined);
        }}
        placeholder="example@email.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect={false}
        returnKeyType="send"
        onSubmitEditing={handleSend}
        errorText={errorText}
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
    textAlign: "auto",
  },
  description: {
    ...typography.uiBaseRegular,
    color: colors.textSecondary,
  },
  sent: {
    alignItems: "center",
    gap: spacing.md,
    paddingTop: spacing.xxxl,
  },
});
