import { MemoFeed } from "@/features/memos/MemoFeed";
import { RoomManagement, type ManagementPage } from "@/features/rooms/RoomManagement";
import { colors, typography } from "@/theme";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { BackHandler, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const tabs = ["홈", "메모", "참여자", "정보"] as const;
const roomTitle = "눈물을 마시는 새 완독 챌린지";

export default function RoomDetail() {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  return <RoomContent key={roomId} roomId={roomId} />;
}

function RoomContent({ roomId }: { roomId: string }) {
  const router = useRouter();
  const [tab, setTab] = useState<(typeof tabs)[number]>("메모");
  const [page, setPage] = useState<ManagementPage>("owner");
  const [showInfo, setShowInfo] = useState(false);
  const managing = tab === "정보";
  const previousPage = page === "transfer" ? "members" : "owner";

  function goBack() {
    if (managing && page !== "owner") {
      setPage(previousPage);
      setShowInfo(false);
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  }

  useEffect(() => {
    if (!managing || page === "owner") return;
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      setPage(previousPage);
      setShowInfo(false);
      return true;
    });
    return () => subscription.remove();
  }, [managing, page, previousPage]);

  return (
    <SafeAreaView style={styles.screen}>
      <Stack.Screen options={{ headerShown: false }} />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="뒤로"
        onPress={goBack}
        style={styles.back}
      >
        <View style={styles.chevron} />
      </Pressable>
      <View style={styles.heading}>
        <Text style={styles.title}>{managing ? (page === "owner" ? "방장 화면" : "멤버 관리") : roomTitle}</Text>
        {managing && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="관리 안내"
            accessibilityState={{ expanded: showInfo }}
            onPress={() => setShowInfo((visible) => !visible)}
            style={styles.infoButton}
          >
            <Text style={styles.infoIcon}>ⓘ</Text>
          </Pressable>
        )}
      </View>
      <View style={styles.tabs} accessibilityRole="tablist">
        {tabs.map((label) => (
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected: tab === label }}
            key={label}
            onPress={() => {
              setTab(label);
              setShowInfo(false);
            }}
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
        <MemoFeed />
      </View>
      {managing && showInfo && (
        <Text style={styles.help} accessibilityLiveRegion="polite">
          {page === "owner" ? "정보 탭에서 방을 관리할 수 있어요." : "방장 본인은 강퇴나 위임 대상에서 제외돼요."}
        </Text>
      )}
      <View style={[styles.content, !managing && styles.inactive]}>
        <RoomManagement roomTitle={roomTitle} page={page} onPageChange={(next) => {
          setPage(next);
          setShowInfo(false);
        }} />
      </View>
      {(tab === "홈" || tab === "참여자") && (
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
  heading: { flexDirection: "row", alignItems: "center", marginHorizontal: 30, marginTop: 12, marginBottom: 14 },
  title: { ...typography.baseBold, color: colors.textPrimary, flex: 1 },
  infoButton: { width: 44, height: 38, justifyContent: "center", alignItems: "flex-end" },
  infoIcon: { color: colors.textPrimary, fontSize: 22, fontWeight: "600" },
  help: { ...typography.uiSmallRegular, color: colors.textSecondary, marginHorizontal: 30, marginTop: 12 },
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
