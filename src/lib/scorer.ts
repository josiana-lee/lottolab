import { NumberStats } from '@/types/lotto'
import { getComboStats } from './combo'
import { SCORE_WEIGHTS } from './constants'

export function calcComboScore(
  numbers: number[],
  statsMap: Map<number, NumberStats>,
  pairMap: Map<string, number>,
): number {
  const combo = getComboStats(numbers)
  const avgNumberScore =
    combo.sorted.reduce((sum, n) => sum + (statsMap.get(n)?.finalScore ?? 0), 0) / combo.sorted.length

  const sumScore = combo.sum >= 115 && combo.sum <= 165 ? 100 : combo.sum >= 90 && combo.sum <= 190 ? 60 : 0
  const oddBalanceScore = Math.abs(combo.oddCount - 3) === 0 ? 100 : Math.abs(combo.oddCount - 3) === 1 ? 70 : 30
  const lowHighScore = Math.abs(combo.lowCount - 3) === 0 ? 100 : Math.abs(combo.lowCount - 3) === 1 ? 70 : 30

  let pairScore = 0
  for (let i = 0; i < combo.sorted.length; i += 1) {
    for (let j = i + 1; j < combo.sorted.length; j += 1) {
      pairScore += pairMap.get(`${combo.sorted[i]}-${combo.sorted[j]}`) ?? 0
    }
  }

  const normalizedPairScore = Math.min(100, (pairScore / 50) * 100)
  const numberWeight =
    SCORE_WEIGHTS.totalFrequency +
    SCORE_WEIGHTS.recent30Trend +
    SCORE_WEIGHTS.recent100Trend +
    SCORE_WEIGHTS.coldGap

  const raw =
    avgNumberScore * numberWeight +
    normalizedPairScore * (SCORE_WEIGHTS.pairFrequency + SCORE_WEIGHTS.tripleFrequency) +
    sumScore * SCORE_WEIGHTS.sumDistribution +
    ((oddBalanceScore + lowHighScore) / 2) * SCORE_WEIGHTS.balance

  return Math.max(0, Math.min(100, Math.round(raw)))
}
