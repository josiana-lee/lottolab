'use client'

import { NumberStats } from '@/types/lotto'
import { getBallColors } from './LottoBall'

type Props = {
  stats: NumberStats[]
  totalRounds?: number
}

export function FreqBarChart({ stats, totalRounds }: Props) {
  const top15 = [...stats].sort((a, b) => b.totalCount - a.totalCount).slice(0, 15)
  const maxCount = top15[0]?.totalCount ?? 1
  const rounds = totalRounds ?? Math.round(stats.reduce((sum, s) => sum + s.totalCount, 0) / 6)

  return (
    <section className="rounded-[20px] border border-white/[0.07] bg-card px-7 py-[26px]">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h3 className="text-[16px] font-bold tracking-[-0.3px]">전체 출현 빈도 TOP 15</h3>
        <span className="font-lotto-mono text-sm text-[#7A8BA8]">{rounds}회 기준</span>
      </div>
      <div className="flex flex-col gap-[9px]">
        {top15.map(stat => {
          const colors = getBallColors(stat.number)
          const barW = Math.floor((stat.totalCount / maxCount) * 100)
          return (
            <div key={stat.number} className="flex items-center gap-2.5">
              <span
                className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full font-lotto-mono text-[13px] font-bold"
                style={{ background: colors.bg, color: colors.text }}
              >
                {stat.number}
              </span>
              <div className="h-[7px] flex-1 overflow-hidden rounded-[4px] bg-white/[0.05]">
                <div
                  className="h-full rounded-[4px] opacity-80"
                  style={{ background: colors.bg, width: `${barW}%` }}
                />
              </div>
              <span className="min-w-[28px] text-right font-lotto-mono text-sm text-[#8A9BB0]">
                {stat.totalCount}
              </span>
            </div>
          )
        })}
      </div>
    </section>
  )
}
