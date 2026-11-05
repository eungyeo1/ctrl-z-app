import { Text, View, StyleSheet } from "react-native";

import { colors, spacing, typography } from "@/theme";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ctrl+Z</Text>
      <Text style={styles.caption}>디자인 토큰 적용 확인용 화면</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: colors.background,
  },
  title: {
    ...typography.heading,
    color: colors.primary,
  },
  caption: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
