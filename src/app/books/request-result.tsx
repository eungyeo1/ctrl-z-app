// S-33 책 등록 요청 결과 (피그마 "요청 결과")
// 요청 직후 / 알림센터 딥링크로 들어옵니다. 상태에 따라:
// - 검토 중(pending): 접수 안내 (+ 같은 ISBN 요청과 합쳐졌는지)
// - S-33-1 승인: 책 상세로 이동
// - S-33-2 반려: 사유 보여주고 다시 요청하기
import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { Screen } from "@/components/layout/Screen";
import { StateView } from "@/components/layout/StateView";
import { Button } from "@/components/ui";
import { Icon, type IconName } from "@/components/ui/Icon";
import { useApi } from "@/hooks/useApi";
import { getBookRequest } from "@/services/api/books";
import { colors, radius, spacing, typography } from "@/theme";
import type { BookRequestStatus } from "@/types/models";

const statusView: Record<BookRequestStatus, { icon: IconName; title: string; color: string }> = {
  pending: { icon: "time-outline", title: "요청이 접수되었어요", color: colors.textSecondary },
  approved: { icon: "checkmark-circle-outline", title: "요청이 승인되었어요", color: colors.primary },
  rejected: { icon: "alert-circle-outline", title: "요청이 반려되었어요", color: colors.error },
};

export default function BookRequestResult() {
  const router = useRouter();
  const { requestId, merged } = useLocalSearchParams<{ requestId: string; merged?: string }>();
  const result = useApi(() => getBookRequest(requestId), [requestId]);

  if (result.loading || result.error || !result.data) {
    return (
      <Screen edges={["bottom"]}>
        <StateView loading={result.loading} errorMessage={result.error?.message} onRetry={result.reload} />
      </Screen>
    );
  }

  const { request, book } = result.data;
  const view = statusView[request.status];

  const footer =
    request.status === "approved" && book ? (
      <Button size="large" onPress={() => router.replace({ pathname: "/books/[bookId]", params: { bookId: book.id } })}>
        책 상세로 이동하기
      </Button>
    ) : request.status === "rejected" ? (
      <Button
        size="large"
        onPress={() =>
          router.replace({ pathname: "/books/request", params: { title: request.title, author: request.author } })
        }
      >
        다시 요청하기
      </Button>
    ) : (
      <Button size="large" onPress={() => router.back()}>
        확인
      </Button>
    );

  return (
    <Screen edges={["bottom"]} footer={footer}>
      <Text style={styles.screenTitle}>요청 결과</Text>

      <View style={styles.center}>
        <Icon name={view.icon} size={56} color={view.color} />
        <Text style={styles.title}>{view.title}</Text>
        <Text style={styles.description}>
          {request.status === "approved"
            ? `«${request.title}»이 검색 결과에 추가됐어요.\n바로 독서방을 둘러보거나 새로 만들어보세요.`
            : request.status === "rejected"
              ? `«${request.title}» 요청을 등록하지 못했어요.`
              : merged === "1"
                ? `같은 책을 먼저 요청한 분이 있어서 요청을 합쳤어요.\n지금까지 ${request.requesterCount}명이 이 책을 기다리고 있어요.`
                : `운영자가 확인한 뒤 결과를 알림으로 알려드릴게요.`}
        </Text>
      </View>

      {request.status === "rejected" && request.rejectReason ? (
        <View style={styles.reasonBox}>
          <Text style={styles.reasonLabel}>반려 사유</Text>
          <Text style={styles.reasonText}>{request.rejectReason}</Text>
        </View>
      ) : null}

      <View style={styles.summary}>
        <Text style={styles.summaryText}>
          {request.title} · {request.author}
          {request.isbn ? ` · ISBN ${request.isbn}` : ""}
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screenTitle: {
    ...typography.uiBaseSemiBold,
    color: colors.textPrimary,
  },
  center: {
    alignItems: "center",
    gap: spacing.md,
    paddingTop: spacing.xxl,
  },
  title: {
    ...typography.uiHeadlineBold,
    color: colors.textPrimary,
  },
  description: {
    ...typography.uiSmallRegular,
    color: colors.textSecondary,
    textAlign: "center",
  },
  reasonBox: {
    gap: spacing.xs,
    padding: spacing.lg,
    borderRadius: radius.xl,
    backgroundColor: colors.textBackground,
  },
  reasonLabel: {
    ...typography.uiSmallSemiBold,
    color: colors.textSecondary,
  },
  reasonText: {
    ...typography.uiBaseRegular,
    color: colors.textPrimary,
  },
  summary: {
    alignItems: "center",
  },
  summaryText: {
    ...typography.uiSmallRegular,
    color: colors.textDisabled,
  },
});
