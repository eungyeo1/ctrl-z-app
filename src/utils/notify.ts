// 간단한 안내 팝업 (웹에서는 Alert.alert 가 동작하지 않아 window.alert 로 대체)
import { Alert, Platform } from "react-native";

export function notify(title: string, message?: string) {
  if (Platform.OS === "web") {
    window.alert(message ? `${title}\n\n${message}` : title);
    return;
  }
  Alert.alert(title, message);
}
