// S-28 아카이브 목록 (피그마 "아카이브")
// S-28-1 완독·중단된 독서방 목록 (+ 전체 탭에는 읽는 중인 방도 함께)
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Screen } from "@/components/layout/Screen";
import { StateView } from "@/components/layout/StateView";
import { Icon } from "@/components/ui/Icon";
import { SegmentedTabs } from "@/components/ui/SegmentedTabs";
import { ArchiveStatusPill } from "@/features/archive/ArchiveStatusPill";
import { BookCover } from "@/features/books/BookCover";
import { useApi } from "@/hooks/useApi";
import { getArchive } from "@/services/api/archive";
import { colors, spacing, typography } from "@/theme";

type Filter = "all" | "finished" | "stopped";

export default function ArchiveList() {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("all");
  const archive = useApi(getArchive, []);

  const entries = archive.data ?? [];
  const count = (status: Filter) => (status === "all" ? entries.length : entries.filter((e) => e.status === status).length);
  const visible = filter === "all" ? entries : entries.filter((entry) => entry.status === filter);

  return (
    <Screen edges={["bottom"]}>
      <Text style={styles.title}>아카이브</Text>

      <SegmentedTabs
        value={filter}
        onChange={setFilter}
        options={[
          { value: "all", label: `전체 ${count("all")}` },
          { value: "finished", label: `완독 ${count("finished")}` },
          { value: "stopped", label: `중단 ${count("stopped")}` },
        ]}
      />

      {archive.loading && !archive.data ? (
        <StateView loading />
      ) : archive.error ? (
        <StateView errorMessage={archive.error.message} onRetry={archive.reload} />
      ) : visible.length === 0 ? (
        <StateView emptyMessage="아직 기록이 없어요. 독서방을 끝까지 함께하면 여기에 남아요." />
      ) : (
        <View>
          {visible.map(({ room, book, status, memoCount }) => (
            <Pressable
              key={room.id}
              accessibilityRole="button"
              onPress={() => router.push({ pathname: "/archive/[roomId]", params: { roomId: room.id } })}
              style={({ pressed }) => [styles.row, pressed && styles.pressed]}
            >
              <BookCover book={book} size="small" />
              <View style={styles.info}>
                <Text style={styles.bookTitle} numberOfLines={1}>
                  {book.title}
                </Text>
                <Text style={styles.meta} numberOfLines={1}>
                  {book.author} · 메모 {memoCount}개
                </Text>
              </View>
              <ArchiveStatusPill status={status} />
              <Icon name="chevron-forward" size={18} color={colors.textSecondary} />
            </Pressable>
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    ...typography.uiHeadlineBold,
    color: colors.textPrimary,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  pressed: {
    opacity: 0.7,
  },
  info: {
    flex: 1,
    gap: spacing.xs,
  },
  bookTitle: {
    ...typography.uiHeadlineBold,
    fontSize: 14,
    color: colors.textPrimary,
  },
  meta: {
    ...typography.uiSmallRegular,
    color: colors.textSecondary,
  },
});
