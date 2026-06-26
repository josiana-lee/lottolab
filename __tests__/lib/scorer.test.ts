import { calcComboScore } from '@/lib/scorer'
import { NumberStats } from '@/types/lotto'

const makeStats = (overrides: Partial<NumberStats> = {}): NumberStats => ({
  number: 1,
  totalCount: 150,
  recent30Count: 4,
  recent100Count: 14,
  lastSeenRound: 1220,
  lastSeenGap: 5,
  averageGap: 7,
  hotScore: 60,
  coldScore: 50,
  finalScore: 55,
  ...overrides,
})

describe('calcComboScore', () => {
  it('returns a number between 0 and 100', () => {
    const statsMap = new Map(Array.from({ length: 45 }, (_, i) => [i + 1, makeStats({ number: i + 1 })]))
    const score = calcComboScore([7, 15, 23, 34, 41, 24], statsMap, new Map())
    expect(score).toBeGreaterThanOrEqual(0)
    expect(score).toBeLessThanOrEqual(100)
  })

  it('gives higher score to balanced odd/even combos', () => {
    const statsMap = new Map(Array.from({ length: 45 }, (_, i) => [i + 1, makeStats({ number: i + 1 })]))
    const balanced = calcComboScore([7, 12, 23, 28, 35, 40], statsMap, new Map())
    const unbalanced = calcComboScore([1, 3, 5, 7, 9, 12], statsMap, new Map())
    expect(balanced).toBeGreaterThan(unbalanced)
  })
})
