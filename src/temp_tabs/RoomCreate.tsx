import { Card, Dropdown, TextField, Toggle } from "@/components/ui";
import { colors, radius, typography } from "@/theme";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const MEMBER_OPTIONS = [
  { label: "2명", value: "2" },
  { label: "3명", value: "3" },
  { label: "4명", value: "4" },
];
export default function RoomCreate() {
  const router = useRouter();

  const [roomName, setRoomName] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [memberLimit, setMemberLimit] = useState("");
  const [duration, setDuration] = useState("");
  const [rules, setRules] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  const handleCreateRoom = () => {
    if (!roomName.trim() || !memberLimit || !duration.trim()) {
      Alert.alert(
        "필수 항목을 확인해 주세요",
        "방 이름, 정원, 진행 기간을 입력해 주세요",
      );
      return;
    }

    // 방 생성 API 연결
    Alert.alert("독서방 만들기", "입력한 정보를 확인했습니다");
  };

  return (
    <ScrollView style={styles.page}>
      {/* 1. 뒤로가기 버튼을 감싸는 절대 위치 영역 */}
      <View style={styles.header}>
        <Pressable
          style={styles.header}
          accessibilityRole="button"
          accessibilityLabel="뒤로 가기"
          hitSlop={8}
          onPress={() => router.back()}
        >
          <Text style={styles.return_btm}>‹</Text>
        </Pressable>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>독서방 만들기</Text>
        <View>
          <Card
            style={{ backgroundColor: colors.textBackground }}
            contentStyle={styles.bookCard}
          >
            <Image
              accessibilityLabel="개설할 책 표지"
              source={{ uri: "https://placehold.co/75x114.png" }}
              style={styles.image}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.explanation}>개설할 책</Text>
              <Text style={typography.smallBold}>책 이름</Text>
            </View>
          </Card>
        </View>

        <View style={styles.textField}>
          <TextField
            label="방 이름 *"
            accessibilityLabel="방 이름"
            value={roomName}
            onChangeText={setRoomName}
            returnKeyType="next"
          />
        </View>

        <View style={styles.textField}>
          <TextField
            label="한 줄 소개 *"
            accessibilityLabel="한 줄 소개"
            value={introduction}
            onChangeText={setIntroduction}
            returnKeyType="next"
          />
        </View>

        <View style={styles.bookCard}>
          <View style={[styles.textField, { flex: 1 }]}>
            <Dropdown
              label="정원 *"
              placeholder=""
              options={MEMBER_OPTIONS}
              value={memberLimit}
              onValueChange={setMemberLimit}
            />
          </View>
          <View style={[styles.textField, { flex: 1 }]}>
            <TextField
              label="진행 기간"
              accessibilityLabel="진행 기간"
              value={duration}
              onChangeText={setDuration}
              returnKeyType="done"
            />
          </View>
        </View>

        <View>
          <Card
            style={[
              { backgroundColor: colors.textBackground },
              { borderRadius: radius.full },
            ]}
            contentStyle={styles.bookCard}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>공개 독서방</Text>
              <Text style={styles.explanation}>
                {isPublic
                  ? "누구나 독서방을 찾고 참여할 수 있어요"
                  : "끄면 비밀번호로만 참여할 수 있어요"}
              </Text>
            </View>
            <Toggle
              value={isPublic}
              onValueChange={setIsPublic}
              accessibilityLabel="공개 독서방"
            />
          </Card>
        </View>

        <View style={styles.textField}>
          <TextField label="규칙" multiline />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  content: { padding: 31, gap: 27 },
  header: {
    position: "relative",
    height: 93,
    justifyContent: "center",
    zIndex: 10, // 다른 컴포넌트 위에 보이도록 설정
  },
  return_btm: {
    padding: 20,
    position: "absolute",
    top: 50,
    left: 9,
    fontSize: 28,
    fontWeight: "500",
  },
  image: { width: 75, height: 114 },
  formColumn: {
    flex: 1,
  },
  bookCard: {
    flexDirection: "row",
    elevation: 2,
    gap: 16,
  },
  title: { ...typography.baseBold },
  explanation: { ...typography.uiSmallRegular, color: colors.textSecondary },
  label: { ...typography.uiSmallRegular, color: colors.textPrimary },
  textField: { gap: 16 },
  toggle: {
    width: 48,
    height: 28,
    justifyContent: "center",
    borderRadius: radius.full,
    padding: 3,
  },
  toggleOn: {
    backgroundColor: colors.primary,
  },
  toggleOff: {
    backgroundColor: colors.textSecondary,
  },
  toggleThumb: {
    width: 22,
    height: 22,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
  },
  toggleThumbOn: {
    alignSelf: "flex-end",
  },
  toggleTumboff: {
    alignSelf: "flex-start",
  },
});
