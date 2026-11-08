import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet } from "react-native";

export default function BookDetail() {
  const { bookId } = useLocalSearchParams<{ bookId: string }>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>책 상세 화면</Text>
      <Text>책 ID: {bookId}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
  },
});
