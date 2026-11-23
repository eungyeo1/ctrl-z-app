// 책 관련 API (S-05 책 검색, S-07 책 상세, S-04 추천)
import { mockBookRequests, mockBooks, mockRooms } from "@/mocks/data";
import type { ApiResponse, Book, BookRequest } from "@/types/models";

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

// ───────── 책 등록 요청 (S-06, S-33) ─────────

export interface BookRequestInput {
  title: string;
  author: string;
  isbn?: string;
  coverUri?: string;
}

// S-06-1 수동 등록 요청 / S-06-2 같은 ISBN 요청이 있으면 기존 요청에 합침
export function requestBook(input: BookRequestInput): Promise<ApiResponse<{ request: BookRequest; merged: boolean }>> {
  // TODO(API): request("/books/requests", { method: "POST", body: JSON.stringify(input) })
  const isbn = input.isbn?.replace(/\D/g, "") || undefined;
  if (isbn && mockBooks.some((book) => book.isbn === isbn)) {
    return mockResponse(fail("BOOK_EXISTS", "이미 등록된 책이에요. 검색에서 ISBN으로 찾아보세요."));
  }
  const existing = isbn ? mockBookRequests.find((item) => item.isbn === isbn && item.status === "pending") : undefined;
  if (existing) {
    existing.requesterCount += 1;
    return mockResponse(ok({ request: { ...existing }, merged: true }));
  }
  const created: BookRequest = {
    id: `req${mockBookRequests.length + 1}`,
    title: input.title.trim(),
    author: input.author.trim(),
    isbn,
    status: "pending",
    requesterCount: 1,
  };
  mockBookRequests.push(created);
  return mockResponse(ok({ request: { ...created }, merged: false }));
}

// S-33 요청 결과 (알림센터 딥링크로 들어옴)
export function getBookRequest(requestId: string): Promise<ApiResponse<{ request: BookRequest; book?: Book }>> {
  // TODO(API): request(`/books/requests/${requestId}`)
  const found = mockBookRequests.find((item) => item.id === requestId);
  if (!found) return mockResponse(fail("REQUEST_NOT_FOUND", "요청 내역을 찾을 수 없어요."));
  const book = found.bookId ? mockBooks.find((item) => item.id === found.bookId) : undefined;
  return mockResponse(ok({ request: { ...found }, book }));
}
