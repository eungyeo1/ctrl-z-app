// 겹쳐 보이는 참여자 아바타 원 (피그마 카드 왼쪽 아래)
import { StyleSheet, View } from "react-native";

import { colors, palette, radius } from "@/theme";

const avatarColors = [palette.avatarPink, palette.avatarBeige, palette.avatarBlue];

export function MemberAvatars({ count, max = 3 }: { count: number; max?: number }) {
  const shown = Math.min(count, max);
  return (
    <View style={styles.row} accessibilityLabel={`참여자 ${count}명`}>
      {Array.from({ length: shown }, (_, i) => (
        <View
          key={i}
          style={[styles.avatar, { backgroundColor: avatarColors[i % avatarColors.length], marginLeft: i === 0 ? 0 : -8 }]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
  },
  avatar: {
    width: 22,
    height: 22,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.textBackground,
  },
});
