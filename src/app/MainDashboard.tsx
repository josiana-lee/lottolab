'use client'

import Link from 'next/link'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { ComboCard } from '@/components/ComboCard'
import { FreqBarChart } from '@/components/FreqBarChart'
import { GenerateButton } from '@/components/GenerateButton'
import { GeneratedHistory, GeneratedHistoryBatch } from '@/components/GeneratedHistory'
import { HotColdPanel } from '@/components/HotColdPanel'
import { LottoHeader } from '@/components/LottoHeader'
import { NumberHeatmap } from '@/components/NumberHeatmap'
import { SavedComboCard } from '@/components/SavedComboCard'
import { SyncStatusCard } from '@/components/SyncStatusCard'
import { MAX_SAVED_COMBOS } from '@/lib/constants'
import { useSavedCombos } from '@/hooks/useSavedCombos'
import { fetchDistribution, fetchNumberStats, useNumberStats } from '@/hooks/useStats'
import { GeneratedCombo } from '@/types/lotto'

type Props = {
  latestRound: number
  lastSync: string
  latestNumbers: number[]
  latestBonus: number
}

const GENERATED_HISTORY_KEY = 'lotto-lab.generated-history'
const MAX_GENERATED_HISTORY = 10

export function MainDashboard({ latestRound, lastSync, latestNumbers, latestBonus }: Props) {
  const [combos, setCombos] = useState<GeneratedCombo[]>([])
  const [generatedHistory, setGeneratedHistory] = useState<GeneratedHistoryBatch[]>([])
  const queryClient = useQueryClient()
  const { data: statsData, error: statsError } = useNumberStats()
  const { data: savedData } = useSavedCombos()

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(GENERATED_HISTORY_KEY)
      if (!stored) return
      const parsed = JSON.parse(stored) as GeneratedHistoryBatch[]
      if (Array.isArray(parsed)) setGeneratedHistory(parsed.slice(0, MAX_GENERATED_HISTORY))
    } catch {
      window.localStorage.removeItem(GENERATED_HISTORY_KEY)
    }
  }, [])

  const prefetchStatsPage = () => {
    queryClient.prefetchQuery({ queryKey: ['stats', 'numbers'], queryFn: fetchNumberStats })
    queryClient.prefetchQuery({ queryKey: ['stats', 'distribution'], queryFn: fetchDistribution })
  }
  const handleGenerated = (nextCombos: GeneratedCombo[]) => {
    setCombos(nextCombos)
    setGeneratedHistory(prev => {
      const batch: GeneratedHistoryBatch = {
        id: `${Date.now()}-${nextCombos.map(combo => combo.numbers.join('-')).join('_')}`,
        createdAt: new Date().toISOString(),
        combos: nextCombos,
      }
      const next = [batch, ...prev].slice(0, MAX_GENERATED_HISTORY)
      window.localStorage.setItem(GENERATED_HISTORY_KEY, JSON.stringify(next))
      return next
    })
  }
  const clearGeneratedHistory = () => {
    window.localStorage.removeItem(GENERATED_HISTORY_KEY)
    setGeneratedHistory([])
  }

  return (
    <div className="min-h-screen bg-base text-primary">
      <LottoHeader />
      <main className="mx-auto max-w-[1100px] px-6 py-9 pb-20">
        <div className="mb-8 flex flex-col gap-8">
          <div className="order-2 md:order-1">
            <SyncStatusCard latestRound={latestRound} lastSync={lastSync} latestNumbers={latestNumbers} latestBonus={latestBonus} />
          </div>
          <div className="order-1 md:order-2">
            <GenerateButton totalRounds={latestRound} onResult={handleGenerated} />
          </div>
        </div>

        {combos.length > 0 && (
          <section className="mb-[52px]">
            <div className="mb-[18px] flex items-center gap-3">
              <h2 className="text-[19px] font-bold tracking-[-0.4px]">실험 결과</h2>
              <span className="rounded-[20px] bg-cyan/[0.09] px-2.5 py-[3px] font-lotto-mono text-xs font-bold tracking-[0.8px] text-cyan">
                {combos.length} COMBOS
              </span>
            </div>
            <div className="space-y-3">
              {combos.map((combo, index) => (
                <ComboCard key={combo.numbers.join('-')} combo={combo} rank={index + 1} animDelay={index * 0.08} />
              ))}
            </div>
          </section>
        )}

        <GeneratedHistory
          history={generatedHistory}
          onRestore={setCombos}
          onClear={clearGeneratedHistory}
        />

        {savedData && savedData.savedCombos.length > 0 && (
          <section className="mb-10">
            <div className="mb-4 flex items-center gap-3">
              <h2 className="text-[19px] font-bold tracking-[-0.4px]">저장 실험 이력</h2>
              <span className="rounded-[20px] bg-lotto-yellow/10 px-2.5 py-[3px] font-lotto-mono text-xs font-bold tracking-[0.8px] text-lotto-yellow">
                {savedData.savedCombos.length} / {MAX_SAVED_COMBOS}
              </span>
            </div>
            <div className="space-y-2.5">
              {savedData.savedCombos.map(saved => (
                <SavedComboCard key={saved.id} saved={saved} />
              ))}
            </div>
          </section>
        )}

        {statsError && (
          <div className="mb-8 rounded-lg border border-lotto-red/30 bg-lotto-red/10 p-4 text-sm text-lotto-red">
            통계 데이터를 불러오지 못했습니다. Supabase 연결 정보와 Prisma 마이그레이션을 확인해주세요.
          </div>
        )}

        {statsData && (
          <div className="mb-8">
            <NumberHeatmap stats={statsData} />
          </div>
        )}

        {statsData && (
          <div className="mb-8">
            <HotColdPanel stats={statsData} />
          </div>
        )}

        {statsData && (
          <div className="mb-8">
            <FreqBarChart stats={statsData} totalRounds={latestRound} />
          </div>
        )}

        <div className="hidden text-center sm:block">
          <Link
            href="/stats"
            onMouseEnter={prefetchStatsPage}
            onFocus={prefetchStatsPage}
            onTouchStart={prefetchStatsPage}
            className="inline-flex min-h-10 items-center justify-center rounded-[10px] border border-cyan/20 bg-cyan/[0.07] px-4 text-sm font-bold text-cyan transition hover:border-cyan/40 hover:bg-cyan/10"
          >
            전체 통계 차트 보기
          </Link>
        </div>
      </main>
      <footer className="border-t border-white/[0.05] px-9 py-7 text-center">
        <p className="mb-[7px] text-[13px] font-semibold text-[#5A6A7A]">연구소 안내</p>
        <p className="mx-auto max-w-[540px] text-[13px] leading-[1.75] text-[#6B7A96]">
          Lotto Lab은 재미로 즐기는 로또 추첨번호 분석 대시보드입니다.
          <br />
          결과를 보장하지 않으며, 모든 조합의 추첨 확률은 동일합니다 (1 / 8,145,060)
        </p>
        <div className="mt-4 flex items-center justify-center gap-4">
          <Link href="/terms" className="text-[12px] text-[#3D4A5E] hover:text-muted">
            이용약관
          </Link>
          <span className="text-[#2A3444]">·</span>
          <Link href="/privacy" className="text-[12px] text-[#3D4A5E] hover:text-muted">
            개인정보처리방침
          </Link>
        </div>
        <p className="mt-3 font-lotto-mono text-[11px] tracking-[0.5px] text-[#3D4A5E]">LOTTO LAB · DATA ANALYSIS TOOL · 2026</p>
      </footer>
    </div>
  )
}
