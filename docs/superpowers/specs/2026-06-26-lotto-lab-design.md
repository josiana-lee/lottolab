# Lotto Lab — Design Spec

**Date:** 2026-06-26  
**Status:** Approved

---

## 1. 프로젝트 개요

로또 6/45 과거 당첨번호 데이터를 수집·분석하고, 아직 실제 당첨 이력이 없는 번호 조합 5개를 생성하는 데이터 분석 대시보드.

> 당첨 예측이 아닌 과거 분포 기반 분석 도구임을 앱 전체에서 일관되게 표현한다.

---

## 2. 기술 스택

| 레이어 | 선택 |
|--------|------|
| 프레임워크 | Next.js 14 (App Router) |
| 언어 | TypeScript |
| 스타일 | Tailwind CSS |
| DB | Supabase (PostgreSQL) |
| ORM | Prisma |
| 서버 상태 | TanStack Query v5 |
| 차트 | Recharts |
| 자동 동기화 | GitHub Actions |
| 날짜 | date-fns |

---

## 3. 아키텍처

```
Next.js 14 (App Router)
  ├── Server Components   → 초기 렌더링
  ├── Client Components   → 인터랙션 (생성, 저장, 동기화)
  └── Route Handlers      → REST API (/api/*)

Supabase (PostgreSQL) ← Prisma ORM

TanStack Query
  └── 서버 상태 캐싱, 로딩/에러, 자동 재검증

GitHub Actions
  └── 매주 토요일 UTC 17:00 (KST 일요일 02:00) → GET /api/draws/sync
```

**데이터 흐름:**
1. 초기 시드: `scripts/seed.ts` → 1회차~최신 일괄 수집 → Supabase
2. 매주 자동: GitHub Actions → `/api/draws/sync` → 신규 회차 저장 + SavedCombo 매칭
3. 조합 생성: `POST /api/generate` → 서버 분석·필터 → 5개 반환
4. 저장함: `POST /api/saved-combos` → DB (최대 10개 제한)

---

## 4. DB 스키마

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

model SavedCombo {
  id            Int      @id @default(autoincrement())
  numbers       String   // "7,12,18,27,34,45"
  comboKey      String   @unique
  score         Float?
  matchedRound  Int?
  matchedDrawId Int?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

`GeneratedCombo` 테이블은 스펙에서 선택 사항 — 이번 구현에서 제외.

---

## 5. API Routes

| Method | Path | 역할 |
|--------|------|------|
| `GET` | `/api/draws/sync` | 최신 회차 동기화 + SavedCombo 매칭 |
| `GET` | `/api/stats/numbers` | 번호별 통계 45개 |
| `GET` | `/api/stats/distribution` | 합계·홀짝·고저 분포 |
| `POST` | `/api/generate` | 추천 조합 5개 생성 |
| `GET` | `/api/saved-combos` | 저장 조합 목록 |
| `POST` | `/api/saved-combos` | 조합 저장 (최대 10개) |
| `DELETE` | `/api/saved-combos/[id]` | 조합 삭제 |

---

## 6. 페이지 구조

### `/` — 메인 대시보드

```
Nav (sticky)
  └── Lotto LAB 로고 + "당첨 보장 없음 · 과거 분포 분석 도구" 배지

StatusStrip (3열 그리드)
  ├── 총 저장 회차
  ├── 최신 저장 회차
  └── 마지막 동기화 + 동기화 버튼

GenerateCTA
  └── "아직 나오지 않은 조합 5개 생성" 버튼 (그라디언트)

ComboResultList (생성 후 표시)
  └── ComboCard × 5 (번호볼 + L·L Score + 통계 칩 + 사유 + 저장 버튼)

SavedComboList
  └── SavedComboCard × N (당첨 매칭 시 opacity-35 grayscale)

NumberHeatmap
  └── 1~45 번호볼 (밝기 = 출현 빈도)

HotColdPanel (2열)
  ├── 핫 번호 🔥 (최근 30회 상위 8개)
  └── 미출현 번호 ❄️ (간격 상위 8개)

FreqChart
  └── 전체 출현 빈도 TOP 15 바 차트
```

### `/stats` — 통계 화면

```
번호별 출현 빈도 (Recharts BarChart)
최근 30회 / 100회 핫 번호
합계 분포 차트
홀짝·고저 비율 차트
연속번호 빈도 차트
```

---

## 7. 핵심 컴포넌트

```
src/components/
  LottoHeader.tsx
  SyncStatusCard.tsx
  GenerateButton.tsx
  ComboCard.tsx
  SavedComboCard.tsx
  NumberHeatmap.tsx
  HotColdPanel.tsx
  FreqBarChart.tsx
  DistributionChart.tsx
```

---

## 8. TanStack Query 패턴

```ts
// 번호 통계 (5분 캐시)
useQuery({ queryKey: ['stats/numbers'], staleTime: 5 * 60 * 1000 })

// 조합 생성
useMutation({ mutationFn: () => fetch('/api/generate', { method: 'POST' }) })

// 동기화 후 stats 자동 재검증
useMutation({
  mutationFn: () => fetch('/api/draws/sync'),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['stats'] }),
})

// 저장 조합
useQuery({ queryKey: ['saved-combos'] })
useMutation({ mutationFn: (data) => fetch('/api/saved-combos', { method: 'POST', body: JSON.stringify(data) }) })
```

---

## 9. 핵심 비즈니스 로직

### 번호별 점수 모델

```ts
const SCORE_WEIGHTS = {
  totalFrequency: 0.15,
  recent30Trend:  0.15,
  recent100Trend: 0.10,
  coldGap:        0.15,
  pairFrequency:  0.15,
  tripleFrequency:0.10,
  sumDistribution:0.10,
  balance:        0.10,
}
```

### 조합 생성 흐름

1. 번호별 점수 계산
2. 가중치 기반 후보 풀 → 조합 최대 100,000개 생성
3. 과거 당첨 조합 Set으로 제외 (`comboKey` 비교)
4. 유효성 필터 (합계 90~190, 홀짝 1~5, 저고 1~5, 연속 4개 미만, 끝수 중복 4개 미만)
5. 점수 상위 중 5개 반환, 같은 요청 내 중복 제거

### 조합 키

```ts
const createComboKey = (numbers: number[]) =>
  [...numbers].sort((a, b) => a - b).join('-')
```

### SavedCombo 매칭 (sync 시 자동 실행)

```ts
async function checkSavedComboMatches() {
  const saved = await prisma.savedCombo.findMany({ where: { matchedRound: null } })
  for (const combo of saved) {
    const draw = await prisma.draw.findUnique({ where: { comboKey: combo.comboKey } })
    if (draw) {
      await prisma.savedCombo.update({
        where: { id: combo.id },
        data: { matchedRound: draw.round, matchedDrawId: draw.id },
      })
    }
  }
}
```

---

## 10. 폴더 구조

```
src/
  app/
    page.tsx
    stats/page.tsx
    api/
      draws/sync/route.ts
      stats/numbers/route.ts
      stats/distribution/route.ts
      generate/route.ts
      saved-combos/route.ts
      saved-combos/[id]/route.ts
  components/
    (위 컴포넌트 목록)
  lib/
    lotto-api.ts   — 동행복권 API 호출
    db.ts          — Prisma 클라이언트 싱글톤
    analyzer.ts    — 번호별 통계 계산
    scorer.ts      — 점수 모델
    generator.ts   — 조합 생성
    combo.ts       — 유효성 필터, comboKey
    constants.ts   — SCORE_WEIGHTS 등
  types/
    lotto.ts

scripts/
  seed.ts          — 초기 데이터 수집 (1회차~최신)

.github/workflows/
  sync-lotto.yml   — 매주 토요일 UTC 17:00 자동 동기화
```

---

## 11. 자동 동기화

```yaml
# .github/workflows/sync-lotto.yml
name: Sync Lotto Draws
on:
  schedule:
    - cron: "0 17 * * 6"  # UTC 토요일 17:00 = KST 일요일 02:00
  workflow_dispatch:
jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - name: Call sync endpoint
        run: curl -X GET "${{ secrets.APP_URL }}/api/draws/sync"
```

---

## 12. 표현 규칙

**금지 표현:** 당첨 확률 높은 번호, 당첨 보장, 1등 예상 번호, 필승 조합  
**사용 표현:** 과거 분포 기반 조합, 아직 나오지 않은 조합, Lotto Lab Score, 통계적 유사도

---

## 13. 구현 순서 (Phase)

1. 기본 세팅 (Next.js + Tailwind + Prisma + Supabase)
2. 데이터 수집 (lotto-api.ts + seed.ts + Draw 저장)
3. 통계 분석 (analyzer.ts + scorer.ts)
4. 조합 생성 API (generator.ts + /api/generate)
5. SavedCombo CRUD API
6. 메인 UI (대시보드)
7. 통계 UI (/stats)
8. GitHub Actions 자동 동기화
