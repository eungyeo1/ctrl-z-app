import { } from "@/components/ui";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function RoomCreateContents() {
  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.back}>‹</Text>
      </View>
      <View style={styles.bookPlaceholder} />
      <View style={styles.row}>
        <View style={styles.half}>
          <Text style={styles.label}>정원 *</Text>
          <View style={styles.input} />
        </View>
        <View style={styles.half}>
          <Text style={styles.label}>진행 기간 *</Text>
          <View style={styles.input} />
        </View>
      </View>
      <View style={styles.public}>
        <View>
          <Text style={styles.bold}>공개 독서방</Text>
          <Text style={styles.muted}>끄면 비밀번호로만 참여할 수 있어요</Text>
        </View>
        <View style={styles.toggle} />
      </View>
      <Text style={styles.label}>규칙</Text>
      <View style={styles.textarea} />
      <View style={styles.divider} />
      <Text style={styles.label}>목차 · 챕터 등록 *</Text>
      <View style={styles.segment}>
        <Text style={styles.selected}>사진으로 자동 인식</Text>
        <Text style={styles.segmentText}>직접 입력</Text>
      </View>
      <View style={styles.upload}>
        <Text style={styles.camera}>▢</Text>
        <Text style={styles.bold}>목차 페이지를 촬영하면</Text>
        <Text style={styles.muted}>AI가 챕터 목록을 정리해드려요</Text>
        <View style={styles.outline}>
          <Text>사진 촬영 · 업로드</Text>
        </View>
      </View>
      <View style={styles.button}>
        <Text style={styles.buttonText}>독서방 기</Text>
      </View>
    </ScrollView>
  );
}

{
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#fbfaf3" },
  content: { padding: 20, paddingBottom: 32 },
  header: { height: 64, justifyContent: "center" },
  back: { fontSize: 32 },
  bookPlaceholder: {
    height: 40,
    backgroundColor: "#eeede5",
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
    elevation: 2,
    marginBottom: 24,
  },
  row: { flexDirection: "row", gap: 12 },
  half: { flex: 1 },
  label: { color: "#34312d", fontSize: 13, marginBottom: 10, marginTop: 10 },
  input: {
    height: 54,
    backgroundColor: "#eeede5",
    borderRadius: 30,
    elevation: 2,
  },
  public: {
    marginTop: 24,
    marginBottom: 12,
    minHeight: 54,
    backgroundColor: "#eeede5",
    borderRadius: 30,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 2,
  },
  bold: { fontWeight: "700", color: "#292723", fontSize: 14, marginTop: 4 },
  muted: { color: "#85837d", fontSize: 12, marginTop: 4 },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 20,
    backgroundColor: "#5a4c40",
  },
  textarea: {
    height: 70,
    backgroundColor: "#eeede5",
    borderRadius: 26,
    elevation: 2,
  },
  divider: { height: 1, backgroundColor: "#c9c7c0", marginVertical: 22 },
  segment: {
    backgroundColor: "#c4c0b8",
    borderRadius: 28,
    padding: 5,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 20,
  },
  selected: {
    color: "white",
    backgroundColor: "#5a4c40",
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 18,
    fontSize: 11,
  },
  segmentText: { fontSize: 11, color: "#292723" },
  upload: {
    height: 142,
    backgroundColor: "#eeede5",
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    gap: 2,
  },
  camera: { color: "#5a4c40", fontSize: 24 },
  outline: {
    borderColor: "#5a4c40",
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginTop: 8,
  },
  button: {
    marginTop: 22,
    height: 48,
    borderRadius: 28,
    backgroundColor: "#5a4c40",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: { color: "white", fontSize: 14, fontWeight: "700" },
});
