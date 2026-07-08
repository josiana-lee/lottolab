# 생성 조합 당첨 이력 확인 기능

## 목적
사용자가 앱에서 생성한 번호 조합을 영구 저장하고, 실제 당첨번호와 대조해 "내가 생성했던 조합이 당첨된 적 있는지" 확인하는 기능.

## 데이터 모델

```prisma
model SavedCombo {
  id           Int      @id @default(autoincrement())
  comboKey     String   @unique  // "4-13-14-18-31-38" (정렬된 번호 하이픈 구분)
  n1           Int
  n2           Int
  n3           Int
  n4           Int
  n5           Int
  n6           Int
  createdAt    DateTime @default(now())
  matchedRound Int?     // null = 미당첨, 숫자 = 당첨된 회차
}
```

- `comboKey`에 unique 제약 → 같은 조합 중복 저장 방지 (upsert)
- 영구 보관, 별도 만료 정책 없음

## API 변경

### `/api/generate` (POST) — 기존 수정
- 기존: 조합 생성 후 응답만 반환
- 변경: 생성된 각 조합을 `SavedCombo`에 upsert (comboKey 기준, 기존 조합이면 createdAt 유지)

### `/api/draws/sync` (GET) — 기존 수정
- 기존: 당첨번호 DB 저장 + 푸시 알림
- 변경: 새 회차 저장 후 해당 회차 comboKey로 `SavedCombo` 조회 → 매칭되면 `matchedRound` 업데이트

### `/api/combos/matches` (GET) — 신규
- matchedRound가 null이 아닌 SavedCombo 전체 반환
- 응답: `{ matches: [{ comboKey, numbers, matchedRound, createdAt }] }`
- 저장된 전체 조합 수도 함께 반환: `{ total: number }`

## UI 컴포넌트

위치: `/stats` 페이지 맨 하단 (`StatsPage` 마지막 섹션)

### 상태별 렌더링

**초기 (버튼 클릭 전)**
```
┌─────────────────────────────────────┐
│  생성한 조합 143개 저장됨             │
│       [ 당첨 이력 확인하기 ]          │
└─────────────────────────────────────┘
```

**당첨 이력 있음**
```
┌─────────────────────────────────────┐
│  생성한 조합 143개 저장됨             │
│  ✓ 2026.07.01 생성  →  1231회 당첨  │
│    4  13  14  18  31  38            │
└─────────────────────────────────────┘
```

**당첨 이력 없음**
```
┌─────────────────────────────────────┐
│  생성한 조합 143개 저장됨             │
│  아직 당첨된 조합이 없습니다           │
└─────────────────────────────────────┘
```

## 구현 순서

1. Prisma 스키마에 `SavedCombo` 추가 + migration
2. `/api/generate` 수정 — 조합 저장 추가
3. `/api/draws/sync` 수정 — 매칭 체크 추가
4. `/api/combos/matches` 신규 생성
5. UI 컴포넌트 `ComboMatchCheck` 작성
6. `/stats` 페이지 하단에 컴포넌트 추가

## 제약 조건

- 같은 조합을 여러 번 생성해도 DB에는 1개만 (upsert, createdAt은 최초 생성 시각 유지)
- `matchedRound`는 sync 시점에만 업데이트 (실시간 아님)
- DESIGN.md 컬러 시스템 준수
