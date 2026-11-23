// 독서방 상세에서 보여주는 대기 상태 카드
// - 대기 중: n번째 순서 + 대기 취소
// - S-34-2 우선참여권: 남은 시간 + 포기(→ S-34-3 다음 순번으로 이월)
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Icon } from "@/components/ui/Icon";
import { colors, radius, spacing, typography } from "@/theme";
import type { WaitlistEntry } from "@/types/models";

// TODO: 우선참여권 유지 시간은 기획 확인 필요 (목업 24시간)
export const PRIORITY_HOURS = 24;

const hoursLeft = (iso: string) => Math.max(0, Math.ceil((Date.parse(iso) - Date.now()) / (60 * 60 * 1000)));

interface WaitlistInfoProps {
  entry: WaitlistEntry;
  priority: boolean;
  onLeave: () => void;
}

export function WaitlistInfo({ entry, priority, onLeave }: WaitlistInfoProps) {
  return (
    <View style={[styles.box, priority && styles.boxPriority]}>
      <View style={styles.row}>
        <Icon
          name={priority ? "sparkles-outline" : "time-outline"}
          size={18}
          color={priority ? colors.success : colors.textSecondary}
        />
        <Text style={styles.title}>
          {priority ? `자리가 났어요! ${hoursLeft(entry.priorityUntil!)}시간 안에 참여해 주세요` : `대기 ${entry.position}번째`}
        </Text>
      </View>
      <Text style={styles.body}>
        {priority
          ? "시간 안에 참여하지 않으면 다음 순서로 넘어가요."
          : `자리가 나면 알림을 보내드려요. 알림 후 ${PRIORITY_HOURS}시간 안에 참여하지 않으면 다음 순서로 넘어가요.`}
      </Text>
      <Pressable accessibilityRole="button" onPress={onLeave} hitSlop={spacing.sm} style={styles.leave}>
        <Text style={styles.leaveText}>{priority ? "참여 포기하기" : "대기 취소하기"}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    gap: spacing.xs,
    padding: spacing.lg,
    borderRadius: radius.xl,
    backgroundColor: colors.textBackground,
  },
  boxPriority: {
    backgroundColor: colors.successBackground,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  title: {
    ...typography.uiBaseSemiBold,
    color: colors.textPrimary,
    flex: 1,
  },
  body: {
    ...typography.uiSmallRegular,
    color: colors.textSecondary,
  },
  leave: {
    alignSelf: "flex-start",
    marginTop: spacing.xs,
  },
  leaveText: {
    ...typography.uiSmallSemiBold,
    color: colors.textSecondary,
    textDecorationLine: "underline",
  },
});
