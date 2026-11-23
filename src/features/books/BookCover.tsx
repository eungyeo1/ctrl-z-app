// 책 표지: 이미지가 있으면 이미지, 없으면 제목을 넣은 임시 표지를 그립니다.
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

import { colors, palette, radius, spacing, typography } from "@/theme";
import type { Book } from "@/types/models";

const sizes = {
  small: { width: 56, height: 80 },
  medium: { width: 96, height: 138 },
  large: { width: 132, height: 190 },
} as const;

const tones = {
  brown: { background: palette.primaryBrown, text: palette.primaryCream },
  cream: { background: palette.textBackground, text: palette.primaryBrown },
  gray: { background: palette.neutral50, text: palette.neutral100 },
} as const;

interface BookCoverProps {
  book: Pick<Book, "title" | "coverTone" | "coverUrl">;
  size?: keyof typeof sizes;
}

export function BookCover({ book, size = "medium" }: BookCoverProps) {
  const dimension = sizes[size];
  if (book.coverUrl) {
    return <Image source={book.coverUrl} style={[styles.base, dimension]} contentFit="cover" />;
  }
  const tone = tones[book.coverTone];
  return (
    <View style={[styles.base, styles.placeholder, dimension, { backgroundColor: tone.background }]}>
      {size !== "small" ? (
        <Text style={[styles.title, { color: tone.text }]} numberOfLines={3}>
          {book.title}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.sm,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  placeholder: {
    justifyContent: "flex-end",
    padding: spacing.sm,
  },
  title: {
    ...typography.xsmallSemiBold,
  },
});
