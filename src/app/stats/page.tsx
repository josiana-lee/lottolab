'use client'

import Link from 'next/link'
import { DistributionChart } from '@/components/DistributionChart'
import { FreqBarChart } from '@/components/FreqBarChart'
import { HotColdPanel } from '@/components/HotColdPanel'
import { LottoHeader } from '@/components/LottoHeader'
import { PairChart } from '@/components/PairChart'
import { ChartSkeleton, DistributionSkeleton, PanelSkeleton } from '@/components/StatsSkeleton'
import { useDistribution, useNumberStats, usePairStats } from '@/hooks/useStats'

export default function StatsPage() {
  const { data: stats, isLoading: statsLoading, error: statsError } = useNumberStats()
  const { data: distribution, isLoading: distLoading, error: distError } = useDistribution()
  const { data: pairs, isLoading: pairsLoading } = usePairStats()

  return (
    <div className="min-h-screen bg-base text-primary">
      <LottoHeader />
      <main className="mx-auto max-w-[1100px] px-6 py-9 pb-20">
        <div className="mb-8 flex items-center gap-4">
          <Link href="/" className="hidden text-sm font-semibold text-muted hover:text-secondary sm:inline">
            메인으로
          </Link>
          <h1 className="text-[22px] font-bold tracking-[-0.4px]">통계 분석</h1>
        </div>

        {(statsError || distError) && (
          <div className="mb-6 rounded-lg border border-lotto-red/30 bg-lotto-red/10 p-4 text-sm text-lotto-red">
            통계 데이터를 불러오지 못했습니다. 데이터베이스 설정과 저장된 회차를 확인해주세요.
          </div>
        )}

        <div className="space-y-6">
          {statsLoading ? <ChartSkeleton /> : stats ? <FreqBarChart stats={stats} /> : null}
          {statsLoading ? <PanelSkeleton /> : stats ? <HotColdPanel stats={stats} /> : null}
          {distLoading ? <DistributionSkeleton /> : distribution ? <DistributionChart dist={distribution} /> : null}
          {pairsLoading ? <ChartSkeleton /> : pairs?.length ? <PairChart pairs={pairs} totalRounds={stats?.length ? Math.round(stats.reduce((s, n) => s + n.totalCount, 0) / 6) : 0} /> : null}
        </div>
      </main>
    </div>
  )
}
