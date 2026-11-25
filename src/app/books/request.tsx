// S-06 책 등록 요청 (피그마 "책 등록 요청")
// S-06-1 원하는 책이 없을 때 정보 직접 입력 / S-06-2 같은 ISBN 요청은 기존 요청에 합침
// 제출하면 요청 결과(S-33) 화면으로 갑니다.
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Screen } from "@/components/layout/Screen";
import { Button, TextField } from "@/components/ui";
import { Icon } from "@/components/ui/Icon";
import { requestBook } from "@/services/api/books";
import { colors, radius, spacing, typography } from "@/theme";
import { notify } from "@/utils/notify";

export default function BookRequestScreen() {
  const router = useRouter();
  // 검색 화면에서 넘어오면 검색어를 제목 칸에 미리 채웁니다. 반려 후 다시 요청할 때는 저자도 채웁니다.
  const params = useLocalSearchParams<{ title?: string; author?: string }>();
  const [title, setTitle] = useState(params.title ?? "");
  const [author, setAuthor] = useState(params.author ?? "");
  const [isbn, setIsbn] = useState("");
  const [isbnError, setIsbnError] = useState<string>();
  const [loading, setLoading] = useState(false);

  const canSubmit = title.trim().length > 0 && author.trim().length > 0;

  const handleSubmit = async () => {
    const digits = isbn.replace(/\D/g, "");
    if (digits && digits.length !== 13) {
      setIsbnError("ISBN은 숫자 13자리예요. 모르면 비워 두세요.");
      return;
    }
    setLoading(true);
    const res = await requestBook({ title, author, isbn: digits || undefined });
    setLoading(false);
    if (!res.success || !res.data) {
      notify("요청하지 못했어요", res.error?.message);
      return;
    }
    const { request, merged } = res.data;
    router.replace({
      pathname: "/books/request-result",
      params: { requestId: request.id, merged: merged ? "1" : "0" },
    });
  };

  return (
    <Screen
      edges={["bottom"]}
      footer={
        <Button size="large" disabled={!canSubmit} loading={loading} onPress={handleSubmit}>
          요청 제출하기
        </Button>
      }
    >
      <Text style={styles.screenTitle}>책 등록 요청</Text>

      <View style={styles.intro}>
        <Icon name="search-outline" size={26} color={colors.textSecondary} />
        <Text style={styles.introTitle}>검색 결과가 없어요</Text>
        <Text style={styles.introText}>
          정보를 입력해주시면 운영자가 검토 후 등록해드려요.{"\n"}같은 ISBN으로 이미 요청이 있다면 자동으로 합쳐져요.
        </Text>
      </View>

      <View style={styles.form}>
        <TextField label="제목 *" value={title} onChangeText={setTitle} placeholder="예 : 모순" shadowPosition="none" />
        <TextField label="저자 *" value={author} onChangeText={setAuthor} placeholder="예 : 양귀자" shadowPosition="none" />
        <TextField
          label="ISBN (선택)"
          value={isbn}
          onChangeText={(text) => {
            setIsbn(text);
            setIsbnError(undefined);
          }}
          placeholder="숫자 13자리"
          keyboardType="number-pad"
          maxLength={17}
          errorText={isbnError}
          shadowPosition="none"
        />
        <View style={styles.coverField}>
          <Text style={styles.label}>표지 사진 (선택)</Text>
          {/* TODO: expo-image-picker 설치 후 카메라/갤러리 연결 */}
          <Pressable
            accessibilityRole="button"
            onPress={() => notify("표지 사진", "사진 첨부는 expo-image-picker 설치 후 연결할게요.")}
            style={({ pressed }) => [styles.coverButton, pressed && styles.pressed]}
          >
            <Icon name="camera-outline" size={18} color={colors.textSecondary} />
            <Text style={styles.coverText}>표지를 촬영하거나 갤러리에서 선택</Text>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screenTitle: {
    ...typography.uiBaseSemiBold,
    color: colors.textPrimary,
  },
  intro: {
    gap: spacing.xs,
  },
  introTitle: {
    ...typography.uiHeadlineBold,
    fontSize: 15,
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },
  introText: {
    ...typography.uiSmallRegular,
    color: colors.textSecondary,
  },
  form: {
    gap: spacing.lg,
  },
  coverField: {
    gap: spacing.xs,
  },
  label: {
    ...typography.uiBaseSemiBold,
    color: colors.textSecondary,
  },
  coverButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    minHeight: 48,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.full,
    backgroundColor: colors.textBackground,
  },
  pressed: {
    opacity: 0.7,
  },
  coverText: {
    ...typography.uiBaseRegular,
    color: colors.textSecondary,
  },
});
