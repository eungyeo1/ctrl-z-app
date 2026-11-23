// 검색 결과 한 줄 (피그마 "검색": 표지 · 제목 · 저자·출판사 · ›)
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Icon } from "@/components/ui/Icon";
import { colors, spacing, typography } from "@/theme";
import type { Book } from "@/types/models";

import { BookCover } from "./BookCover";

interface BookListItemProps {
  book: Book;
  onPress: () => void;
}

export function BookListItem({ book, onPress }: BookListItemProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <BookCover book={book} size="small" />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {book.title}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {book.author} · {book.publisher}
        </Text>
      </View>
      <Icon name="chevron-forward" size={18} color={colors.textSecondary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
    paddingVertical: spacing.md,
  },
  pressed: {
    opacity: 0.7,
  },
  info: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    ...typography.uiHeadlineBold,
    fontSize: 14,
    color: colors.textPrimary,
  },
  meta: {
    ...typography.uiSmallRegular,
    color: colors.textSecondary,
  },
});
