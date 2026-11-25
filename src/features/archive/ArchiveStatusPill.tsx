// 아카이브 상태 표시 (피그마 "아카이브": ● 읽는 중 / ● 완독 / ● 중단)
import { StyleSheet, Text, View } from "react-native";

import { colors, palette, radius, spacing, typography } from "@/theme";
import type { ArchiveStatus } from "@/types/models";

export const archiveStatusLabel: Record<ArchiveStatus, string> = {
  reading: "읽는 중",
  finished: "완독",
  stopped: "중단",
};

const tones: Record<ArchiveStatus, { dot: string; text: string; background: string }> = {
  reading: { dot: colors.success, text: colors.success, background: colors.successBackground },
  finished: { dot: palette.avatarPink, text: colors.textPrimary, background: colors.surface },
  stopped: { dot: colors.textDisabled, text: colors.textSecondary, background: colors.disabled },
};

export function ArchiveStatusPill({ status }: { status: ArchiveStatus }) {
  const tone = tones[status];
  return (
    <View style={[styles.pill, { backgroundColor: tone.background }]}>
      <View style={[styles.dot, { backgroundColor: tone.dot }]} />
      <Text style={[styles.label, { color: tone.text }]}>{archiveStatusLabel[status]}</Text>
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
  dot: {
    width: 6,
    height: 6,
    borderRadius: radius.full,
  },
  label: {
    ...typography.uiSmallSemiBold,
  },
});
