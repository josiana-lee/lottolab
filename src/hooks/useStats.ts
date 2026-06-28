import { useQuery } from '@tanstack/react-query'
import { DistributionStats, NumberStats } from '@/types/lotto'
import type { PairStat } from '@/app/api/stats/pairs/route'

async function readJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  const body = await res.json()
  if (!res.ok) throw new Error(body.error ?? '요청 실패')
  return body
}

export function fetchNumberStats() {
  return readJson<NumberStats[]>('/api/stats/numbers')
}

export function fetchDistribution() {
  return readJson<DistributionStats>('/api/stats/distribution')
}

export function fetchPairStats() {
  return readJson<PairStat[]>('/api/stats/pairs')
}

export function useNumberStats() {
  return useQuery<NumberStats[]>({
    queryKey: ['stats', 'numbers'],
    queryFn: fetchNumberStats,
  })
}

export function useDistribution() {
  return useQuery<DistributionStats>({
    queryKey: ['stats', 'distribution'],
    queryFn: fetchDistribution,
  })
}

export function usePairStats() {
  return useQuery<PairStat[]>({
    queryKey: ['stats', 'pairs'],
    queryFn: fetchPairStats,
  })
}
