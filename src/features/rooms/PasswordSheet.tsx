// S-12 비공개방 비밀번호 입력 (피그마 시안 없음)
// S-12-1 비밀번호 검증 / S-12-2 5회 연속 틀리면 잠금
// 목업 비밀번호: r2(새벽 독서 모임) → 1234
import { useState } from "react";
import { StyleSheet, Text } from "react-native";

import { BottomSheet } from "@/components/layout/BottomSheet";
import { Button, TextField } from "@/components/ui";
import { verifyRoomPassword } from "@/services/api/rooms";
import { colors, typography } from "@/theme";

interface PasswordSheetProps {
  roomId: string;
  visible: boolean;
  onClose: () => void;
  onVerified: () => void; // 통과하면 부모가 참여 처리
}

const timeText = (iso: string) => {
  const date = new Date(iso);
  return `${date.getHours()}시 ${String(date.getMinutes()).padStart(2, "0")}분`;
};

export function PasswordSheet({ roomId, visible, onClose, onVerified }: PasswordSheetProps) {
  const [password, setPassword] = useState("");
  const [errorText, setErrorText] = useState<string>();
  const [lockedUntil, setLockedUntil] = useState<string>();
  const [loading, setLoading] = useState(false);

  const locked = !!lockedUntil && Date.parse(lockedUntil) > Date.now();

  const close = () => {
    setPassword("");
    setErrorText(undefined);
    onClose();
  };

  const handleSubmit = async () => {
    setLoading(true);
    const res = await verifyRoomPassword(roomId, password);
    setLoading(false);
    if (!res.success || !res.data) {
      setErrorText(res.error?.message ?? "확인하지 못했어요.");
      return;
    }
    const result = res.data;
    if (result.ok) {
      setPassword("");
      setErrorText(undefined);
      onVerified();
      return;
    }
    setPassword("");
    if (result.lockedUntil) {
      setLockedUntil(result.lockedUntil);
      setErrorText(undefined);
    } else {
      setErrorText(`비밀번호가 맞지 않아요. (${result.attemptsLeft}번 더 시도할 수 있어요)`);
    }
  };

  return (
    <BottomSheet visible={visible} onClose={close} title="비공개 독서방이에요">
      {locked ? (
        <Text style={styles.locked}>
          비밀번호를 5번 연속으로 틀려서 잠겼어요.{"\n"}
          {timeText(lockedUntil!)} 이후에 다시 시도하거나, 방장에게 초대 링크를 요청해 주세요.
        </Text>
      ) : (
        <>
          <Text style={styles.description}>방장에게 받은 비밀번호를 입력해 주세요.</Text>
          <TextField
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setErrorText(undefined);
            }}
            placeholder="비밀번호"
            secureTextEntry
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
            errorText={errorText}
            shadowPosition="none"
          />
          <Button size="large" disabled={!password} loading={loading} onPress={handleSubmit}>
            확인하고 참여하기
          </Button>
        </>
      )}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  description: {
    ...typography.uiBaseRegular,
    color: colors.textSecondary,
  },
  locked: {
    ...typography.uiBaseRegular,
    color: colors.error,
  },
});
