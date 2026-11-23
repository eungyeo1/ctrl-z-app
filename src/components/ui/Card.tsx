import type { ReactNode } from "react";
import {
  StyleSheet,
  View,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from "react-native";

import { colors, radius, spacing } from "@/theme";

// 카드의 배경과 테두리 표현 방식입니다.
export type CardVariant = "default" | "tinted";

// View의 기본 props에 카드 스타일과 내부 여백 옵션을 더합니다.
export interface CardProps extends Omit<ViewProps, "children" | "style"> {
  children: ReactNode;
  variant?: CardVariant;
  padded?: boolean;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}

export function Card({
  children,
  variant = "default",
  padded = true,
  style,
  contentStyle,
  ...viewProps
}: CardProps) {
  return (
    <View
      {...viewProps}
      // 기본 모양, 선택한 variant, 화면별 스타일 순서로 합칩니다.
      style={[styles.base, styles[`variant_${variant}`], style]}
    >
      {/* padded가 true일 때 기본 안쪽 여백을 주고, contentStyle로 조정할 수 있습니다. */}
      <View style={[padded && styles.content, contentStyle]}>{children}</View>
    </View>
  );
}

// 색상·모서리·여백은 테마 토큰을 사용하고, 기본 카드에는 가벼운 그림자를 줍니다.
const styles = StyleSheet.create({
  base: {
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
  },
  variant_default: {
    elevation: 4,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },

    shadowOpacity: 0.3,
    shadowRadius: radius.sm,
  },
  variant_tinted: {
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
  },
});
