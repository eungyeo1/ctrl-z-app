// S-08 해당 책 독서방 목록 (피그마 "독서방 홈": "{책 제목} · 독서방" + 전체/공개/비공개 탭)
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Screen } from "@/components/layout/Screen";
import { StateView } from "@/components/layout/StateView";
import { RoomListItem } from "@/features/rooms/RoomListItem";
import { useApi } from "@/hooks/useApi";
import { getBook } from "@/services/api/books";
import { getRoomsByBook } from "@/services/api/rooms";
import { colors, radius, spacing, typography } from "@/theme";
import type { Room, RoomVisibility } from "@/types/models";

type Filter = "all" | RoomVisibility;

const filterLabels: Record<Filter, string> = {
  all: "전체",
  public: "공개",
  private: "비공개",
};

const matches = (filter: Filter) => (room: Room) => filter === "all" || room.visibility === filter;

export default function BookRooms() {
  const router = useRouter();
  const { bookId } = useLocalSearchParams<{ bookId: string }>();
  const [filter, setFilter] = useState<Filter>("all");

  const book = useApi(() => getBook(bookId), [bookId]);
  const rooms = useApi(() => getRoomsByBook(bookId), [bookId]);

  // 방에 참여하고 돌아오면 인원 수가 바뀌므로 다시 불러옵니다.
  const { reload } = rooms;
  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  const allRooms = rooms.data ?? [];
  const visibleRooms = allRooms.filter(matches(filter));

  return (
    <Screen edges={["bottom"]}>
      <Text style={styles.title}>{book.data ? `${book.data.title} · 독서방` : " "}</Text>

      {/* 세그먼트 탭: FE2 브랜치의 SegmentedControl 이 합쳐지면 그걸로 교체 */}
      <View style={styles.segment} accessibilityRole="tablist">
        {(Object.keys(filterLabels) as Filter[]).map((key) => {
          const selected = key === filter;
          const count = key === "all" ? ` ${allRooms.length}` : "";
          return (
            <Pressable
              key={key}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              onPress={() => setFilter(key)}
              style={[styles.segmentItem, selected && styles.segmentItemSelected]}
            >
              <Text style={[styles.segmentText, selected && styles.segmentTextSelected]}>
                {filterLabels[key]}
                {count}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {rooms.loading && !rooms.data ? (
        <StateView loading />
      ) : rooms.error ? (
        <StateView errorMessage={rooms.error.message} onRetry={rooms.reload} />
      ) : visibleRooms.length === 0 ? (
        <StateView emptyMessage="조건에 맞는 독서방이 없어요." />
      ) : (
        <View style={styles.list}>
          {visibleRooms.map((room) => (
            <RoomListItem
              key={room.id}
              room={room}
              onPress={() => router.push({ pathname: "/rooms/[roomId]", params: { roomId: room.id } })}
            />
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    ...typography.uiBaseSemiBold,
    color: colors.textPrimary,
  },
  segment: {
    flexDirection: "row",
    padding: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: colors.textBackground,
  },
  segmentItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
  },
  segmentItemSelected: {
    backgroundColor: colors.primary,
  },
  segmentText: {
    ...typography.uiSmallSemiBold,
    color: colors.textSecondary,
  },
  segmentTextSelected: {
    color: colors.onPrimary,
  },
  list: {
    gap: spacing.xl,
  },
});
