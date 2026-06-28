'use client'

import type { PairStat } from '@/app/api/stats/pairs/route'
import { getBallColors } from './LottoBall'

type Props = {
  pairs: PairStat[]
  totalRounds?: number
}

export function PairChart({ pairs }: Props) {
  const maxCount = pairs[0]?.count ?? 1

  return (
    <section className="rounded-[20px] border border-white/[0.07] bg-card px-7 py-[26px]">
      <div className="mb-1">
        <h3 className="text-[16px] font-bold tracking-[-0.3px]">자주 함께 나오는 번호 쌍 TOP 10</h3>
      </div>
      <p className="mb-5 text-[12px] text-[#5A6A82]">
        두 번호가 같은 회차에 동시에 당첨된 횟수 — 3개 이상 맞추고 싶다면 참고하세요
      </p>
      <div className="flex flex-col gap-[10px]">
        {pairs.map((stat, i) => {
          const c1 = getBallColors(stat.n1)
          const c2 = getBallColors(stat.n2)
          const barW = Math.floor((stat.count / maxCount) * 100)
          return (
            <div key={stat.pair} className="flex items-center gap-3">
              <span className="w-5 text-right font-lotto-mono text-[11px] text-[#3D4A5E]">{i + 1}</span>
              <div className="flex shrink-0 items-center gap-1">
                <span
                  className="flex h-[28px] w-[28px] items-center justify-center rounded-full font-lotto-mono text-[11px] font-bold"
                  style={{ background: c1.bg, color: c1.text }}
                >
                  {stat.n1}
                </span>
                <span
                  className="flex h-[28px] w-[28px] items-center justify-center rounded-full font-lotto-mono text-[11px] font-bold"
                  style={{ background: c2.bg, color: c2.text }}
                >
                  {stat.n2}
                </span>
              </div>
              <div className="h-[6px] flex-1 overflow-hidden rounded-[3px] bg-white/[0.05]">
                <div
                  className="h-full rounded-[3px] bg-gradient-to-r from-cyan/60 to-cyan-blue/60"
                  style={{ width: `${barW}%` }}
                />
              </div>
              <div className="flex shrink-0 items-center gap-2 font-lotto-mono text-[12px]">
                <span className="text-[#C8D4E8]">{stat.count}회</span>
                <span className="text-[#3D4A5E]">({stat.pct}%)</span>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
