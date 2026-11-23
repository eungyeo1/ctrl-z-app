import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { colors, spacing, typography } from "@/theme";

export interface TabButtonProps extends Omit<PressableProps, "children" | "style"> {
  /** 탭에 표시할 이름 */
  title: string;
  /** 선택된 탭이면 밑줄과 강조 글자를 표시합니다. */
  selected: boolean;
  /** 탭 컨테이너에 추가할 스타일 */
  style?: StyleProp<ViewStyle>;
}

/** 방 화면의 탭 하나를 표시하는 버튼입니다. */
export function TabButton({
  title,
  selected,
  disabled = false,
  accessibilityRole = "tab",
  accessibilityState,
  style,
  ...pressableProps
}: TabButtonProps) {
  return (
    <Pressable
      {...pressableProps}
      accessibilityRole={accessibilityRole}
      accessibilityState={{
        ...accessibilityState,
        selected,
        disabled,
      }}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      <Text style={[styles.label, selected && styles.selectedLabel]}>{title}</Text>
      {selected ? <View style={styles.underline} /> : <View style={styles.underlinePlaceholder} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    minHeight: 40,
    alignItems: "center",
    justifyContent: "flex-end",
    gap: spacing.sm,
  },
  label: {
    ...typography.uiSmallRegular,
    color: colors.textPrimary,
  },
  selectedLabel: {
    ...typography.uiSmallSemiBold,
    color: colors.primary,
  },
  underline: {
    width: 48,
    height: 3,
    borderRadius: 9999,
    backgroundColor: colors.primary,
  },
  // 선택 여부가 바뀌어도 탭 행의 높이가 흔들리지 않도록 자리를 유지합니다.
  underlinePlaceholder: {
    width: 48,
    height: 3,
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.75,
  },
});
