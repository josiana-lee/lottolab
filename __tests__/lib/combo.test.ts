import { createComboKey, isValidCombo } from '@/lib/combo'

describe('createComboKey', () => {
  it('sorts numbers ascending and joins with dash', () => {
    expect(createComboKey([42, 7, 18, 3, 27, 15])).toBe('3-7-15-18-27-42')
  })

  it('handles already-sorted input', () => {
    expect(createComboKey([1, 2, 3, 4, 5, 6])).toBe('1-2-3-4-5-6')
  })
})

describe('isValidCombo', () => {
  const empty = new Set<string>()

  it('returns false for past combo', () => {
    expect(isValidCombo([3, 7, 15, 18, 27, 42], new Set(['3-7-15-18-27-42']))).toBe(false)
  })

  it('returns false for invalid ranges and duplicate numbers', () => {
    expect(isValidCombo([0, 2, 3, 4, 30, 45], empty)).toBe(false)
    expect(isValidCombo([7, 15, 23, 23, 34, 41], empty)).toBe(false)
  })

  it('returns false for invalid sums', () => {
    expect(isValidCombo([1, 2, 3, 4, 5, 6], empty)).toBe(false)
    expect(isValidCombo([40, 41, 42, 43, 44, 45], empty)).toBe(false)
  })

  it('returns false for all odd, all even, all low, or all high combos', () => {
    expect(isValidCombo([1, 3, 5, 7, 9, 11], empty)).toBe(false)
    expect(isValidCombo([2, 4, 6, 8, 10, 12], empty)).toBe(false)
    expect(isValidCombo([1, 5, 10, 15, 20, 22], empty)).toBe(false)
    expect(isValidCombo([23, 27, 31, 35, 40, 45], empty)).toBe(false)
  })

  it('returns false for concentration patterns', () => {
    expect(isValidCombo([10, 11, 12, 13, 25, 35], empty)).toBe(false)
    expect(isValidCombo([1, 11, 21, 31, 5, 15], empty)).toBe(false)
    expect(isValidCombo([11, 12, 13, 14, 15, 30], empty)).toBe(false)
  })

  it('returns true for a valid combo', () => {
    expect(isValidCombo([7, 15, 23, 34, 41, 24], empty)).toBe(true)
  })
})
