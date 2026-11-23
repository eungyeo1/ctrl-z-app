import { StyleSheet, Text, View } from "react-native";

export default function ContentsPhotoUpload() {
  return (
    <View style={styles.page}>
      <View style={styles.header}><Text style={styles.back}>‹</Text></View>
      <Text style={styles.title}>목차 사진 등록</Text>
      <View style={styles.progress}><View style={styles.progressDone} /><View style={styles.progressRest} /></View>
      <Text style={styles.muted}>사진 선택</Text>
      <Text style={styles.heading}>목차가 잘 보이게 올려주세요</Text>
      <Text style={styles.description}>JPG, PNG, HEIC / 장당 10MB 이하 / 여러 장을 순서대로 올릴 수 있어요</Text>
      <View style={styles.upload}><Text style={styles.camera}>▢</Text><Text style={styles.bold}>목차 사진 추가</Text><Text style={styles.muted}>카메라 촬영 또는 갤러리 선택</Text><View style={styles.outline}><Text>사진 추가하기</Text></View></View>
      <View style={styles.file}><View style={styles.thumbnail} /><View style={styles.fileInfo}><Text style={styles.fileName}>IMG_2048.HEIC</Text><Text style={styles.muted}>2.4MB 업로드 완료</Text></View><Text style={styles.ready}>● 준비됨</Text></View>
      <View style={styles.notice}><Text style={styles.muted}>책을 평평하게 펴고 그림자 없이 촬영하면 인식률이 높아져요. 실패해도 직접 입력으로 바꿀 수 있어요.</Text></View>
      <View style={styles.button}><Text style={styles.buttonText}>글자 인식하고 정리하기</Text></View>
    </View>
  );
}

const styles = StyleSheet.create({ page: { flex: 1, backgroundColor: "#fbfaf3", padding: 22 }, header: { height: 64, justifyContent: "center" }, back: { fontSize: 32 }, title: { fontSize: 16, fontWeight: "700", marginBottom: 16, color: "#292723" }, progress: { flexDirection: "row", gap: 5, height: 11, marginBottom: 14 }, progressDone: { flex: 1, backgroundColor: "#5a4c40" }, progressRest: { flex: 1, backgroundColor: "#e7e6e4", borderRadius: 8 }, muted: { fontSize: 12, color: "#85837d", lineHeight: 18 }, heading: { fontWeight: "700", fontSize: 15, color: "#292723", marginTop: 20 }, description: { fontSize: 12, color: "#85837d", marginTop: 10, lineHeight: 18 }, upload: { height: 140, backgroundColor: "#eeede5", borderRadius: 28, alignItems: "center", justifyContent: "center", marginTop: 20, elevation: 2 }, camera: { fontSize: 25, color: "#5a4c40" }, bold: { fontSize: 13, fontWeight: "700", color: "#292723", marginTop: 4 }, outline: { borderWidth: 1, borderColor: "#5a4c40", borderRadius: 24, paddingVertical: 8, paddingHorizontal: 20, marginTop: 8 }, file: { height: 100, backgroundColor: "#eeede5", borderRadius: 26, marginTop: 20, padding: 18, flexDirection: "row", alignItems: "center", elevation: 2 }, thumbnail: { width: 54, height: 64, backgroundColor: "#d0d0d0", borderRadius: 8 }, fileInfo: { flex: 1, marginLeft: 14 }, fileName: { fontSize: 11, color: "#34312d" }, ready: { color: "#7aa278", backgroundColor: "#e9f6e3", overflow: "hidden", borderRadius: 20, padding: 8, fontSize: 10 }, notice: { backgroundColor: "#f7f3d9", borderRadius: 24, padding: 20, marginTop: 22 }, button: { marginTop: "auto", height: 48, borderRadius: 28, backgroundColor: "#5a4c40", alignItems: "center", justifyContent: "center" }, buttonText: { color: "white", fontWeight: "700", fontSize: 13 } });
