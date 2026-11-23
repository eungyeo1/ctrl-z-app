// 선택 칩 (피그마 "독서 취향": 선택되면 갈색 채움)
import { Pressable, StyleSheet, Text } from "react-native";

import { colors, radius, spacing, typography } from "@/theme";

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}

export function Chip({ label, selected = false, onPress }: ChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [styles.chip, selected && styles.selected, pressed && styles.pressed]}
    >
      <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.textBackground,
  },
  selected: {
    backgroundColor: colors.primary,
  },
  pressed: {
    opacity: 0.8,
  },
  label: {
    ...typography.uiBaseRegular,
    color: colors.textSecondary,
  },
  labelSelected: {
    ...typography.uiBaseSemiBold,
    color: colors.onPrimary,
  },
});
