// S-04 홈 (피그마 "홈 1", "홈 2")
// - S-04-1 참여 중인 독서방 (지붕 카드)
// - S-04-2 {닉네임} 님을 위한 추천 (책 표지 가로 스크롤) + 모집 중인 독서방
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { AppHeader } from "@/components/layout/AppHeader";
import { Screen } from "@/components/layout/Screen";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { StateView } from "@/components/layout/StateView";
import { Button } from "@/components/ui";
import { useAuth } from "@/features/auth/AuthContext";
import { BookCover } from "@/features/books/BookCover";
import { SearchBar } from "@/features/books/SearchBar";
import { MyRoomCard } from "@/features/rooms/MyRoomCard";
import { RoomListItem } from "@/features/rooms/RoomListItem";
import { roomHomeHref, roomPreviewHref } from "@/features/rooms/routes";
import { useApi } from "@/hooks/useApi";
import { getRecommendedBooks } from "@/services/api/books";
import { getMyRooms, getRecommendedRooms } from "@/services/api/rooms";
import { colors, spacing, typography } from "@/theme";

// 홈에서는 참여 중인 방을 2개까지만 보여주고 나머지는 "전체보기"로 봅니다.
const MY_ROOM_PREVIEW = 2;

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const [showAllRooms, setShowAllRooms] = useState(false);

  const myRooms = useApi(getMyRooms, []);
  const books = useApi(getRecommendedBooks, []);
  const rooms = useApi(getRecommendedRooms, []);

  // 다른 화면에서 방에 참여하고 돌아오면 목록을 새로 불러옵니다.
  const { reload: reloadMyRooms } = myRooms;
  const { reload: reloadRooms } = rooms;
  useFocusEffect(
    useCallback(() => {
      reloadMyRooms();
      reloadRooms();
    }, [reloadMyRooms, reloadRooms]),
  );

  const nickname = user?.nickname;

  return (
    <Screen>
      <AppHeader />

      <View style={styles.greeting}>
        <Text style={styles.greetingSmall}>{nickname ? `${nickname} 님, 오늘도 한 페이지` : "오늘도 한 페이지"}</Text>
        <Text style={styles.greetingLarge}>{nickname ? "읽던 곳으로 돌아가볼까요?" : "함께 읽을 책을 찾아볼까요?"}</Text>
      </View>

      <SearchBar
        editable={false}
        placeholder="책 제목, 저자로 검색"
        onPress={() => router.push("/search")}
      />

      {/* S-04-1 참여 중인 독서방 */}
      <View style={styles.section}>
        <SectionHeader
          title="참여 중인 독서방"
          actionLabel={
            user && (myRooms.data?.length ?? 0) > MY_ROOM_PREVIEW ? (showAllRooms ? "접기" : "전체보기") : undefined
          }
          onActionPress={() => setShowAllRooms((prev) => !prev)}
        />
        {!user ? (
          <StateView
            emptyMessage="로그인하면 참여 중인 독서방을 볼 수 있어요."
            action={
              <Button size="small" onPress={() => router.push("/login")}>
                로그인하기
              </Button>
            }
          />
        ) : myRooms.loading && !myRooms.data ? (
          <StateView loading />
        ) : myRooms.error ? (
          <StateView errorMessage={myRooms.error.message} onRetry={myRooms.reload} />
        ) : myRooms.data?.length ? (
          myRooms.data
            .slice(0, showAllRooms ? undefined : MY_ROOM_PREVIEW)
            .map((item) => <MyRoomCard key={item.room.id} item={item} onPress={() => router.push(roomHomeHref(item.room.id))} />)
        ) : (
          <StateView emptyMessage="아직 참여 중인 독서방이 없어요." />
        )}
      </View>

      {/* S-04-2 추천 책 */}
      <View style={styles.section}>
        <SectionHeader title={nickname ? `${nickname} 님을 위한 추천` : "이런 책은 어때요?"} />
        {books.loading ? (
          <StateView loading />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.bookRow}>
            {books.data?.map((book) => (
              <Pressable
                key={book.id}
                accessibilityRole="button"
                accessibilityLabel={`${book.title}, ${book.author}`}
                style={styles.bookItem}
                onPress={() => router.push({ pathname: "/books/[bookId]", params: { bookId: book.id } })}
              >
                <BookCover book={book} />
                <Text style={styles.bookTitle} numberOfLines={1}>
                  {book.title}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        )}
      </View>

      {/* S-04-2 추천 독서방 (피그마에는 없음 — 기획 확인 후 유지/삭제) */}
      <View style={styles.section}>
        <SectionHeader title="지금 모집 중인 독서방" />
        {rooms.loading && !rooms.data ? (
          <StateView loading />
        ) : rooms.data?.length ? (
          rooms.data.map(({ room, book }) => (
            <RoomListItem key={room.id} room={room} book={book} onPress={() => router.push(roomPreviewHref(room.id))} />
          ))
        ) : (
          <StateView emptyMessage="모집 중인 독서방이 없어요." />
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  greeting: {
    gap: spacing.xxs,
  },
  greetingSmall: {
    ...typography.uiSmallRegular,
    color: colors.textSecondary,
  },
  greetingLarge: {
    ...typography.uiTitleBold,
    color: colors.textPrimary,
  },
  section: {
    gap: spacing.lg,
  },
  bookRow: {
    gap: spacing.md,
  },
  bookItem: {
    width: 96,
    gap: spacing.xs,
  },
  bookTitle: {
    ...typography.uiSmallSemiBold,
    color: colors.textPrimary,
  },
});
