import { Tabs } from "expo-router";

import { Icon, type IconName } from "@/components/ui/Icon";
import { colors, fontFamily } from "@/theme";

// 탭 아이콘: [선택 안 됨, 선택됨]
const icons: Record<string, [IconName, IconName]> = {
  index: ["home-outline", "home"],
  search: ["search-outline", "search"],
  mypage: ["person-outline", "person"],
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.textPrimary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: { backgroundColor: colors.background, borderTopColor: colors.divider },
        tabBarLabelStyle: { fontFamily: fontFamily.pretendardSemiBold, fontSize: 11 },
        tabBarIcon: ({ focused, color }) => {
          const [outline, filled] = icons[route.name] ?? icons.index;
          return <Icon name={focused ? filled : outline} size={22} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: "홈" }} />
      <Tabs.Screen name="search" options={{ title: "검색" }} />
      <Tabs.Screen name="mypage" options={{ title: "마이 페이지" }} />
    </Tabs>
  );
}
