import { LottoHeader } from '@/components/LottoHeader'
import { ChartSkeleton, DistributionSkeleton, PanelSkeleton } from '@/components/StatsSkeleton'

export default function StatsLoading() {
  return (
    <div className="min-h-screen bg-base text-primary">
      <LottoHeader />
      <main className="mx-auto max-w-[1100px] px-6 py-9 pb-20">
        <div className="mb-8 flex items-center gap-4">
          <div className="skeleton-shine h-4 w-16 rounded bg-white/[0.05]" />
          <div className="skeleton-shine h-7 w-24 rounded bg-white/[0.06]" />
        </div>
        <div className="space-y-6">
          <ChartSkeleton />
          <PanelSkeleton />
          <DistributionSkeleton />
        </div>
      </main>
    </div>
  )
}
