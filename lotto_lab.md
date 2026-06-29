# Lotto Lab

> 확률은 같지만, 패턴은 볼 수 있다.
> 과거 로또 당첨 데이터를 수집·분석하고, 아직 나오지 않은 번호 조합 5개를 생성하는 데이터 분석 대시보드.

---

## 1. 프로젝트 개요

`Lotto Lab`은 로또 6/45 과거 당첨번호 데이터를 기반으로 번호별 통계, 조합 패턴, 최근 추세, 미출현 간격 등을 분석하고, 사용자가 버튼을 클릭하면 **아직 실제 당첨 이력이 없는 번호 조합 5개**를 생성해 보여주는 웹 애플리케이션이다.

이 프로젝트의 목적은 “당첨 예측”이 아니라, 다음을 구현하는 것이다.

- 로또 회차별 당첨번호 API 수집
- 로컬 DB 저장
- 번호별 통계 분석
- 조합별 패턴 분석
- 이미 나온 조합 제외
- 사용자 클릭 기반 추천 조합 5개 생성
- 매주 1회 최신 당첨번호 자동 저장
- 저장된 당첨 조합은 이후 추천 후보에서 제외

---

## 2. 핵심 전제

로또 6/45의 모든 조합은 수학적으로 동일한 확률을 가진다.

- 전체 가능한 조합 수: `8,145,060`
- 특정 조합 1개의 당첨 확률: `1 / 8,145,060`

따라서 이 앱은 “확률을 높이는 예측기”가 아니라, **과거 데이터 분포와 유사한 조합을 생성하는 분석 도구**로 만든다.

앱 내에도 다음 안내 문구를 표시한다.

> Lotto Lab은 당첨을 보장하지 않습니다.
> 모든 로또 조합의 당첨 확률은 동일합니다.
> 이 서비스는 과거 당첨 데이터의 분포를 시각화하고, 아직 등장하지 않은 조합을 생성하는 분석형 도구입니다.

---

## 3. 기술 스택

권장 스택:

- Next.js 14+
- TypeScript
- React
- Tailwind CSS
- Zustand 또는 TanStack Query
- SQLite 또는 Supabase
- Prisma
- Recharts
- Node Cron 또는 GitHub Actions
- date-fns

---

## 4. 데이터 출처

회차별 로또 당첨번호는 아래 형식의 API를 사용한다.

```ts
https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=${round}
```

예시 응답 필드:

```ts
{
  returnValue: "success",
  drwNo: 1229,
  drwNoDate: "2026-06-21",
  drwtNo1: 12,
  drwtNo2: 13,
  drwtNo3: 29,
  drwtNo4: 34,
  drwtNo5: 37,
  drwtNo6: 42,
  bnusNo: 16
}
```

주의:

- API 실패 시 `returnValue !== "success"`로 처리한다.
- 최신 회차가 아직 발표되지 않은 경우 저장하지 않는다.
- 동일 회차는 중복 저장하지 않는다.

---

## 5. 주요 기능

### 5.1 초기 데이터 수집

앱 초기 세팅 시 1회차부터 최신 회차까지 데이터를 수집한다.

요구사항:

- `1`부터 최신 회차까지 순회
- 각 회차 API 호출
- 성공한 회차만 DB 저장
- 이미 저장된 회차는 skip
- 번호 6개는 오름차순 정렬 후 저장
- 보너스 번호는 별도 저장

---

### 5.2 매주 최신 회차 자동 저장

매주 토요일 추첨 이후 또는 일요일 새벽에 최신 회차를 확인한다.

권장 실행 시간:

```txt
매주 일요일 오전 02:00 KST
```

동작:

1. DB에 저장된 마지막 회차 조회
2. 마지막 회차 + 1 API 호출
3. 성공하면 DB 저장
4. 실패하면 종료
5. 여러 회차가 밀렸을 수 있으므로 성공하는 동안 반복 조회

---

### 5.3 번호별 통계

1~45번 각각에 대해 아래 값을 계산한다.

```ts
type NumberStats = {
  number: number;
  totalCount: number;
  recent30Count: number;
  recent100Count: number;
  lastSeenRound: number | null;
  lastSeenGap: number;
  averageGap: number;
  hotScore: number;
  coldScore: number;
  finalScore: number;
};
```

계산 항목:

- 전체 출현 횟수
- 최근 30회 출현 횟수
- 최근 100회 출현 횟수
- 마지막 출현 회차
- 마지막 출현 이후 지난 회차 수
- 평균 출현 간격
- 최근 강세 점수
- 장기 미출현 점수
- 최종 점수

---

### 5.4 조합별 통계

생성된 6개 번호 조합에 대해 아래 값을 계산한다.

```ts
type ComboStats = {
  numbers: number[];
  sum: number;
  oddCount: number;
  evenCount: number;
  lowCount: number;
  highCount: number;
  consecutivePairCount: number;
  sameLastDigitMaxCount: number;
  pairScore: number;
  tripleScore: number;
  totalScore: number;
};
```

분석 항목:

- 번호 합계
- 홀짝 비율
- 저번호/고번호 비율
  - 저번호: 1~22
  - 고번호: 23~45

- 연속 번호 개수
- 끝수 중복
- 과거 번호쌍 동시 출현 점수
- 과거 3개 조합 동시 출현 점수
- 최종 조합 점수

---

## 6. 점수 모델

번호 최종 점수는 0~100 사이로 정규화한다.

권장 가중치:

```ts
const SCORE_WEIGHTS = {
  totalFrequency: 0.15,
  recent30Trend: 0.15,
  recent100Trend: 0.1,
  coldGap: 0.15,
  pairFrequency: 0.15,
  tripleFrequency: 0.1,
  sumDistribution: 0.1,
  balance: 0.1,
};
```

해석:

- 많이 나온 번호만 우대하지 않는다.
- 최근 많이 나온 번호와 오래 안 나온 번호를 모두 반영한다.
- 조합 자체의 균형도 함께 본다.
- 점수는 “당첨 가능성”이 아니라 “과거 당첨 분포와의 유사도”로 표시한다.

---

## 7. 추천 조합 생성 로직

사용자가 버튼을 클릭하면 추천 조합 5개를 보여준다.

버튼명:

```txt
아직 안 나온 조합 5개 생성하기
```

동작 순서:

1. 번호별 통계 계산
2. 가중치 기반 후보 번호 풀 생성
3. 후보 조합 10,000~100,000개 생성
4. 이미 나온 당첨 조합 제외
5. 유효성 필터 적용
6. 조합 점수 계산
7. 점수 상위 조합 중 5개 반환
8. 같은 요청 안에서 중복 조합 제거

---

## 8. 이미 나온 조합 제외

DB에 저장된 모든 당첨번호 조합을 Set으로 만든다.

```ts
function createComboKey(numbers: number[]): string {
  return [...numbers].sort((a, b) => a - b).join("-");
}
```

예시:

```ts
createComboKey([12, 13, 29, 34, 37, 42]);
// "12-13-29-34-37-42"
```

추천 조합 생성 시 아래 조건은 무조건 제외한다.

```ts
if (pastComboSet.has(createComboKey(candidate))) {
  return false;
}
```

---

## 9. 조합 유효성 필터

기본 필터:

```ts
function isValidCombo(numbers: number[], pastComboSet: Set<string>) {
  const key = createComboKey(numbers);

  if (pastComboSet.has(key)) return false;

  const sum = numbers.reduce((acc, cur) => acc + cur, 0);
  if (sum < 90 || sum > 190) return false;

  const oddCount = numbers.filter((n) => n % 2 === 1).length;
  if (oddCount === 0 || oddCount === 6) return false;

  const lowCount = numbers.filter((n) => n <= 22).length;
  if (lowCount === 0 || lowCount === 6) return false;

  return true;
}
```

추가 필터:

- 동일 끝수 4개 이상 제외
- 연속번호 4개 이상 제외
- 같은 10번대에 5개 이상 몰린 조합 제외
- 번호 합계가 너무 극단적인 조합 제외

---

## 10. 데이터베이스 설계

### Draw 테이블

```prisma
model Draw {
  id        Int      @id @default(autoincrement())
  round     Int      @unique
  drawDate  DateTime
  n1        Int
  n2        Int
  n3        Int
  n4        Int
  n5        Int
  n6        Int
  bonus     Int
  comboKey  String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### GeneratedCombo 테이블

선택 사항이다. 사용자가 생성한 조합 이력을 저장하고 싶으면 사용한다.

```prisma
model GeneratedCombo {
  id          Int      @id @default(autoincrement())
  numbers     String
  comboKey    String
  score       Float
  generatedAt DateTime @default(now())
}
```

---

## 11. API Route 설계

### `GET /api/draws/sync`

최신 회차 데이터를 동기화한다.

역할:

- 마지막 저장 회차 확인
- 다음 회차 API 호출
- 성공 시 DB 저장
- 실패 시 종료

---

### `GET /api/stats/numbers`

번호별 통계를 반환한다.

응답 예시:

```ts
[
  {
    number: 34,
    totalCount: 184,
    recent30Count: 5,
    recent100Count: 18,
    lastSeenGap: 3,
    averageGap: 6.8,
    finalScore: 87.4,
  },
];
```

---

### `GET /api/stats/distribution`

전체 분포 통계를 반환한다.

포함 항목:

- 합계 분포
- 홀짝 비율 분포
- 고저 비율 분포
- 연속번호 발생 빈도
- 끝수 중복 빈도

---

### `POST /api/generate`

아직 나오지 않은 추천 조합 5개를 생성한다.

요청:

```ts
{
  count: 5;
}
```

응답:

```ts
{
  combos: [
    {
      numbers: [7, 12, 18, 27, 34, 45],
      score: 86.2,
      sum: 143,
      oddCount: 3,
      evenCount: 3,
      lowCount: 3,
      highCount: 3,
      reason: [
        "홀짝 비율 3:3",
        "고저 비율 3:3",
        "과거 당첨 조합과 동일하지 않음",
        "합계가 과거 주요 분포 범위 안에 있음",
      ],
    },
  ];
}
```

---

## 12. 화면 구성

### 메인 대시보드

경로:

```txt
/
```

구성:

- 프로젝트 제목: Lotto Lab
- 설명 문구
- 현재 저장된 최신 회차
- 전체 저장 회차 수
- 마지막 동기화 시간
- “최신 당첨번호 동기화” 버튼
- “아직 안 나온 조합 5개 생성하기” 버튼
- 생성된 추천 조합 카드 5개

---

### 통계 화면

경로:

```txt
/stats
```

구성:

- 번호별 출현 빈도 차트
- 최근 30회 핫 번호
- 최근 100회 핫 번호
- 오래 안 나온 번호
- 합계 분포 차트
- 홀짝 비율 차트
- 고저 비율 차트
- 연속번호 빈도 차트

---

### 조합 카드 UI

각 추천 조합은 카드 형태로 표시한다.

표시 정보:

- 번호 6개
- 총점
- 합계
- 홀짝 비율
- 고저 비율
- 연속번호 여부
- 추천 사유

예시:

```txt
7  12  18  27  34  45

Lotto Lab Score: 86.2
합계: 143
홀짝: 3:3
고저: 3:3

- 아직 실제 당첨 이력이 없는 조합
- 과거 당첨 조합의 합계 분포와 유사
- 홀짝/고저 균형이 안정적
```

---

## 13. 폴더 구조

```txt
src/
  app/
    page.tsx
    stats/
      page.tsx
    api/
      draws/
        sync/
          route.ts
      stats/
        numbers/
          route.ts
        distribution/
          route.ts
      generate/
        route.ts

  components/
    LottoHeader.tsx
    SyncStatusCard.tsx
    GenerateButton.tsx
    ComboCard.tsx
    NumberFrequencyChart.tsx
    RecentTrendChart.tsx
    GapTable.tsx
    DistributionChart.tsx

  lib/
    lotto-api.ts
    db.ts
    analyzer.ts
    scorer.ts
    generator.ts
    combo.ts
    constants.ts

  types/
    lotto.ts
```

---

## 14. 핵심 타입

```ts
export type LottoDraw = {
  round: number;
  drawDate: string;
  numbers: number[];
  bonus: number;
  comboKey: string;
};

export type NumberStats = {
  number: number;
  totalCount: number;
  recent30Count: number;
  recent100Count: number;
  lastSeenRound: number | null;
  lastSeenGap: number;
  averageGap: number;
  finalScore: number;
};

export type GeneratedCombo = {
  numbers: number[];
  score: number;
  sum: number;
  oddCount: number;
  evenCount: number;
  lowCount: number;
  highCount: number;
  consecutivePairCount: number;
  reason: string[];
};
```

---

## 15. 구현 순서

### Phase 1. 기본 세팅

- Next.js + TypeScript 프로젝트 생성
- Tailwind CSS 설정
- Prisma + SQLite 설정
- 기본 레이아웃 구성

### Phase 2. 데이터 수집

- 로또 API 호출 함수 작성
- 1회차부터 최신 회차까지 저장하는 seed script 작성
- Draw 테이블 저장
- 중복 저장 방지

### Phase 3. 통계 분석

- 번호별 출현 횟수 계산
- 최근 30회/100회 계산
- 미출현 간격 계산
- 합계/홀짝/고저 분포 계산

### Phase 4. 추천 조합 생성

- 번호별 점수 계산
- 가중치 기반 랜덤 생성
- 이미 나온 조합 제외
- 유효성 필터 적용
- 상위 5개 조합 반환

### Phase 5. UI 구현

- 메인 대시보드
- 추천 조합 카드
- 통계 차트
- 동기화 버튼
- 로딩/에러 상태 처리

### Phase 6. 자동 업데이트

- GitHub Actions 또는 Cron 설정
- 매주 일요일 새벽 최신 회차 동기화
- 실패 로그 저장

---

## 16. GitHub Actions 예시

```yml
name: Sync Lotto Draws

on:
  schedule:
    - cron: "0 17 * * 6"
  workflow_dispatch:

jobs:
  sync:
    runs-on: ubuntu-latest

    steps:
      - name: Call sync endpoint
        run: |
          curl -X GET "${{ secrets.APP_URL }}/api/draws/sync"
```

설명:

- UTC 기준 토요일 17:00
- 한국 시간 기준 일요일 02:00
- `APP_URL`은 배포된 서비스 주소

---

## 17. UI 톤

디자인 방향:

- 데이터 분석 대시보드 느낌
- 너무 도박 사이트처럼 보이지 않게 만들 것
- 신뢰감 있는 카드 UI
- 차트 중심
- 추천 결과는 “당첨 예측”보다 “분석 결과”처럼 표현

권장 문구:

```txt
추천 번호
```

보다는

```txt
아직 나오지 않은 분석 조합
```

을 사용한다.

---

## 18. 금지할 표현

앱 안에서 아래 표현은 사용하지 않는다.

- 당첨 확률 높은 번호
- 당첨 보장
- 1등 예상 번호
- 무조건 나오는 번호
- 확률 상승
- 필승 조합

대신 아래 표현을 사용한다.

- 과거 분포 기반 조합
- 아직 나오지 않은 조합
- 분석 점수
- Lotto Lab Score
- 통계적 유사도
- 데이터 기반 생성 결과

---

## 19. 최종 목표

최종 결과물은 다음 기능을 만족해야 한다.

- 1회차부터 최신 회차까지 로또 번호 저장
- 매주 최신 회차 자동 저장
- 저장된 당첨 조합은 추천 후보에서 제외
- 버튼 클릭 시 아직 나오지 않은 조합 5개 생성
- 각 조합마다 분석 점수와 추천 사유 표시
- 번호별/조합별 통계 시각화
- 당첨 보장 오해를 막는 안내 문구 표시

---

## 20. 작업 지시

이 명세를 기준으로 `Lotto Lab` 프로젝트를 구현해줘.

우선순위:

1. 데이터 수집과 DB 저장
2. 이미 나온 조합 제외 로직
3. 추천 조합 5개 생성 API
4. 메인 UI
5. 통계 차트
6. 자동 업데이트

코드는 타입 안정성을 지켜서 작성하고, 주요 계산 로직에는 주석을 추가해줘.

## 21. 생성 조합 저장함 기능

사용자가 생성한 조합 중 마음에 드는 조합을 저장할 수 있다.

기능명:

```txt
내 조합 저장함
```

목표:

- 생성된 조합을 사용자가 저장할 수 있음
- 최대 10개까지 저장 가능
- 저장한 조합 목록을 다시 확인 가능
- 최신 회차 동기화 시 저장된 조합이 실제 당첨번호와 일치하는지 자동 확인
- 당첨 이력이 생긴 조합은 UI에서 흐리게 표시

- 해당 조합 옆에 당첨 회차 표시

---

## 22. 저장 조합 정책

### 저장 개수 제한

사용자는 최대 10개 조합까지만 저장할 수 있다.

```ts
const MAX_SAVED_COMBOS = 10;
```

10개를 초과하려고 하면 아래 메시지를 표시한다.

```txt
저장 가능한 조합은 최대 10개입니다. 기존 조합을 삭제한 뒤 다시 저장해주세요.
```

---

## 23. SavedCombo 테이블

```prisma
model SavedCombo {
  id             Int       @id @default(autoincrement())
  numbers        String
  comboKey       String    @unique
  score          Float?
  matchedRound   Int?
  matchedDrawId  Int?
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
}
```

필드 설명:

- `numbers`: `"7,12,18,27,34,45"` 형태 저장
- `comboKey`: `"7-12-18-27-34-45"` 형태 저장
- `score`: 생성 당시 Lotto Lab Score
- `matchedRound`: 실제 당첨 조합과 일치한 회차
- `matchedDrawId`: Draw 테이블 id
- `matchedRound`가 있으면 이미 당첨 이력이 있는 조합으로 간주

---

## 24. 저장 조합 API

### `GET /api/saved-combos`

저장된 조합 목록을 조회한다.

응답:

```ts
{
  savedCombos: [
    {
      id: 1,
      numbers: [7, 12, 18, 27, 34, 45],
      comboKey: "7-12-18-27-34-45",
      score: 86.2,
      matchedRound: null,
      createdAt: "2026-06-26T00:00:00.000Z",
    },
  ];
}
```

---

### `POST /api/saved-combos`

조합을 저장한다.

요청:

```ts
{
  numbers: [7, 12, 18, 27, 34, 45],
  score: 86.2
}
```

처리 조건:

1. 번호는 반드시 6개
2. 1~45 사이 숫자만 허용
3. 중복 번호 불가
4. 오름차순 정렬 후 저장
5. 동일 조합 중복 저장 불가
6. 저장 개수 10개 초과 불가

---

### `DELETE /api/saved-combos/:id`

저장한 조합을 삭제한다.

---

## 25. 최신 회차 동기화 시 저장 조합 매칭

`/api/draws/sync` 실행 후 저장 조합도 함께 검사한다.

동작:

1. 최신 당첨번호 저장
2. 모든 `SavedCombo` 조회
3. `SavedCombo.comboKey`와 `Draw.comboKey` 비교
4. 일치하는 조합이 있으면 `matchedRound`, `matchedDrawId` 업데이트

예시 로직:

```ts
async function checkSavedComboMatches() {
  const savedCombos = await prisma.savedCombo.findMany({
    where: {
      matchedRound: null,
    },
  });

  for (const combo of savedCombos) {
    const matchedDraw = await prisma.draw.findUnique({
      where: {
        comboKey: combo.comboKey,
      },
    });

    if (matchedDraw) {
      await prisma.savedCombo.update({
        where: { id: combo.id },
        data: {
          matchedRound: matchedDraw.round,
          matchedDrawId: matchedDraw.id,
        },
      });
    }
  }
}
```

---

## 26. 저장 조합 UI

메인 화면 또는 별도 섹션에 표시한다.

섹션명:

```txt
내 조합 저장함
```

각 저장 조합 카드 표시 정보:

- 번호 6개
- 저장일
- Lotto Lab Score
- 삭제 버튼
- 당첨 매칭 상태

---

## 27. 저장 조합 상태별 UI

### 아직 당첨 이력 없음

```txt
7  12  18  27  34  45

Lotto Lab Score: 86.2
상태: 아직 당첨 이력 없음
```

### 실제 당첨번호와 일치한 경우

```txt
7  12  18  27  34  45

Lotto Lab Score: 86.2
상태: 1240회차 당첨 번호
```

이 경우 카드 스타일:

```css
.saved-combo-card.matched {
  opacity: 0.35;
  filter: grayscale(1);
}
```

또는 Tailwind 기준:

```tsx
className={cn(
  "rounded-xl border p-4 transition",
  combo.matchedRound && "opacity-35 grayscale"
)}
```

---

## 28. 생성 결과 카드에 저장 버튼 추가

추천 조합 카드에 버튼을 추가한다.

버튼명:

```txt
내 조합으로 저장
```

저장 완료 후:

```txt
저장 완료
```

이미 저장된 조합이면:

```txt
이미 저장한 조합입니다
```

저장함이 10개 가득 찬 경우:

```txt
저장 가능한 조합은 최대 10개입니다.
```

---

## 29. 메인 화면 레이아웃 업데이트

메인 화면 구성:

```txt
Lotto Lab

[최신 당첨번호 동기화]
[아직 안 나온 조합 5개 생성하기]

분석 조합 결과
- 조합 카드 5개
- 각 카드에 저장 버튼

내 조합 저장함 0/10
- 저장한 조합 카드 목록
- 당첨 매칭 상태 표시
```

---

## 30. 동기화 완료 메시지

최신 회차 동기화 후 저장 조합 매칭 결과도 함께 보여준다.

예시:

```txt
최신 회차 동기화 완료.
새로 저장된 회차: 1230회
저장한 조합 중 당첨번호와 일치한 조합은 없습니다.
```

일치한 조합이 있다면:

```txt
최신 회차 동기화 완료.
새로 저장된 회차: 1240회
저장한 조합 1개가 1240회차 당첨번호와 일치합니다.
```

---

## 31. 추가 구현 우선순위

기존 구현 순서에 아래 항목을 추가한다.

1. `SavedCombo` 테이블 추가
2. 저장 조합 CRUD API 구현
3. 추천 조합 카드에 저장 버튼 추가
4. 내 조합 저장함 UI 구현
5. 최신 회차 동기화 후 저장 조합 매칭 로직 추가
6. 매칭된 조합 opacity/grayscale 처리
7. 매칭 회차 표시
