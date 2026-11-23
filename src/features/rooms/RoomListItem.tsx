// 독서방 목록 카드 (피그마 "독서방 홈" = 책별 독서방 목록, 정원마감 카드 포함)
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing, typography } from "@/theme";
import type { Book, Room } from "@/types/models";

import { deadlineText } from "./format";
import { MemberAvatars } from "./MemberAvatars";
import { RoofCard } from "./RoofCard";

interface RoomListItemProps {
  room: Room;
  // 홈 추천처럼 여러 책의 방이 섞여 있을 때만 책 제목을 함께 보여줍니다.
  book?: Book;
  onPress: () => void;
}

export function RoomListItem({ room, book, onPress }: RoomListItemProps) {
  const isFull = room.memberCount >= room.capacity;
  const visibility = room.visibility === "public" ? "공개" : "비공개";

  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => pressed && styles.pressed}>
      <RoofCard>
        <Text style={styles.name} numberOfLines={1}>
          {room.name}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {book ? `${book.title} · ` : ""}
          {visibility} · {room.memberCount}/{room.capacity}명
        </Text>
        <Text style={styles.intro} numberOfLines={2}>
          {room.intro}
        </Text>
        <View style={styles.bottom}>
          <MemberAvatars count={room.memberCount} />
          {isFull ? (
            <View style={styles.fullRow}>
              <View style={styles.fullPill}>
                <Text style={styles.fullText}>정원마감</Text>
              </View>
              {room.waitingCount > 0 ? <Text style={styles.meta}>대기 {room.waitingCount}명</Text> : null}
            </View>
          ) : (
            <Text style={styles.dday}>{deadlineText(room.endDate)}</Text>
          )}
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
  intro: {
    ...typography.uiSmallRegular,
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },
  bottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.md,
  },
  dday: {
    ...typography.uiSmallSemiBold,
    color: colors.textPrimary,
  },
  fullRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  fullPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
  },
  fullText: {
    ...typography.uiSmallSemiBold,
    color: colors.onPrimary,
  },
});
