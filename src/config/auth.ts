// 소셜 로그인 설정값 (백엔드 콘솔 담당자에게 받은 값)
// 카카오 네이티브 앱 키와 구글 클라이언트 ID는 앱 안에 들어가는 공개 식별자라 레포에 둬도 됩니다.
// (비밀 키인 카카오 Client Secret, 구글 Client Secret 은 절대 앱에 넣지 마세요)
//
// ⚠️ app.json 의 plugins 에도 같은 값이 들어 있어요. 바꿀 때는 두 곳 모두 바꿔 주세요.
//    - @react-native-kakao/core → nativeAppKey
//    - @react-native-google-signin/google-signin → iosUrlScheme

export const KAKAO_NATIVE_APP_KEY = "e672b92575f8a5486ed76d138e7dccac";

// 서버가 id token 의 aud 를 이 값으로 검사하므로 webClientId 에는 꼭 웹 클라이언트 ID 를 넣어야 해요.
export const GOOGLE_WEB_CLIENT_ID = "660504824611-ik9akgdd1ie0d4ok4oplatrcleu92qh3.apps.googleusercontent.com";
export const GOOGLE_IOS_CLIENT_ID = "660504824611-aotuvv381bqa9nifveplevo04orrv7m5.apps.googleusercontent.com";
// Android 는 패키지명 + SHA-1 로 콘솔에 등록되어 있어 별도 ID 가 없어요.
