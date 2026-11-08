import { useRouter } from "expo-router";
import { View, Text, Button, StyleSheet } from "react-native";

export default function Search() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>검색 화면</Text>
      <Button
        title="책 상세 보기"
        onPress={() =>
          router.push({
            pathname: "/books/[bookId]",
            params: { bookId: "123" },
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
