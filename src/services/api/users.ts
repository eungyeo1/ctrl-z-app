// 내 정보 API (S-27 마이페이지, S-05 최근 검색어)
import { mockRecentSearches, mockUserStats } from "@/mocks/data";
import type { ApiResponse, UserStats } from "@/types/models";

import { mockResponse, ok } from "./client";

export function getMyStats(): Promise<ApiResponse<UserStats>> {
  // TODO(API): request<UserStats>("/users/me/stats")
  return mockResponse(ok({ ...mockUserStats }));
}

// 최근 검색어는 서버 API가 없으면 기기 저장소(AsyncStorage 등)로 옮겨도 됩니다.
export function getRecentSearches(): Promise<ApiResponse<string[]>> {
  return mockResponse(ok([...mockRecentSearches]));
}

export function addRecentSearch(keyword: string) {
  const index = mockRecentSearches.indexOf(keyword);
  if (index >= 0) mockRecentSearches.splice(index, 1);
  mockRecentSearches.unshift(keyword);
  mockRecentSearches.splice(5);
}
