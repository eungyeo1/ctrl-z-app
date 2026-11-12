import type { ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";

import { colors, radius, spacing, typography } from "@/theme";

// 버튼 종류와 크기에서 허용하는 값입니다.
export type ButtonVariant = "primary" | "secondary" | "tertiary";
export type ButtonSize = "small" | "medium" | "large";

// Pressable의 기본 이벤트 props에 디자인 옵션을 더합니다.
export interface ButtonProps extends Omit<PressableProps, "children" | "style"> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

// 버튼 종류별 글자 색을 연결합니다.
const textColorByVariant: Record<ButtonVariant, string> = {
  primary: colors.onPrimary,
  secondary: colors.primary,
  tertiary: colors.primary,
};

export function Button({
  children,
  variant = "primary",
  size = "medium",
  loading = false,
  disabled = false,
  style,
  textStyle,
  accessibilityRole = "button",
  ...pressableProps
}: ButtonProps) {
  // 로딩 중에는 중복 입력을 막기 위해 버튼도 비활성화합니다.
  const isDisabled = disabled || loading;
  const contentColor = isDisabled
    ? colors.textDisabled
    : textColorByVariant[variant];

  return (
    <Pressable
      {...pressableProps}
      accessibilityRole={accessibilityRole}
      accessibilityState={{
        ...pressableProps.accessibilityState,
        disabled: isDisabled,
        busy: loading,
      }}
      disabled={isDisabled}
      // 크기·종류·상태 스타일을 조합하고, 마지막에 화면별 스타일을 적용합니다.
      style={({ pressed }) => [
        styles.base,
        styles[`size_${size}`],
        styles[`variant_${variant}`],
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
        style,
      ]}
    >
      {/* 로딩이면 스피너, 문자열이면 테마 텍스트, 그 외에는 전달된 요소를 표시합니다. */}
      {loading ? (
        <ActivityIndicator color={contentColor} size="small" />
      ) : typeof children === "string" ? (
        <Text style={[styles.label, { color: contentColor }, textStyle]}>
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

// 컴포넌트 기본 모양과 variant/size별 디자인 토큰을 정의합니다.
const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: radius.full,
    flexDirection: "row",
  },
  size_small: {
    minHeight: 36,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  size_medium: {
    minHeight: 44,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  size_large: {
    minHeight: 52,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  variant_primary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  variant_secondary: {
    backgroundColor: colors.surface,
    borderColor: colors.primary,
  },
  variant_tertiary: {
    backgroundColor: "transparent",
    borderColor: "transparent",
  },
  disabled: {
    backgroundColor: colors.disabled,
    borderColor: colors.disabled,
  },
  pressed: {
    opacity: 0.82,
  },
  label: {
    ...typography.uiBaseSemiBold,
    color: colors.onPrimary,
    textAlign: "center",
  },
});
