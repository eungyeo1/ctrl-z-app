import { useRouter } from "expo-router";
import { Text, View, Button, StyleSheet } from "react-native";

import { colors, spacing, typography } from "@/theme";

export default function Home() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>오두막 책방</Text>
      <Text style={styles.caption}>디자인 토큰 적용 확인용 화면</Text>
      <Button
        title="독서방 상세 보기"
        onPress={() =>
          router.push({
            pathname: "/rooms/[roomId]",
            params: { roomId: "456" },
          })
        }
      />
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
