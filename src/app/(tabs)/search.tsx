// S-05 책 검색 (피그마 "검색", "검색 2")
// 제목 / 저자 / ISBN 검색(S-05-1), 최근 검색어, 결과 끝에 책 등록 요청(S-06) 안내
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { AppHeader } from "@/components/layout/AppHeader";
import { Screen } from "@/components/layout/Screen";
import { StateView } from "@/components/layout/StateView";
import { Button } from "@/components/ui";
import { BookListItem } from "@/features/books/BookListItem";
import { SearchBar } from "@/features/books/SearchBar";
import { useApi } from "@/hooks/useApi";
import { searchBooks } from "@/services/api/books";
import { addRecentSearch, getRecentSearches } from "@/services/api/users";
import { colors, radius, spacing, typography } from "@/theme";
import type { Book } from "@/types/models";

// 입력이 멈춘 뒤 이 시간만큼 기다렸다가 검색합니다.
const SEARCH_DELAY_MS = 300;


export default function Search() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Book[] | null>(null);
  const [loading, setLoading] = useState(false);
  const recent = useApi(getRecentSearches, []);

  useEffect(() => {
    const keyword = query.trim();
    if (!keyword) {
      setResults(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    let cancelled = false;
    const timer = setTimeout(async () => {
      const res = await searchBooks(keyword);
      if (cancelled) return;
      setResults(res.data ?? []);
      setLoading(false);
    }, SEARCH_DELAY_MS);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  const openBook = (bookId: string) => {
    addRecentSearch(query.trim());
    recent.reload();
    router.push({ pathname: "/books/[bookId]", params: { bookId } });
  };

  return (
    <Screen>
      <AppHeader />
      <Text style={styles.title}>어떤 책을 펼쳐볼까요</Text>

      <View style={styles.searchArea}>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder="제목, 저자, ISBN으로 검색"
          returnKeyType="search"
          autoCorrect={false}
          clearButtonMode="while-editing"
          accessibilityLabel="책 검색어"
        />
        {recent.data?.length ? (
          <View style={styles.recent}>
            <Text style={styles.caption}>최근 검색어</Text>
            <View style={styles.chips}>
              {recent.data.map((keyword) => (
                <Pressable
                  key={keyword}
                  accessibilityRole="button"
                  onPress={() => setQuery(keyword)}
                  style={({ pressed }) => [styles.chip, pressed && styles.pressed]}
                >
                  <Text style={styles.chipText}>{keyword}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        ) : null}
      </View>

      {loading ? (
        <StateView loading />
      ) : results === null ? null : (
        <View>
          <Text style={styles.resultTitle}>검색 결과 · {results.length}권</Text>
          {results.map((book) => (
            <BookListItem key={book.id} book={book} onPress={() => openBook(book.id)} />
          ))}

          {/* 피그마 "검색 2": 결과 끝 등록 요청 카드 */}
          <View style={styles.requestCard}>
            <Text style={styles.requestText}>
              {results.length === 0
                ? `'${query.trim()}'에 대한 검색 결과가 없어요.\n찾는 책이 없다면 직접 등록을 요청해 보세요.`
                : "찾는 책이 없다면 직접 등록을 요청해 보세요."}
            </Text>
            <Button
              variant="secondary"
              size="small"
              onPress={() => router.push({ pathname: "/books/request", params: { title: query.trim() } })}
            >
              책 등록 요청
            </Button>
          </View>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    ...typography.uiTitleBold,
    color: colors.textPrimary,
    marginTop: -spacing.md,
  },
  searchArea: {
    gap: spacing.lg,
  },
  recent: {
    gap: spacing.sm,
  },
  caption: {
    ...typography.uiSmallRegular,
    color: colors.textSecondary,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: colors.textBackground,
  },
  chipText: {
    ...typography.uiSmallRegular,
    color: colors.textSecondary,
  },
  pressed: {
    opacity: 0.7,
  },
  resultTitle: {
    ...typography.uiHeadlineBold,
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  requestCard: {
    alignItems: "center",
    gap: spacing.md,
    marginTop: spacing.lg,
    padding: spacing.lg,
    borderRadius: radius.xl,
    backgroundColor: colors.textBackground,
  },
  requestText: {
    ...typography.uiSmallRegular,
    color: colors.textSecondary,
    textAlign: "center",
  },
});
