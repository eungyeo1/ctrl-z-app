// 목업 데이터 (백엔드 연결 전까지 화면 퍼블리싱용)
// 실제 API로 바꿀 때는 src/services/api/*.ts 만 고치면 되고, 이 파일은 지워도 됩니다.

import type { Book, MyRoom, Room, User, UserStats } from "@/types/models";

// 로그인 테스트용 계정: 이 이메일이면 "로그인", 다른 이메일이면 "회원가입"으로 분기됩니다.
export const MOCK_PASSWORD = "password1!";

export const mockUsers: User[] = [
  {
    id: "u1",
    email: "test@ctrlz.com",
    nickname: "은결",
    bio: "천천히, 오래 읽는 사람",
    favoriteGenres: ["소설", "에세이"],
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
