// S-08 해당 책 독서방 목록 (피그마 "독서방 홈": "{책 제목} · 독서방" + 전체/공개/비공개 탭)
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Screen } from "@/components/layout/Screen";
import { StateView } from "@/components/layout/StateView";
import { SegmentedTabs } from "@/components/ui/SegmentedTabs";
import { RoomListItem } from "@/features/rooms/RoomListItem";
import { useApi } from "@/hooks/useApi";
import { getBook } from "@/services/api/books";
import { getRoomsByBook } from "@/services/api/rooms";
import { colors, spacing, typography } from "@/theme";
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

      <SegmentedTabs
        value={filter}
        onChange={setFilter}
        options={(Object.keys(filterLabels) as Filter[]).map((key) => ({
          value: key,
          label: key === "all" ? `${filterLabels[key]} ${allRooms.length}` : filterLabels[key],
        }))}
      />

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
  list: {
    gap: spacing.xl,
  },
});
