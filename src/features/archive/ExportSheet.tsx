// S-50 아카이브 내보내기 (피그마 시안 없음)
// S-50-1 포맷 선택(PDF / 이미지 / 텍스트) 후 생성 → S-50-2 공유 시트 호출
// ⚠️ 목업: 지금은 세 포맷 모두 텍스트로 공유돼요. 실제 PDF·이미지 생성은
//    expo-print / react-native-view-shot + expo-sharing 설치 후 연결 (또는 서버 생성 URL)
import { useState } from "react";
import { Pressable, Share, StyleSheet, Text, View } from "react-native";

import { BottomSheet } from "@/components/layout/BottomSheet";
import { Button } from "@/components/ui";
import { Icon, type IconName } from "@/components/ui/Icon";
import { exportArchive } from "@/services/api/archive";
import { colors, radius, spacing, typography } from "@/theme";
import type { ExportFormat } from "@/types/models";
import { notify } from "@/utils/notify";

const formats: { value: ExportFormat; label: string; description: string; icon: IconName }[] = [
  { value: "pdf", label: "PDF", description: "인쇄하거나 보관하기 좋아요", icon: "document-text-outline" },
  { value: "image", label: "이미지", description: "SNS에 공유하기 좋아요", icon: "image-outline" },
  { value: "text", label: "텍스트", description: "메모 앱에 붙여넣기 좋아요", icon: "reader-outline" },
];

interface ExportSheetProps {
  roomId: string;
  visible: boolean;
  onClose: () => void;
}

export function ExportSheet({ roomId, visible, onClose }: ExportSheetProps) {
  const [format, setFormat] = useState<ExportFormat>("pdf");
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    const res = await exportArchive(roomId, format);
    setLoading(false);
    if (!res.success || !res.data) {
      notify("내보내지 못했어요", res.error?.message);
      return;
    }
    try {
      await Share.share({ title: res.data.fileName, message: res.data.text });
      onClose();
    } catch {
      notify("공유하지 못했어요", "잠시 후 다시 시도해 주세요.");
    }
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} title="기록 내보내기">
      <View style={styles.options}>
        {formats.map((item) => {
          const selected = item.value === format;
          return (
            <Pressable
              key={item.value}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              onPress={() => setFormat(item.value)}
              style={[styles.option, selected && styles.optionSelected]}
            >
              <Icon name={item.icon} size={20} color={selected ? colors.primary : colors.textSecondary} />
              <View style={styles.optionText}>
                <Text style={styles.optionLabel}>{item.label}</Text>
                <Text style={styles.optionDescription}>{item.description}</Text>
              </View>
              <Icon
                name={selected ? "radio-button-on" : "radio-button-off"}
                size={20}
                color={selected ? colors.primary : colors.border}
              />
            </Pressable>
          );
        })}
      </View>
      <Button size="large" loading={loading} onPress={handleExport}>
        만들고 공유하기
      </Button>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  options: {
    gap: spacing.sm,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
  },
  optionSelected: {
    borderColor: colors.primary,
  },
  optionText: {
    flex: 1,
    gap: spacing.xxs,
  },
  optionLabel: {
    ...typography.uiBaseSemiBold,
    color: colors.textPrimary,
  },
  optionDescription: {
    ...typography.uiSmallRegular,
    color: colors.textSecondary,
  },
});
