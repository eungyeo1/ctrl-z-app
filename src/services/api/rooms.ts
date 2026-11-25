// 독서방 관련 API
// S-04 홈, S-08 독서방 목록, S-11 독서방 상세/참여, S-12 비공개방 비밀번호, S-34 대기열
import { mockBooks, mockMyRoomEntries, mockRoomPasswords, mockRooms, mockWaitlist } from "@/mocks/data";
import type {
  ApiResponse,
  Book,
  JoinState,
  MyRoom,
  PasswordCheckResult,
  Room,
  WaitlistEntry,
} from "@/types/models";

import { fail, mockResponse, ok } from "./client";

export interface RoomDetail {
  room: Room;
  book: Book;
  joinState: JoinState;
  waitlist?: WaitlistEntry; // 대기 중이거나 우선참여권이 있을 때
}

const MAX_PASSWORD_ATTEMPTS = 5;
const LOCK_MINUTES = 10;

const findBook = (bookId: string) => mockBooks.find((book) => book.id === bookId);
const findRoom = (roomId: string) => mockRooms.find((room) => room.id === roomId);
const isJoined = (roomId: string) => mockMyRoomEntries.some((entry) => entry.roomId === roomId);
const findWaitlist = (roomId: string) => mockWaitlist.find((entry) => entry.roomId === roomId);
const hasPriority = (entry?: WaitlistEntry) => !!entry?.priorityUntil && Date.parse(entry.priorityUntil) > Date.now();
const todayYmd = () => new Date().toISOString().slice(0, 10);
const isOngoing = (room: Room) => room.endDate >= todayYmd();

// 비공개방 비밀번호: 틀린 횟수와 잠금 시각, 통과한 방 (목업 메모리)
const passwordFails: Record<string, number> = {};
const passwordLockedUntil: Record<string, number> = {};
const passwordVerified = new Set<string>();

// S-08-1 해당 책의 독서방 리스트 (끝난 방 제외)
export function getRoomsByBook(bookId: string): Promise<ApiResponse<Room[]>> {
  // TODO(API): request<Room[]>(`/books/${bookId}/rooms`)
  return mockResponse(ok(mockRooms.filter((room) => room.bookId === bookId && isOngoing(room))));
}

// S-04-1 진행 중인 내 독서방
export function getMyRooms(): Promise<ApiResponse<MyRoom[]>> {
  // TODO(API): request<MyRoom[]>("/users/me/rooms")
  const result: MyRoom[] = [];
  for (const { roomId, ...rest } of mockMyRoomEntries) {
    const room = findRoom(roomId);
    const book = room && findBook(room.bookId);
    if (room && book) result.push({ room, book, ...rest });
  }
  return mockResponse(ok(result));
}

// S-04-2 추천 독서방 (목업: 내가 참여하지 않았고 자리가 남은 진행 중 공개방)
export function getRecommendedRooms(): Promise<ApiResponse<{ room: Room; book: Book }[]>> {
  // TODO(API): request("/rooms/recommendations")
  const result = mockRooms
    .filter(
      (room) =>
        !isJoined(room.id) && isOngoing(room) && room.visibility === "public" && room.memberCount < room.capacity,
    )
    .flatMap((room) => {
      const book = findBook(room.bookId);
      return book ? [{ room, book }] : [];
    });
  return mockResponse(ok(result));
}

// S-11-1 방 정보 미리보기
export function getRoomDetail(roomId: string): Promise<ApiResponse<RoomDetail>> {
  // TODO(API): request<RoomDetail>(`/rooms/${roomId}`)
  const room = findRoom(roomId);
  const book = room && findBook(room.bookId);
  if (!room || !book) return mockResponse(fail("ROOM_NOT_FOUND", "독서방을 찾을 수 없어요."));

  const waitlist = findWaitlist(room.id);
  let joinState: JoinState = "joinable";
  if (isJoined(room.id)) joinState = "joined";
  else if (hasPriority(waitlist)) joinState = "priority";
  else if (waitlist) joinState = "waiting";
  else if (room.memberCount >= room.capacity) joinState = "full";
  else if (room.visibility === "private" && !passwordVerified.has(room.id)) joinState = "private";

  return mockResponse(ok({ room, book, joinState, waitlist: waitlist ? { ...waitlist } : undefined }));
}

// S-12-1 비공개방 비밀번호 검증 / S-12-2 5회 연속 불일치 시 잠금
export function verifyRoomPassword(roomId: string, password: string): Promise<ApiResponse<PasswordCheckResult>> {
  // TODO(API): request(`/rooms/${roomId}/password`, { method: "POST", body: JSON.stringify({ password }) })
  const lockedUntil = passwordLockedUntil[roomId];
  if (lockedUntil && lockedUntil > Date.now()) {
    return mockResponse(ok({ ok: false, attemptsLeft: 0, lockedUntil: new Date(lockedUntil).toISOString() }));
  }
  if (mockRoomPasswords[roomId] === password) {
    passwordFails[roomId] = 0;
    passwordVerified.add(roomId);
    return mockResponse(ok({ ok: true, attemptsLeft: MAX_PASSWORD_ATTEMPTS }));
  }
  const fails = (passwordFails[roomId] ?? 0) + 1;
  passwordFails[roomId] = fails;
  if (fails >= MAX_PASSWORD_ATTEMPTS) {
    const until = Date.now() + LOCK_MINUTES * 60 * 1000;
    passwordLockedUntil[roomId] = until;
    passwordFails[roomId] = 0;
    return mockResponse(ok({ ok: false, attemptsLeft: 0, lockedUntil: new Date(until).toISOString() }));
  }
  return mockResponse(ok({ ok: false, attemptsLeft: MAX_PASSWORD_ATTEMPTS - fails }));
}

// S-11-1 참여 (공개방 / 비밀번호 통과한 비공개방 / 우선참여권 보유)
export function joinRoom(roomId: string): Promise<ApiResponse<{ roomId: string }>> {
  // TODO(API): request(`/rooms/${roomId}/join`, { method: "POST" })
  const room = findRoom(roomId);
  if (!room) return mockResponse(fail("ROOM_NOT_FOUND", "독서방을 찾을 수 없어요."));
  if (isJoined(roomId)) return mockResponse(ok({ roomId }));

  const waitlist = findWaitlist(roomId);
  const priority = hasPriority(waitlist);
  if (!priority && room.memberCount >= room.capacity) {
    return mockResponse(fail("ROOM_FULL", "정원이 가득 찼어요."));
  }
  if (!priority && room.visibility === "private" && !passwordVerified.has(roomId)) {
    return mockResponse(fail("PASSWORD_REQUIRED", "비밀번호를 먼저 입력해 주세요."));
  }

  if (priority) {
    // 우선참여권으로 들어가면 대기열에서 빠지고, 비어 있던 자리를 채웁니다.
    mockWaitlist.splice(mockWaitlist.indexOf(waitlist!), 1);
    room.waitingCount = Math.max(0, room.waitingCount - 1);
  } else {
    room.memberCount += 1;
  }
  mockMyRoomEntries.push({
    roomId,
    status: "reading",
    progress: 0,
    currentChapter: "1장",
    currentPage: 0,
    newMemoCount: 0,
  });
  return mockResponse(ok({ roomId }));
}

// S-34-1 정원 초과 시 대기 등록
export function joinWaitlist(roomId: string): Promise<ApiResponse<WaitlistEntry>> {
  // TODO(API): request(`/rooms/${roomId}/waitlist`, { method: "POST" })
  const room = findRoom(roomId);
  if (!room) return mockResponse(fail("ROOM_NOT_FOUND", "독서방을 찾을 수 없어요."));
  const existing = findWaitlist(roomId);
  if (existing) return mockResponse(ok({ ...existing }));
  room.waitingCount += 1;
  const entry: WaitlistEntry = { roomId, position: room.waitingCount };
  mockWaitlist.push(entry);
  return mockResponse(ok({ ...entry }));
}

// 대기 취소 (우선참여권을 포기해도 같은 동작 → S-34-3 다음 순번으로 이월)
export function leaveWaitlist(roomId: string): Promise<ApiResponse<{ roomId: string }>> {
  // TODO(API): request(`/rooms/${roomId}/waitlist`, { method: "DELETE" })
  const room = findRoom(roomId);
  const entry = findWaitlist(roomId);
  if (room && entry) {
    mockWaitlist.splice(mockWaitlist.indexOf(entry), 1);
    room.waitingCount = Math.max(0, room.waitingCount - 1);
  }
  return mockResponse(ok({ roomId }));
}
