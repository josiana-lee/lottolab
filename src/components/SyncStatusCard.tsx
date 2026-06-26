'use client'

import { useSync } from '@/hooks/useSync'

type Props = {
  totalRounds: number
  latestRound: number
  lastSync: string
}

export function SyncStatusCard({ totalRounds, latestRound, lastSync }: Props) {
  const sync = useSync()

  return (
    <section className="grid gap-3.5 md:grid-cols-[1fr_1fr_1.7fr]">
      <Stat label="총 저장 회차" value={totalRounds.toLocaleString()} suffix="회" />
      <Stat label="최신 저장 회차" value={latestRound.toLocaleString()} suffix="회" />
      <div className="rounded-2xl border border-white/[0.07] bg-card px-6 py-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[1.4px] text-[#8A9BB0]">마지막 동기화</p>
            <p className="font-lotto-mono text-sm font-semibold text-[#C8D4E8]">{lastSync}</p>
            {sync.data && <p className="mt-1 text-xs text-muted">{sync.data.message}</p>}
            {sync.error && <p className="mt-1 text-xs text-lotto-red">{sync.error.message}</p>}
          </div>
          <button
            type="button"
            onClick={() => sync.mutate()}
            disabled={sync.isPending}
            className="min-h-10 shrink-0 whitespace-nowrap rounded-[10px] border border-cyan/20 bg-cyan/[0.07] px-[18px] text-[13px] font-semibold text-cyan disabled:opacity-50"
          >
            {sync.isPending ? '동기화 중' : '최신 회차 동기화'}
          </button>
        </div>
      </div>
    </section>
  )
}

function Stat({ label, value, suffix }: { label: string; value: string; suffix: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-card px-6 py-[22px]">
      <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[1.4px] text-[#8A9BB0]">{label}</p>
      <p className="flex items-baseline gap-1">
        <span className="font-lotto-mono text-[34px] font-bold leading-none text-primary">{value}</span>
        <span className="text-sm text-[#4A5A72]">{suffix}</span>
      </p>
    </div>
  )
}
