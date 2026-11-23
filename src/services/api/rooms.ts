// 독서방 관련 API (S-04 홈, S-08 독서방 목록, S-11 독서방 상세/참여)
import { mockBooks, mockMyRoomEntries, mockRooms } from "@/mocks/data";
import type { ApiResponse, Book, JoinState, MyRoom, Room } from "@/types/models";

import { fail, mockResponse, ok } from "./client";

export interface RoomDetail {
  room: Room;
  book: Book;
  joinState: JoinState;
}

const findBook = (bookId: string) => mockBooks.find((book) => book.id === bookId);
const isJoined = (roomId: string) => mockMyRoomEntries.some((entry) => entry.roomId === roomId);

// S-08-1 해당 책의 독서방 리스트
export function getRoomsByBook(bookId: string): Promise<ApiResponse<Room[]>> {
  // TODO(API): request<Room[]>(`/books/${bookId}/rooms`)
  return mockResponse(ok(mockRooms.filter((room) => room.bookId === bookId)));
}

// S-04-1 진행 중인 내 독서방
export function getMyRooms(): Promise<ApiResponse<MyRoom[]>> {
  // TODO(API): request<MyRoom[]>("/users/me/rooms")
  const result: MyRoom[] = [];
  for (const { roomId, ...rest } of mockMyRoomEntries) {
    const room = mockRooms.find((item) => item.id === roomId);
    const book = room && findBook(room.bookId);
    if (room && book) result.push({ room, book, ...rest });
  }
  return mockResponse(ok(result));
}

// S-04-2 추천 독서방 (목업: 내가 참여하지 않았고 자리가 남은 공개방)
export function getRecommendedRooms(): Promise<ApiResponse<{ room: Room; book: Book }[]>> {
  // TODO(API): request("/rooms/recommendations")
  const result = mockRooms
    .filter((room) => !isJoined(room.id) && room.visibility === "public" && room.memberCount < room.capacity)
    .flatMap((room) => {
      const book = findBook(room.bookId);
      return book ? [{ room, book }] : [];
    });
  return mockResponse(ok(result));
}

// S-11-1 방 정보 미리보기
export function getRoomDetail(roomId: string): Promise<ApiResponse<RoomDetail>> {
  // TODO(API): request<RoomDetail>(`/rooms/${roomId}`)
  const room = mockRooms.find((item) => item.id === roomId);
  const book = room && findBook(room.bookId);
  if (!room || !book) return mockResponse(fail("ROOM_NOT_FOUND", "독서방을 찾을 수 없어요."));

  let joinState: JoinState = "joinable";
  if (isJoined(room.id)) joinState = "joined";
  else if (room.memberCount >= room.capacity) joinState = "full";
  else if (room.visibility === "private") joinState = "private";

  return mockResponse(ok({ room, book, joinState }));
}

// S-11-1 공개방 참여
export function joinRoom(roomId: string): Promise<ApiResponse<{ roomId: string }>> {
  // TODO(API): request(`/rooms/${roomId}/join`, { method: "POST" })
  const room = mockRooms.find((item) => item.id === roomId);
  if (!room) return mockResponse(fail("ROOM_NOT_FOUND", "독서방을 찾을 수 없어요."));
  if (room.memberCount >= room.capacity) {
    return mockResponse(fail("ROOM_FULL", "정원이 가득 찼어요."));
  }
  if (!isJoined(roomId)) {
    room.memberCount += 1;
    mockMyRoomEntries.push({
      roomId,
      status: "reading",
      progress: 0,
      currentChapter: "1장",
      currentPage: 0,
      newMemoCount: 0,
    });
  }
  return mockResponse(ok({ roomId }));
}
