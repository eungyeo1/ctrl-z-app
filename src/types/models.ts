// 여러 화면에서 함께 쓰는 데이터 타입입니다.
// 필드 이름은 API 명세서 기준으로 맞추고, 서버 응답이 정해지면 여기만 고치면 됩니다.

// 서버 공통 응답 형식: { success, data, error: { code, message } }
export interface ApiError {
  code: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: ApiError | null;
}

export interface User {
  id: string;
  email: string;
  nickname: string;
  bio?: string;
  favoriteGenres: string[];
  joinedAt: string; // YYYY-MM-DD
}

// 마이페이지 상단 숫자 3개
export interface UserStats {
  joinedRoomCount: number;
  finishedBookCount: number;
  memoCount: number;
}

export interface Book {
  id: string;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  publishedYear: number;
  genre: string;
  description: string;
  totalChapters: number;
  // 표지 이미지가 없을 때 쓰는 임시 표지 색 (목업 전용)
  coverTone: "brown" | "cream" | "gray";
  coverUrl?: string;
}

export type RoomVisibility = "public" | "private";
export type ReadingStatus = "reading" | "paused" | "finished";

export interface Room {
  id: string;
  bookId: string;
  name: string;
  intro: string;
  rules: string[];
  visibility: RoomVisibility;
  capacity: number;
  memberCount: number;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  ownerNickname: string;
  waitingCount: number; // 정원 초과 시 대기자 수
}

// 내가 참여 중인 방 (홈·마이페이지에서 사용)
export interface MyRoom {
  room: Room;
  book: Book;
  status: ReadingStatus;
  progress: number; // 0~100
  currentChapter: string; // 예: 3장 «눈물처럼 흐르는 죽음»
  currentPage: number;
  newMemoCount: number;
}

// 방 상세 화면에서 참여 버튼 상태를 정하는 값
export type JoinState = "joinable" | "joined" | "full" | "private";
