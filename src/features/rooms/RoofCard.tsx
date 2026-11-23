// 지붕 모양 카드 (피그마 "참여 중인 독서방" / "독서방 목록" 카드)
// 카드 위에 갈색 지붕 선과 오른쪽 리본(책갈피)이 얹힌 모양입니다. 너비는 onLayout 으로 재서 그립니다.
import { useState, type ReactNode } from "react";
import { StyleSheet, View, type LayoutChangeEvent, type StyleProp, type ViewStyle } from "react-native";

import { colors, radius, spacing } from "@/theme";

const ROOF_STROKE = 9;
const ROOF_HEIGHT_RATIO = 0.26; // 지붕 높이 = 카드 너비 × 비율
const RIBBON_WIDTH = 12;
const RIBBON_HEIGHT = 30;

interface RoofCardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function RoofCard({ children, style }: RoofCardProps) {
  const [width, setWidth] = useState(0);
  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);

  const roofHeight = Math.round(width * ROOF_HEIGHT_RATIO);
  const half = width / 2;
  // 지붕 선 두께만큼 안쪽 삼각형을 줄여서 "선"처럼 보이게 합니다.
  const angle = Math.atan2(roofHeight, half);
  const innerTop = ROOF_STROKE / Math.cos(angle);
  const innerHeight = Math.max(0, roofHeight - innerTop);
  const innerHalf = innerHeight * (half / Math.max(roofHeight, 1));
  // 리본은 지붕 오른쪽 경사면 위, 카드 너비의 85% 지점에 매답니다.
  const ribbonX = width * 0.85;
  const ribbonTop = roofHeight * ((ribbonX - half) / Math.max(half, 1));

  return (
    <View style={style} onLayout={onLayout}>
      {width > 0 ? (
        <View style={{ height: roofHeight }}>
          <View style={[styles.triangle, triangle(half, roofHeight, colors.primary)]} />
          <View
            style={[
              styles.triangle,
              triangle(innerHalf, innerHeight, colors.textBackground),
              { position: "absolute", top: innerTop, left: half - innerHalf },
            ]}
          />
          <View style={[styles.ribbon, { left: ribbonX - RIBBON_WIDTH / 2, top: ribbonTop }]}>
            <View style={styles.ribbonNotch} />
          </View>
        </View>
      ) : null}
      <View style={styles.body}>{children}</View>
    </View>
  );
}

const triangle = (halfBase: number, height: number, color: string): ViewStyle => ({
  borderLeftWidth: halfBase,
  borderRightWidth: halfBase,
  borderBottomWidth: height,
  borderBottomColor: color,
});

const styles = StyleSheet.create({
  triangle: {
    width: 0,
    height: 0,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
  },
  ribbon: {
    position: "absolute",
    width: RIBBON_WIDTH,
    height: RIBBON_HEIGHT,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "flex-end",
    zIndex: 1,
  },
  // 리본 아래 V자 홈
  ribbonNotch: {
    width: 0,
    height: 0,
    borderLeftWidth: RIBBON_WIDTH / 2,
    borderRightWidth: RIBBON_WIDTH / 2,
    borderBottomWidth: 6,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: colors.textBackground,
  },
  body: {
    marginTop: -1,
    padding: spacing.lg,
    gap: spacing.xs,
    backgroundColor: colors.textBackground,
    borderRadius: radius.xl,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    elevation: 3,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: radius.sm,
  },
});
