'use client'

import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { NumberStats } from '@/types/lotto'
import { getBallColors } from './LottoBall'

export function FreqBarChart({ stats }: { stats: NumberStats[] }) {
  const data = [...stats].sort((a, b) => b.totalCount - a.totalCount).slice(0, 15)

  return (
    <section className="rounded-[20px] border border-white/[0.07] bg-card p-7">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-[16px] font-bold tracking-[-0.2px]">전체 출현 빈도 TOP 15</h2>
        <span className="font-lotto-mono text-xs text-[#7A8BA8]">{Math.round(stats.reduce((sum, s) => sum + s.totalCount, 0) / 6)}회 기준</span>
      </div>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -18 }}>
            <XAxis dataKey="number" tick={{ fill: '#AAB8CC', fontSize: 11 }} />
            <YAxis tick={{ fill: '#6B7A96', fontSize: 11 }} />
            <Tooltip
              cursor={{ fill: 'rgba(255,255,255,0.04)' }}
              contentStyle={{ background: '#0C1220', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8 }}
              labelFormatter={value => `${value}번`}
              formatter={(value: number) => [value, '출현 횟수']}
            />
            <Bar dataKey="totalCount" radius={[4, 4, 0, 0]}>
              {data.map(stat => (
                <Cell key={stat.number} fill={getBallColors(stat.number).bg} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
