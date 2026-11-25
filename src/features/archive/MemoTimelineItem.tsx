// 아카이브 메모 타임라인 한 칸 (S-29-1)
// TODO: 지현님 브랜치의 MemoCard 가 develop 에 합쳐지면 카드 부분을 MemoCard 로 교체
//       (다른 사람 메모까지 보여주게 되면 SpoilerMemoCard + '그래도 보기' 잠금 해제 연결)
import { StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing, typography } from "@/theme";
import type { Memo } from "@/types/models";
import { clock, monthDay } from "@/utils/date";

interface MemoTimelineItemProps {
  memo: Memo;
  showDate: boolean; // 같은 날 메모가 이어지면 날짜는 처음에만
  isLast: boolean;
}

export function MemoTimelineItem({ memo, showDate, isLast }: MemoTimelineItemProps) {
  return (
    <View style={styles.row}>
      {/* 왼쪽 세로줄 + 점 */}
      <View style={styles.rail}>
        <View style={styles.dot} />
        {!isLast ? <View style={styles.line} /> : null}
      </View>

      <View style={styles.content}>
        {showDate ? <Text style={styles.date}>{monthDay(memo.createdAt)}</Text> : null}
        <View style={styles.card}>
          <Text style={styles.meta}>
            {memo.chapter} · {memo.page}p · {clock(memo.createdAt)}
          </Text>
          {memo.quote ? (
            <View style={styles.quote}>
              <Text style={styles.quoteText}>{memo.quote}</Text>
            </View>
          ) : null}
          <Text style={styles.body}>{memo.body}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: spacing.md,
  },
  rail: {
    width: 12,
    alignItems: "center",
  },
  dot: {
    width: 10,
    height: 10,
    marginTop: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
  },
  line: {
    flex: 1,
    width: 2,
    marginTop: spacing.xs,
    backgroundColor: colors.divider,
  },
  content: {
    flex: 1,
    gap: spacing.sm,
    paddingBottom: spacing.xl,
  },
  date: {
    ...typography.uiSmallSemiBold,
    color: colors.textSecondary,
  },
  card: {
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: radius.xl,
    backgroundColor: colors.textBackground,
  },
  meta: {
    ...typography.uiSmallRegular,
    color: colors.textSecondary,
  },
  quote: {
    paddingLeft: spacing.md,
    borderLeftWidth: 2,
    borderLeftColor: colors.primary,
  },
  quoteText: {
    ...typography.smallRegular,
    color: colors.textPrimary,
  },
  body: {
    ...typography.uiBaseRegular,
    color: colors.textPrimary,
  },
});
