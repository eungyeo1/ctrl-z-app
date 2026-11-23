import { MemoFeed } from "@/features/memos/MemoFeed";
import { colors, typography } from "@/theme";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const tabs = ["홈", "메모", "참여자", "정보"] as const;

export default function RoomDetail() {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const router = useRouter();
  const [tab, setTab] = useState<(typeof tabs)[number]>("메모");

  return (
    <SafeAreaView style={styles.screen}>
      <Stack.Screen options={{ headerShown: false }} />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="뒤로"
        onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))}
        style={styles.back}
      >
        <View style={styles.chevron} />
      </Pressable>
      <Text style={styles.title}>눈물을 마시는 새 완독 챌린지</Text>
      <View style={styles.tabs} accessibilityRole="tablist">
        {tabs.map((label) => (
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected: tab === label }}
            key={label}
            onPress={() => setTab(label)}
            style={styles.tab}
          >
            <Text style={[styles.tabLabel, tab === label && styles.selectedLabel]}>
              {label}
            </Text>
            {tab === label && <View style={styles.indicator} />}
          </Pressable>
        ))}
      </View>
      <View style={[styles.content, tab !== "메모" && styles.inactive]}>
        <MemoFeed key={roomId} />
      </View>
      {tab !== "메모" && (
        <View style={styles.placeholder}>
          <Text style={styles.tabLabel}>
            {tab === "홈" ? `독서방 ID: ${roomId}` : `${tab} 정보를 아직 불러올 수 없어요.`}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  back: { width: 44, height: 44, marginLeft: 4, alignItems: "center", justifyContent: "center" },
  chevron: {
    width: 10, height: 10, borderLeftWidth: 2, borderBottomWidth: 2,
    borderColor: colors.textPrimary, transform: [{ rotate: "45deg" }],
  },
  title: {
    ...typography.baseBold, color: colors.textPrimary,
    marginHorizontal: 30, marginTop: 12, marginBottom: 14,
  },
  tabs: { flexDirection: "row", marginHorizontal: 15 },
  tab: { flex: 1, alignItems: "center", justifyContent: "center", minHeight: 44 },
  tabLabel: { ...typography.uiBaseRegular, color: colors.textPrimary },
  selectedLabel: { ...typography.uiBaseSemiBold, color: colors.primary },
  indicator: {
    position: "absolute", bottom: 0, width: "68%", height: 4,
    borderRadius: 2, backgroundColor: colors.primary,
  },
  content: { flex: 1 },
  inactive: { display: "none" },
  placeholder: { flex: 1, alignItems: "center", justifyContent: "center" },
});
