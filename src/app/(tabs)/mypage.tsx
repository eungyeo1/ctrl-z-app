import { useRouter } from "expo-router";
import { View, Text, Button, StyleSheet } from "react-native";

export default function MyPage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>마이페이지</Text>
      <Button
        title="로그인 화면 테스트"
        onPress={() => router.push("/login")}
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
