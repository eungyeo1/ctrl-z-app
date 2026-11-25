// 둥근 세그먼트 탭 (피그마 "독서방 목록" 전체/공개/비공개, "아카이브" 전체/완독/중단)
// TODO: FE2 브랜치의 SegmentedControl 이 합쳐지면 하나로 통일
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing, typography } from "@/theme";

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentedTabsProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

export function SegmentedTabs<T extends string>({ options, value, onChange }: SegmentedTabsProps<T>) {
  return (
    <View style={styles.segment} accessibilityRole="tablist">
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            onPress={() => onChange(option.value)}
            style={[styles.item, selected && styles.itemSelected]}
          >
            <Text style={[styles.text, selected && styles.textSelected]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  segment: {
    flexDirection: "row",
    padding: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: colors.textBackground,
  },
  item: {
    flex: 1,
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
  },
  itemSelected: {
    backgroundColor: colors.primary,
  },
  text: {
    ...typography.uiSmallSemiBold,
    color: colors.textSecondary,
  },
  textSelected: {
    color: colors.onPrimary,
  },
});
