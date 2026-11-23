// 체크박스 한 줄 (피그마 "약관 동의": 둥근 네모 + 라벨 + 필수/선택 표시)
import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing, typography } from "@/theme";

import { Icon } from "./Icon";

interface CheckboxProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  tag?: string; // "필수" / "선택"
  description?: string;
  right?: ReactNode;
}

export function Checkbox({ checked, onChange, label, tag, description, right }: CheckboxProps) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      onPress={() => onChange(!checked)}
      style={styles.row}
    >
      <View style={[styles.box, checked && styles.boxChecked]}>
        {checked ? <Icon name="checkmark" size={16} color={colors.onPrimary} /> : null}
      </View>
      <View style={styles.text}>
        <Text style={styles.label}>
          {label}
          {tag ? <Text style={styles.tag}>  {tag}</Text> : null}
        </Text>
        {description ? <Text style={styles.description}>{description}</Text> : null}
      </View>
      {right}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  box: {
    width: 24,
    height: 24,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.border,
  },
  boxChecked: {
    backgroundColor: colors.primary,
  },
  text: {
    flex: 1,
    gap: spacing.xxs,
  },
  label: {
    ...typography.uiBaseSemiBold,
    color: colors.textPrimary,
  },
  tag: {
    ...typography.uiSmallRegular,
    color: colors.textSecondary,
  },
  description: {
    ...typography.uiSmallRegular,
    color: colors.textSecondary,
  },
});
