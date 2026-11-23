// 탭 화면 상단: 왼쪽 로고(또는 제목) + 오른쪽 알림 벨 (피그마 홈/검색/마이페이지)
// 벨을 누르면 알림센터(S-51)로 가고, 안 읽은 알림이 있으면 점을 표시합니다.
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Icon } from "@/components/ui/Icon";
import { useApi } from "@/hooks/useApi";
import { getUnreadCount } from "@/services/api/notifications";
import { colors, radius, spacing, typography } from "@/theme";

import { Logo } from "./Logo";

interface AppHeaderProps {
  title?: string; // 없으면 로고 표시
  showBell?: boolean;
}

export function AppHeader({ title, showBell = true }: AppHeaderProps) {
  const router = useRouter();
  const unread = useApi(getUnreadCount, []);

  // 알림센터에서 읽고 돌아오면 점을 갱신합니다.
  const { reload } = unread;
  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  const hasUnread = (unread.data ?? 0) > 0;

  return (
    <View style={styles.row}>
      {title ? <Text style={styles.title}>{title}</Text> : <Logo />}
      {showBell ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={hasUnread ? `알림센터, 안 읽은 알림 ${unread.data}개` : "알림센터"}
          onPress={() => router.push("/notifications")}
          hitSlop={spacing.sm}
        >
          <Icon name="notifications-outline" size={20} />
          {hasUnread ? <View style={styles.dot} /> : null}
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    ...typography.uiHeadlineBold,
    color: colors.textPrimary,
  },
  dot: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 7,
    height: 7,
    borderRadius: radius.full,
    backgroundColor: colors.error,
  },
});
