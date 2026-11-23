import { colors, typography } from "@/theme";
import { Image } from "expo-image";
import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Card } from "./Card";

export type MemoCardContent = {
  author: string;
  location: string;
  body: string;
  quote?: string;
};

export type MemoCardProps = {
  memo: MemoCardContent;
  avatarColor?: string;
  stacked?: boolean;
  spoiler?: boolean;
  headerAction?: ReactNode;
  notice?: ReactNode;
  footer?: ReactNode;
};

export function MemoCard({
  memo, avatarColor = colors.memoAvatarBlue, stacked, spoiler, headerAction, notice, footer,
}: MemoCardProps) {
  return (
    <View style={stacked && styles.stack}>
      {stacked && (
        <>
          <View style={[styles.sheet, styles.farSheet]} />
          <View style={[styles.sheet, styles.nearSheet]} />
        </>
      )}
      <Card style={styles.card} contentStyle={styles.content}>
        {stacked && (
          <Image
            accessible={false}
            source={require("@/assets/images/memo-attach-file.png")}
            contentFit="contain"
            tintColor={colors.textSecondary}
            style={styles.clip}
          />
        )}
        <View style={styles.byline}>
          <View style={[styles.avatar, { backgroundColor: avatarColor }]} />
          <View style={styles.author}>
            <Text style={styles.body}>{memo.author}</Text>
            <Text style={styles.meta}>{memo.location}</Text>
          </View>
          {headerAction}
        </View>
        {notice}
        {memo.quote && (
          <View style={styles.quoteRow}>
            <View style={styles.quoteRule} />
            <Text style={[styles.meta, styles.quote]}>“{memo.quote}”</Text>
          </View>
        )}
        <Text style={styles.body}>{memo.body}</Text>
        {spoiler && <Text style={styles.meta}>스포일러가 포함된 메모</Text>}
        {footer}
      </Card>
    </View>
  );
}

export type SpoilerMemoCardProps = {
  chapter: number;
  onReveal: () => void;
};

export function SpoilerMemoCard({ chapter, onReveal }: SpoilerMemoCardProps) {
  return (
    <Card style={[styles.card, styles.locked]} contentStyle={[styles.content, styles.lockedContent]}>
      <View pointerEvents="none" style={styles.mask}>
        <View style={[styles.avatar, styles.maskAvatar]} />
        <View style={[styles.maskLine, { width: "55%" }]} />
        <View style={[styles.maskLine, { width: "86%" }]} />
        <View style={[styles.maskLine, { width: "67%" }]} />
      </View>
      <View style={styles.lockIcon}>
        <View style={styles.lockHandle} />
        <View style={styles.lockBody} />
      </View>
      <Text style={styles.lockText}>아직 읽지 않은 {chapter}장 내용이에요</Text>
      <Text style={styles.lockText}>스포일러가 포함되어 있을 수 있어요</Text>
      <Pressable accessibilityRole="button" style={styles.reveal} onPress={onReveal}>
        <Text style={styles.actionText}>그래도 보기</Text>
      </Pressable>
    </Card>
  );
}

const styles = StyleSheet.create({
  stack: { paddingVertical: 14, marginBottom: 7 },
  sheet: { position: "absolute", left: 5, right: 5, top: 7, bottom: 6, borderRadius: 29 },
  farSheet: { backgroundColor: colors.memoPaperFar, transform: [{ rotate: "4deg" }] },
  nearSheet: { backgroundColor: colors.memoPaperBack, transform: [{ rotate: "-8deg" }] },
  card: {
    borderRadius: 29, backgroundColor: colors.memoPaper, shadowColor: colors.shadow,
    shadowOpacity: 0.26, shadowRadius: 3,
  },
  content: { padding: 25, gap: 18 },
  clip: {
    position: "absolute", top: -15, right: 31, width: 44, height: 44,
    transform: [{ rotate: "30deg" }],
  },
  byline: { flexDirection: "row", alignItems: "center", gap: 8 },
  avatar: { width: 28, height: 28, borderRadius: 14 },
  author: { flex: 1 },
  meta: { ...typography.xsmallRegular, color: colors.textSecondary },
  body: { ...typography.uiBaseRegular, color: colors.textPrimary },
  quoteRow: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  quoteRule: { width: 2, height: 25, marginTop: 3, borderRadius: 2, backgroundColor: colors.textSecondary },
  quote: { flex: 1 },
  locked: { backgroundColor: colors.memoLocked, overflow: "hidden" },
  lockedContent: { alignItems: "center", gap: 8 },
  mask: { ...StyleSheet.absoluteFill, gap: 9, padding: 28, opacity: 0.6 },
  maskAvatar: { backgroundColor: colors.memoAvatarSand },
  maskLine: { height: 8, borderRadius: 8, backgroundColor: colors.memoLockedPlaceholder },
  lockIcon: { alignItems: "center", marginBottom: 4 },
  lockHandle: { width: 10, height: 9, borderWidth: 2, borderBottomWidth: 0, borderRadius: 5, borderColor: colors.surface },
  lockBody: { width: 16, height: 12, borderWidth: 2, borderRadius: 2, borderColor: colors.surface },
  lockText: { ...typography.uiSmallSemiBold, color: colors.surface, textAlign: "center" },
  reveal: { marginTop: 6, borderRadius: 24, paddingHorizontal: 22, minHeight: 36, justifyContent: "center", backgroundColor: colors.background },
  actionText: { ...typography.uiBaseSemiBold, color: colors.textPrimary },
});
