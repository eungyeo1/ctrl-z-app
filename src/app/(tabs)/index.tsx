import { useRouter } from "expo-router";
import { View, Text, Button, StyleSheet } from "react-native";

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>홈 화면</Text>
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
    gap: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
});
