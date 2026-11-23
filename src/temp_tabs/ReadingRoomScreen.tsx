import { TabButton } from "@/components/ui";
import PageBackButton from "@/components/ui/PageBackButton";
import { typography } from "@/theme";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import MemoFeedContent from "./Room_Contents/MemoFeedContent";
import RoomHomeContent from "./Room_Contents/RoomHomeContent";
import RoomInfoContent from "./Room_Contents/RoomInfoContent";
import RoomMemeberContent from "./Room_Contents/RoomMemeberContent";

type RoomHomeResponse = {
  success: boolean;
  data: {
    room: {
      bookroom_id: number;
      title: string;
      book_title: string;
    };
    role: "owner" | "member";
  } | null;
  error: {
    code: string;
    message: string;
  } | null;
};

type RoomHome = RoomHomeResponse["data"];

type RoomTab = "home" | "memo" | "members" | "info";

type Props = {
  roomId: number;
  accessToken: string;
};

const API_BASE_URL = "http://43.203.57.41:8000/api";

const ReadingRoomScreen = ({ roomId, accessToken }: Props) => {
  const [activeTab, setActiveTab] = useState<RoomTab>("home");

  const [roomHome, setRoomHome] = useState<RoomHome>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /*
  // API GET
  useEffect(() => {
    const controller = new AbortController();

    async function loadRoomHome() {
      setIsLoading(true);
      setErrorMessage(null);
      setRoomHome(null);

      try {
        // 명세: GET /api/rooms/{room_id}/home, 인증 필요, Query Parameter 없음
        const response = await fetch(
          `${API_BASE_URL}/api/rooms/${roomId}/home`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: "application/json",
            },
            signal: controller.signal,
          },
        );

        const result = (await response.json()) as RoomHomeResponse;
        //
        if (!response.ok || !result.success || !result.data) {
          if (
            response.status === 401 ||
            result.error?.code === "UNAUTHORIZED"
          ) {
            throw new Error("인증 토큰이 없거나 만료되었습니다.");
          }
          if (
            response.status === 404 ||
            result.error?.code === "ROOM_NOT_FOUND"
          ) {
            throw new Error("요청한 독서방을 찾을 수 없습니다");
          }
          if (
            response.status === 404 ||
            result.error?.code === "ROOM_NOT_FOUND"
          ) {
            throw new Error("요청한 독서방을 찾을 수 없습니다");
          }
          throw new Error(
            result.error?.message ?? "독서방 정보를 불러오지 못했어요.",
          );
        }

        setRoomHome(result.data);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "잠시 후 다시 시도해 주세요.",
        );
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    void loadRoomHome();
    return () => controller.abort();
  }, [roomId, accessToken]);

  if (isLoading) {
    return (
      <View>
        <ActivityIndicator color={colors.primary} />
        <Text>독서방 정보를 불러오는 중이에요</Text>
      </View>
    );
  }

  if (errorMessage || !roomHome) {
    return (
      <View>
        <Text>{errorMessage ?? "독서방 정보를 찾을 수 없어요."}</Text>
        <Text>이전 화면으로 돌아가 다시 확인해 주세요.</Text>
      </View>
    );
  }

  const { room, role } = roomHome;
  */
  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.content}>
        {/* 헤더 */}
        <PageBackButton />
        <Text style={typography.baseBold}>눈물을 마시는 새 완독 모임</Text>
        {/* 탭 */}
        <View style={{ flexDirection: "row" }}>
          <TabButton
            title="홈"
            selected={activeTab === "home"}
            onPress={() => setActiveTab("home")}
          />
          <TabButton
            title="메모"
            selected={activeTab === "memo"}
            onPress={() => setActiveTab("memo")}
          />
          <TabButton
            title="참여자"
            selected={activeTab === "members"}
            onPress={() => setActiveTab("members")}
          />
          <TabButton
            title="정보"
            selected={activeTab === "info"}
            onPress={() => setActiveTab("info")}
          />
        </View>
        <View>
          {activeTab === "home" && <RoomHomeContent />}
          {activeTab === "memo" && <MemoFeedContent />}
          {activeTab === "members" && <RoomMemeberContent />}
          {activeTab === "info" && <RoomInfoContent />}
        </View>
      </View>
    </ScrollView>
  );
};

export default ReadingRoomScreen;

const styles = StyleSheet.create({
  header: { flexDirection: "row", justifyContent: "space-between" },
  content: { padding: 31, gap: 27 },
});
