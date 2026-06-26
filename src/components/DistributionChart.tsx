'use client'

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { DistributionStats } from '@/types/lotto'

const tooltipStyle = {
  background: '#0C1220',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 8,
}

export function DistributionChart({ dist }: { dist: DistributionStats }) {
  return (
    <section className="grid gap-4 md:grid-cols-2">
      <ChartCard title="합계 분포" data={dist.sumDistribution} xKey="range" yKey="count" color="#00E5FF" />
      <ChartCard title="홀짝 비율" data={dist.oddEvenDistribution} xKey="label" yKey="count" color="#69C8F2" />
      <ChartCard title="저고 비율" data={dist.lowHighDistribution} xKey="label" yKey="count" color="#58D68D" />
      <ChartCard title="연속번호 발생 빈도" data={dist.consecutiveFrequency} xKey="pairs" yKey="frequency" color="#FF7272" />
    </section>
  )
}

function ChartCard({
  title,
  data,
  xKey,
  yKey,
  color,
}: {
  title: string
  data: Record<string, string | number>[]
  xKey: string
  yKey: string
  color: string
}) {
  return (
    <div className="rounded-[20px] border border-white/[0.07] bg-card p-6">
      <h2 className="mb-4 text-[15px] font-bold">{title}</h2>
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ left: -18, right: 8 }}>
            <XAxis dataKey={xKey} tick={{ fill: '#AAB8CC', fontSize: 10 }} interval="preserveStartEnd" />
            <YAxis tick={{ fill: '#6B7A96', fontSize: 10 }} />
            <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [value, '회차 수']} />
            <Bar dataKey={yKey} fill={color} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
