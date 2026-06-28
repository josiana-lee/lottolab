'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { createComboKey } from '@/lib/combo'
import { useSync } from '@/hooks/useSync'
import { loadSavedCombos } from '@/hooks/useSavedCombos'
import { getBallColors } from './LottoBall'
import { PushNotifyButton } from './PushNotifyButton'

type Props = {
  latestRound: number
  lastSync: string
  latestNumbers: number[]
  latestBonus: number
}

function getKST() {
  return new Date(Date.now() + 9 * 60 * 60 * 1000)
}

function isSaturdayAfterDraw() {
  const kst = getKST()
  const totalMinutes = kst.getUTCHours() * 60 + kst.getUTCMinutes()
  return kst.getUTCDay() === 6 && totalMinutes >= 20 * 60 + 35
}

function isSaturdayBeforeNine() {
  const kst = getKST()
  const totalMinutes = kst.getUTCHours() * 60 + kst.getUTCMinutes()
  return kst.getUTCDay() === 6 && totalMinutes >= 20 * 60 + 35 && totalMinutes < 21 * 60
}

function DrawBalls({ numbers, bonus }: { numbers: number[]; bonus: number }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {numbers.map(n => {
        const c = getBallColors(n)
        return (
          <span
            key={n}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-lotto-mono text-[12px] font-bold"
            style={{ background: c.bg, color: c.text }}
          >
            {n}
          </span>
        )
      })}
      {bonus > 0 && (
        <>
          <span className="text-[#3D4A5E]">+</span>
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-lotto-mono text-[12px] font-bold ring-2 ring-white/20"
            style={{ background: getBallColors(bonus).bg, color: getBallColors(bonus).text, opacity: 0.65 }}
            title="보너스"
          >
            {bonus}
          </span>
        </>
      )}
    </div>
  )
}

export function SyncStatusCard({ latestRound, lastSync, latestNumbers, latestBonus }: Props) {
  const sync = useSync()
  const router = useRouter()
  const [matchedMsg, setMatchedMsg] = useState<string | null>(null)
  const autoSynced = useRef(false)

  // 토요일 오후 8:35 이후 자동 동기화 (페이지 로드 시 1회)
  useEffect(() => {
    if (autoSynced.current) return
    if (isSaturdayAfterDraw()) {
      autoSynced.current = true
      sync.mutate()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!sync.isSuccess) return
    router.refresh()
    if (sync.data?.latestDraw) {
      const drawKey = createComboKey([...sync.data.latestDraw.numbers].sort((a, b) => a - b))
      const count = loadSavedCombos().filter(c => c.comboKey === drawKey).length
      if (count > 0) setMatchedMsg(`저장한 조합 ${count}개가 추첨번호와 일치합니다.`)
    }
  }, [sync.isSuccess, sync.data, router])

  const syncedDraw = sync.data?.synced.length ? sync.data.latestDraw : null
  const noNewData = sync.data && !sync.data.synced.length
  const waitMsg = noNewData && isSaturdayBeforeNine() ? '9시 이후 다시 확인할 수 있습니다.' : null

  const displayRound = syncedDraw?.round ?? latestRound
  const displayNumbers = syncedDraw?.numbers ?? latestNumbers
  const displayBonus = syncedDraw?.bonus ?? latestBonus

  return (
    <section className="grid gap-3.5 md:grid-cols-[1fr_1.7fr]">

      {/* 최신 저장 회차 + 당첨번호 */}
      <div className="rounded-2xl border border-white/[0.07] bg-card px-6 py-[22px]">
        <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[1.4px] text-[#8A9BB0]">최신 저장 회차</p>
        <p className="mb-3 flex items-baseline gap-1">
          <span className="font-lotto-mono text-[34px] font-bold leading-none text-primary">
            {displayRound.toLocaleString()}
          </span>
          <span className="text-sm text-[#4A5A72]">회</span>
        </p>
        {displayNumbers.length > 0 && (
          <DrawBalls numbers={displayNumbers} bonus={displayBonus} />
        )}
      </div>

      {/* 동기화 */}
      <div className="rounded-2xl border border-white/[0.07] bg-card px-6 py-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[1.4px] text-[#8A9BB0]">마지막 동기화</p>
            <p className="font-lotto-mono text-sm font-semibold text-[#C8D4E8]">{lastSync}</p>
            {waitMsg && <p className="mt-1 text-xs text-[#8A9BB0]">{waitMsg}</p>}
            {noNewData && !waitMsg && (
              <p className="mt-1 text-xs text-muted">{sync.data?.message}</p>
            )}
            {matchedMsg && <p className="mt-1 text-xs text-cyan">{matchedMsg}</p>}
            {sync.error && <p className="mt-1 text-xs text-lotto-red">{sync.error.message}</p>}
          </div>
          <div className="flex shrink-0 flex-col items-end gap-3">
            <button
              type="button"
              onClick={() => sync.mutate()}
              disabled={sync.isPending}
              className="min-h-10 whitespace-nowrap rounded-[10px] border border-cyan/20 bg-cyan/[0.07] px-[18px] text-[13px] font-semibold text-cyan disabled:opacity-50"
            >
              {sync.isPending ? '동기화 중' : '최신 회차 동기화'}
            </button>
            <PushNotifyButton />
          </div>
        </div>
      </div>

    </section>
  )
}
