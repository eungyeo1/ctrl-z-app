// S-51 알림센터 (피그마 시안 없음 — 아카이브 목록 스타일로 구성)
// S-51-1 새 메모/댓글/답글, 신고 결과, 마감 임박, 방 설정 변경, 책 등록 결과, 우선참여권을 한곳에
// S-51-2 누르면 읽음 처리 + 관련 화면으로 이동 / S-51-3 30일 지난 알림은 자동 정리
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Screen } from "@/components/layout/Screen";
import { StateView } from "@/components/layout/StateView";
import { Icon, type IconName } from "@/components/ui/Icon";
import { useApi } from "@/hooks/useApi";
import { getNotifications, markAllNotificationsRead, markNotificationRead } from "@/services/api/notifications";
import { colors, radius, spacing, typography } from "@/theme";
import type { AppNotification, NotificationType } from "@/types/models";
import { relativeTime } from "@/utils/date";

const typeIcon: Record<NotificationType, IconName> = {
  memo: "create-outline",
  comment: "chatbubble-outline",
  reply: "chatbubbles-outline",
  report: "shield-checkmark-outline",
  deadline: "alarm-outline",
  roomSetting: "settings-outline",
  bookRequest: "book-outline",
  waitlist: "sparkles-outline",
};

export default function Notifications() {
  const router = useRouter();
  const list = useApi(getNotifications, []);
  const items = list.data ?? [];
  const hasUnread = items.some((item) => !item.read);

  const open = async (item: AppNotification) => {
    if (!item.read) await markNotificationRead(item.id);
    if (item.link) router.push(item.link);
    else list.reload();
  };

  const readAll = async () => {
    await markAllNotificationsRead();
    list.reload();
  };

  return (
    <Screen edges={["bottom"]}>
      <View style={styles.header}>
        <Text style={styles.title}>알림</Text>
        {hasUnread ? (
          <Pressable accessibilityRole="button" onPress={readAll} hitSlop={spacing.sm}>
            <Text style={styles.readAll}>모두 읽음</Text>
          </Pressable>
        ) : null}
      </View>

      {list.loading && !list.data ? (
        <StateView loading />
      ) : list.error ? (
        <StateView errorMessage={list.error.message} onRetry={list.reload} />
      ) : items.length === 0 ? (
        <StateView emptyMessage="새 알림이 없어요." />
      ) : (
        <View style={styles.list}>
          {items.map((item) => (
            <Pressable
              key={item.id}
              accessibilityRole="button"
              accessibilityLabel={`${item.read ? "" : "안 읽음, "}${item.title}, ${item.body}`}
              onPress={() => open(item)}
              style={({ pressed }) => [styles.item, !item.read && styles.itemUnread, pressed && styles.pressed]}
            >
              <View style={styles.iconCircle}>
                <Icon name={typeIcon[item.type]} size={18} color={colors.primary} />
              </View>
              <View style={styles.text}>
                <View style={styles.titleRow}>
                  <Text style={styles.itemTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.time}>{relativeTime(item.createdAt)}</Text>
                </View>
                <Text style={styles.body} numberOfLines={2}>
                  {item.body}
                </Text>
              </View>
              {!item.read ? <View style={styles.unreadDot} /> : null}
            </Pressable>
          ))}
        </View>
      )}

      <Text style={styles.footnote}>30일이 지난 알림은 자동으로 정리돼요.</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    ...typography.uiHeadlineBold,
    color: colors.textPrimary,
  },
  readAll: {
    ...typography.uiSmallSemiBold,
    color: colors.textSecondary,
  },
  list: {
    gap: spacing.sm,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.xl,
  },
  itemUnread: {
    backgroundColor: colors.textBackground,
  },
  pressed: {
    opacity: 0.7,
  },
  iconCircle: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
    backgroundColor: colors.surface,
  },
  text: {
    flex: 1,
    gap: spacing.xxs,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  itemTitle: {
    ...typography.uiBaseSemiBold,
    color: colors.textPrimary,
    flex: 1,
  },
  time: {
    ...typography.uiSmallRegular,
    color: colors.textDisabled,
  },
  body: {
    ...typography.uiSmallRegular,
    color: colors.textSecondary,
  },
  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: radius.full,
    backgroundColor: colors.error,
  },
  footnote: {
    ...typography.uiSmallRegular,
    color: colors.textDisabled,
    textAlign: "center",
  },
});
