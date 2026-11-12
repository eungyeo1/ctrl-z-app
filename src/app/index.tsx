import { colors, spacing, typography } from "@/theme";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>오두막 책방</Text>
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
    ...typography.largeBold,
    color: colors.primary,
  },
  caption: {
    ...typography.smallRegular,
    color: colors.textSecondary,
  },
});
