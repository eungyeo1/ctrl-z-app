import { useEffect, useState } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { colors, radius } from "@/theme";

export interface ToggleProps {
  /** 현재 켜짐/꺼짐 상태 */
  value: boolean;
  /** 사용자가 상태를 바꿨을 때 호출됩니다. */
  onValueChange: (value: boolean) => void;
  /** 접근성 서비스에 읽힐 이름 */
  accessibilityLabel: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

const ANIMATION_DURATION = 200;
const THUMB_TRAVEL_DISTANCE = 20;

export function Toggle({
  value,
  onValueChange,
  accessibilityLabel,
  disabled = false,
  style,
}: ToggleProps) {
  const [progress] = useState(() => new Animated.Value(value ? 1 : 0));

  // 부모에서 value를 변경한 경우에도 표시 상태가 동기화되도록 합니다.
  useEffect(() => {
    Animated.timing(progress, {
      toValue: value ? 1 : 0,
      duration: ANIMATION_DURATION,
      useNativeDriver: false,
    }).start();
  }, [progress, value]);

  const backgroundColor = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.textSecondary, colors.primary],
  });

  const thumbTranslateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, THUMB_TRAVEL_DISTANCE],
  });

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked: value, disabled }}
      disabled={disabled}
      hitSlop={8}
      onPress={() => onValueChange(!value)}
      style={({ pressed }) => [
        styles.touchTarget,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      <Animated.View style={[styles.track, { backgroundColor }]}>
        <Animated.View
          style={[
            styles.thumb,
            { transform: [{ translateX: thumbTranslateX }] },
          ]}
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  touchTarget: {
    width: 48,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  track: {
    width: 48,
    height: 28,
    justifyContent: "center",
    padding: 3,
    borderRadius: radius.full,
  },
  thumb: {
    width: 22,
    height: 22,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.8,
  },
});
