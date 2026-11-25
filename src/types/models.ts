import type { Href } from "expo-router";

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
  readingPurposes: string[];
  joinedAt: string; // YYYY-MM-DD
}

export type SocialProvider = "kakao" | "google";

// 회원가입 진행 중 정보 (S-01 → S-31 → S-30 사이에 들고 다님)
// - email: 이메일 가입. email·password 를 들고 약관 → 이메일 인증
// - social: 소셜 첫 로그인. 서버가 is_new_user 를 주면 소셜 토큰을 들고 약관으로
//           hasEmail 이 false 면(카카오에서 이메일을 못 받음) 이메일 인증을 한 번 더 거칩니다.
export interface SignupDraft {
  method: "email" | "social";
  email: string;
  password: string;
  provider?: SocialProvider;
  socialToken?: string;
  hasEmail?: boolean;
  agreements: { terms: boolean; privacy: boolean; marketing: boolean };
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
// waiting: 대기열 등록됨 / priority: 자리가 나서 우선참여권을 받음(S-34-2)
export type JoinState = "joinable" | "joined" | "full" | "private" | "waiting" | "priority";

// 대기열 (S-34)
export interface WaitlistEntry {
  roomId: string;
  position: number; // 1부터
  priorityUntil?: string; // ISO 시각. 있으면 우선참여권 보유 중
}

// 비공개방 비밀번호 확인 결과 (S-12)
export interface PasswordCheckResult {
  ok: boolean;
  attemptsLeft: number;
  lockedUntil?: string; // ISO 시각. 5회 연속 실패 시
}

// 책 등록 요청 (S-06, S-33)
export type BookRequestStatus = "pending" | "approved" | "rejected";

export interface BookRequest {
  id: string;
  title: string;
  author: string;
  isbn?: string;
  status: BookRequestStatus;
  rejectReason?: string;
  bookId?: string; // 승인되면 생성된 책 id
  requesterCount: number; // 같은 ISBN 요청이 합쳐진 수 (S-06-2)
}

// 아카이브 (S-28, S-29)
export type ArchiveStatus = "reading" | "finished" | "stopped";

export interface ArchiveEntry {
  room: Room;
  book: Book;
  status: ArchiveStatus;
  memoCount: number;
}

export interface Memo {
  id: string;
  chapter: string;
  page: number;
  quote?: string;
  body: string;
  createdAt: string; // ISO
}

export type ExportFormat = "pdf" | "image" | "text";

// 알림센터 (S-51)
export type NotificationType =
  | "memo"
  | "comment"
  | "reply"
  | "report"
  | "deadline"
  | "roomSetting"
  | "bookRequest"
  | "waitlist";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  createdAt: string; // ISO
  read: boolean;
  // 누르면 이동할 화면 (S-51-2 딥링크)
  link?: Href;
}
