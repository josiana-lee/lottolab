import { GeneratedCombo } from '@/types/lotto'
import { analyzeNumbers, calcPairScores, DrawRow, getDrawNumbers } from './analyzer'
import { createComboKey, getComboStats, isValidCombo } from './combo'
import { COMBO_CANDIDATES } from './constants'
import { calcComboScore } from './scorer'

function weightedPick(weights: number[], exclude: Set<number>): number {
  const availableTotal = weights.reduce((sum, weight, i) => (exclude.has(i + 1) ? sum : sum + weight), 0)
  let cursor = Math.random() * availableTotal

  for (let i = 0; i < weights.length; i += 1) {
    const number = i + 1
    if (exclude.has(number)) continue
    cursor -= weights[i]
    if (cursor <= 0) return number
  }

  for (let i = 1; i <= 45; i += 1) {
    if (!exclude.has(i)) return i
  }

  return 1
}

export function generateCombos(draws: DrawRow[], count: number): GeneratedCombo[] {
  const stats = analyzeNumbers(draws)
  const pairMap = calcPairScores(draws)
  const statsMap = new Map(stats.map(stat => [stat.number, stat]))
  const pastComboSet = new Set(draws.map(draw => createComboKey(getDrawNumbers(draw))))
  const weights = stats.map(stat => Math.max(0.15, Math.pow((stat.finalScore + 15) / 65, 1.35)))
  const candidates = new Map<string, GeneratedCombo>()
  const maxAttempts = Math.max(COMBO_CANDIDATES, count * 500)

  for (let attempt = 0; attempt < maxAttempts && candidates.size < count * 12; attempt += 1) {
    const picked = new Set<number>()
    while (picked.size < 6) picked.add(weightedPick(weights, picked))

    const numbers = [...picked].sort((a, b) => a - b)
    const key = numbers.join('-')
    if (candidates.has(key) || !isValidCombo(numbers, pastComboSet)) continue

    const comboStats = getComboStats(numbers)
    const score = calcComboScore(numbers, statsMap, pairMap)
    const reason = ['과거 당첨 이력이 없는 조합']

    if (comboStats.sum >= 115 && comboStats.sum <= 165) reason.push(`합계 ${comboStats.sum}: 주요 분포 범위`)
    else reason.push(`합계 ${comboStats.sum}: 유효 범위`)
    if (Math.abs(comboStats.oddCount - 3) <= 1) reason.push(`홀짝 ${comboStats.oddCount}:${comboStats.evenCount}`)
    if (Math.abs(comboStats.lowCount - 3) <= 1) reason.push(`저고 ${comboStats.lowCount}:${comboStats.highCount}`)
    if (comboStats.consecutivePairCount > 0) reason.push(`연속 ${comboStats.consecutivePairCount}쌍`)

    candidates.set(key, {
      numbers,
      score,
      sum: comboStats.sum,
      oddCount: comboStats.oddCount,
      evenCount: comboStats.evenCount,
      lowCount: comboStats.lowCount,
      highCount: comboStats.highCount,
      consecutivePairCount: comboStats.consecutivePairCount,
      reason,
    })
  }

  return [...candidates.values()]
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
}
