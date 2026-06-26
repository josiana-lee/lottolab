import { DrawRow } from '@/lib/analyzer'
import { generateCombos } from '@/lib/generator'

const makeDraws = (n: number): DrawRow[] =>
  Array.from({ length: n }, (_, i) => ({
    round: i + 1,
    n1: 1,
    n2: 8,
    n3: 15,
    n4: 22,
    n5: 30,
    n6: 38,
  }))

describe('generateCombos', () => {
  it('returns exactly count combos', () => {
    expect(generateCombos(makeDraws(100), 5)).toHaveLength(5)
  })

  it('returns no duplicate combos', () => {
    const result = generateCombos(makeDraws(100), 5)
    const keys = result.map(combo => combo.numbers.join('-'))
    expect(new Set(keys).size).toBe(5)
  })

  it('returns combos not in past draws', () => {
    const keys = generateCombos(makeDraws(100), 5).map(combo => combo.numbers.join('-'))
    expect(keys).not.toContain('1-8-15-22-30-38')
  })

  it('each combo has required fields', () => {
    const result = generateCombos(makeDraws(100), 5)
    for (const combo of result) {
      expect(combo.numbers).toHaveLength(6)
      expect(typeof combo.score).toBe('number')
      expect(combo.reason.length).toBeGreaterThan(0)
      expect(combo.sum).toBe(combo.numbers.reduce((a, b) => a + b, 0))
    }
  })
})
