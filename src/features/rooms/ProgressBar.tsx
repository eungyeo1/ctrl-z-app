// 독서 진행률 막대 (0~100)
import { StyleSheet, View } from "react-native";

import { colors, radius } from "@/theme";

export function ProgressBar({ value }: { value: number }) {
  const percent = Math.min(100, Math.max(0, value));
  return (
    <View
      style={styles.track}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: percent }}
    >
      <View style={[styles.fill, { width: `${percent}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 6,
    borderRadius: radius.full,
    backgroundColor: colors.divider,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: radius.full,
    backgroundColor: colors.primary,
  },
});
