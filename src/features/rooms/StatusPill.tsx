// 독서 상태 표시 (● 읽는 중 / 쉬는 중 / 완독)
import { StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing, typography } from "@/theme";
import type { ReadingStatus } from "@/types/models";

import { statusLabel } from "./format";

export function StatusPill({ status }: { status: ReadingStatus }) {
  const active = status === "reading";
  return (
    <View style={[styles.pill, active ? styles.pillActive : styles.pillIdle]}>
      <View style={[styles.dot, { backgroundColor: active ? colors.success : colors.textDisabled }]} />
      <Text style={[styles.label, { color: active ? colors.success : colors.textSecondary }]}>{statusLabel[status]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radius.full,
  },
  pillActive: {
    backgroundColor: colors.successBackground,
  },
  pillIdle: {
    backgroundColor: colors.surface,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: radius.full,
  },
  label: {
    ...typography.uiSmallSemiBold,
  },
});
