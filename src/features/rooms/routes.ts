// 독서방 화면 주소 (11/23 회의에서 정한 방식)
//   rooms/[roomId]          → S-13 독서방 홈 (참여한 사람, FE2)
//   rooms/[roomId]/preview  → S-11 독서방 상세/참여 (참여 전, FE1)
//   rooms/[roomId]/members  → S-38 멤버 관리 (FE3)
// 방으로 이동할 때는 아래 함수를 써서 주소를 한 곳에서 관리합니다.
import type { Href } from "expo-router";

// 참여 전 미리보기 (검색·책별 목록·추천·우선참여권 알림)
export const roomPreviewHref = (roomId: string): Href => ({
  pathname: "/rooms/[roomId]/preview",
  params: { roomId },
});

// 참여한 방 안으로 (홈의 참여 중인 독서방, 메모·댓글·마감 알림)
// TODO: FE2 독서방 홈(app/rooms/[roomId]/index.tsx)이 develop 에 합쳐지면
//       아래를 { pathname: "/rooms/[roomId]", params: { roomId } } 로 바꾸세요.
//       그 전까지는 화면이 없어서 미리보기 화면으로 보냅니다.
export const roomHomeHref = (roomId: string): Href => roomPreviewHref(roomId);
