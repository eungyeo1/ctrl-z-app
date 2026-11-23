import { Button, Card } from "@/components/ui";
import { typography } from "@/theme";
import { StyleSheet, Text, View } from "react-native";

export default function RoomHomeContent() {
  return (
    <View>
      <Card>
        <Text>나의 진행 상태</Text>
        <Button variant="secondary">위치 기록</Button>
        <Text>읽는 중</Text>
        <Text></Text>
      </Card>

      <Text style={typography.baseBold}>모두의 진행 현황</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  content: { padding: 31, gap: 27 },
  header: { flexDirection: "row", justifyContent: "space-between" },
  tab: { flexDirection: "row", justifyContent: "space-between" },
});
