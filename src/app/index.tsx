import { ScrollView, StyleSheet, Text, View } from "react-native";

import { colors, spacing, typography } from "@/theme";

// 미리보기할 때만 아래 import의 주석을 풀어 사용하세요.
import { Button, Card, TextField } from "@/components/ui";

export default function Index() {
  // 미리보기를 실행하려면 기존 return 블록을 잠시 주석 처리하고,
  // 아래 코드를 주석 해제하세요: return <ComponentPreview />;
  /*
  return (
    <View style={styles.container}>
      <Text style={styles.title}>오두막 책방</Text>
      <Text style={styles.caption}>디자인 토큰 적용 확인용 화면</Text>
    </View>
  );*/
  return <ComponentPreview />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: colors.background,
  },
  title: {
    ...typography.largeBold,
    color: colors.primary,
  },
  caption: {
    ...typography.smallRegular,
    color: colors.textSecondary,
  },
});

// 임시 공통 컴포넌트 미리보기입니다.
// 확인 후 이 블록과 위의 import 주석을 제거하면 원래 화면으로 돌아옵니다.
function ComponentPreview() {
  return (
    <ScrollView contentContainerStyle={previewStyles.container}>
      <Text style={previewStyles.title}>공통 컴포넌트 미리보기</Text>

      <Card>
        <Text style={previewStyles.sectionTitle}>Button</Text>
        <View style={previewStyles.group}>
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="tertiary">Tertiary</Button>
        </View>
        <View style={previewStyles.group}>
          <Button size="small">Small</Button>
          <Button size="medium">Medium</Button>
          <Button size="large">Large</Button>
        </View>
        <View style={previewStyles.group}>
          <Button disabled>Disabled</Button>
          <Button loading>Loading</Button>
        </View>
      </Card>

      <Card variant="tinted">
        <Text style={previewStyles.sectionTitle}>TextField</Text>
        <TextField label="책 이름" placeholder="책 이름을 입력하세요" />
        <TextField
          label="한 줄 소개"
          placeholder="독서방을 소개해 주세요"
          helperText="최대 500자까지 입력할 수 있어요."
          multiline
        />
        <TextField
          label="오류 상태"
          placeholder="값을 입력해 주세요"
          errorText="필수 입력 항목입니다."
        />
        <TextField
          label="읽기 전용"
          value="수정할 수 없는 값"
          editable={false}
        />
      </Card>

      <Text style={previewStyles.sectionTitle}>Card</Text>
      <Card>
        <Text style={previewStyles.cardTitle}>기본 카드</Text>
        <Text style={previewStyles.body}>
          기본 표면과 부드러운 그림자가 적용됩니다.
        </Text>
      </Card>
      <Card variant="tinted">
        <Text style={previewStyles.cardTitle}>배경 강조 카드</Text>
        <Text style={previewStyles.body}>
          테마 배경색으로 영역을 강조합니다.
        </Text>
      </Card>
    </ScrollView>
  );
}

const previewStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    gap: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  title: {
    ...typography.largeBold,
    color: colors.primary,
  },
  sectionTitle: {
    ...typography.baseBold,
    color: colors.textPrimary,
  },
  group: {
    gap: spacing.sm,
  },
  cardTitle: {
    ...typography.smallBold,
    color: colors.textPrimary,
  },
  body: {
    ...typography.smallRegular,
    color: colors.textSecondary,
  },
});
