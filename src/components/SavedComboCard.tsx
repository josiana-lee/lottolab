'use client'

import { useDeleteCombo } from '@/hooks/useSavedCombos'
import { SavedComboRecord } from '@/types/lotto'
import { LottoBall } from './LottoBall'

export function SavedComboCard({ saved }: { saved: SavedComboRecord }) {
  const del = useDeleteCombo()
  const matched = saved.matchedRound !== null

  return (
    <article className={`rounded-2xl border border-white/[0.07] bg-card p-5 ${matched ? 'opacity-35 grayscale' : ''}`}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {saved.numbers.map(number => (
            <LottoBall key={number} number={number} size="sm" />
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {matched && (
            <span className="rounded-full border border-lotto-red/30 bg-lotto-red/10 px-2.5 py-1 text-xs font-bold text-lotto-red">
              {saved.matchedRound}회 당첨 이력 매칭
            </span>
          )}
          {saved.score !== null && (
            <p className="font-lotto-mono text-sm text-cyan">
              Score <b>{saved.score.toFixed(1)}</b>
            </p>
          )}
          <p className="text-xs text-muted">{new Date(saved.createdAt).toLocaleDateString('ko-KR')}</p>
          <button
            type="button"
            onClick={() => del.mutate(saved.id)}
            disabled={del.isPending}
            className="min-h-8 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 text-xs font-semibold text-[#5A6A7A]"
          >
            삭제
          </button>
        </div>
      </div>
    </article>
  )
}
