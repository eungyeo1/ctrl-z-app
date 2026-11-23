// 로딩 / 에러 / 빈 화면 공통 표시
import type { ReactNode } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/ui";
import { colors, spacing, typography } from "@/theme";

interface StateViewProps {
  loading?: boolean;
  errorMessage?: string;
  emptyMessage?: string;
  onRetry?: () => void;
  action?: ReactNode;
}

export function StateView({ loading, errorMessage, emptyMessage, onRetry, action }: StateViewProps) {
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{errorMessage ?? emptyMessage}</Text>
      {errorMessage && onRetry ? (
        <Button variant="secondary" size="small" onPress={onRetry}>
          다시 시도
        </Button>
      ) : null}
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
    paddingVertical: spacing.xxl,
  },
  message: {
    ...typography.uiBaseRegular,
    color: colors.textSecondary,
    textAlign: "center",
  },
});
