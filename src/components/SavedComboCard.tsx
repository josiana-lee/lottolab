'use client'

import { useDeleteCombo } from '@/hooks/useSavedCombos'
import { SavedComboRecord } from '@/types/lotto'
import { LottoBall } from './LottoBall'

function formatSavedAt(iso: string) {
  const d = new Date(iso)
  const y = d.getFullYear()
  const mo = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const h = String(d.getHours()).padStart(2, '0')
  const m = String(d.getMinutes()).padStart(2, '0')
  return `${y}-${mo}-${day} ${h}:${m}`
}

export function SavedComboCard({ saved }: { saved: SavedComboRecord }) {
  const del = useDeleteCombo()
  const matched = saved.matchedRound !== null

  return (
    <article
      className="relative rounded-[16px] border border-white/[0.07] bg-card px-6 py-5"
      style={{ opacity: matched ? 0.38 : 1 }}
    >
      {matched && (
        <span className="absolute right-[18px] top-[14px] rounded-[20px] border border-lotto-red/30 bg-lotto-red/[0.12] px-2.5 py-[3px] font-lotto-mono text-xs font-bold tracking-[0.5px] text-lotto-red">
          {saved.matchedRound}회 당첨
        </span>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {saved.numbers.map(number => (
            <LottoBall key={number} number={number} size="md" />
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {saved.score !== null && (
            <div className="text-center">
              <p className="mb-[3px] font-lotto-mono text-[11px] uppercase tracking-[1px] text-[#4A5A72]">Score</p>
              <p className="font-lotto-mono text-[22px] font-bold leading-none text-cyan">{saved.score.toFixed(1)}</p>
            </div>
          )}
          <div>
            <p className="mb-[3px] text-[11px] text-[#4A5A72]">저장일시</p>
            <p className="font-lotto-mono text-[13px] text-[#8A9BB0]">{formatSavedAt(saved.createdAt)}</p>
          </div>
          <button
            type="button"
            onClick={() => del.mutate(saved.id)}
            disabled={del.isPending}
            className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-[7px] text-xs text-[#5A6A7A] disabled:opacity-50"
          >
            삭제
          </button>
        </div>
      </div>
    </article>
  )
}
