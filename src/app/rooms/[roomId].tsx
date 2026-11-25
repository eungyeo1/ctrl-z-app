import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet } from "react-native";

export default function RoomDetail() {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>독서방 상세 화면</Text>
      <Text>독서방 ID: {roomId}</Text>
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
