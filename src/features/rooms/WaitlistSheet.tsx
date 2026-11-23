// S-34-1 정원 초과 시 대기 등록 (피그마 시안 없음)
// 등록하면 내 순번을 보여주고, 자리가 나면 우선참여권 알림(S-34-2)이 옵니다.
import { useState } from "react";
import { StyleSheet, Text } from "react-native";

import { BottomSheet } from "@/components/layout/BottomSheet";
import { Button } from "@/components/ui";
import { joinWaitlist } from "@/services/api/rooms";
import { colors, typography } from "@/theme";
import type { Room } from "@/types/models";
import { notify } from "@/utils/notify";

import { PRIORITY_HOURS } from "./WaitlistInfo";

interface WaitlistSheetProps {
  room: Room;
  visible: boolean;
  onClose: () => void;
  onRegistered: () => void;
}

export function WaitlistSheet({ room, visible, onClose, onRegistered }: WaitlistSheetProps) {
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    const res = await joinWaitlist(room.id);
    setLoading(false);
    if (!res.success || !res.data) {
      notify("대기열에 등록하지 못했어요", res.error?.message);
      return;
    }
    onRegistered();
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} title="정원이 가득 찼어요">
      <Text style={styles.description}>
        지금 {room.waitingCount}명이 기다리고 있어요. 대기열에 등록하면 {room.waitingCount + 1}번째 순서가 돼요.
      </Text>
      <Text style={styles.note}>
        자리가 나면 순서대로 알림을 보내드려요. 알림을 받고 {PRIORITY_HOURS}시간 안에 참여하지 않으면 다음 순서로
        넘어가요.
      </Text>
      <Button size="large" loading={loading} onPress={handleRegister}>
        대기열에 등록하기
      </Button>
      <Button variant="tertiary" onPress={onClose}>
        다음에 할게요
      </Button>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  description: {
    ...typography.uiBaseRegular,
    color: colors.textPrimary,
  },
  note: {
    ...typography.uiSmallRegular,
    color: colors.textSecondary,
  },
});
