// 날짜 표시 도우미

// ISO 시각 → "방금 전" / "5분 전" / "3시간 전" / "어제" / "4일 전" / "11.2"
export function relativeTime(iso: string, now = Date.now()) {
  const diffMin = Math.floor((now - Date.parse(iso)) / 60000);
  if (diffMin < 1) return "방금 전";
  if (diffMin < 60) return `${diffMin}분 전`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}시간 전`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay === 1) return "어제";
  if (diffDay < 7) return `${diffDay}일 전`;
  const date = new Date(iso);
  return `${date.getMonth() + 1}.${date.getDate()}`;
}

// ISO 시각 → "9월 13일"
export function monthDay(iso: string) {
  const date = new Date(iso);
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}

// ISO 시각 → "21:10"
export function clock(iso: string) {
  const date = new Date(iso);
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}
