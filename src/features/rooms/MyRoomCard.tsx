// 참여 중인 독서방 카드 (피그마 "홈 1" 참여 중인 독서방)
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, spacing, typography } from "@/theme";
import type { MyRoom } from "@/types/models";

import { MemberAvatars } from "./MemberAvatars";
import { ProgressBar } from "./ProgressBar";
import { RoofCard } from "./RoofCard";
import { StatusPill } from "./StatusPill";

export function MyRoomCard({ item, onPress }: { item: MyRoom; onPress: () => void }) {
  const { room, book, status, progress, currentChapter, currentPage, newMemoCount } = item;
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => pressed && styles.pressed}>
      <RoofCard>
        <Text style={styles.name} numberOfLines={1}>
          {room.name}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {book.title} · {book.author}
        </Text>
        <View style={styles.progress}>
          <ProgressBar value={progress} />
        </View>
        <Text style={styles.meta} numberOfLines={1}>
          {currentChapter} · {currentPage}p · {progress}%
        </Text>
        <View style={styles.bottom}>
          <View style={styles.memo}>
            <MemberAvatars count={room.memberCount} />
            <Text style={styles.meta}>{newMemoCount > 0 ? `새 메모 ${newMemoCount}개` : "새 메모 없음"}</Text>
          </View>
          <StatusPill status={status} />
        </View>
      </RoofCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.85,
  },
  name: {
    ...typography.uiHeadlineBold,
    color: colors.textPrimary,
  },
  meta: {
    ...typography.uiSmallRegular,
    color: colors.textSecondary,
  },
  progress: {
    marginTop: spacing.sm,
    marginBottom: spacing.xxs,
  },
  bottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.md,
  },
  memo: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
});
