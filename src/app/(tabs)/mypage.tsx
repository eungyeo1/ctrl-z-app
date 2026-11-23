// S-27 마이페이지 (피그마 "마이페이지" 2장: 기본 + 로그아웃 확인 모달)
// 프로필, 숫자 3개(참여 중인 방·완독한 책·남긴 메모), 아카이브·계정 설정 진입, 로그아웃
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { AppHeader } from "@/components/layout/AppHeader";
import { Screen } from "@/components/layout/Screen";
import { StateView } from "@/components/layout/StateView";
import { Button } from "@/components/ui";
import { Icon, type IconName } from "@/components/ui/Icon";
import { useAuth } from "@/features/auth/AuthContext";
import { useApi } from "@/hooks/useApi";
import { getMyStats } from "@/services/api/users";
import { colors, fontFamily, radius, spacing, typography } from "@/theme";
import { notify } from "@/utils/notify";

// "2026-09-01" → "2026년 9월부터 함께 읽는 중"
const sinceText = (ymd: string) => {
  const [y, m] = ymd.split("-");
  return `${y}년 ${Number(m)}월부터 함께 읽는 중`;
};

type MenuItem = { icon: IconName; label: string; description: string; onPress: () => void };

export default function MyPage() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [confirmLogout, setConfirmLogout] = useState(false);
  const stats = useApi(getMyStats, []);

  const { reload } = stats;
  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  const header = <AppHeader title="마이페이지" />;

  const menus: MenuItem[] = [
    {
      icon: "bookmark-outline",
      label: "아카이브",
      description: "완독·중단된 책",
      onPress: () => router.push("/archive"),
    },
    {
      icon: "reorder-three-outline",
      label: "계정 설정",
      description: "취향·비밀번호 변경",
      // TODO: 계정 설정 화면(취향 수정은 S-03 재사용, 비밀번호 변경) — 담당·시안 확인 필요
      onPress: () => notify("계정 설정은 준비 중이에요."),
    },
  ];

  if (!user) {
    return (
      <Screen>
        {header}
        <StateView
          emptyMessage={"로그인하고 내 독서방과\n아카이브를 확인해 보세요."}
          action={<Button onPress={() => router.push("/login")}>로그인 / 회원가입</Button>}
        />
      </Screen>
    );
  }

  const statItems = [
    { label: "참여 중인 방", value: stats.data?.joinedRoomCount },
    { label: "완독한 책", value: stats.data?.finishedBookCount },
    { label: "남긴 메모", value: stats.data?.memoCount },
  ];

  return (
    <Screen>
      {header}

      {/* 프로필 */}
      <View style={styles.profile}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user.nickname.slice(0, 1)}</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.nickname}>{user.nickname}</Text>
          <Text style={styles.meta}>{sinceText(user.joinedAt)}</Text>
        </View>
        {/* TODO: 피그마 "프로필 수정" 화면 — 담당 확인 필요 */}
        <Button variant="secondary" size="small" onPress={() => notify("프로필 수정은 준비 중이에요.")}>
          수정
        </Button>
      </View>

      {/* 숫자 3개 */}
      <View style={styles.stats}>
        {statItems.map((item) => (
          <View key={item.label} style={styles.statTile}>
            <Text style={styles.statValue}>{item.value ?? "-"}</Text>
            <Text style={styles.meta}>{item.label}</Text>
          </View>
        ))}
      </View>

      {/* 아카이브 · 계정 설정 */}
      <View style={styles.menuCard}>
        {menus.map((menu, index) => (
          <Pressable
            key={menu.label}
            accessibilityRole="button"
            onPress={menu.onPress}
            style={({ pressed }) => [styles.menuItem, index > 0 && styles.menuDivider, pressed && styles.pressed]}
          >
            <Icon name={menu.icon} size={18} color={colors.textSecondary} />
            <View style={styles.menuText}>
              <Text style={styles.menuLabel}>{menu.label}</Text>
              <Text style={styles.meta}>{menu.description}</Text>
            </View>
            <Icon name="chevron-forward" size={18} color={colors.textPrimary} />
          </Pressable>
        ))}
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={() => setConfirmLogout(true)}
        style={({ pressed }) => [styles.logout, pressed && styles.pressed]}
      >
        <Icon name="log-out-outline" size={18} color={colors.error} />
        <Text style={styles.logoutText}>로그아웃</Text>
      </Pressable>

      {/* 로그아웃 확인 모달 */}
      <Modal transparent visible={confirmLogout} animationType="fade" onRequestClose={() => setConfirmLogout(false)}>
        <View style={styles.backdrop}>
          <View style={styles.dialog}>
            <Text style={styles.dialogTitle}>로그아웃 하시겠어요?</Text>
            <Text style={styles.dialogBody}>로그아웃해도 독서방과 기록은 그대로 남아 있어요.</Text>
            <View style={styles.dialogButtons}>
              <Button variant="secondary" style={styles.dialogButton} onPress={() => setConfirmLogout(false)}>
                취소
              </Button>
              <Button
                style={styles.dialogButton}
                onPress={() => {
                  setConfirmLogout(false);
                  signOut();
                }}
              >
                로그아웃
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  profile: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    ...typography.largeBold,
    color: colors.onPrimary,
  },
  profileInfo: {
    flex: 1,
    gap: spacing.xxs,
  },
  nickname: {
    ...typography.uiHeadlineBold,
    color: colors.textPrimary,
  },
  meta: {
    ...typography.uiSmallRegular,
    color: colors.textSecondary,
  },
  stats: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  statTile: {
    flex: 1,
    alignItems: "center",
    gap: spacing.xxs,
    paddingVertical: spacing.lg,
    borderRadius: radius.xl,
    backgroundColor: colors.textBackground,
  },
  statValue: {
    fontFamily: fontFamily.hahmletBold,
    fontSize: 24,
    lineHeight: 35,
    color: colors.textPrimary,
  },
  menuCard: {
    borderRadius: radius.xl,
    backgroundColor: colors.textBackground,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.lg,
  },
  menuDivider: {
    borderTopWidth: 1,
    borderTopColor: colors.primary,
  },
  pressed: {
    opacity: 0.7,
  },
  menuText: {
    flex: 1,
    gap: spacing.xxs,
  },
  menuLabel: {
    ...typography.uiBaseSemiBold,
    color: colors.textPrimary,
  },
  logout: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    minHeight: 44,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  logoutText: {
    ...typography.uiBaseSemiBold,
    color: colors.error,
  },
  backdrop: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  dialog: {
    width: "100%",
    gap: spacing.md,
    padding: spacing.xl,
    borderRadius: radius.xl,
    backgroundColor: colors.background,
  },
  dialogTitle: {
    ...typography.uiHeadlineBold,
    color: colors.textPrimary,
    textAlign: "center",
  },
  dialogBody: {
    ...typography.uiSmallRegular,
    color: colors.textSecondary,
    textAlign: "center",
  },
  dialogButtons: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  dialogButton: {
    flex: 1,
  },
});
