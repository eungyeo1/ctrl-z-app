// S-29 아카이브 상세 (피그마: 별도 시안 없음 — "우리의 교환독서 기록"은 S-54로 보여서 따로 둠)
// S-29-1 본인이 남긴 메모를 시간순 타임라인으로 / 오른쪽 위 내보내기 → S-50
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Screen } from "@/components/layout/Screen";
import { StateView } from "@/components/layout/StateView";
import { Button } from "@/components/ui";
import { Icon } from "@/components/ui/Icon";
import { ArchiveStatusPill } from "@/features/archive/ArchiveStatusPill";
import { ExportSheet } from "@/features/archive/ExportSheet";
import { MemoTimelineItem } from "@/features/archive/MemoTimelineItem";
import { BookCover } from "@/features/books/BookCover";
import { periodText } from "@/features/rooms/format";
import { useApi } from "@/hooks/useApi";
import { getArchiveDetail } from "@/services/api/archive";
import { colors, spacing, typography } from "@/theme";

export default function ArchiveDetail() {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const [exportOpen, setExportOpen] = useState(false);
  const detail = useApi(() => getArchiveDetail(roomId), [roomId]);

  if (detail.loading || detail.error || !detail.data) {
    return (
      <Screen edges={["bottom"]}>
        <StateView loading={detail.loading} errorMessage={detail.error?.message} onRetry={detail.reload} />
      </Screen>
    );
  }

  const { entry, memos } = detail.data;
  const { room, book, status } = entry;

  return (
    <Screen edges={["bottom"]}>
      <View style={styles.header}>
        <BookCover book={book} size="medium" />
        <View style={styles.headerInfo}>
          <ArchiveStatusPill status={status} />
          <Text style={styles.title}>{book.title}</Text>
          <Text style={styles.meta}>{book.author}</Text>
          <Text style={styles.meta}>
            {room.name} · {periodText(room)}
          </Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>내 메모 {memos.length}개</Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => setExportOpen(true)}
          hitSlop={spacing.sm}
          style={styles.exportLink}
        >
          <Icon name="share-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.exportText}>내보내기</Text>
        </Pressable>
      </View>

      {memos.length === 0 ? (
        <StateView emptyMessage="이 방에서 남긴 메모가 없어요." />
      ) : (
        <View>
          {memos.map((memo, index) => (
            <MemoTimelineItem
              key={memo.id}
              memo={memo}
              showDate={index === 0 || memos[index - 1].createdAt.slice(0, 10) !== memo.createdAt.slice(0, 10)}
              isLast={index === memos.length - 1}
            />
          ))}
        </View>
      )}

      <Button variant="secondary" size="large" onPress={() => setExportOpen(true)}>
        기록 내보내기
      </Button>

      <ExportSheet roomId={room.id} visible={exportOpen} onClose={() => setExportOpen(false)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    gap: spacing.lg,
  },
  headerInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    ...typography.uiTitleBold,
    color: colors.textPrimary,
  },
  meta: {
    ...typography.uiSmallRegular,
    color: colors.textSecondary,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    ...typography.uiHeadlineBold,
    fontSize: 15,
    color: colors.textPrimary,
  },
  exportLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  exportText: {
    ...typography.uiSmallSemiBold,
    color: colors.textSecondary,
  },
});
