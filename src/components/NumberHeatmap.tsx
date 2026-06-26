import { NumberStats } from '@/types/lotto'
import { getBallColors } from './LottoBall'

export function NumberHeatmap({ stats }: { stats: NumberStats[] }) {
  const maxCount = Math.max(1, ...stats.map(stat => stat.totalCount))
  const minCount = Math.min(...stats.map(stat => stat.totalCount))
  const range = Math.max(1, maxCount - minCount)
  const totalRounds = Math.round(stats.reduce((sum, stat) => sum + stat.totalCount, 0) / 6)

  return (
    <section>
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="mb-[5px] text-[19px] font-bold tracking-[-0.4px]">번호별 출현 현황</h2>
          <p className="text-[13px] text-[#4A5A72]">전체 {totalRounds.toLocaleString()}회 기준 · 밝을수록 출현 빈도 높음</p>
        </div>
      </div>
      <div className="rounded-[20px] border border-white/[0.07] bg-card px-[22px] py-6">
        <div className="flex flex-wrap gap-2">
          {stats.map(stat => {
            const heat = (stat.totalCount - minCount) / range
            const colors = getBallColors(stat.number)
            return (
              <div key={stat.number} className="flex w-[52px] flex-col items-center gap-1">
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-full font-lotto-mono text-sm font-bold"
                  style={{
                    background: colors.bg,
                    color: colors.text,
                    filter: `brightness(${(0.48 + heat * 0.52).toFixed(2)})`,
                  }}
                >
                  {stat.number}
                </span>
                <span className="h-[3px] w-[34px] overflow-hidden rounded-sm bg-white/[0.06]">
                  <span
                    className="block h-full rounded-sm opacity-70"
                    style={{ background: colors.bg, width: `${Math.max(4, heat * 100)}%` }}
                  />
                </span>
                <span className="font-lotto-mono text-[11px] leading-none text-[#6B7A96]">{stat.totalCount}</span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
