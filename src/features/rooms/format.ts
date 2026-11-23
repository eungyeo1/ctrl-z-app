// 독서방 화면에서 쓰는 날짜·문구 포맷
import type { ReadingStatus, Room } from "@/types/models";

const DAY_MS = 24 * 60 * 60 * 1000;

const toDate = (ymd: string) => {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(y, m - 1, d);
};

// "2026-11-16" → "11.16"
export const shortDate = (ymd: string) => {
  const [, m, d] = ymd.split("-");
  return `${Number(m)}.${Number(d)}`;
};

export const periodText = (room: Pick<Room, "startDate" | "endDate">) =>
  `${shortDate(room.startDate)} ~ ${shortDate(room.endDate)}`;

// 종료일까지 남은 날: "D-21", 당일 "D-Day", 지난 경우 "종료"
export function dDay(endDate: string, today = new Date()) {
  const base = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const diff = Math.round((toDate(endDate).getTime() - base.getTime()) / DAY_MS);
  if (diff > 0) return `D-${diff}`;
  if (diff === 0) return "D-Day";
  return "종료";
}

export const statusLabel: Record<ReadingStatus, string> = {
  reading: "읽는 중",
  paused: "쉬는 중",
  finished: "완독",
};

// 목록 카드 오른쪽 아래 마감 문구: "D - 9 마감" / "오늘 마감" / "종료"
export function deadlineText(endDate: string) {
  const d = dDay(endDate);
  if (d === "종료") return d;
  if (d === "D-Day") return "오늘 마감";
  return `D - ${d.slice(2)} 마감`;
}
