// 책 관련 API (S-05 책 검색, S-07 책 상세, S-04 추천)
import { mockBooks, mockRooms } from "@/mocks/data";
import type { ApiResponse, Book } from "@/types/models";

import { fail, mockResponse, ok } from "./client";

// 띄어쓰기·대소문자·하이픈을 무시하고 비교합니다.
const normalize = (text: string) => text.replace(/[\s-]/g, "").toLowerCase();

// S-05-1 검색어 기반 조회: 제목 / 저자 / ISBN
export function searchBooks(query: string): Promise<ApiResponse<Book[]>> {
  const keyword = normalize(query);
  if (!keyword) return mockResponse(ok([]));
  // TODO(API): request<Book[]>(`/books?query=${encodeURIComponent(query)}`)
  const result = mockBooks.filter(
    (book) =>
      normalize(book.title).includes(keyword) ||
      normalize(book.author).includes(keyword) ||
      book.isbn.includes(keyword),
  );
  return mockResponse(ok(result));
}

// S-07-1 책 상세
export function getBook(bookId: string): Promise<ApiResponse<Book>> {
  // TODO(API): request<Book>(`/books/${bookId}`)
  const book = mockBooks.find((item) => item.id === bookId);
  return mockResponse(book ? ok(book) : fail("BOOK_NOT_FOUND", "책 정보를 찾을 수 없어요."));
}

// S-04-2 추천 책 (목업: 독서방이 많은 순)
export function getRecommendedBooks(): Promise<ApiResponse<Book[]>> {
  // TODO(API): request<Book[]>("/books/recommendations")
  const roomCount = (bookId: string) => mockRooms.filter((room) => room.bookId === bookId).length;
  const sorted = [...mockBooks].sort((a, b) => roomCount(b.id) - roomCount(a.id));
  return mockResponse(ok(sorted.slice(0, 4)));
}
