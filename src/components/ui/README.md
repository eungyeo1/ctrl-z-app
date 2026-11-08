# 공통 UI 컴포넌트

이 폴더의 컴포넌트는 여러 화면에서 반복해서 쓰는 기본 UI입니다. 색상·간격·글자 스타일은 `@/theme` 토큰을 사용합니다.

```tsx
import { Button, Card, Dropdown, TextField } from "@/components/ui";
```

## Button

`Button`은 누를 수 있는 공통 버튼입니다. 기본값은 `primary` 종류와 `medium` 크기입니다.

```tsx
<Button onPress={handleSave}>저장하기</Button>
<Button variant="secondary" size="small" onPress={handleCancel}>
  취소
</Button>
<Button loading onPress={handleSubmit}>제출하기</Button>
```

### 종류와 크기

| prop | 값 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `variant` | `primary`, `secondary`, `tertiary` | `primary` | 채움형 주요 버튼, 테두리형 보조 버튼, 배경 없는 버튼 |
| `size` | `small`, `medium`, `large` | `medium` | 최소 높이와 안쪽 여백 |

### 상태와 스타일 props

| prop | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `children` | `ReactNode` | 필수 | 버튼 안의 텍스트 또는 요소 |
| `onPress` | `Pressable`의 `onPress` | 없음 | 버튼을 눌렀을 때 실행할 함수 |
| `disabled` | `boolean` | `false` | 버튼을 비활성화 |
| `loading` | `boolean` | `false` | 스피너를 표시하고 버튼을 비활성화 |
| `style` | `StyleProp<ViewStyle>` | 없음 | 버튼 바깥 스타일 추가 |
| `textStyle` | `StyleProp<TextStyle>` | 없음 | 문자열 children의 글자 스타일 추가 |

그 외 `accessibilityLabel`, `testID` 등 React Native `Pressable` props를 전달할 수 있습니다. `textStyle`은 문자열 children에만 적용됩니다.

버튼은 `disabled || loading`으로 실제 비활성 상태를 정합니다. 로딩 중에는 스피너, 문자열 children에는 테마 글자 스타일을 적용하고, 그 외 요소는 전달된 그대로 표시합니다. 눌린 동안에는 살짝 투명해집니다.

## TextField

`TextField`는 라벨, 입력창, 안내 또는 오류 문구를 함께 보여줍니다. 입력 동작과 키보드 옵션은 React Native `TextInput` props를 사용합니다.

```tsx
<TextField
  label="책 이름"
  placeholder="책 이름을 입력하세요"
  value={bookName}
  onChangeText={setBookName}
/>

<TextField
  label="한 줄 소개"
  helperText="독서방을 소개해 주세요."
  multiline
  numberOfLines={4}
/>

<TextField label="책 이름" errorText="책 이름을 입력해 주세요." />
<TextField label="그림자 없음" shadowPosition="none" />
<TextField label="위쪽 그림자" shadowPosition="top" />
```

### 주요 props

| prop | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `label` | `string` | 없음 | 입력창 위의 제목 |
| `helperText` | `string` | 없음 | 입력창 아래 안내 문구 |
| `errorText` | `string` | 없음 | 오류 문구. 있으면 안내 문구보다 우선 |
| `shadowPosition` | `top`, `bottom`, `none` | `bottom` | 그림자 방향 또는 그림자 없음 |
| `multiline` | `boolean` | `false` | 여러 줄 입력 모드 |
| `editable` | `boolean` | `true` | 입력 가능 여부. `false`면 읽기 전용 스타일 |
| `containerStyle` | `StyleProp<ViewStyle>` | 없음 | 라벨·입력·문구를 감싸는 영역 스타일 |
| `inputStyle` | `StyleProp<TextStyle>` | 없음 | 입력창 스타일 추가 |

그림자 위치는 `shadowPosition`으로 선택합니다. `onFocus`·`onBlur`는 React Native `TextInput`에 그대로 전달됩니다. 그 외 `value`, `onChangeText`, `keyboardType`, `secureTextEntry` 등 `TextInput` props를 사용할 수 있습니다.

## Dropdown

`Dropdown`은 옵션 중 하나를 선택하는 공통 선택 필드입니다. 현재 값은 표시만 하고 직접 입력하지 않습니다. 옵션을 누르면 선택값을 전달하고 목록을 닫습니다.

```tsx
const [chapter, setChapter] = useState("chapter-1");

<Dropdown
  label="챕터"
  value={chapter}
  onValueChange={setChapter}
  options={[
    { label: "1장 «구출대»", value: "chapter-1" },
    { label: "2장 «새로운 만남»", value: "chapter-2" },
  ]}
/>
```

| prop | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `options` | `{ label: string; value: string }[]` | 필수 | 선택할 항목 목록 |
| `value` | `string` | 없음 | 현재 선택값 |
| `onValueChange` | `(value: string) => void` | 필수 | 선택 시 호출 |
| `label` | `string` | 없음 | 필드와 선택 목록의 제목 |
| `placeholder` | `string` | `선택해 주세요` | 선택 전 표시 문구 |
| `disabled` | `boolean` | `false` | 필드 비활성화 |
| `shadowPosition` | `top`, `bottom`, `none` | `bottom` | 그림자 방향 |
| `containerStyle` | `StyleProp<ViewStyle>` | 없음 | 라벨과 필드 영역 스타일 |
| `style` | `StyleProp<ViewStyle>` | 없음 | 필드 스타일 추가 |

## Card

`Card`는 책 정보나 안내처럼 콘텐츠를 묶는 컨테이너입니다. 기본값은 `default` variant와 내부 여백 사용입니다.

```tsx
<Card>
  <Text>카드 안의 내용</Text>
</Card>

<Card variant="outlined">테두리 카드</Card>
<Card variant="tinted" padded={false}>배경 강조 카드</Card>
```

### 주요 props

| prop | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `children` | `ReactNode` | 필수 | 카드 안의 내용 |
| `variant` | `default`, `outlined`, `tinted` | `default` | 기본 그림자형, 테두리형, 배경 강조형 |
| `padded` | `boolean` | `true` | 기본 안쪽 여백 사용 여부 |
| `style` | `StyleProp<ViewStyle>` | 없음 | 카드 바깥 View 스타일 추가 |
| `contentStyle` | `StyleProp<ViewStyle>` | 없음 | 안쪽 콘텐츠 View 스타일 추가 |

```tsx
<Card padded={false} contentStyle={{ padding: 0 }}>
  <BookCover />
</Card>
```

바깥 View에는 기본 모양, variant, 사용자 `style` 순으로 적용됩니다. 안쪽 View에는 `padded`가 참일 때 기본 여백을 주고, `contentStyle`로 추가 조정할 수 있습니다. 나머지 React Native `View` props도 전달할 수 있습니다.
