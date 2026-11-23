// S-03 독서 취향 설정 (피그마 "독서 취향")
// S-03-1 선호 장르·독서 목적 다중 선택 / S-03-2 건너뛰기
// 완료하거나 건너뛰면 가드가 홈으로 보냅니다.
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Screen } from "@/components/layout/Screen";
import { Button } from "@/components/ui";
import { Chip } from "@/components/ui/Chip";
import { useAuth } from "@/features/auth/AuthContext";
import { savePreferences } from "@/services/api/auth";
import { colors, spacing, typography } from "@/theme";
import { notify } from "@/utils/notify";

// TODO: 장르·목적 목록을 서버에서 받을지 확정
const GENRES = ["소설", "에세이", "자기계발", "인문", "과학", "시", "기타"];
const PURPOSES = ["깊이 있는 대화", "꾸준한 완독 습관", "새로운 사람들과 교류"];

const toggleIn = (list: string[], value: string) =>
  list.includes(value) ? list.filter((item) => item !== value) : [...list, value];

export default function Preferences() {
  const { completeOnboarding } = useAuth();
  const [genres, setGenres] = useState<string[]>([]);
  const [purposes, setPurposes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    const res = await savePreferences(genres, purposes);
    setLoading(false);
    if (!res.success) {
      notify("저장하지 못했어요", res.error?.message);
      return;
    }
    completeOnboarding({ favoriteGenres: genres, readingPurposes: purposes });
  };

  return (
    <Screen
      edges={["top", "bottom"]}
      footer={
        <Button size="large" disabled={genres.length === 0 && purposes.length === 0} loading={loading} onPress={handleSave}>
          시작하기
        </Button>
      }
    >
      <View style={styles.topBar}>
        <Text style={styles.topTitle}>독서 취향</Text>
        <Pressable accessibilityRole="button" onPress={() => completeOnboarding()} hitSlop={spacing.sm}>
          <Text style={styles.skip}>건너뛰기</Text>
        </Pressable>
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>어떤 책을 즐겨 읽으세요?</Text>
        <Text style={styles.description}>
          선택한 취향을 바탕으로 독서방과 책을 추천해드려요.{"\n"}취향은 언제든 바꿀 수 있어요.
        </Text>
      </View>

      <View style={styles.group}>
        <Text style={styles.groupTitle}>선호 장르(복수 선택)</Text>
        <View style={styles.chips}>
          {GENRES.map((genre) => (
            <Chip
              key={genre}
              label={genre}
              selected={genres.includes(genre)}
              onPress={() => setGenres((prev) => toggleIn(prev, genre))}
            />
          ))}
        </View>
      </View>

      <View style={styles.group}>
        <Text style={styles.groupTitle}>독서 목적</Text>
        <View style={styles.chips}>
          {PURPOSES.map((purpose) => (
            <Chip
              key={purpose}
              label={purpose}
              selected={purposes.includes(purpose)}
              onPress={() => setPurposes((prev) => toggleIn(prev, purpose))}
            />
          ))}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  topTitle: {
    ...typography.uiBaseSemiBold,
    color: colors.textPrimary,
  },
  skip: {
    ...typography.uiSmallRegular,
    color: colors.textSecondary,
  },
  header: {
    gap: spacing.sm,
  },
  title: {
    ...typography.uiTitleBold,
    color: colors.textPrimary,
  },
  description: {
    ...typography.uiSmallRegular,
    color: colors.textSecondary,
  },
  group: {
    gap: spacing.md,
  },
  groupTitle: {
    ...typography.uiSmallRegular,
    color: colors.textSecondary,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
});
