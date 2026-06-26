'use client'

import { useState } from 'react'
import { createComboKey } from '@/lib/combo'
import { useSaveCombo, useSavedCombos } from '@/hooks/useSavedCombos'
import { GeneratedCombo } from '@/types/lotto'
import { LottoBall } from './LottoBall'

type Props = {
  combo: GeneratedCombo
  rank: number
  animDelay: number
}

export function ComboCard({ combo, rank, animDelay }: Props) {
  const save = useSaveCombo()
  const { data } = useSavedCombos()
  const [error, setError] = useState<string | null>(null)
  const comboKey = createComboKey(combo.numbers)
  const isSaved = data?.savedCombos.some(saved => saved.comboKey === comboKey) ?? false

  return (
    <article className="animate-fade-in-up rounded-[20px] border border-white/[0.07] bg-card px-5 py-6 sm:px-[30px]" style={{ animationDelay: `${animDelay}s` }}>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-3.5">
          <span className="w-6 shrink-0 font-lotto-mono text-[13px] font-bold text-[#5A6A7A]">#{rank}</span>
          <div className="flex flex-wrap gap-2">
            {combo.numbers.map(number => (
              <LottoBall key={number} number={number} size="lg" />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-[22px] sm:flex-row sm:items-center">
          <div className="min-w-[76px] text-left sm:text-center">
            <p className="mb-[5px] text-[10px] font-bold uppercase tracking-[1.2px] text-[#7A8BA8]">L·L Score</p>
            <p className="font-lotto-mono text-[32px] font-bold leading-none text-cyan">{combo.score}</p>
          </div>
          <div className="flex flex-col gap-[9px]">
            <div className="flex flex-wrap gap-1.5">
              <Chip label="합계" value={combo.sum} />
              <Chip label="홀짝" value={`${combo.oddCount}:${combo.evenCount}`} />
              <Chip label="저고" value={`${combo.lowCount}:${combo.highCount}`} />
            </div>
            <div className="flex flex-wrap gap-1">
              {combo.reason.map(reason => (
                <span key={reason} className="rounded bg-white/[0.03] px-2 py-0.5 text-[11px] text-[#5A6A7A]">
                  · {reason}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-[13px] flex justify-end border-t border-white/[0.05] pt-[11px]">
        <div className="flex flex-col items-end gap-1">
          <button
            type="button"
            onClick={() => {
              setError(null)
              save.mutate({ numbers: combo.numbers, score: combo.score }, { onError: e => setError(e.message) })
            }}
            disabled={isSaved || save.isPending}
            className="min-h-[34px] rounded-lg border border-white/10 bg-white/[0.04] px-4 text-[13px] font-semibold text-[#6B7A96] disabled:opacity-60"
          >
            {isSaved ? '저장됨' : save.isPending ? '저장 중' : '저장'}
          </button>
          {error && <span className="text-xs text-lotto-red">{error}</span>}
        </div>
      </div>
    </article>
  )
}

function Chip({ label, value }: { label: string; value: string | number }) {
  return (
    <span className="rounded-[7px] border border-white/[0.08] bg-white/[0.04] px-[11px] py-1 font-lotto-mono text-xs text-[#7A8BA8]">
      {label} <b className="text-[#C8D4E8]">{value}</b>
    </span>
  )
}
