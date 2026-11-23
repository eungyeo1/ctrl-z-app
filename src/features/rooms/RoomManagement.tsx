import { Button } from "@/components/ui";
import { colors, typography } from "@/theme";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export type ManagementPage = "owner" | "members" | "transfer";

type Member = {
  id: string;
  name: string;
  progress: string;
  activity: string;
  color: string;
};

const sampleMembers: Member[] = [
  { id: "chaehyeon", name: "채현", progress: "2장 · 32% · 읽는 중", activity: "2장 · 최근 활동 2시간 전", color: colors.memoAvatarRose },
  { id: "eunsu", name: "은수", progress: "5장 · 85% · 읽는 중", activity: "5장 · 최근 활동 어제", color: colors.memberAvatarOlive },
  { id: "jihwan", name: "지환", progress: "진행 기록 없음 · 쉬는 중", activity: "쉬는 중 · 최근 활동 4일 전", color: colors.memoAvatarBlue },
];

const menu = [
  { title: "방 설정 수정", description: "이름 · 소개 · 정원 · 기간 · 규칙", icon: "edit" },
  { title: "멤버 관리", description: "참여자 목록 · 강퇴", icon: "member" },
  { title: "신고함", description: "접수된 신고 0건", icon: "member" },
  { title: "방 삭제", description: "되돌릴 수 없어요", icon: "delete" },
] as const;

type Props = {
  roomTitle: string;
  page: ManagementPage;
  onPageChange: (page: ManagementPage) => void;
};

export function RoomManagement({ roomTitle, page, onPageChange }: Props) {
  const [members, setMembers] = useState(sampleMembers);
  const [kickTarget, setKickTarget] = useState<string>();
  const [selectedId, setSelectedId] = useState<string>();
  const [pendingId, setPendingId] = useState<string>();
  const [feedback, setFeedback] = useState("");
  const pendingMember = members.find((member) => member.id === pendingId);
  const selectedMember = members.find((member) => member.id === selectedId);

  function kick(member: Member) {
    if (kickTarget !== member.id) return;
    setMembers((current) => current.filter(({ id }) => id !== member.id));
    setKickTarget(undefined);
    if (pendingId === member.id) setPendingId(undefined);
    setFeedback(`${member.name} 님을 강퇴했어요.`);
  }

  function requestTransfer() {
    if (pendingId || !selectedMember) return;
    setPendingId(selectedMember.id);
    setFeedback(`${selectedMember.name} 님에게 방장 위임 요청을 보냈어요.`);
    onPageChange("members");
  }

  if (page === "owner") {
    return (
      <ScrollView key={page} contentContainerStyle={[styles.content, styles.ownerContent]}>
        <View style={styles.intro}>
          <View style={styles.crown}>
            <View style={styles.crownPoint} />
            <View style={styles.crownPoint} />
          </View>
          <Text style={styles.body}>{roomTitle}의 방장이에요.{"\n"}아래에서 방을 관리할 수 있어요.</Text>
        </View>
        <View style={styles.menu}>
          {menu.map((item, index) => (
            <Pressable
              accessibilityRole="button"
              key={item.title}
              onPress={() => {
                if (item.title === "멤버 관리") {
                  setKickTarget(undefined);
                  setFeedback("");
                  onPageChange("members");
                } else {
                  setFeedback(item.title === "신고함" ? "접수된 신고가 없어요." : `${item.title} 화면은 아직 연결되지 않았어요.`);
                }
              }}
              style={({ pressed }) => [styles.menuRow, index > 0 && styles.separator, pressed && styles.pressed]}
            >
              <MenuIcon kind={item.icon} />
              <View style={styles.copy}>
                <Text style={[styles.menuTitle, item.icon === "delete" && styles.danger]}>{item.title}</Text>
                <Text style={styles.meta}>{item.description}</Text>
              </View>
              <View style={styles.next} />
            </Pressable>
          ))}
        </View>
        {!!feedback && <Text accessibilityLiveRegion="polite" style={styles.feedback}>{feedback}</Text>}
      </ScrollView>
    );
  }

  return (
    <ScrollView key={page} contentContainerStyle={styles.content}>
      {page === "transfer" ? (
        <>
          <Text style={styles.meta}>새 방장이 수락하면 나는 일반 참여자로 전환돼요.{"\n"}수락 전까지는 언제든 요청을 취소할 수 있어요.</Text>
          <View accessibilityRole="radiogroup" style={styles.candidates}>
            {members.map((member) => {
              const selected = member.id === selectedId;
              return (
                <Pressable
                  accessibilityRole="radio"
                  accessibilityState={{ checked: selected }}
                  key={member.id}
                  onPress={() => setSelectedId(member.id)}
                  style={[styles.candidate, selected && styles.selected]}
                >
                  <View style={styles.radio}>{selected && <View style={styles.radioDot} />}</View>
                  <MemberLabel member={member} description={member.activity} />
                </Pressable>
              );
            })}
          </View>
          <Button size="medium" disabled={!selectedMember || !!pendingId} onPress={requestTransfer}>위임 요청 보내기</Button>
        </>
      ) : (
        <>
          <Text style={styles.meta}>참여자 {members.length + 1}명 · 방장 본인은 강퇴 대상에서 제외돼요.</Text>
          {pendingMember ? (
            <View style={styles.pending}>
              <Text style={[styles.meta, styles.copy]}>{pendingMember.name} 님의 위임 수락을 기다리고 있어요.</Text>
              <Button size="small" variant="secondary" onPress={() => {
                setPendingId(undefined);
                setFeedback("방장 위임 요청을 취소했어요.");
              }}>요청 취소</Button>
            </View>
          ) : (
            <Button size="medium" disabled={members.length === 0} onPress={() => {
              setSelectedId(undefined);
              setKickTarget(undefined);
              setFeedback("");
              onPageChange("transfer");
            }}>방장 위임하기</Button>
          )}
          <View style={styles.list}>
            {members.map((member) => (
              <View key={member.id} style={styles.member}>
                <View style={styles.memberRow}>
                  <MemberLabel member={member} description={member.progress} />
                  <Button
                    size="small"
                    variant="secondary"
                    accessibilityLabel={`${member.name} 강퇴`}
                    onPress={() => {
                      setFeedback("");
                      setKickTarget(member.id);
                    }}
                    style={styles.kickButton}
                  >강퇴</Button>
                </View>
                {kickTarget === member.id && (
                  <View style={styles.confirm}>
                    <Text style={[styles.meta, styles.confirmCopy]}>정말 강퇴할까요?{"\n"}다시 초대하려면 새로 참여시켜야 해요.</Text>
                    <View style={styles.actions}>
                      <Button size="small" variant="secondary" onPress={() => setKickTarget(undefined)}>취소</Button>
                      <Button size="small" accessibilityLabel={`${member.name} 강퇴 확인`} onPress={() => kick(member)}>강퇴</Button>
                    </View>
                  </View>
                )}
              </View>
            ))}
            {members.length === 0 && <Text style={styles.meta}>관리할 참여자가 없어요.</Text>}
          </View>
          {!!feedback && <Text accessibilityLiveRegion="polite" style={styles.feedback}>{feedback}</Text>}
        </>
      )}
    </ScrollView>
  );
}

function MemberLabel({ member, description }: { member: Member; description: string }) {
  return (
    <>
      <View style={[styles.avatar, { backgroundColor: member.color }]} />
      <View style={styles.copy}>
        <Text style={styles.body}>{member.name}</Text>
        <Text style={styles.meta}>{description}</Text>
      </View>
    </>
  );
}

function MenuIcon({ kind }: { kind: (typeof menu)[number]["icon"] }) {
  return (
    <View style={styles.icon}>
      {kind === "member" && <><View style={styles.personHead} /><View style={styles.personBody} /></>}
      {kind === "edit" && <><View style={styles.pen} /><View style={styles.penLine} /></>}
      {kind === "delete" && <><View style={styles.binHandle} /><View style={styles.bin} /></>}
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 30, paddingTop: 22, paddingBottom: 32, gap: 18 },
  ownerContent: { paddingHorizontal: 38, gap: 28 },
  intro: { borderRadius: 29, backgroundColor: colors.textBackground, padding: 20, minHeight: 110, justifyContent: "center", gap: 12 },
  body: { ...typography.uiBaseRegular, color: colors.textPrimary },
  meta: { ...typography.uiSmallRegular, color: colors.textSecondary },
  crown: { width: 16, height: 8, borderWidth: 1.5, borderTopWidth: 0, borderColor: colors.textPrimary, borderBottomLeftRadius: 3, borderBottomRightRadius: 3, flexDirection: "row" },
  crownPoint: { width: 6, height: 6, borderLeftWidth: 1.5, borderTopWidth: 1.5, borderColor: colors.textPrimary, transform: [{ rotate: "45deg" }] },
  menu: { borderRadius: 29, overflow: "hidden", backgroundColor: colors.textBackground },
  menuRow: { minHeight: 70, flexDirection: "row", alignItems: "center", paddingVertical: 10, paddingHorizontal: 20, gap: 14 },
  separator: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.textPrimary },
  menuTitle: { ...typography.uiBaseSemiBold, color: colors.textPrimary },
  danger: { color: colors.error },
  copy: { flex: 1, gap: 4 },
  next: { width: 8, height: 8, borderTopWidth: 2, borderRightWidth: 2, borderColor: colors.textPrimary, transform: [{ rotate: "45deg" }] },
  pressed: { opacity: 0.65 },
  icon: { width: 20, height: 22, alignItems: "center", justifyContent: "center" },
  personHead: { width: 10, height: 10, borderRadius: 5, borderWidth: 1.5, borderColor: colors.textPrimary },
  personBody: { width: 16, height: 10, borderRadius: 8, borderWidth: 1.5, borderColor: colors.textPrimary },
  pen: { width: 15, height: 5, borderWidth: 1.5, borderColor: colors.textPrimary, transform: [{ rotate: "-45deg" }] },
  penLine: { width: 16, height: 1.5, marginTop: 6, backgroundColor: colors.textPrimary },
  binHandle: { width: 7, height: 4, borderWidth: 1.5, borderColor: colors.error },
  bin: { width: 12, height: 12, borderWidth: 1.5, borderColor: colors.error },
  list: { gap: 24, marginTop: 12 },
  member: { gap: 12 },
  memberRow: { flexDirection: "row", alignItems: "center", minHeight: 58, gap: 12 },
  avatar: { width: 44, height: 44, borderRadius: 22 },
  kickButton: { minWidth: 76 },
  confirm: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 8, padding: 12, borderRadius: 24, backgroundColor: colors.textBackground },
  confirmCopy: { flexGrow: 1, flexBasis: 120 },
  actions: { flexDirection: "row", gap: 6 },
  candidates: { gap: 22 },
  candidate: { minHeight: 85, paddingHorizontal: 14, paddingVertical: 12, borderRadius: 27, borderColor: "transparent", borderWidth: 2, flexDirection: "row", alignItems: "center", gap: 12 },
  selected: { borderColor: colors.primary, backgroundColor: colors.textBackground, elevation: 3, shadowColor: colors.shadow, shadowOpacity: 0.22, shadowRadius: 3, shadowOffset: { width: 0, height: 3 } },
  radio: { width: 20, height: 20, borderWidth: 1.5, borderRadius: 10, borderColor: colors.primary, alignItems: "center", justifyContent: "center" },
  radioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.primary },
  pending: { flexDirection: "row", alignItems: "center", gap: 10, borderRadius: 22, padding: 12, backgroundColor: colors.textBackground },
  feedback: { ...typography.uiSmallSemiBold, alignSelf: "center", textAlign: "center", color: colors.onPrimary, backgroundColor: colors.primary, paddingVertical: 8, paddingHorizontal: 14, borderRadius: 16 },
});
