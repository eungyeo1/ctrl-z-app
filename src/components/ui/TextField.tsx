import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
  type ViewStyle,
} from "react-native";

import { colors, radius, spacing, typography } from "@/theme";

// TextInput의 모든 기본 props에 라벨·안내 문구·커스텀 스타일을 더합니다.
export interface TextFieldProps extends TextInputProps {
  label?: string;
  helperText?: string;
  errorText?: string;
  shadowPosition?: "top" | "bottom" | "none";
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
}

export function TextField({
  label,
  helperText,
  errorText,
  shadowPosition = "bottom",
  containerStyle,
  inputStyle,
  multiline = false,
  editable = true,
  placeholderTextColor = colors.textSecondary,
  selectionColor = colors.primary,
  onFocus,
  onBlur,
  ...textInputProps
}: TextFieldProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        {...textInputProps}
        editable={editable}
        multiline={multiline}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholderTextColor={placeholderTextColor}
        selectionColor={selectionColor}
        underlineColorAndroid="transparent"
        // 기본 → 여러 줄 → 읽기 전용 → 화면별 스타일 순으로 조합합니다.
        style={[
          styles.input,
          styles[`shadow_${shadowPosition}`],
          multiline && styles.multiline,
          !editable && styles.readOnly,
          inputStyle,
        ]}
      />
      {/* errorText가 있으면 helperText보다 우선해 일반 안내 스타일로 표시합니다. */}
      {errorText || helperText ? (
        <Text style={styles.helper}>{errorText ?? helperText}</Text>
      ) : null}
    </View>
  );
}

// 입력 상태와 문구 스타일에 테마 색상·간격·타이포그래피를 적용합니다.
const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  label: {
    ...typography.uiBaseSemiBold,
    color: colors.textSecondary,
  },
  input: {
    minHeight: 48,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.full,
    backgroundColor: colors.textBackground, // color token 누락
    color: colors.textPrimary,
    shadowColor: "#000000",
    shadowOpacity: 0.5,
    shadowRadius: radius.md,
    ...typography.uiBaseRegular,
  },
  shadow_bottom: {
    elevation: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: radius.sm,
  },
  shadow_top: {
    elevation: 4,
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
  multiline: {
    minHeight: 112,
    borderRadius: radius.xl,
    textAlignVertical: "top",
  },
  readOnly: {
    color: colors.textDisabled,
  },
  helper: {
    ...typography.uiSmallRegular,
    color: colors.textSecondary,
  },
});
