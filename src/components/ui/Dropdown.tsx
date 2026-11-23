import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { colors, fontFamily, radius, spacing, typography } from "@/theme";

// 드롭다운에 표시할 문구와 실제 선택값입니다.
export interface DropdownOption {
  label: string;
  value: string;
}

// 선택 목록, 현재 값, 선택 콜백과 스타일 옵션을 받습니다.
export interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  onValueChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  shadowPosition?: "top" | "bottom" | "none";
  containerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
}

export function Dropdown({
  options,
  value,
  onValueChange,
  label,
  placeholder = "선택해 주세요",
  disabled = false,
  shadowPosition = "bottom",
  containerStyle,
  style,
}: DropdownProps) {
  // 열림 상태는 컴포넌트 안에서 관리하고, 선택값은 부모가 관리합니다.
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((option) => option.value === value);

  // 선택된 값을 부모에 알린 뒤 목록을 닫습니다.
  const selectOption = (optionValue: string) => {
    onValueChange(optionValue);
    setIsOpen(false);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      {/* 현재 값과 화살표를 보여주는 선택 필드입니다. */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled, expanded: isOpen }}
        disabled={disabled}
        onPress={() => setIsOpen(true)}
        style={({ pressed }) => [
          styles.trigger,
          styles[`shadow_${shadowPosition}`],
          disabled && styles.disabled,
          pressed && !disabled && styles.pressed,
          style,
        ]}
      >
        <Text
          numberOfLines={1}
          style={[styles.value, !selectedOption && styles.placeholder]}
        >
          {selectedOption?.label ?? placeholder}
        </Text>
        <View style={styles.chevron} />
      </Pressable>

      {/* 바깥을 누르거나 옵션을 고르면 닫히는 선택 목록입니다. */}
      <Modal
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
        transparent
        visible={isOpen}
      >
        <View style={styles.modalRoot}>
          <Pressable
            accessibilityLabel="드롭다운 닫기"
            onPress={() => setIsOpen(false)}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.optionsPanel}>
            {label ? <Text style={styles.panelTitle}>{label}</Text> : null}
            <ScrollView>
              {/* 현재 선택 여부를 표시하면서 각 옵션을 목록으로 렌더링합니다. */}
              {options.map((option) => {
                const isSelected = option.value === value;

                return (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    key={option.value}
                    onPress={() => selectOption(option.value)}
                    style={({ pressed }) => [
                      styles.option,
                      isSelected && styles.selectedOption,
                      pressed && styles.pressed,
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.selectedOptionText,
                      ]}
                    >
                      {option.label}
                    </Text>
                    {isSelected ? <View style={styles.selectedMark} /> : null}
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// 배경·간격·그림자 및 선택 목록의 모양에 테마 토큰을 적용합니다.
const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  label: {
    ...typography.uiBaseRegular,
    color: colors.textSecondary,
  },
  trigger: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    borderRadius: radius.full,
    backgroundColor: colors.textBackground,
  },
  value: {
    ...typography.uiBaseRegular,
    color: colors.textPrimary,
    flex: 1,
  },
  placeholder: {
    color: colors.textSecondary,
  },
  chevron: {
    width: spacing.sm,
    height: spacing.sm,
    marginLeft: spacing.md,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: colors.textSecondary,
    transform: [{ rotate: "45deg" }, { translateY: -2 }],
  },
  shadow_bottom: {
    elevation: 4,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: radius.sm,
  },
  shadow_top: {
    elevation: 4,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: radius.sm,
  },
  shadow_none: {
    elevation: 0,
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
  },
  disabled: {
    opacity: 0.6,
  },
  pressed: {
    opacity: 0.8,
  },
  modalRoot: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.24)",
  },
  optionsPanel: {
    maxHeight: "70%",
    padding: spacing.lg,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    backgroundColor: colors.background,
  },
  panelTitle: {
    ...typography.baseBold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  option: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
  },
  selectedOption: {
    backgroundColor: colors.textBackground,
  },
  optionText: {
    ...typography.uiBaseRegular,
    color: colors.textPrimary,
  },
  selectedOptionText: {
    fontFamily: fontFamily.pretendardSemiBold,
  },
  selectedMark: {
    width: spacing.sm,
    height: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
  },
});
