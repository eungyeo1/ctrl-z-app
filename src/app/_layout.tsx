import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)/login" options={{ title: "로그인" }} />
      <Stack.Screen name="books/[bookId]" options={{ title: "책 상세" }} />
      <Stack.Screen name="rooms/[roomId]" options={{ title: "독서방 상세" }} />
    </Stack>
  );
}
