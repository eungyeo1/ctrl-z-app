// 탭 화면 상단: 왼쪽 로고(또는 제목) + 오른쪽 알림 아이콘 (피그마 홈/검색/마이페이지)
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Icon } from "@/components/ui/Icon";
import { colors, spacing, typography } from "@/theme";

import { Logo } from "./Logo";

interface AppHeaderProps {
  title?: string; // 없으면 로고 표시
  onBellPress?: () => void;
}

export function AppHeader({ title, onBellPress }: AppHeaderProps) {
  return (
    <View style={styles.row}>
      {title ? <Text style={styles.title}>{title}</Text> : <Logo />}
      {onBellPress ? (
        <Pressable accessibilityRole="button" accessibilityLabel="알림센터" onPress={onBellPress} hitSlop={spacing.sm}>
          <Icon name="notifications-outline" size={20} />
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
});
