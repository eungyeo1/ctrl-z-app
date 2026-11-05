# Ctrl+Z — 프론트엔드

SOLUX 26-2 Ctrl+Z 팀의 앱 프로젝트입니다. (Expo + React Native + TypeScript + Expo Router)

## 실행 방법

1. 레포 받기

   ```bash
   git clone https://github.com/eungyeo1/ctrl-z-app.git
   cd ctrl-z-app
   ```

2. 패키지 설치

   ```bash
   npm install
   ```

3. 개발 서버 실행

   ```bash
   npx expo start
   ```

4. 휴대폰에 **Expo Go** 앱(최신 버전)을 설치하고 터미널의 QR 코드를 스캔합니다.
   - 폰에서 안 열리면(학교 와이파이 등) 터널 모드로 실행하세요.

     ```bash
     npx expo start --tunnel ngrok
     ```

   - 터미널에서 `w` 를 누르면 웹 브라우저로도 볼 수 있습니다.

## 폴더 구조

[`src/README.md`](src/README.md) 를 참고해 주세요.

## 팀 규칙

- 패키지 매니저는 **npm** 으로 통일합니다.
- 라이브러리는 `npx expo install <패키지>` 로 설치합니다. (SDK 버전에 맞는 버전으로 설치됨)
- 색상·간격·글자 크기는 `@/theme` 의 디자인 토큰을 사용합니다.
- 커밋 전에 `npm run lint` 로 코드 검사를 해 주세요.
