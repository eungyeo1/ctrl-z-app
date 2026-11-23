import { Button, Dropdown } from "@/components/ui";
import { colors, typography } from "@/theme";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet,
  Text, TextInput, View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const chapters = [
  { value: "1", label: "1장 《구출대》" },
  { value: "2", label: "2장" },
  { value: "3", label: "3장" },
  { value: "4", label: "4장" },
];
const bodyLimit = 500;

export type MemoDraft = {
  chapter: number;
  location: string;
  quote: string;
  body: string;
  spoiler: boolean;
  attachmentUri?: string;
};

type Props = {
  onClose: () => void;
  onSave: (draft: MemoDraft) => void;
};

export function MemoComposer({ onClose, onSave }: Props) {
  const [chapter, setChapter] = useState(chapters[0].value);
  const [quote, setQuote] = useState("");
  const [body, setBody] = useState("");
  const [spoiler, setSpoiler] = useState(false);
  const [attachmentUri, setAttachmentUri] = useState<string>();
  const [quotePhoto, setQuotePhoto] = useState<string>();
  const [quoteDraft, setQuoteDraft] = useState("");
  const [photoMenu, setPhotoMenu] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const [picking, setPicking] = useState(false);

  async function pickPhoto(target: "quote" | "attachment", source: "camera" | "library") {
    if (picking) return;
    setPicking(true);
    setPhotoError("");
    setPhotoMenu(false);

    try {
      if (source === "camera" && Platform.OS !== "web") {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
          setPhotoError("카메라 권한이 필요해요. 사진 보관함에서도 선택할 수 있어요.");
          return;
        }
      }

      const options: ImagePicker.ImagePickerOptions = { mediaTypes: ["images"], quality: 0.8 };
      const result = source === "camera"
        ? await ImagePicker.launchCameraAsync(options)
        : await ImagePicker.launchImageLibraryAsync(options);
      if (result.canceled) return;

      const { uri } = result.assets[0];
      if (target === "quote") {
        setQuoteDraft(quote);
        setQuotePhoto(uri);
      } else {
        setAttachmentUri(uri);
      }
    } catch {
      setPhotoError("사진을 열지 못했어요. 다시 시도해 주세요.");
    } finally {
      setPicking(false);
    }
  }

  function goBack() {
    if (quotePhoto) setQuotePhoto(undefined);
    else onClose();
  }

  function save() {
    const selectedChapter = chapters.find((option) => option.value === chapter);
    if (!selectedChapter || !body.trim()) return;

    onSave({
      chapter: Number(chapter),
      location: selectedChapter.label,
      quote: quote.trim(),
      body: body.trim(),
      spoiler,
      attachmentUri,
    });
  }

  return (
    <Modal visible animationType="slide" presentationStyle="fullScreen" onRequestClose={goBack}>
      <SafeAreaView style={styles.screen}>
        <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <Pressable accessibilityRole="button" accessibilityLabel="뒤로" onPress={goBack} style={styles.back}>
            <View style={styles.chevron} />
          </Pressable>
          {quotePhoto ? (
            <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
              <Text style={styles.title}>기록할 문장 선택</Text>
              <Image source={{ uri: quotePhoto }} style={styles.quotePhoto} contentFit="contain" accessibilityLabel="인용할 책 사진" />
              <Text style={styles.hint}>사진을 보면서 기록할 문장을 옮겨 적어 주세요. 작성 화면에서 다시 수정할 수 있어요.</Text>
              <TextInput
                accessibilityLabel="기록할 문장"
                multiline
                value={quoteDraft}
                onChangeText={setQuoteDraft}
                placeholder="기록할 문장을 입력하세요"
                placeholderTextColor={colors.textSecondary}
                style={[styles.input, styles.quoteInput]}
              />
              <Button size="large" disabled={!quoteDraft.trim()} onPress={() => {
                setQuote(quoteDraft.trim());
                setQuotePhoto(undefined);
              }}>완료</Button>
            </ScrollView>
          ) : (
            <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
              <Text style={styles.title}>메모 작성</Text>
              <View style={styles.field}>
                <Text style={styles.label}>챕터</Text>
                <Dropdown options={chapters} value={chapter} onValueChange={setChapter} />
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>인용문</Text>
                <View style={[styles.quoteCard, styles.shadow]}>
                  <View style={styles.camera}><View style={styles.lens} /></View>
                  <TextInput
                    accessibilityLabel="인용문"
                    multiline
                    value={quote}
                    onChangeText={setQuote}
                    placeholder="마음에 남는 문장을 옮겨보세요"
                    placeholderTextColor={colors.textSecondary}
                    style={styles.quoteText}
                  />
                  <Button variant="secondary" size="small" disabled={picking} onPress={() => setPhotoMenu((open) => !open)}>
                    사진 촬영 · 업로드
                  </Button>
                  {photoMenu && (
                    <View style={styles.photoOptions}>
                      <Button variant="tertiary" onPress={() => void pickPhoto("quote", "camera")}>사진 촬영</Button>
                      <Button variant="tertiary" onPress={() => void pickPhoto("quote", "library")}>사진 선택</Button>
                    </View>
                  )}
                </View>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>생각 *</Text>
                <TextInput
                  accessibilityLabel="생각"
                  multiline
                  maxLength={bodyLimit}
                  value={body}
                  onChangeText={setBody}
                  placeholder="자유롭게 작성해보세요"
                  placeholderTextColor={colors.textSecondary}
                  style={[styles.input, styles.shadow]}
                />
                <Text style={styles.counter}>{body.length} / {bodyLimit}</Text>
              </View>

              <Pressable
                accessibilityRole="checkbox"
                accessibilityState={{ checked: spoiler }}
                onPress={() => setSpoiler((checked) => !checked)}
                style={styles.checkRow}
              >
                <View style={[styles.checkbox, spoiler && styles.checked]}>
                  {spoiler && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.label}>스포일러 표기</Text>
              </Pressable>

              <Button variant="secondary" size="large" disabled={picking} onPress={() => void pickPhoto("attachment", "library")}>
                {attachmentUri ? "사진 메모 변경" : "사진 메모 첨부"}
              </Button>
              {attachmentUri && (
                <View style={styles.attachment}>
                  <Image source={{ uri: attachmentUri }} style={styles.thumbnail} accessibilityLabel="첨부 사진 미리보기" />
                  <Button variant="tertiary" onPress={() => setAttachmentUri(undefined)}>사진 제거</Button>
                </View>
              )}
              {!!photoError && <Text accessibilityLiveRegion="polite" style={styles.error}>{photoError}</Text>}
              <Button size="large" disabled={!body.trim() || picking} onPress={save}>저장하기</Button>
            </ScrollView>
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  back: { width: 44, height: 44, marginLeft: 4, alignItems: "center", justifyContent: "center" },
  chevron: { width: 10, height: 10, borderLeftWidth: 2, borderBottomWidth: 2, borderColor: colors.textPrimary, transform: [{ rotate: "45deg" }] },
  content: { paddingHorizontal: 30, paddingTop: 12, paddingBottom: 28, gap: 20 },
  title: { ...typography.baseBold, color: colors.textPrimary, marginBottom: 4 },
  field: { gap: 12 },
  label: { ...typography.uiBaseRegular, color: colors.textPrimary },
  shadow: { elevation: 4, shadowColor: colors.shadow, shadowOpacity: 0.24, shadowRadius: 3, shadowOffset: { width: 0, height: 4 } },
  quoteCard: { alignItems: "center", borderRadius: 28, backgroundColor: colors.textBackground, padding: 20, gap: 10 },
  camera: { width: 27, height: 20, borderRadius: 4, borderWidth: 2, borderColor: colors.primary, alignItems: "center", justifyContent: "center" },
  lens: { width: 10, height: 10, borderWidth: 2, borderRadius: 5, borderColor: colors.primary },
  quoteText: { ...typography.uiBaseRegular, color: colors.textPrimary, width: "100%", textAlign: "center", paddingVertical: 4 },
  photoOptions: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center" },
  input: { ...typography.uiBaseRegular, color: colors.textPrimary, backgroundColor: colors.memoPaper, minHeight: 165, padding: 22, borderRadius: 28, textAlignVertical: "top" },
  quoteInput: { minHeight: 88 },
  counter: { ...typography.uiBaseRegular, color: colors.textPrimary, textAlign: "right" },
  checkRow: { flexDirection: "row", alignItems: "center", minHeight: 44, gap: 16 },
  checkbox: { width: 28, height: 28, borderRadius: 5, backgroundColor: colors.border, alignItems: "center", justifyContent: "center" },
  checked: { backgroundColor: colors.primary },
  checkmark: { ...typography.uiBaseSemiBold, color: colors.onPrimary },
  quotePhoto: { width: "100%", aspectRatio: 1, borderRadius: 28, backgroundColor: colors.textBackground },
  hint: { ...typography.uiBaseRegular, color: colors.textSecondary, backgroundColor: colors.textBackground, borderRadius: 24, padding: 18 },
  attachment: { flexDirection: "row", alignItems: "center", gap: 12 },
  thumbnail: { width: 60, height: 60, borderRadius: 12 },
  error: { ...typography.uiBaseRegular, color: colors.error },
});
