import { StyleSheet, Text, View } from "react-native";

export default function ContentsRecognitionReview() {
  return (
    <View style={styles.page}>
      <View style={styles.header}><Text style={styles.back}>‹</Text></View>
      <Text style={styles.title}>인식 결과 확인</Text>
      <View style={styles.progress}><View style={styles.progressDone} /><View style={styles.progressDone} /></View>
      <View style={styles.success}><Text style={styles.check}>ⓥ</Text><View><Text style={styles.successTitle}>3개 챕터를 찾았어요.</Text><Text style={styles.muted}>틀린 글자와 순서를 확인한 뒤 확정해주세요.</Text></View></View>
      <View style={styles.chapter}><Text style={styles.drag}>☰</Text><Text style={styles.chapterName}>채식주의자</Text><Text style={styles.remove}>×</Text></View>
      <View style={styles.chapter}><Text style={styles.drag}>☰</Text><Text style={styles.chapterName}>몽고반점</Text><Text style={styles.remove}>×</Text></View>
      <View style={styles.chapter}><Text style={styles.drag}>☰</Text><Text style={styles.chapterName}>나무 불꽃</Text><Text style={styles.remove}>×</Text></View>
      <View style={styles.add}><Text style={styles.addText}>＋ 챕터 추가</Text></View>
      <Text style={styles.hint}>최소 2개 이상의 챕터가 있어야 확정할 수 있어요.</Text>
      <View style={styles.button}><Text style={styles.buttonText}>목차 확정하기</Text></View>
    </View>
  );
}

const styles = StyleSheet.create({ page: { flex: 1, backgroundColor: "#fbfaf3", padding: 22 }, header: { height: 64, justifyContent: "center" }, back: { fontSize: 32 }, title: { fontSize: 16, fontWeight: "700", marginBottom: 16, color: "#292723" }, progress: { flexDirection: "row", gap: 5, height: 11, marginBottom: 20 }, progressDone: { flex: 1, backgroundColor: "#5a4c40", borderRadius: 8 }, success: { borderWidth: 2, borderColor: "#5a4c40", borderRadius: 26, minHeight: 82, flexDirection: "row", alignItems: "center", padding: 16, gap: 14, marginBottom: 14 }, check: { fontSize: 23, color: "#5a4c40" }, successTitle: { fontSize: 13, color: "#5a4c40", fontWeight: "700", marginBottom: 4 }, muted: { fontSize: 11, color: "#85837d" }, chapter: { height: 54, borderRadius: 28, backgroundColor: "#eeede5", elevation: 2, marginBottom: 13, flexDirection: "row", alignItems: "center", paddingHorizontal: 24 }, drag: { fontSize: 16, color: "#292723", marginRight: 16 }, chapterName: { flex: 1, fontSize: 13, color: "#5a4c40" }, remove: { fontSize: 24, color: "#292723" }, add: { height: 44, borderWidth: 1, borderColor: "#292723", borderRadius: 24, alignItems: "center", justifyContent: "center", marginTop: 3 }, addText: { color: "#5a4c40", fontSize: 12 }, hint: { fontSize: 12, color: "#5a4c40", marginTop: 16 }, button: { marginTop: "auto", height: 48, borderRadius: 28, backgroundColor: "#5a4c40", alignItems: "center", justifyContent: "center" }, buttonText: { color: "white", fontSize: 13, fontWeight: "700" } });
