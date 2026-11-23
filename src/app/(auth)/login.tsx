import { useRouter } from "expo-router";
import { View, Text, Button, StyleSheet } from "react-native";

export default function Login() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>로그인 화면</Text>
      <Text style={styles.description}>
        로그인 기능은 추후 구현 예정입니다.
      </Text>
      <Button
        title="이전 화면으로 돌아가기"
        onPress={() => router.back()}
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
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    color: "#777777",
    textAlign: "center",
  },
});
