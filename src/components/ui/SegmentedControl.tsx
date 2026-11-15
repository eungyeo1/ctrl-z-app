import { useEffect, useState } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { colors, radius, spacing, typography } from "@/theme";

export interface SegmentedControlOption {
  label: string;
  value: string;
}

export interface SegmentedControlProps {
  options: SegmentedControlOption[];
  value: string;
  onValueChange: (value: string) => void;
  accessibilityLabel: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

const ANIMATION_DURATION = 200;
const TRACK_HORIZONTAL_PADDING = spacing.sm;

export function SegmentedControl({
  options,
  value,
  onValueChange,
  accessibilityLabel,
  disabled = false,
  style,
}: SegmentedControlProps) {
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );
  const [progress] = useState(() => new Animated.Value(selectedIndex));
  const [trackWidth, setTrackWidth] = useState(0);
  const pillWidth =
    options.length > 0
      ? (trackWidth - TRACK_HORIZONTAL_PADDING * 2) / options.length
      : 0;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: selectedIndex,
      duration: ANIMATION_DURATION,
      useNativeDriver: true,
    }).start();
  }, [progress, selectedIndex]);

  const pillTranslateX = progress.interpolate({
    inputRange: options.map((_, index) => index),
    outputRange: options.map((_, index) => index * pillWidth),
    extrapolate: "clamp",
  });

  const handleTrackLayout = (event: LayoutChangeEvent) => {
    setTrackWidth(event.nativeEvent.layout.width);
  };

  if (options.length === 0) {
    return null;
  }

  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel={accessibilityLabel}
      onLayout={handleTrackLayout}
      style={[styles.track, disabled && styles.disabled, style]}
    >
      <Animated.View
        pointerEvents="none"
        style={[
          styles.selectionPill,
          { width: pillWidth },
          { transform: [{ translateX: pillTranslateX }] },
        ]}
      />

      {options.map((option, index) => {
        const isSelected = option.value === value;

        return (
          <Pressable
            accessibilityRole="radio"
            accessibilityLabel={option.label}
            accessibilityState={{ selected: isSelected, disabled }}
            disabled={disabled}
            key={option.value}
            onPress={() => onValueChange(option.value)}
            style={styles.option}
          >
            <Text
              numberOfLines={1}
              style={[
                styles.optionText,
                isSelected && styles.selectedOptionText,
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "stretch",
    padding: TRACK_HORIZONTAL_PADDING,
    borderRadius: radius.full,
    backgroundColor: "#BDB8AF",
  },
  selectionPill: {
    position: "absolute",
    top: TRACK_HORIZONTAL_PADDING,
    bottom: TRACK_HORIZONTAL_PADDING,
    left: TRACK_HORIZONTAL_PADDING,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
  },
  option: {
    zIndex: 1,
    flex: 1,
    minWidth: 0,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.sm,
  },
  optionText: {
    ...typography.uiSmallRegular,
    color: colors.textPrimary,
  },
  selectedOptionText: {
    color: colors.onPrimary,
  },
  disabled: {
    opacity: 0.5,
  },
});
