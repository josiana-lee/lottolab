import { LOW_NUMBER_THRESHOLD, MAX_SUM, MIN_SUM } from './constants'

export function createComboKey(numbers: number[]): string {
  return [...numbers].sort((a, b) => a - b).join('-')
}

export function parseNumbers(numbersStr: string): number[] {
  return numbersStr
    .split(',')
    .map(Number)
    .filter(Number.isFinite)
}

export function getComboStats(numbers: number[]) {
  const sorted = [...numbers].sort((a, b) => a - b)
  const sum = sorted.reduce((total, n) => total + n, 0)
  const oddCount = sorted.filter(n => n % 2 === 1).length
  const lowCount = sorted.filter(n => n <= LOW_NUMBER_THRESHOLD).length

  let consecutivePairCount = 0
  let maxConsecutiveRun = sorted.length > 0 ? 1 : 0
  let currentRun = sorted.length > 0 ? 1 : 0

  for (let i = 1; i < sorted.length; i += 1) {
    if (sorted[i] === sorted[i - 1] + 1) {
      consecutivePairCount += 1
      currentRun += 1
      maxConsecutiveRun = Math.max(maxConsecutiveRun, currentRun)
    } else {
      currentRun = 1
    }
  }

  const lastDigitCounts = new Map<number, number>()
  const decadeCounts = new Map<number, number>()

  for (const n of sorted) {
    lastDigitCounts.set(n % 10, (lastDigitCounts.get(n % 10) ?? 0) + 1)
    decadeCounts.set(Math.floor((n - 1) / 10), (decadeCounts.get(Math.floor((n - 1) / 10)) ?? 0) + 1)
  }

  return {
    sorted,
    sum,
    oddCount,
    evenCount: sorted.length - oddCount,
    lowCount,
    highCount: sorted.length - lowCount,
    consecutivePairCount,
    maxConsecutiveRun,
    maxSameLastDigit: Math.max(0, ...lastDigitCounts.values()),
    maxSameDecade: Math.max(0, ...decadeCounts.values()),
  }
}

export function isValidCombo(numbers: number[], pastComboSet: Set<string>): boolean {
  if (numbers.length !== 6) return false
  if (numbers.some(n => !Number.isInteger(n) || n < 1 || n > 45)) return false
  if (new Set(numbers).size !== 6) return false

  const stats = getComboStats(numbers)
  if (pastComboSet.has(stats.sorted.join('-'))) return false
  if (stats.sum < MIN_SUM || stats.sum > MAX_SUM) return false
  if (stats.oddCount === 0 || stats.oddCount === 6) return false
  if (stats.lowCount === 0 || stats.lowCount === 6) return false
  if (stats.maxConsecutiveRun >= 4) return false
  if (stats.maxSameLastDigit >= 4) return false
  if (stats.maxSameDecade >= 5) return false

  return true
}
