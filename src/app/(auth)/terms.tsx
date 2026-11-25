// S-31 약관 동의 (피그마 "약관 동의")
// S-31-1 필수 약관(서비스 이용약관·개인정보 처리방침) / S-31-2 선택 약관(마케팅 정보 수신)
// 다음 → 인증코드 발송(S-30-1) 후 이메일 인증 화면으로
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Screen } from "@/components/layout/Screen";
import { StateView } from "@/components/layout/StateView";
import { Button } from "@/components/ui";
import { Checkbox } from "@/components/ui/Checkbox";
import { useAuth } from "@/features/auth/AuthContext";
import { sendVerificationCode } from "@/services/api/auth";
import { colors, radius, spacing, typography } from "@/theme";
import type { SignupDraft } from "@/types/models";
import { notify } from "@/utils/notify";

type AgreementKey = keyof SignupDraft["agreements"];

const items: { key: AgreementKey; label: string; required: boolean }[] = [
  { key: "terms", label: "서비스 이용약관 동의", required: true },
  { key: "privacy", label: "개인정보 처리방침 동의", required: true },
  { key: "marketing", label: "마케팅 정보 수신 동의", required: false },
];

export default function Terms() {
  const router = useRouter();
  const { signupDraft, setSignupDraft } = useAuth();
  const [agreements, setAgreements] = useState(
    signupDraft?.agreements ?? { terms: false, privacy: false, marketing: false },
  );
  const [loading, setLoading] = useState(false);

  if (!signupDraft) {
    return (
      <Screen edges={["bottom"]}>
        <StateView
          emptyMessage="가입 정보가 없어요. 로그인 화면에서 이메일과 비밀번호를 먼저 입력해 주세요."
          action={<Button onPress={() => router.replace("/login")}>로그인 화면으로</Button>}
        />
      </Screen>
    );
  }

  const allChecked = items.every((item) => agreements[item.key]);
  const requiredChecked = items.filter((item) => item.required).every((item) => agreements[item.key]);

  const toggleAll = (next: boolean) => setAgreements({ terms: next, privacy: next, marketing: next });
  const toggle = (key: AgreementKey) => (next: boolean) => setAgreements((prev) => ({ ...prev, [key]: next }));

  const handleNext = async () => {
    setLoading(true);
    const res = await sendVerificationCode(signupDraft.email);
    setLoading(false);
    if (!res.success) {
      notify("인증코드를 보내지 못했어요", res.error?.message);
      return;
    }
    setSignupDraft({ ...signupDraft, agreements });
    router.push("/verify-email");
  };

  return (
    <Screen
      edges={["bottom"]}
      footer={
        <Button size="large" disabled={!requiredChecked} loading={loading} onPress={handleNext}>
          다음
        </Button>
      }
    >
      <Text style={styles.title}>시작하기 전에,{"\n"}아래 약관을 확인해 주세요</Text>

      <View style={styles.allBox}>
        <Checkbox
          checked={allChecked}
          onChange={toggleAll}
          label="전체 동의"
          description="필수 및 선택 약관에 모두 동의해요"
        />
      </View>

      <View style={styles.list}>
        {items.map((item) => (
          <Checkbox
            key={item.key}
            checked={agreements[item.key]}
            onChange={toggle(item.key)}
            label={item.label}
            tag={item.required ? "필수" : "선택"}
            right={
              // TODO: 약관 전문 페이지(웹뷰 또는 노션 링크) 정해지면 연결
              <Pressable
                accessibilityRole="link"
                hitSlop={spacing.sm}
                onPress={() => notify(item.label, "약관 전문은 준비 중이에요.")}
              >
                <Text style={styles.view}>보기</Text>
              </Pressable>
            }
          />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    ...typography.uiTitleBold,
    color: colors.textPrimary,
  },
  allBox: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.xl,
    backgroundColor: colors.textBackground,
  },
  list: {
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
  },
  view: {
    ...typography.uiSmallRegular,
    color: colors.textSecondary,
    textDecorationLine: "underline",
  },
});
