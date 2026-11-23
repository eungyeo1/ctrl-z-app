// 오두막 책방 로고 (피그마에서 내보낸 지붕 마크 + 글자 이미지)
// small: 탭 화면 상단 (마크 + 글자 가로 배치) / large: 온보딩 (마크 위, 글자 아래)
import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

import { spacing } from "@/theme";

const mark = require("@/assets/images/logo-mark.png");
const wordmark = require("@/assets/images/logo-wordmark.png");

// 원본 이미지 비율 (가로 / 세로)
const MARK_RATIO = 172 / 108;
const WORDMARK_RATIO = 622 / 129;

const sizes = {
  small: { markHeight: 14, wordHeight: 13 },
  large: { markHeight: 52, wordHeight: 30 },
} as const;

export function Logo({ size = "small" }: { size?: keyof typeof sizes }) {
  const { markHeight, wordHeight } = sizes[size];
  return (
    <View
      style={[styles.row, size === "large" && styles.column]}
      accessible
      accessibilityRole="image"
      accessibilityLabel="오두막 책방"
    >
      <Image source={mark} style={{ height: markHeight, width: markHeight * MARK_RATIO }} contentFit="contain" />
      <Image source={wordmark} style={{ height: wordHeight, width: wordHeight * WORDMARK_RATIO }} contentFit="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  column: {
    flexDirection: "column",
    gap: spacing.lg,
  },
});
