// 독서방 화면 주소 (11/23 회의에서 정한 방식)
//   rooms/[roomId]          → S-13 독서방 홈 (참여한 사람, FE2)
//   rooms/[roomId]/preview  → S-11 독서방 상세/참여 (참여 전, FE1)
// 방으로 이동할 때는 아래 함수를 써서 주소를 한 곳에서 관리합니다.
import type { Href } from "expo-router";

// 참여 전 미리보기 (검색·책별 목록·추천·우선참여권 알림)
export const roomPreviewHref = (roomId: string): Href => ({
  pathname: "/rooms/[roomId]/preview",
  params: { roomId },
});

// 참여한 방 안으로 (홈의 참여 중인 독서방, 메모·댓글·마감 알림)
// app/rooms/[roomId].tsx 는 FE2 독서방 홈 + FE3 메모 탭이 채울 화면이라 FE1 에서는 건드리지 않습니다.
export const roomHomeHref = (roomId: string): Href => ({
  pathname: "/rooms/[roomId]",
  params: { roomId },
});
