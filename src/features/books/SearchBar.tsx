// 검색창 (피그마 홈·검색 화면의 둥근 검색바)
// editable={false} + onPress 로 쓰면 홈처럼 "누르면 검색 탭으로 이동"하는 가짜 검색바가 됩니다.
import { Pressable, StyleSheet, TextInput, View, type TextInputProps } from "react-native";

import { Icon } from "@/components/ui/Icon";
import { colors, radius, spacing, typography } from "@/theme";

interface SearchBarProps extends TextInputProps {
  onPress?: () => void;
}

export function SearchBar({ onPress, editable = true, ...inputProps }: SearchBarProps) {
  const content = (
    <View style={styles.bar}>
      <Icon name="search-outline" size={18} color={colors.textSecondary} />
      <TextInput
        {...inputProps}
        editable={editable}
        pointerEvents={editable ? "auto" : "none"}
        placeholderTextColor={colors.textDisabled}
        selectionColor={colors.primary}
        style={styles.input}
      />
    </View>
  );
  if (!onPress) return content;
  return (
    <Pressable accessibilityRole="search" onPress={onPress}>
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    minHeight: 44,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.full,
    backgroundColor: colors.textBackground,
    elevation: 2,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: radius.sm,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.sm,
    color: colors.textPrimary,
    ...typography.uiBaseRegular,
  },
});
