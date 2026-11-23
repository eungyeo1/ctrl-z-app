// 목업 데이터 (백엔드 연결 전까지 화면 퍼블리싱용)
// 실제 API로 바꿀 때는 src/services/api/*.ts 만 고치면 되고, 이 파일은 지워도 됩니다.

import type {
  AppNotification,
  ArchiveStatus,
  Book,
  BookRequest,
  Memo,
  MyRoom,
  Room,
  User,
  UserStats,
  WaitlistEntry,
} from "@/types/models";

// 목업 날짜를 "지금" 기준으로 만듭니다.
const HOUR = 60 * 60 * 1000;
const now = Date.now();
const hoursAgo = (h: number) => new Date(now - h * HOUR).toISOString();
const hoursLater = (h: number) => new Date(now + h * HOUR).toISOString();

// 로그인 테스트용 계정: 이 이메일이면 "로그인", 다른 이메일이면 "회원가입"으로 분기됩니다.
export const MOCK_PASSWORD = "password1!";

export const mockUsers: User[] = [
  {
    id: "u1",
    email: "test@ctrlz.com",
    nickname: "은결",
    bio: "천천히, 오래 읽는 사람",
    favoriteGenres: ["소설", "에세이"],
    readingPurposes: ["깊이 있는 대화"],
    joinedAt: "2026-09-01",
  },
];

export const mockBooks: Book[] = [
  {
    id: "b1",
    isbn: "9788936434120",
    title: "소년이 온다",
    author: "한강",
    publisher: "창비",
    publishedYear: 2014,
    genre: "소설",
    description:
      "1980년 5월 광주를 배경으로, 그때 그곳에 있었던 사람들과 남겨진 이들의 이야기를 여섯 개의 장으로 엮은 장편소설.",
    totalChapters: 7,
    coverTone: "brown",
  },
  {
    id: "b2",
    isbn: "9791190090018",
    title: "지구에서 한아뿐",
    author: "정세랑",
    publisher: "난다",
    publishedYear: 2019,
    genre: "소설",
    description:
      "외계에서 온 존재와 지구의 한 사람이 만들어 가는 다정하고 엉뚱한 사랑 이야기.",
    totalChapters: 12,
    coverTone: "cream",
  },
  {
    id: "b3",
    isbn: "9788932473901",
    title: "사탄탱고",
    author: "크러스너호르커이 라슬로",
    publisher: "알마",
    publishedYear: 2018,
    genre: "소설",
    description:
      "비가 그치지 않는 헝가리의 몰락한 마을, 죽은 줄 알았던 이리미아시가 돌아온다는 소식에 술렁이는 사람들.",
    totalChapters: 12,
    coverTone: "gray",
  },
  {
    id: "b4",
    isbn: "9791167740984",
    title: "혼모노",
    author: "성해나",
    publisher: "창비",
    publishedYear: 2025,
    genre: "소설",
    description: "진짜와 가짜의 경계에서 흔들리는 사람들을 그린 소설집.",
    totalChapters: 7,
    coverTone: "brown",
  },
  {
    id: "b5",
    isbn: "9791198173898",
    title: "오두막의 겨울 (목업 도서)",
    author: "가상 작가",
    publisher: "목업출판",
    publishedYear: 2026,
    genre: "에세이",
    description: "검색 결과 확인용 가짜 도서입니다. 실제 데이터로 교체해 주세요.",
    totalChapters: 9,
    coverTone: "gray",
  },
];

// 책 등록 요청이 승인되어 추가된 책 (S-33 승인 예시)
mockBooks.push({
  id: "b6",
  isbn: "9791195521011",
  title: "모순",
  author: "양귀자",
  publisher: "쓰다",
  publishedYear: 2013,
  genre: "소설",
  description: "책 등록 요청으로 추가된 책 예시입니다. 실제 소개 문구로 교체해 주세요.",
  totalChapters: 10,
  coverTone: "cream",
});

export const mockRooms: Room[] = [
  {
    id: "r1",
    bookId: "b1",
    name: "천천히 소년이 온다",
    intro: "한 장씩 천천히 읽고 마음에 남은 문장을 나눠요. 부담 없이 오세요.",
    rules: ["주 2장 읽기", "스포일러는 블러 처리된 메모로만", "서로 존중하는 댓글"],
    visibility: "public",
    capacity: 6,
    memberCount: 4,
    startDate: "2026-11-16",
    endDate: "2026-12-14",
    ownerNickname: "한비",
    waitingCount: 0,
  },
  {
    id: "r2",
    bookId: "b1",
    name: "새벽 독서 모임",
    intro: "출근 전 30분, 같이 읽어요.",
    rules: ["매일 아침 진행률 기록", "결석 3회 시 자동 퇴장"],
    visibility: "private",
    capacity: 4,
    memberCount: 2,
    startDate: "2026-11-20",
    endDate: "2026-12-20",
    ownerNickname: "지현",
    waitingCount: 0,
  },
  {
    id: "r3",
    bookId: "b1",
    name: "광주 이야기 깊게 읽기",
    intro: "역사 배경 자료도 함께 공유하는 방이에요.",
    rules: ["장마다 메모 1개 이상"],
    visibility: "public",
    capacity: 5,
    memberCount: 5,
    startDate: "2026-11-10",
    endDate: "2026-12-10",
    ownerNickname: "채현",
    waitingCount: 1,
  },
  {
    id: "r4",
    bookId: "b2",
    name: "한아뿐 같이 읽어요",
    intro: "가볍고 다정한 소설, 주말마다 감상을 나눠요.",
    rules: ["주말 감상 메모 남기기"],
    visibility: "public",
    capacity: 8,
    memberCount: 3,
    startDate: "2026-11-18",
    endDate: "2026-12-09",
    ownerNickname: "은결",
    waitingCount: 0,
  },
  {
    id: "r5",
    bookId: "b3",
    name: "사탄탱고 완독 챌린지",
    intro: "어려운 책이지만 함께라면 끝까지!",
    rules: ["막히는 부분은 질문 남기기", "주 1장 이상"],
    visibility: "public",
    capacity: 6,
    memberCount: 5,
    startDate: "2026-11-01",
    endDate: "2026-12-31",
    ownerNickname: "지우",
    waitingCount: 0,
  },
  {
    id: "r6",
    bookId: "b4",
    name: "혼모노 단편 하나씩",
    intro: "단편 하나씩 읽고 이야기해요.",
    rules: ["단편 1편당 메모 1개"],
    visibility: "public",
    capacity: 6,
    memberCount: 1,
    startDate: "2026-11-25",
    endDate: "2026-12-23",
    ownerNickname: "주안",
    waitingCount: 0,
  },
  {
    // 정원 마감 + 내가 대기 1번 + 우선참여권 보유 (S-34-2 예시)
    id: "r7",
    bookId: "b2",
    name: "퇴근 후 30분 독서",
    intro: "대기열 등록 시 자리가 나는대로 안내 드려요!",
    rules: ["평일 저녁 30분 읽기"],
    visibility: "public",
    capacity: 6,
    memberCount: 6,
    startDate: "2026-11-20",
    endDate: "2026-12-18",
    ownerNickname: "지우",
    waitingCount: 1,
  },
  // 아래 3개는 이미 끝난 방 (아카이브 예시)
  {
    id: "r8",
    bookId: "b1",
    name: "가을 한 장씩",
    intro: "9월에 함께 완독한 방",
    rules: ["주 2장"],
    visibility: "public",
    capacity: 6,
    memberCount: 4,
    startDate: "2026-09-12",
    endDate: "2026-09-30",
    ownerNickname: "은결",
    waitingCount: 0,
  },
  {
    id: "r9",
    bookId: "b6",
    name: "모순 같이 읽기",
    intro: "10월 완독 방",
    rules: ["장마다 메모 1개"],
    visibility: "private",
    capacity: 4,
    memberCount: 3,
    startDate: "2026-10-01",
    endDate: "2026-10-20",
    ownerNickname: "한비",
    waitingCount: 0,
  },
  {
    id: "r10",
    bookId: "b3",
    name: "사탄탱고 1차 도전",
    intro: "기간 안에 못 끝낸 방",
    rules: ["주 1장"],
    visibility: "public",
    capacity: 5,
    memberCount: 5,
    startDate: "2026-09-01",
    endDate: "2026-10-15",
    ownerNickname: "지우",
    waitingCount: 0,
  },
];

// 로그인한 목업 유저(u1)가 참여 중인 방
export interface MockMyRoomEntry extends Omit<MyRoom, "room" | "book"> {
  roomId: string;
}

export const mockMyRoomEntries: MockMyRoomEntry[] = [
  {
    roomId: "r4",
    status: "reading",
    progress: 42,
    currentChapter: "5장 «다정한 침입»",
    currentPage: 132,
    newMemoCount: 3,
  },
  {
    roomId: "r5",
    status: "paused",
    progress: 15,
    currentChapter: "2장 «거미의 일»",
    currentPage: 48,
    newMemoCount: 0,
  },
];

export const mockUserStats: UserStats = {
  joinedRoomCount: 2,
  finishedBookCount: 7,
  memoCount: 13,
};

// 최근 검색어 (S-05 검색 화면)
export const mockRecentSearches = ["소년이 온다", "정세랑", "에세이"];

// 비공개방 비밀번호 (S-12). 테스트: r2 → 1234
export const mockRoomPasswords: Record<string, string> = { r2: "1234" };

// 대기열 (S-34): r7 에서 내가 1번이고, 자리가 나서 우선참여권을 받은 상태
export const mockWaitlist: WaitlistEntry[] = [{ roomId: "r7", position: 1, priorityUntil: hoursLater(20) }];

// 이메일 인증 코드 (S-30). 테스트: 123456
export const MOCK_VERIFICATION_CODE = "123456";

// 책 등록 요청 (S-06, S-33)
export const mockBookRequests: BookRequest[] = [
  { id: "req1", title: "모순", author: "양귀자", isbn: "9791195521011", status: "approved", bookId: "b6", requesterCount: 2 },
  {
    id: "req2",
    title: "어느 오두막의 일기",
    author: "미상",
    status: "rejected",
    rejectReason: "저자·출판 정보가 확인되지 않아요. 표지 사진과 함께 다시 요청해 주세요.",
    requesterCount: 1,
  },
  { id: "req3", title: "작별하지 않는다", author: "한강", isbn: "9788954682152", status: "pending", requesterCount: 3 },
];

// 아카이브 (S-28): 읽는 중 1 · 완독 2 · 중단 1
export const mockArchive: { roomId: string; status: ArchiveStatus; memoCount: number }[] = [
  { roomId: "r4", status: "reading", memoCount: 4 },
  { roomId: "r8", status: "finished", memoCount: 4 },
  { roomId: "r9", status: "finished", memoCount: 3 },
  { roomId: "r10", status: "stopped", memoCount: 6 },
];

// 아카이브 상세 메모 타임라인 (S-29). 방마다 같은 예시를 씁니다.
export const mockMemos: Memo[] = [
  {
    id: "m1",
    chapter: "1장",
    page: 12,
    quote: "첫 문장부터 오래 머물게 되는 책이었다.",
    body: "처음 몇 쪽을 세 번이나 다시 읽었다. 천천히 읽기로 한 이유가 여기 있었다.",
    createdAt: "2026-09-13T21:10:00+09:00",
  },
  {
    id: "m2",
    chapter: "2장",
    page: 48,
    body: "등장인물이 늘어나면서 관계도를 따로 적어두기 시작했다.",
    createdAt: "2026-09-17T23:02:00+09:00",
  },
  {
    id: "m3",
    chapter: "4장",
    page: 131,
    quote: "우리는 서로의 속도로 읽는다.",
    body: "방 사람들 메모를 보니 같은 문장에서 다들 멈췄다. 신기하다.",
    createdAt: "2026-09-22T08:40:00+09:00",
  },
  {
    id: "m4",
    chapter: "마지막 장",
    page: 214,
    body: "끝까지 왔다. 혼자였다면 중간에 덮었을 것 같다.",
    createdAt: "2026-09-29T22:15:00+09:00",
  },
];

// 알림센터 (S-51). 30일이 지난 알림은 화면에서 자동으로 정리됩니다(S-51-3).
export const mockNotifications: AppNotification[] = [
  {
    id: "n1",
    type: "waitlist",
    title: "자리가 났어요!",
    body: "'퇴근 후 30분 독서'에 우선 참여할 수 있어요. 20시간 안에 참여해 주세요.",
    createdAt: hoursAgo(1),
    read: false,
    link: { pathname: "/rooms/[roomId]", params: { roomId: "r7" } },
  },
  {
    id: "n2",
    type: "memo",
    title: "새 메모 3개",
    body: "'한아뿐 같이 읽어요'에 새 메모가 올라왔어요.",
    createdAt: hoursAgo(3),
    read: false,
    link: { pathname: "/rooms/[roomId]", params: { roomId: "r4" } },
  },
  {
    id: "n3",
    type: "bookRequest",
    title: "책 등록 요청이 승인됐어요",
    body: "«모순»이 검색 결과에 추가됐어요.",
    createdAt: hoursAgo(26),
    read: true,
    link: { pathname: "/books/request-result", params: { requestId: "req1" } },
  },
  {
    id: "n4",
    type: "comment",
    title: "새 댓글",
    body: "지현님이 내 메모에 댓글을 남겼어요.",
    createdAt: hoursAgo(50),
    read: true,
    link: { pathname: "/rooms/[roomId]", params: { roomId: "r4" } },
  },
  {
    id: "n5",
    type: "deadline",
    title: "종료 3일 전",
    body: "'사탄탱고 완독 챌린지'가 곧 끝나요.",
    createdAt: hoursAgo(75),
    read: true,
    link: { pathname: "/rooms/[roomId]", params: { roomId: "r5" } },
  },
  {
    id: "n6",
    type: "bookRequest",
    title: "책 등록 요청이 반려됐어요",
    body: "«어느 오두막의 일기» 요청을 다시 확인해 주세요.",
    createdAt: hoursAgo(120),
    read: true,
    link: { pathname: "/books/request-result", params: { requestId: "req2" } },
  },
  {
    id: "n7",
    type: "report",
    title: "신고 처리 결과",
    body: "신고하신 댓글이 검토 후 삭제되었어요.",
    createdAt: hoursAgo(200),
    read: true,
  },
  {
    id: "n8",
    type: "roomSetting",
    title: "방 설정 변경",
    body: "30일이 지나 자동으로 정리되는 예시 알림이에요.",
    createdAt: hoursAgo(24 * 40),
    read: true,
  },
];
