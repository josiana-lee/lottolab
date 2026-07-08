# 생성 조합 당첨 이력 확인 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 앱이 생성한 모든 조합을 DB에 영구 저장하고, 새 회차 sync 시 당첨번호와 대조해 /stats 페이지 하단에 매칭 이력을 표시한다.

**Architecture:** 기존 localStorage 기반 "즐겨찾기" 시스템과 별개로, DB에 `SavedCombo` 테이블을 추가해 생성된 모든 조합을 자동 저장한다. sync 시 새 회차 comboKey로 SavedCombo를 조회해 matchedRound를 기록한다. /stats 페이지 하단의 `ComboMatchCheck` 컴포넌트가 버튼 클릭 시 `/api/combos/matches`를 호출해 결과를 표시한다.

**Tech Stack:** Next.js 14 App Router, Prisma 5, Supabase PostgreSQL, React Query (useMutation), TypeScript

## Global Constraints

- pnpm 사용 (npm/yarn 금지)
- DESIGN.md 컬러 시스템 준수: bg-card, text-primary, text-cyan, text-muted, border-white/[0.07]
- `export const dynamic = 'force-dynamic'` — 모든 API route에 필수
- comboKey 형식: 정렬된 번호를 하이픈으로 연결 (예: "4-13-14-18-31-38"), `createComboKey()` 함수 사용
- 기존 localStorage 기반 SavedComboRecord 시스템은 건드리지 않음

---

### Task 1: Prisma 스키마 — SavedCombo 모델 추가 + migration

**Files:**
- Modify: `prisma/schema.prisma`

**Interfaces:**
- Produces: `SavedCombo` Prisma 모델 — Task 2, 3, 4에서 사용

- [ ] **Step 1: schema.prisma에 모델 추가**

`prisma/schema.prisma` 파일에 기존 `PushSubscription` 모델 아래에 추가:

```prisma
model SavedCombo {
  id           Int      @id @default(autoincrement())
  comboKey     String   @unique
  n1           Int
  n2           Int
  n3           Int
  n4           Int
  n5           Int
  n6           Int
  createdAt    DateTime @default(now())
  matchedRound Int?
}
```

- [ ] **Step 2: migration 실행**

```bash
cd /Users/seungmi/lotto-lab
npx prisma migrate dev --name add_saved_combo
```

Expected: `migrations/YYYYMMDD_add_saved_combo/migration.sql` 생성, `✔ Generated Prisma Client` 출력

- [ ] **Step 3: Prisma client 재생성 확인**

```bash
npx prisma generate
```

Expected: `✔ Generated Prisma Client` 출력

- [ ] **Step 4: commit**

```bash
git add prisma/schema.prisma prisma/migrations
git commit -m "feat: SavedCombo 모델 추가 (생성 조합 DB 저장)"
```

---

### Task 2: `/api/generate` — 조합 생성 후 DB 저장

**Files:**
- Modify: `src/app/api/generate/route.ts`

**Interfaces:**
- Consumes: `prisma.savedCombo.upsert`, `createComboKey(numbers: number[]): string`
- Produces: 기존 응답 그대로 `{ combos: GeneratedCombo[] }` — 클라이언트 변경 없음

- [ ] **Step 1: route.ts 수정 — 생성 후 upsert**

`src/app/api/generate/route.ts` 전체를 다음으로 교체:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { hasDatabaseConfig } from '@/lib/env'
import { generateCombos } from '@/lib/generator'
import { createComboKey } from '@/lib/combo'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    if (!hasDatabaseConfig()) {
      return NextResponse.json({ error: 'DATABASE_URL 설정이 필요합니다.' }, { status: 503 })
    }

    const body = await req.json().catch(() => ({}))
    const count = Number(body.count ?? 5)

    if (!Number.isInteger(count) || count < 1 || count > 10) {
      return NextResponse.json({ error: 'count는 1~10 사이여야 합니다.' }, { status: 400 })
    }

    const draws = await prisma.draw.findMany({
      orderBy: { round: 'asc' },
      select: { round: true, n1: true, n2: true, n3: true, n4: true, n5: true, n6: true },
    })

    if (draws.length === 0) {
      return NextResponse.json({ error: '저장된 데이터가 없습니다. 먼저 동기화를 실행해주세요.' }, { status: 400 })
    }

    const combos = generateCombos(draws, count)

    // 생성된 조합을 DB에 upsert (이미 있으면 createdAt 유지)
    await Promise.allSettled(
      combos.map(combo => {
        const sorted = [...combo.numbers].sort((a, b) => a - b)
        const comboKey = createComboKey(sorted)
        return prisma.savedCombo.upsert({
          where: { comboKey },
          update: {},
          create: {
            comboKey,
            n1: sorted[0],
            n2: sorted[1],
            n3: sorted[2],
            n4: sorted[3],
            n5: sorted[4],
            n6: sorted[5],
          },
        })
      })
    )

    return NextResponse.json({ combos })
  } catch {
    return NextResponse.json({ error: '조합 생성 실패' }, { status: 500 })
  }
}
```

- [ ] **Step 2: dev 서버에서 생성 API 호출 테스트**

```bash
curl -s -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"count":3}' | python3 -m json.tool
```

Expected: `{ "combos": [...] }` 반환 (3개 조합)

- [ ] **Step 3: DB에 저장됐는지 확인**

```bash
npx prisma studio
```

브라우저에서 SavedCombo 테이블에 3개 행이 생성됐는지 확인. 또는:

```bash
node -e "
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.savedCombo.count().then(n => { console.log('SavedCombo count:', n); p.\$disconnect(); });
"
```

Expected: `SavedCombo count: 3` (또는 그 이상)

- [ ] **Step 4: commit**

```bash
git add src/app/api/generate/route.ts
git commit -m "feat: generate API — 생성 조합 SavedCombo에 자동 저장"
```

---

### Task 3: `/api/draws/sync` — 새 회차 sync 시 매칭 체크

**Files:**
- Modify: `src/app/api/draws/sync/route.ts`

**Interfaces:**
- Consumes: `prisma.savedCombo.updateMany({ where: { comboKey }, data: { matchedRound } })`
- Produces: 기존 응답 그대로 유지 — `{ synced, message, latestDraw }`

- [ ] **Step 1: sync route.ts 수정 — 새 회차 저장 직후 매칭 체크 추가**

`src/app/api/draws/sync/route.ts` 에서 draw upsert 블록 다음에 매칭 체크 추가.
전체 파일을 다음으로 교체:

```typescript
import { NextResponse } from 'next/server'
import webpush from 'web-push'
import { prisma } from '@/lib/db'
import { hasDatabaseConfig } from '@/lib/env'
import { fetchLottoDraw } from '@/lib/lotto-api'

if (process.env.VAPID_EMAIL && process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    process.env.VAPID_EMAIL,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY,
  )
}

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    if (!hasDatabaseConfig()) {
      return NextResponse.json({ error: 'DATABASE_URL 설정이 필요합니다.' }, { status: 503 })
    }

    const lastDraw = await prisma.draw.findFirst({ orderBy: { round: 'desc' } })
    let round = (lastDraw?.round ?? 0) + 1
    const synced: number[] = []

    while (true) {
      const draw = await fetchLottoDraw(round)
      if (!draw) break

      await prisma.draw.upsert({
        where: { round: draw.round },
        update: {},
        create: {
          round: draw.round,
          drawDate: new Date(draw.drawDate),
          n1: draw.numbers[0],
          n2: draw.numbers[1],
          n3: draw.numbers[2],
          n4: draw.numbers[3],
          n5: draw.numbers[4],
          n6: draw.numbers[5],
          bonus: draw.bonus,
          comboKey: draw.comboKey,
        },
      })

      // 이 회차 당첨번호가 SavedCombo에 있으면 matchedRound 기록
      await prisma.savedCombo.updateMany({
        where: { comboKey: draw.comboKey, matchedRound: null },
        data: { matchedRound: draw.round },
      })

      synced.push(round)
      round += 1
    }

    const latestStoredDraw = await prisma.draw.findFirst({ orderBy: { round: 'desc' } })
    const latestDraw = latestStoredDraw
      ? {
          round: latestStoredDraw.round,
          numbers: [
            latestStoredDraw.n1,
            latestStoredDraw.n2,
            latestStoredDraw.n3,
            latestStoredDraw.n4,
            latestStoredDraw.n5,
            latestStoredDraw.n6,
          ],
          bonus: latestStoredDraw.bonus,
        }
      : null

    if (synced.length > 0 && latestDraw) {
      const subs = await prisma.pushSubscription.findMany()
      const payload = JSON.stringify({
        title: `${latestDraw.round}회 당첨번호 발표 🎱`,
        body: `${latestDraw.numbers.join('  ')}  +  ${latestDraw.bonus}`,
        url: '/',
      })
      await Promise.allSettled(
        subs.map(sub =>
          webpush.sendNotification(
            { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
            payload,
          ).catch(() => prisma.pushSubscription.delete({ where: { endpoint: sub.endpoint } }))
        )
      )
    }

    return NextResponse.json({
      synced,
      message: synced.length === 0 ? '새로운 회차가 없습니다.' : `${synced.join(', ')}회차 동기화 완료.`,
      latestDraw,
    })
  } catch {
    return NextResponse.json({ error: '동기화 실패' }, { status: 500 })
  }
}
```

- [ ] **Step 2: commit**

```bash
git add src/app/api/draws/sync/route.ts
git commit -m "feat: sync API — 새 회차 당첨번호로 SavedCombo 매칭 체크"
```

---

### Task 4: `/api/combos/matches` — 매칭된 조합 목록 API

**Files:**
- Create: `src/app/api/combos/matches/route.ts`

**Interfaces:**
- Produces:
  ```typescript
  GET /api/combos/matches
  Response: {
    matches: Array<{
      comboKey: string
      numbers: number[]
      matchedRound: number
      createdAt: string  // ISO string
    }>
    total: number  // 전체 저장된 조합 수
  }
  ```

- [ ] **Step 1: API route 생성**

`src/app/api/combos/matches/route.ts` 파일 생성:

```typescript
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { hasDatabaseConfig } from '@/lib/env'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    if (!hasDatabaseConfig()) {
      return NextResponse.json({ error: 'DATABASE_URL 설정이 필요합니다.' }, { status: 503 })
    }

    const [matches, total] = await Promise.all([
      prisma.savedCombo.findMany({
        where: { matchedRound: { not: null } },
        orderBy: { matchedRound: 'desc' },
        select: {
          comboKey: true,
          n1: true, n2: true, n3: true, n4: true, n5: true, n6: true,
          matchedRound: true,
          createdAt: true,
        },
      }),
      prisma.savedCombo.count(),
    ])

    return NextResponse.json({
      matches: matches.map(m => ({
        comboKey: m.comboKey,
        numbers: [m.n1, m.n2, m.n3, m.n4, m.n5, m.n6],
        matchedRound: m.matchedRound as number,
        createdAt: m.createdAt.toISOString(),
      })),
      total,
    })
  } catch {
    return NextResponse.json({ error: '조회 실패' }, { status: 500 })
  }
}
```

- [ ] **Step 2: API 응답 확인**

```bash
curl -s http://localhost:3000/api/combos/matches | python3 -m json.tool
```

Expected:
```json
{
  "matches": [],
  "total": 3
}
```
(생성된 조합 수만큼 total 증가, 아직 당첨 없으면 matches 빈 배열)

- [ ] **Step 3: commit**

```bash
git add src/app/api/combos/matches/route.ts
git commit -m "feat: /api/combos/matches — 당첨된 생성 조합 목록 API"
```

---

### Task 5: `ComboMatchCheck` UI 컴포넌트

**Files:**
- Create: `src/components/ComboMatchCheck.tsx`

**Interfaces:**
- Consumes: `GET /api/combos/matches` → `{ matches, total }`
- Produces: `<ComboMatchCheck />` — props 없음, 내부에서 fetch

컴포넌트 상태:
- `idle`: 버튼 표시 (total 수 포함)
- `loading`: 조회 중 스피너
- `done-empty`: "아직 당첨된 조합이 없습니다"
- `done-matched`: 당첨 회차 + 번호 목록

- [ ] **Step 1: 컴포넌트 작성**

`src/components/ComboMatchCheck.tsx` 생성:

```typescript
'use client'

import { useState } from 'react'
import { LottoBall } from './LottoBall'

type Match = {
  comboKey: string
  numbers: number[]
  matchedRound: number
  createdAt: string
}

type ApiResponse = {
  matches: Match[]
  total: number
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

export function ComboMatchCheck() {
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle')
  const [result, setResult] = useState<ApiResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function check() {
    setState('loading')
    setError(null)
    try {
      const res = await fetch('/api/combos/matches')
      const body = (await res.json()) as ApiResponse
      if (!res.ok) throw new Error((body as unknown as { error: string }).error ?? '조회 실패')
      setResult(body)
      setState('done')
    } catch (e) {
      setError(e instanceof Error ? e.message : '조회 실패')
      setState('idle')
    }
  }

  return (
    <section className="rounded-2xl border border-white/[0.07] bg-card px-6 py-[22px]">
      <p className="mb-4 text-[11px] font-semibold uppercase tracking-[1.4px] text-[#8A9BB0]">
        생성 조합 당첨 이력
      </p>

      {state === 'idle' && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted">
            {result !== null
              ? `저장된 조합 ${result.total.toLocaleString()}개`
              : '생성한 조합이 당첨된 적 있는지 확인합니다'}
          </p>
          <button
            type="button"
            onClick={check}
            className="shrink-0 rounded-[10px] border border-cyan/20 bg-cyan/[0.07] px-[18px] py-[9px] text-[13px] font-semibold text-cyan"
          >
            당첨 이력 확인하기
          </button>
        </div>
      )}

      {state === 'loading' && (
        <div className="flex items-center gap-3 text-sm text-muted">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-cyan/20 border-t-cyan" />
          조회 중...
        </div>
      )}

      {state === 'done' && result && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">저장된 조합 {result.total.toLocaleString()}개</p>
            <button
              type="button"
              onClick={() => setState('idle')}
              className="text-xs text-[#4A5A72] hover:text-muted"
            >
              닫기
            </button>
          </div>

          {result.matches.length === 0 ? (
            <p className="text-sm text-[#4A5A72]">아직 당첨된 조합이 없습니다.</p>
          ) : (
            <ul className="space-y-3">
              {result.matches.map(m => (
                <li
                  key={m.comboKey}
                  className="rounded-xl border border-white/[0.05] bg-white/[0.02] px-4 py-3"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded-full border border-lotto-red/30 bg-lotto-red/[0.12] px-2 py-[2px] font-lotto-mono text-[11px] font-bold text-lotto-red">
                      {m.matchedRound}회 당첨
                    </span>
                    <span className="text-[11px] text-[#4A5A72]">{formatDate(m.createdAt)} 생성</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {m.numbers.map(n => (
                      <LottoBall key={n} number={n} size="sm" />
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {error && <p className="mt-2 text-xs text-lotto-red">{error}</p>}
    </section>
  )
}
```

- [ ] **Step 2: LottoBall size="sm" 지원 확인**

```bash
grep -n 'size' /Users/seungmi/lotto-lab/src/components/LottoBall.tsx | head -20
```

`size="sm"` prop이 없으면 `size="md"`로 변경.

- [ ] **Step 3: commit**

```bash
git add src/components/ComboMatchCheck.tsx
git commit -m "feat: ComboMatchCheck 컴포넌트 — 당첨 이력 확인 UI"
```

---

### Task 6: `/stats` 페이지 하단에 컴포넌트 추가

**Files:**
- Modify: `src/app/stats/page.tsx`

**Interfaces:**
- Consumes: `<ComboMatchCheck />` from `@/components/ComboMatchCheck`

- [ ] **Step 1: stats/page.tsx에 컴포넌트 추가**

`src/app/stats/page.tsx` 수정:

```typescript
'use client'

import Link from 'next/link'
import { ComboMatchCheck } from '@/components/ComboMatchCheck'
import { DistributionChart } from '@/components/DistributionChart'
import { FreqBarChart } from '@/components/FreqBarChart'
import { HotColdPanel } from '@/components/HotColdPanel'
import { LottoHeader } from '@/components/LottoHeader'
import { PairChart } from '@/components/PairChart'
import { ChartSkeleton, DistributionSkeleton, PanelSkeleton } from '@/components/StatsSkeleton'
import { useDistribution, useNumberStats, usePairStats } from '@/hooks/useStats'

export default function StatsPage() {
  const { data: stats, isLoading: statsLoading, error: statsError } = useNumberStats()
  const { data: distribution, isLoading: distLoading, error: distError } = useDistribution()
  const { data: pairs, isLoading: pairsLoading } = usePairStats()

  return (
    <div className="min-h-screen bg-base text-primary">
      <LottoHeader />
      <main className="mx-auto max-w-[1100px] px-6 py-9 pb-20">
        <div className="mb-8 flex items-center gap-4">
          <Link href="/" className="hidden text-sm font-semibold text-muted hover:text-secondary sm:inline">
            메인으로
          </Link>
          <h1 className="text-[22px] font-bold tracking-[-0.4px]">통계 분석</h1>
        </div>

        {(statsError || distError) && (
          <div className="mb-6 rounded-lg border border-lotto-red/30 bg-lotto-red/10 p-4 text-sm text-lotto-red">
            통계 데이터를 불러오지 못했습니다. 데이터베이스 설정과 저장된 회차를 확인해주세요.
          </div>
        )}

        <div className="space-y-6">
          {statsLoading ? <ChartSkeleton /> : stats ? <FreqBarChart stats={stats} /> : null}
          {statsLoading ? <PanelSkeleton /> : stats ? <HotColdPanel stats={stats} /> : null}
          {pairsLoading ? <ChartSkeleton /> : pairs?.length ? <PairChart pairs={pairs} /> : null}
          {distLoading ? <DistributionSkeleton /> : distribution ? <DistributionChart dist={distribution} /> : null}
          <ComboMatchCheck />
        </div>
      </main>
    </div>
  )
}
```

- [ ] **Step 2: 브라우저에서 /stats 페이지 확인**

http://localhost:3000/stats 접속 → 맨 하단에 "생성 조합 당첨 이력" 섹션이 보이는지 확인.
"당첨 이력 확인하기" 버튼 클릭 → 저장된 조합 수와 빈 매칭 결과 확인.

- [ ] **Step 3: 전체 기능 흐름 테스트**

1. 메인 페이지에서 "아직 나오지 않은 조합 5개 생성" 버튼 클릭
2. `/api/combos/matches` 호출: `total`이 5 이상으로 증가했는지 확인
   ```bash
   curl -s http://localhost:3000/api/combos/matches | python3 -m json.tool
   ```
3. /stats 페이지 → "당첨 이력 확인하기" → `저장된 조합 N개` 텍스트 확인

- [ ] **Step 4: commit**

```bash
git add src/app/stats/page.tsx
git commit -m "feat: /stats 페이지 하단에 ComboMatchCheck 컴포넌트 추가"
```
