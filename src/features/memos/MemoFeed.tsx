import { Dropdown, MemoCard, SpoilerMemoCard, type MemoCardContent } from "@/components/ui";
import { MemoComposer, type MemoDraft } from "@/features/memos/MemoComposer";
import { MemoReport, type MemoReportDraft } from "@/features/memos/MemoReport";
import { colors, typography } from "@/theme";
import { Image } from "expo-image";
import { useRef, useState, type ComponentRef } from "react";
import {
  Modal, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Memo = MemoCardContent & {
  id: number;
  chapter: number;
  related: MemoCardContent[];
  locked?: boolean;
  spoiler?: boolean;
  attachmentUri?: string;
  summary?: string;
};

const initialMemos: Memo[] = [
  {
    id: 1,
    author: "지환",
    chapter: 1,
    location: "1장 《구출대》 · 78p",
    quote: "피를 마시는 새가 가장 오래 산다오. 하지만 그 새의 몸에서는 악취가 나지. 눈물을 마시는 새가 가장 빨리 죽소. 하지만 그 새는 가장 아름다운 노래를 부른다오.",
    body: "왜 왕이 ‘눈물을 마시는 새’여야만 하는지, 타인의 슬픔을 짊어지는 그 희생의 무게가 얼마나 무거운지 단번에 와닿아서 마음이 먹먹해지네요.",
    related: [
      { author: "서윤", location: "78p", quote: "눈물을 마시는 새가 가장 빨리 죽소. 하지만 그 새는 가장 아름다운 노래를 부른다오.", body: "타인의 슬픔을 마시고 아름다운 노래를 부르지만 결국 가장 먼저 죽게 된다는 비유가 뭉클했어요." },
      { author: "민경", location: "78p", body: "왕의 역할이 무엇인지 다시 생각하게 됐어요." },
      { author: "우재", location: "78p", body: "다른 새들과 비교하니 문장의 리듬과 마지막 구절이 더 오래 남아요." },
      { author: "지환", location: "78p", body: "타인의 슬픔을 짊어지는 희생의 무게가 와닿았어요." },
    ],
    summary: "네 사람 모두 ‘눈물을 마시는 새’가 가진 슬픔과 희생의 은유에 주목했어요. 우재는 문장의 시적인 리듬을, 서윤·지환·민경은 타인의 슬픔을 짊어진다는 비유의 여운을 이야기했어요.",
  },
  {
    id: 2,
    author: "채현",
    chapter: 4,
    location: "4장",
    body: "앞선 장의 이야기가 이 장면에서 이어지는 방식이 인상적이었어요.",
    related: [],
    locked: true,
  },
];

const sortOptions = [
  { label: "인기순", value: "popular" },
  { label: "최신순", value: "latest" },
  { label: "챕터순", value: "chapter" },
];

const reportMenuWidth = 76;
const reportMenuHeight = 36;
const reportMenuMargin = 12;

function MemoOptions({ author, onOpen, expanded }: {
  author: string;
  onOpen: (right: number, bottom: number) => void;
  expanded: boolean;
}) {
  const optionsButton = useRef<ComponentRef<typeof View>>(null);

  return (
    <Pressable
      ref={optionsButton}
      accessibilityRole="button"
      accessibilityLabel={`${author} 님의 메모 옵션`}
      accessibilityState={{ expanded }}
      onPress={() => optionsButton.current?.measureInWindow((x, y, width, height) => {
        onOpen(x + width, y + height);
      })}
      style={styles.reportButton}
    >
      <View style={styles.menuDot} />
      <View style={styles.menuDot} />
      <View style={styles.menuDot} />
    </Pressable>
  );
}

export function MemoFeed() {
  const { bottom } = useSafeAreaInsets();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const [memos, setMemos] = useState(initialMemos);
  const [sort, setSort] = useState("popular");
  const [revealed, setRevealed] = useState<number[]>([]);
  const [detail, setDetail] = useState<Memo | null>(null);
  const [revealTarget, setRevealTarget] = useState<Memo | null>(null);
  const [writing, setWriting] = useState(false);
  const [reportTarget, setReportTarget] = useState<string>();
  const [reportMenu, setReportMenu] = useState<{ target: string; right: number; bottom: number }>();
  const [reports, setReports] = useState<Record<string, MemoReportDraft>>({});
  const feedScroll = useRef<ComponentRef<typeof ScrollView>>(null);
  const sortedMemos = [...memos].sort((a, b) => {
    if (sort === "latest") return b.id - a.id;
    if (sort === "chapter") return a.chapter - b.chapter || a.id - b.id;
    return b.related.length - a.related.length || b.id - a.id;
  });

  function closeModal() {
    setRevealTarget(null);
  }

  function saveDraft(draft: MemoDraft) {
    setMemos((current) => [
      { ...draft, id: Math.max(...current.map((memo) => memo.id)) + 1, author: "나", related: [] },
      ...current,
    ]);
    setSort("latest");
    setWriting(false);
    feedScroll.current?.scrollTo({ y: 0, animated: false });
  }

  function saveReport(draft: MemoReportDraft) {
    if (reportTarget === undefined) return;
    setReports((current) => ({ ...current, [reportTarget]: draft }));
    setReportTarget(undefined);
  }

  function reportActions(target: string, author: string) {
    if (reports[target]) {
      return { notice: <Text accessibilityLiveRegion="polite" style={styles.location}>신고가 이 화면에 임시 저장됐어요.</Text> };
    }
    if (author === "나") return {};
    return {
      headerAction: (
        <MemoOptions
          author={author}
          expanded={reportMenu?.target === target}
          onOpen={(right, bottom) => setReportMenu({ target, right, bottom })}
        />
      ),
    };
  }

  return (
    <View style={styles.feed}>
      <ScrollView
        ref={feedScroll}
        contentContainerStyle={styles.scroll}
        style={detail ? styles.hidden : undefined}
      >
        <View style={styles.heading}>
          <Text style={styles.title}>메모 피드</Text>
          <Dropdown
            options={sortOptions}
            value={sort}
            onValueChange={setSort}
            shadowPosition="none"
            style={styles.sort}
            containerStyle={styles.sortContainer}
          />
        </View>
        {sortedMemos.map((memo) =>
          memo.locked && !revealed.includes(memo.id) ? (
            <SpoilerMemoCard key={memo.id} chapter={memo.chapter} onReveal={() => setRevealTarget(memo)} />
          ) : (
            <MemoCard
              key={memo.id}
              memo={memo}
              avatarColor={memo.id === 1 ? colors.memoAvatarBlue : colors.memoAvatarSand}
              spoiler={memo.spoiler}
              stacked={memo.related.length > 0}
              {...reportActions(`memo:${memo.id}`, memo.author)}
              footer={memo.related.length > 0 && (
                  <Pressable accessibilityRole="button" style={styles.related} onPress={() => setDetail(memo)}>
                    <View style={styles.relatedAvatars}>
                      <View style={[styles.avatar, styles.roseAvatar]} />
                      <View style={[styles.avatar, styles.sandAvatar, styles.overlap]} />
                    </View>
                    <Text style={styles.relatedText}>같은 장면에 대한 생각 {memo.related.length}개</Text>
                    <View style={styles.chevron} />
                  </Pressable>
              )}
            />
          ),
        )}
      </ScrollView>
      {detail && (
        <ScrollView contentContainerStyle={[styles.scroll, styles.clusterScroll]}>
          <View style={styles.heading}>
            <Text style={styles.title}>메모 피드</Text>
            <Pressable accessibilityRole="button" onPress={() => setDetail(null)} style={styles.backToFeed}>
              <Text style={styles.actionText}>목록으로</Text>
            </Pressable>
          </View>
          <Text style={styles.location}>{detail.location} 근처 · 생각 {detail.related.length}개</Text>
          {detail.summary && (
            <View style={[styles.card, styles.summaryCard]}>
              <View style={styles.summaryHeading}>
                <Image
                  accessible={false}
                  source={require("@/assets/images/memo-summary-north-star.png")}
                  contentFit="contain"
                  style={styles.summaryIcon}
                />
                <Text style={styles.summaryTitle}>AI 의견 요약</Text>
              </View>
              <Text style={styles.summaryBody}>{detail.summary}</Text>
              <Text style={styles.location}>{detail.related.length}개의 메모 기반</Text>
            </View>
          )}
          <Text style={styles.location}>모아진 생각 {detail.related.length}개</Text>
          {detail.related.map((memo, index) => {
            const target = `cluster:${detail.id}:${index}`;
            return (
              <MemoCard
                key={target}
                memo={memo}
                avatarColor={index === 0 ? colors.memoAvatarRose : colors.memoAvatarSand}
                {...reportActions(target, memo.author)}
              />
            );
          })}
        </ScrollView>
      )}
      {!detail && <Pressable
        accessibilityRole="button"
        accessibilityLabel="메모 작성"
        onPress={() => setWriting(true)}
        style={[styles.add, { bottom: Math.max(12, 32 - bottom) }]}
      >
        <View style={styles.plusHorizontal} />
        <View style={styles.plusVertical} />
      </Pressable>}
      {writing && <MemoComposer onClose={() => setWriting(false)} onSave={saveDraft} />}
      <Modal
        transparent
        statusBarTranslucent
        visible={reportMenu !== undefined || reportTarget !== undefined}
        onRequestClose={() => {
          setReportMenu(undefined);
          setReportTarget(undefined);
        }}
      >
        {reportMenu ? (
          <View style={styles.feed}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="메모 옵션 닫기"
              style={StyleSheet.absoluteFill}
              onPress={() => setReportMenu(undefined)}
            />
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                setReportTarget(reportMenu.target);
                setReportMenu(undefined);
              }}
              style={[styles.reportMenu, {
                left: Math.max(reportMenuMargin, Math.min(reportMenu.right, windowWidth - reportMenuMargin) - reportMenuWidth),
                top: Math.max(0, Math.min(reportMenu.bottom, windowHeight - reportMenuHeight - reportMenuMargin)),
              }]}
            >
              <Text style={styles.reportMenuLabel}>신고하기</Text>
            </Pressable>
          </View>
        ) : reportTarget !== undefined && (
          <MemoReport onClose={() => setReportTarget(undefined)} onSubmit={saveReport} />
        )}
      </Modal>
      <Modal
        transparent
        animationType="fade"
        visible={revealTarget !== null}
        onRequestClose={closeModal}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modal}>
            {revealTarget && (
              <>
                <Text style={styles.title}>스포일러 주의</Text>
                <Text style={styles.body}>아직 읽지 않은 {revealTarget.chapter}장 내용을 볼까요?</Text>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => {
                    setRevealed((ids) => [...ids, revealTarget.id]);
                    closeModal();
                  }}
                  style={styles.modalButton}
                >
                  <Text style={styles.actionText}>그래도 보기</Text>
                </Pressable>
              </>
            )}
            <Pressable
              accessibilityRole="button"
              onPress={closeModal}
              style={styles.modalButton}
            >
              <Text style={styles.actionText}>취소</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  feed: { flex: 1 },
  scroll: { paddingHorizontal: 30, paddingTop: 17, paddingBottom: 88, gap: 34 },
  heading: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  title: { ...typography.baseBold, color: colors.textPrimary },
  sortContainer: { width: 92 },
  sort: { minHeight: 32, paddingHorizontal: 12, backgroundColor: colors.disabled },
  card: {
    borderRadius: 29, padding: 25, gap: 18, backgroundColor: colors.memoPaper,
    elevation: 4, shadowColor: colors.shadow, shadowOpacity: 0.26,
    shadowRadius: 3, shadowOffset: { width: 0, height: 4 },
  },
  reportButton: { width: 44, minHeight: 44, marginRight: -10, alignItems: "center", justifyContent: "center", gap: 3 },
  menuDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: colors.textPrimary },
  reportMenu: {
    position: "absolute", width: reportMenuWidth, minHeight: reportMenuHeight,
    alignItems: "center", justifyContent: "center", backgroundColor: colors.background, borderRadius: 6,
    borderWidth: 1, borderColor: colors.border,
  },
  reportMenuLabel: { ...typography.uiSmallSemiBold, color: colors.error },
  avatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.memoAvatarBlue },
  location: { ...typography.xsmallRegular, color: colors.textSecondary },
  body: { ...typography.uiBaseRegular, color: colors.textPrimary },
  related: { flexDirection: "row", alignItems: "center", minHeight: 44, gap: 10 },
  relatedAvatars: { flexDirection: "row" },
  roseAvatar: { backgroundColor: colors.memoAvatarRose },
  sandAvatar: { backgroundColor: colors.memoAvatarSand },
  overlap: { marginLeft: -10 },
  relatedText: { ...typography.uiSmallSemiBold, flex: 1, color: colors.primary },
  chevron: {
    width: 8, height: 8, borderRightWidth: 2, borderTopWidth: 2,
    borderColor: colors.textPrimary, transform: [{ rotate: "45deg" }],
  },
  actionText: { ...typography.uiBaseSemiBold, color: colors.textPrimary },
  add: {
    position: "absolute", right: 38, width: 64, height: 64, borderRadius: 32,
    backgroundColor: colors.primary, alignItems: "center", justifyContent: "center",
  },
  plusHorizontal: { position: "absolute", width: 23, height: 2, borderRadius: 1, backgroundColor: colors.surface },
  plusVertical: { width: 2, height: 23, borderRadius: 1, backgroundColor: colors.surface },
  modalBackdrop: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: "rgba(26,26,26,0.4)" },
  modal: { gap: 12, padding: 22, borderRadius: 24, backgroundColor: colors.background },
  modalButton: { minHeight: 44, alignItems: "center", justifyContent: "center", borderRadius: 22, backgroundColor: colors.textBackground },
  hidden: { display: "none" },
  clusterScroll: { gap: 20 },
  backToFeed: { minHeight: 44, justifyContent: "center", paddingHorizontal: 8 },
  summaryCard: { backgroundColor: colors.memoSummary },
  summaryHeading: { flexDirection: "row", alignItems: "center", gap: 8 },
  summaryIcon: { width: 16, height: 16 },
  summaryTitle: { ...typography.uiBaseSemiBold, color: colors.primary },
  summaryBody: { ...typography.uiBaseRegular, lineHeight: 23, color: colors.textPrimary },
});
