// 알림센터 API (S-51)
import { mockNotifications } from "@/mocks/data";
import type { ApiResponse, AppNotification } from "@/types/models";

import { mockResponse, ok } from "./client";

// S-51-3 생성 후 30일이 지난 알림은 정리 (실서버에서는 서버가 지움)
const KEEP_DAYS = 30;
const isFresh = (item: AppNotification) => Date.now() - Date.parse(item.createdAt) < KEEP_DAYS * 24 * 60 * 60 * 1000;

// S-51-1 / S-51-2 알림 목록 (최신순)
export function getNotifications(): Promise<ApiResponse<AppNotification[]>> {
  // TODO(API): request<AppNotification[]>("/notifications")
  const list = mockNotifications.filter(isFresh).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return mockResponse(ok(list.map((item) => ({ ...item }))));
}

export function getUnreadCount(): Promise<ApiResponse<number>> {
  // TODO(API): request<number>("/notifications/unread-count")
  return mockResponse(ok(mockNotifications.filter((item) => isFresh(item) && !item.read).length));
}

export function markNotificationRead(id: string): Promise<ApiResponse<{ id: string }>> {
  // TODO(API): request(`/notifications/${id}/read`, { method: "POST" })
  const found = mockNotifications.find((item) => item.id === id);
  if (found) found.read = true;
  return mockResponse(ok({ id }));
}

export function markAllNotificationsRead(): Promise<ApiResponse<{ done: true }>> {
  // TODO(API): request("/notifications/read-all", { method: "POST" })
  mockNotifications.forEach((item) => {
    item.read = true;
  });
  return mockResponse(ok({ done: true }));
}
