'use client'

import { GeneratedCombo } from '@/types/lotto'
import { LottoBall } from './LottoBall'

export type GeneratedHistoryBatch = {
  id: string
  createdAt: string
  combos: GeneratedCombo[]
}

type Props = {
  history: GeneratedHistoryBatch[]
  onRestore: (combos: GeneratedCombo[]) => void
  onClear: () => void
}

export function GeneratedHistory({ history, onRestore, onClear }: Props) {
  if (history.length === 0) return null

  return (
    <section className="mb-10">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-[19px] font-bold tracking-[-0.4px]">최근 생성 기록</h2>
          <span className="rounded-[20px] bg-white/[0.05] px-2.5 py-[3px] font-lotto-mono text-xs font-bold tracking-[0.8px] text-secondary">
            {history.length} BATCHES
          </span>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="min-h-8 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 text-xs font-semibold text-[#6B7A96] transition hover:text-secondary"
        >
          기록 비우기
        </button>
      </div>

      <div className="space-y-3">
        {history.map((batch, batchIndex) => (
          <article key={batch.id} className="rounded-[20px] border border-white/[0.07] bg-card p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-lotto-mono text-[13px] font-bold text-[#5A6A7A]">#{history.length - batchIndex}</p>
                <p className="text-xs text-muted">{new Date(batch.createdAt).toLocaleString('ko-KR')}</p>
              </div>
              <button
                type="button"
                onClick={() => onRestore(batch.combos)}
                className="min-h-9 rounded-lg border border-cyan/20 bg-cyan/[0.07] px-3.5 text-[13px] font-semibold text-cyan transition hover:border-cyan/40 hover:bg-cyan/10"
              >
                다시 보기
              </button>
            </div>

            <div className="space-y-2">
              {batch.combos.map((combo, index) => (
                <div
                  key={`${batch.id}-${combo.numbers.join('-')}`}
                  className="flex flex-col gap-3 rounded-xl border border-white/[0.05] bg-white/[0.025] p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 shrink-0 font-lotto-mono text-xs font-bold text-[#5A6A7A]">#{index + 1}</span>
                    <div className="flex flex-wrap gap-1.5">
                      {combo.numbers.map(number => (
                        <LottoBall key={number} number={number} size="sm" />
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#7A8BA8]">
                    <span className="rounded-[7px] border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 font-lotto-mono">
                      Score <b className="text-cyan">{combo.score}</b>
                    </span>
                    <span className="rounded-[7px] border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 font-lotto-mono">
                      합계 <b className="text-[#C8D4E8]">{combo.sum}</b>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
