// S-07 책 상세 (피그마 "책 정보")
// 표지 + 제목·저자·출판사·연도·장르 + "독서방 N개 진행 중", 책 소개, 이 책의 독서방(둘러보기 / 새로 만들기)
import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { Screen } from "@/components/layout/Screen";
import { StateView } from "@/components/layout/StateView";
import { Button } from "@/components/ui";
import { BookCover } from "@/features/books/BookCover";
import { useApi } from "@/hooks/useApi";
import { getBook } from "@/services/api/books";
import { getRoomsByBook } from "@/services/api/rooms";
import { colors, radius, spacing, typography } from "@/theme";
import { notify } from "@/utils/notify";

export default function BookDetail() {
  const router = useRouter();
  const { bookId } = useLocalSearchParams<{ bookId: string }>();

  const book = useApi(() => getBook(bookId), [bookId]);
  const rooms = useApi(() => getRoomsByBook(bookId), [bookId]);

  if (book.loading || book.error || !book.data) {
    return (
      <Screen edges={["bottom"]}>
        <StateView loading={book.loading} errorMessage={book.error?.message} onRetry={book.reload} />
      </Screen>
    );
  }

  const data = book.data;
  const roomCount = rooms.data?.length ?? 0;

  return (
    <Screen edges={["bottom"]}>
      <View style={styles.hero}>
        <BookCover book={data} size="large" />
        <View style={styles.heroInfo}>
          <Text style={styles.title}>{data.title}</Text>
          <View>
            <Text style={styles.meta}>{data.author} 저자</Text>
            <Text style={styles.meta}>{data.publisher} 출판</Text>
            <Text style={styles.meta}>{data.publishedYear}</Text>
            <Text style={styles.meta}>{data.genre}</Text>
          </View>
          {!rooms.loading ? (
            <View style={styles.chip}>
              <Text style={styles.chipText}>
                {roomCount > 0 ? `독서방 ${roomCount}개 진행 중` : "진행 중인 독서방 없음"}
              </Text>
            </View>
          ) : null}
        </View>
      </View>

      <Text style={styles.description}>{data.description}</Text>

      <View style={styles.divider} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>이 책의 독서방</Text>
        <Button
          size="large"
          onPress={() => router.push({ pathname: "/books/[bookId]/rooms", params: { bookId } })}
        >
          독서방 둘러보기
        </Button>
        {/* TODO: S-10 독서방 생성(FE2) 화면과 연결 */}
        <Button
          variant="secondary"
          size="large"
          onPress={() => notify("새 독서방 만들기", "독서방 생성 화면(S-10)은 FE2 작업이 합쳐지면 연결돼요.")}
        >
          + 새 독서방 만들기
        </Button>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    flexDirection: "row",
    gap: spacing.lg,
  },
  heroInfo: {
    flex: 1,
    gap: spacing.md,
  },
  title: {
    ...typography.uiTitleBold,
    color: colors.textPrimary,
  },
  meta: {
    ...typography.uiSmallRegular,
    color: colors.textSecondary,
  },
  chip: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: colors.textBackground,
  },
  chipText: {
    ...typography.uiSmallSemiBold,
    color: colors.textSecondary,
  },
  description: {
    ...typography.uiBaseRegular,
    color: colors.textPrimary,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
  section: {
    gap: spacing.md,
  },
  sectionTitle: {
    ...typography.uiHeadlineBold,
    fontSize: 15,
    color: colors.textPrimary,
  },
});
