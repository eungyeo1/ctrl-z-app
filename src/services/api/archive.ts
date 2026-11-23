// 아카이브 API (S-28 목록, S-29 상세 메모 타임라인, S-50 내보내기)
import { mockArchive, mockBooks, mockMemos, mockRooms } from "@/mocks/data";
import type { ApiResponse, ArchiveEntry, ExportFormat, Memo } from "@/types/models";

import { fail, mockResponse, ok } from "./client";

const toEntry = ({ roomId, status, memoCount }: (typeof mockArchive)[number]): ArchiveEntry | null => {
  const room = mockRooms.find((item) => item.id === roomId);
  const book = room && mockBooks.find((item) => item.id === room.bookId);
  return room && book ? { room, book, status, memoCount } : null;
};

// S-28-1 완독/중단(+읽는 중) 방 목록
export function getArchive(): Promise<ApiResponse<ArchiveEntry[]>> {
  // TODO(API): request<ArchiveEntry[]>("/archive")
  const entries = mockArchive.map(toEntry).filter((entry): entry is ArchiveEntry => entry !== null);
  return mockResponse(ok(entries));
}

// S-29-1 본인이 남긴 메모를 시간순으로
export function getArchiveDetail(roomId: string): Promise<ApiResponse<{ entry: ArchiveEntry; memos: Memo[] }>> {
  // TODO(API): request(`/archive/${roomId}/memos`) — API 명세서 93번
  const raw = mockArchive.find((item) => item.roomId === roomId);
  const entry = raw && toEntry(raw);
  if (!entry) return mockResponse(fail("ARCHIVE_NOT_FOUND", "기록을 찾을 수 없어요."));
  const memos = [...mockMemos].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  return mockResponse(ok({ entry, memos }));
}

// S-50-1 포맷 선택 후 파일 생성
// 목업에서는 텍스트 내용만 만들고, PDF·이미지는 실제 생성 대신 같은 텍스트를 돌려줍니다.
// TODO(API): 서버에서 파일을 만들어 URL을 주는지, 앱에서 만드는지(expo-print / react-native-view-shot) 정해야 해요.
export function exportArchive(
  roomId: string,
  format: ExportFormat,
): Promise<ApiResponse<{ fileName: string; text: string }>> {
  const raw = mockArchive.find((item) => item.roomId === roomId);
  const entry = raw && toEntry(raw);
  if (!entry) return mockResponse(fail("ARCHIVE_NOT_FOUND", "기록을 찾을 수 없어요."));

  const lines = [
    `${entry.book.title} · ${entry.room.name}`,
    `${entry.room.startDate} ~ ${entry.room.endDate}`,
    "",
    ...mockMemos.flatMap((memo) => [
      `[${memo.chapter} · ${memo.page}p] ${memo.createdAt.slice(0, 10)}`,
      ...(memo.quote ? [`“${memo.quote}”`] : []),
      memo.body,
      "",
    ]),
  ];
  const extension = { pdf: "pdf", image: "png", text: "txt" }[format];
  return mockResponse(ok({ fileName: `오두막책방_${entry.book.title}.${extension}`, text: lines.join("\n") }));
}
