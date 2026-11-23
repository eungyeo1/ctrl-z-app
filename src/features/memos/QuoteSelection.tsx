import { Button } from "@/components/ui";
import { colors, typography } from "@/theme";
import { Image, type ImageSource } from "expo-image";
import { useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View, type GestureResponderEvent } from "react-native";

type Point = { x: number; y: number };
type Selection = { left: number; top: number; width: number; height: number };

export const sampleQuotePhoto = {
  source: require("@/assets/images/quote-selection-sample.jpg") as number,
  aspectRatio: 1,
  sample: true,
};

export type QuotePhoto = {
  source: ImageSource | number;
  aspectRatio: number;
  sample?: boolean;
};

const sampleLines = [
  { top: 0.058, text: "그는 오전의 나머지 시간 내내 일을 제대로 할 수가 없었다." },
  { top: 0.185, text: "텔레스크린으로부터 마음의 동요를 감추는 것이 무척이나 힘들었다." },
  { top: 0.25, text: "마치 뱃속에 불이 붙은 것 같았다." },
];
const lineHeight = 0.05;

type Props = {
  photo: QuotePhoto;
  initialQuote: string;
  onDone: (quote: string) => void;
};

export function QuoteSelection({ photo, initialQuote, onDone }: Props) {
  const imageSize = useRef({ width: 0, height: 0 });
  const origin = useRef<Point | null>(null);
  const priorSelection = useRef<Selection | null>(null);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [dragging, setDragging] = useState(false);
  const [draft, setDraft] = useState(photo.sample ? "" : initialQuote);
  const selectedLines = photo.sample && selection
    ? sampleLines.filter(({ top }) => top <= selection.top + selection.height && top + lineHeight >= selection.top)
    : [];
  const selectedQuote = photo.sample ? selectedLines.map(({ text }) => text).join(" ") : draft.trim();

  function eventPoint(event: GestureResponderEvent): Point {
    const { locationX, locationY } = event.nativeEvent;
    const { width, height } = imageSize.current;
    return {
      x: Math.max(0, Math.min(1, locationX / Math.max(width, 1))),
      y: Math.max(0, Math.min(1, locationY / Math.max(height, 1))),
    };
  }

  function updateSelection(event: GestureResponderEvent) {
    if (!origin.current) return;
    const start = origin.current;
    const end = eventPoint(event);
    setSelection({
      left: Math.min(start.x, end.x),
      top: Math.min(start.y, end.y),
      width: Math.abs(end.x - start.x),
      height: Math.abs(end.y - start.y),
    });
  }

  return (
    <View style={styles.screen}>
      <ScrollView scrollEnabled={!dragging} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>기록할 문장 선택</Text>
        <View
          accessible
          accessibilityLabel={photo.sample ? "인용문 선택용 샘플 사진" : "인용할 책 사진"}
          style={[styles.imageFrame, { aspectRatio: photo.aspectRatio }]}
          onLayout={({ nativeEvent }) => { imageSize.current = nativeEvent.layout; }}
          onStartShouldSetResponder={() => true}
          onResponderGrant={(event) => {
            priorSelection.current = selection;
            origin.current = eventPoint(event);
            setDragging(true);
            updateSelection(event);
          }}
          onResponderMove={updateSelection}
          onResponderRelease={(event) => {
            updateSelection(event);
            origin.current = null;
            setDragging(false);
          }}
          onResponderTerminate={() => {
            setSelection(priorSelection.current);
            origin.current = null;
            setDragging(false);
          }}
          onResponderTerminationRequest={() => false}
        >
          <View pointerEvents="none" style={StyleSheet.absoluteFill}>
            <Image source={photo.source} style={StyleSheet.absoluteFill} contentFit="contain" />
            {selectedLines.length > 0 ? selectedLines.map(({ top }) => (
              <View key={top} style={[styles.highlight, { left: "4%", width: "92%", top: `${top * 100}%`, height: `${lineHeight * 100}%` }]} />
            )) : selection && (
              <View style={[styles.highlight, {
                left: `${selection.left * 100}%`, top: `${selection.top * 100}%`,
                width: `${selection.width * 100}%`, height: `${selection.height * 100}%`,
              }]} />
            )}
          </View>
        </View>
        <View style={styles.hint}>
          <Text style={styles.hintText}>기록할 문장을 드래그해서 선택하세요.{"\n"}작성 화면에서 수정할 수 있어요.</Text>
          {photo.sample ? (
            <Text accessibilityLiveRegion="polite" style={styles.hintText}>
              {selectedQuote || "샘플 사진 위쪽의 문장을 드래그해 보세요."}
            </Text>
          ) : (
            <>
              <Text style={styles.hintText}>선택한 영역을 보며 문장을 직접 입력해 주세요.</Text>
              <TextInput
                accessibilityLabel="기록할 문장"
                multiline
                value={draft}
                onChangeText={setDraft}
                placeholder="기록할 문장을 입력하세요"
                placeholderTextColor={colors.textSecondary}
                style={styles.input}
              />
            </>
          )}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Button size="large" disabled={!selectedQuote || dragging} onPress={() => onDone(selectedQuote)}>완료</Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 30, paddingTop: 12, paddingBottom: 24, gap: 26 },
  title: { ...typography.baseBold, color: colors.textPrimary },
  imageFrame: { width: "100%", borderRadius: 28, overflow: "hidden", backgroundColor: colors.textBackground, touchAction: "none" },
  highlight: { position: "absolute", backgroundColor: colors.quoteHighlight },
  hint: { borderRadius: 28, backgroundColor: colors.textBackground, padding: 22, gap: 10 },
  hintText: { ...typography.uiBaseRegular, color: colors.textSecondary },
  input: { ...typography.uiBaseRegular, color: colors.textPrimary, minHeight: 80, padding: 12, borderRadius: 14, backgroundColor: colors.background, textAlignVertical: "top" },
  footer: { paddingHorizontal: 30, paddingBottom: 14 },
});
