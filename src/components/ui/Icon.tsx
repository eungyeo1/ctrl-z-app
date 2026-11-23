// 아이콘 공통 컴포넌트 (Ionicons)
// ⚠️ 처음 한 번 설치 필요: npx expo install @expo/vector-icons
// 피그마 아이콘 에셋이 정해지면 이 파일 안만 바꾸면 됩니다.
import Ionicons from "@expo/vector-icons/Ionicons";
import type { ComponentProps } from "react";

import { colors } from "@/theme";

export type IconName = ComponentProps<typeof Ionicons>["name"];

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
}

export function Icon({ name, size = 22, color = colors.textPrimary }: IconProps) {
  return <Ionicons name={name} size={size} color={color} />;
}
