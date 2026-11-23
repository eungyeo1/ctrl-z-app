import { Button } from "@/components/ui";
import { colors, typography } from "@/theme";
import { useState } from "react";
import {
  KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet,
  Text, TextInput, View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const reasons = [
  { id: "spam", title: "스팸 또는 광고", description: "홍보 링크, 반복 게시물" },
  { id: "abuse", title: "비방 · 혐오 표현", description: "모욕, 차별, 괴롭힘" },
  { id: "spoiler", title: "스포일러 미표기", description: "진행 위치 이후 내용을 가림 없이 공개" },
  { id: "other", title: "기타", description: "직접 사유를 입력하세요" },
] as const;

export type MemoReportDraft = {
  reason: (typeof reasons)[number]["id"];
  description: string;
};

export function MemoReport({ onClose, onSubmit }: {
  onClose: () => void;
  onSubmit: (draft: MemoReportDraft) => void;
}) {
  const [reason, setReason] = useState<MemoReportDraft["reason"]>();
  const [description, setDescription] = useState("");

  function submit() {
    if (reason) onSubmit({ reason, description: description.trim() });
  }

  return (
    <SafeAreaProvider style={styles.screen}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <Pressable accessibilityRole="button" accessibilityLabel="뒤로" onPress={onClose} style={styles.back}>
            <View style={styles.chevron} />
          </Pressable>
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            <Text accessibilityRole="header" style={styles.title}>신고하기</Text>
            <Text style={styles.hint}>신고 대상에게는 신고자의 정보가 공개되지 않아요.</Text>
            <View accessibilityRole="radiogroup" accessibilityLabel="신고 유형" style={styles.reasons}>
              {reasons.map((option) => {
                const selected = option.id === reason;
                return (
                  <Pressable
                    key={option.id}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: selected }}
                    onPress={() => setReason(option.id)}
                    style={[styles.card, styles.option, selected && styles.selected]}
                  >
                    <View style={[styles.radio, selected && styles.radioSelected]}>
                      {selected && <View style={styles.dot} />}
                    </View>
                    <View style={styles.copy}>
                      <Text style={styles.label}>{option.title}</Text>
                      <Text style={styles.hint}>{option.description}</Text>
                    </View>
                  </Pressable>
                );
                })}
              </View>
              <Text style={styles.label}>신고 사유 <Text style={styles.hint}>(선택)</Text></Text>
              <TextInput
                accessibilityLabel="신고 상세 사유 (선택)"
                multiline
                value={description}
                onChangeText={setDescription}
                placeholder="검토에 필요한 내용을 적어주세요"
                placeholderTextColor={colors.textSecondary}
                style={[styles.card, styles.input]}
              />
            </ScrollView>
            <View style={styles.footer}>
              <Button size="large" disabled={!reason} onPress={submit}>신고하기</Button>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  safeArea: { flex: 1, paddingTop: 8, backgroundColor: colors.background },
  back: { width: 52, height: 52, marginLeft: 8, alignItems: "center", justifyContent: "center" },
  chevron: { width: 10, height: 10, borderLeftWidth: 2, borderBottomWidth: 2, borderColor: colors.textPrimary, transform: [{ rotate: "45deg" }] },
  content: { paddingHorizontal: 30, paddingTop: 14, paddingBottom: 20, gap: 15 },
  title: { ...typography.baseBold, color: colors.textPrimary },
  label: { ...typography.uiBaseSemiBold, color: colors.textPrimary },
  hint: { ...typography.uiBaseRegular, color: colors.textSecondary },
  reasons: { gap: 20, marginTop: 2, marginBottom: 12 },
  card: {
    backgroundColor: colors.textBackground, borderRadius: 28,
    elevation: 4, shadowColor: colors.shadow, shadowOpacity: 0.26,
    shadowRadius: 3, shadowOffset: { width: 0, height: 4 },
  },
  option: { minHeight: 82, flexDirection: "row", alignItems: "flex-start", gap: 15, padding: 18, borderWidth: 2, borderColor: "transparent" },
  selected: { borderColor: colors.primary },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: colors.textDisabled, alignItems: "center", justifyContent: "center" },
  radioSelected: { borderColor: colors.primary },
  dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.primary },
  copy: { flex: 1, gap: 5 },
  input: { ...typography.uiBaseRegular, minHeight: 100, padding: 22, color: colors.textPrimary, textAlignVertical: "top" },
  footer: { paddingHorizontal: 30, paddingTop: 10, paddingBottom: 14 },
});
