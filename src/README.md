# src 폴더 구조

```
src/
├── app/              # 화면(라우트). 파일 하나 = 화면 하나 (Expo Router)
│                     # _layout.tsx 는 네비게이션(Stack, Tabs) 설정
├── features/         # 기능별 코드 (예: auth/, rooms/, notes/)
│                     # 화면에서 쓰는 기능 전용 컴포넌트·훅·API 호출을 기능 폴더 안에 둡니다
├── components/
│   ├── ui/           # 공통 UI: Button, Input, Card, Modal 등
│   └── layout/       # 공통 레이아웃: Header, Screen 등
├── services/
│   └── api/          # 서버 통신 공통 설정 (base URL, 요청/에러 처리)
├── mocks/            # 백엔드 연결 전 목업 데이터 (services/api 에서만 사용)
├── hooks/            # 여러 기능에서 함께 쓰는 커스텀 훅
├── theme/            # 디자인 토큰: 색상·간격·글자 스타일
├── constants/        # 공통 상수 (예: 화면에 쓰는 고정 문구, 설정 값)
├── types/            # 여러 곳에서 쓰는 공통 타입 (User, Book, Room 등)
└── utils/            # 작은 공통 함수 (예: notify 안내 팝업)
```

## 규칙

- `app/` 안에는 **화면 파일만** 둡니다. 컴포넌트·훅·유틸은 `app/` 밖에 둡니다.
  (`app/` 안의 모든 파일은 화면으로 인식됩니다.)
- import 할 때는 상대 경로(`../../`) 대신 `@/` 를 사용합니다.
  예: `import { colors } from "@/theme";`
- 색상, 간격, 글자 크기는 숫자나 hex 값을 직접 쓰지 말고 `@/theme` 토큰을 사용합니다.
- 비어 있는 폴더의 `.gitkeep` 은 git에 폴더를 올리기 위한 빈 파일입니다. 그 폴더에 실제 파일이 생기면 지워도 됩니다.
- 라이브러리는 `npm install` 대신 `npx expo install <패키지>` 로 설치합니다. (SDK 버전에 맞는 버전으로 설치됨)

## 목업 데이터 → 실제 API 전환

- 화면은 `@/services/api/*` 함수만 부릅니다. 지금은 이 함수들이 `@/mocks/data.ts` 를 서버 응답 형식(`{ success, data, error }`)으로 돌려줍니다.
- 백엔드 연결 시 각 함수의 `TODO(API)` 주석에 적힌 `request()` 호출로 바꾸면 화면 코드는 그대로 둬도 됩니다.
- 목업 로그인 계정: `test@ctrlz.com` / `password1!` (다른 이메일은 회원가입으로 분기)
- 아이콘은 `@/components/ui/Icon` (Ionicons) 을 씁니다. 처음 한 번 `npx expo install @expo/vector-icons` 가 필요합니다.
