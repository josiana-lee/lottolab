import { NumberStats } from '@/types/lotto'
import { LottoBall } from './LottoBall'

export function HotColdPanel({ stats }: { stats: NumberStats[] }) {
  const hot = [...stats].sort((a, b) => b.recent30Count - a.recent30Count).slice(0, 8)
  const cold = [...stats].sort((a, b) => b.lastSeenGap - a.lastSeenGap).slice(0, 8)

  return (
    <section className="grid gap-4 md:grid-cols-2">
      <RankPanel title="최근 핫 번호" caption="최근 30회 기준 상위 8개" items={hot} valueKey="recent30Count" valueSuffix="" tone="hot" />
      <RankPanel title="장기 미출현 번호" caption="마지막 출현 이후 경과 회차" items={cold} valueKey="lastSeenGap" valuePrefix="+" valueSuffix="회" tone="cold" />
    </section>
  )
}

function RankPanel({
  title,
  caption,
  items,
  valueKey,
  valuePrefix = '',
  valueSuffix,
  tone,
}: {
  title: string
  caption: string
  items: NumberStats[]
  valueKey: 'recent30Count' | 'lastSeenGap'
  valuePrefix?: string
  valueSuffix: string
  tone: 'hot' | 'cold'
}) {
  const max = Math.max(1, ...items.map(item => item[valueKey]))

  return (
    <div className={`rounded-[20px] border bg-card px-7 py-[26px] ${tone === 'hot' ? 'border-lotto-red/10' : 'border-lotto-sky/10'}`}>
      <div className="mb-5">
        <h3 className="mb-[3px] text-[15px] font-bold">{title}</h3>
        <p className="text-xs text-[#4A5A72]">{caption}</p>
      </div>
      <div className="space-y-[9px]">
        {items.map(item => (
          <div key={item.number} className="grid grid-cols-[34px_1fr_42px] items-center gap-2.5">
            <LottoBall number={item.number} size="sm" />
            <div className="h-[5px] overflow-hidden rounded-[3px] bg-white/[0.05]">
              <div
                className={`h-full rounded-[3px] ${tone === 'hot' ? 'bg-gradient-to-r from-lotto-red to-[#FF4040]' : 'bg-gradient-to-r from-lotto-sky to-[#3B8FCC]'}`}
                style={{ width: `${(item[valueKey] / max) * 100}%` }}
              />
            </div>
            <span className="text-right font-lotto-mono text-xs text-[#8A9BB0]">
              {valuePrefix}
              {item[valueKey]}
              {valueSuffix}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
