// S-11 독서방 상세 / 참여: 소개·참여자 수·규칙 미리보기 후 참여 (S-11-1)
// ⚠️ 피그마에 이 화면 시안이 없어서, 독서방 목록 카드(지붕 카드)와 책 정보 화면 스타일을 따라 만들었습니다.
// ⚠️ 참여 후 들어가는 "독서방 홈(S-13)"은 FE2 담당이라, 지금은 참여 완료 안내까지만 처리합니다.
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Screen } from "@/components/layout/Screen";
import { StateView } from "@/components/layout/StateView";
import { Button } from "@/components/ui";
import { Icon } from "@/components/ui/Icon";
import { useAuth } from "@/features/auth/AuthContext";
import { BookCover } from "@/features/books/BookCover";
import { deadlineText, periodText } from "@/features/rooms/format";
import { MemberAvatars } from "@/features/rooms/MemberAvatars";
import { RoofCard } from "@/features/rooms/RoofCard";
import { useApi } from "@/hooks/useApi";
import { getRoomDetail, joinRoom } from "@/services/api/rooms";
import { colors, radius, spacing, typography } from "@/theme";
import type { JoinState } from "@/types/models";
import { notify } from "@/utils/notify";

const joinButtonLabel: Record<JoinState, string> = {
  joinable: "참여하기",
  private: "비밀번호 입력하고 참여하기",
  full: "대기열에 등록하기",
  joined: "참여 중인 방이에요",
};

export default function RoomDetail() {
  const router = useRouter();
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const { user } = useAuth();
  const [joining, setJoining] = useState(false);

  const detail = useApi(() => getRoomDetail(roomId), [roomId]);

  if (detail.loading && !detail.data) {
    return (
      <Screen edges={["bottom"]}>
        <StateView loading />
      </Screen>
    );
  }
  if (detail.error || !detail.data) {
    return (
      <Screen edges={["bottom"]}>
        <StateView errorMessage={detail.error?.message ?? "독서방을 불러오지 못했어요."} onRetry={detail.reload} />
      </Screen>
    );
  }

  const { room, book, joinState } = detail.data;
  const isFull = joinState === "full";

  const handleJoin = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (joinState === "private") {
      notify("비공개 독서방", "비밀번호 입력 화면(S-12)은 준비 중이에요.");
      return;
    }
    if (joinState === "full") {
      notify("정원이 가득 찼어요", "대기열 등록 화면(S-34)은 준비 중이에요.");
      return;
    }
    setJoining(true);
    const res = await joinRoom(room.id);
    setJoining(false);
    if (!res.success) {
      notify("참여하지 못했어요", res.error?.message);
      detail.reload();
      return;
    }
    notify("독서방에 참여했어요!", "독서방 홈 화면은 FE2 작업이 합쳐지면 연결돼요.");
    detail.reload();
  };

  return (
    <Screen
      edges={["bottom"]}
      footer={
        <Button size="large" loading={joining} disabled={joinState === "joined"} onPress={handleJoin}>
          {user ? joinButtonLabel[joinState] : "로그인하고 참여하기"}
        </Button>
      }
    >
      <Text style={styles.caption}>
        {book.title} · {room.visibility === "public" ? "공개" : "비공개"} 독서방
      </Text>

      <RoofCard>
        <Text style={styles.name}>{room.name}</Text>
        <Text style={styles.meta}>
          방장 {room.ownerNickname} · {room.memberCount}/{room.capacity}명
        </Text>
        <Text style={styles.intro}>{room.intro}</Text>
        <View style={styles.cardBottom}>
          <MemberAvatars count={room.memberCount} />
          {isFull ? (
            <Text style={styles.meta}>정원마감{room.waitingCount > 0 ? ` · 대기 ${room.waitingCount}명` : ""}</Text>
          ) : (
            <Text style={styles.deadline}>{deadlineText(room.endDate)}</Text>
          )}
        </View>
      </RoofCard>

      <Pressable
        accessibilityRole="button"
        onPress={() => router.push({ pathname: "/books/[bookId]", params: { bookId: book.id } })}
        style={({ pressed }) => [styles.bookRow, pressed && styles.pressed]}
      >
        <BookCover book={book} size="small" />
        <View style={styles.bookInfo}>
          <Text style={styles.bookTitle} numberOfLines={1}>
            {book.title}
          </Text>
          <Text style={styles.meta}>
            {book.author} · {book.totalChapters}장
          </Text>
        </View>
        <Icon name="chevron-forward" size={18} color={colors.textSecondary} />
      </Pressable>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>기간</Text>
        <Text style={styles.body}>{periodText(room)}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>규칙</Text>
        {room.rules.map((rule, index) => (
          <Text key={rule} style={styles.body}>
            {index + 1}. {rule}
          </Text>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  caption: {
    ...typography.uiBaseSemiBold,
    color: colors.textPrimary,
  },
  name: {
    ...typography.uiTitleBold,
    fontSize: 20,
    color: colors.textPrimary,
  },
  meta: {
    ...typography.uiSmallRegular,
    color: colors.textSecondary,
  },
  intro: {
    ...typography.uiBaseRegular,
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },
  cardBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.md,
  },
  deadline: {
    ...typography.uiSmallSemiBold,
    color: colors.textPrimary,
  },
  bookRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
  },
  pressed: {
    opacity: 0.7,
  },
  bookInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  bookTitle: {
    ...typography.uiBaseSemiBold,
    color: colors.textPrimary,
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.uiHeadlineBold,
    fontSize: 15,
    color: colors.textPrimary,
  },
  body: {
    ...typography.uiBaseRegular,
    color: colors.textPrimary,
  },
});
