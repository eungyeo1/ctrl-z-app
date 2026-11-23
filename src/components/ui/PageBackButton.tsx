import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";

const PageBackButton = () => {
  const router = useRouter();

  return (
    <Pressable
      style={styles.header}
      accessibilityRole="button"
      accessibilityLabel="뒤로 가기"
      hitSlop={8}
      onPress={() => router.back()}
    >
      <Text style={styles.return_btm}>‹</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  return_btm: {
    position: "absolute",
    top: 32,
    left: -12,
    fontSize: 28,
    fontWeight: "500",
  },
  header: {
    position: "relative",
    height: 60,
    justifyContent: "center",
    zIndex: 10, // 다른 컴포넌트 위에 보이도록 설정
  },
});

export default PageBackButton;
