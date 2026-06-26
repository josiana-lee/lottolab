import { analyzeNumbers, DrawRow } from '@/lib/analyzer'

const makeDraws = (rounds: { round: number; nums: number[] }[]): DrawRow[] =>
  rounds.map(({ round, nums }) => ({
    round,
    n1: nums[0],
    n2: nums[1],
    n3: nums[2],
    n4: nums[3],
    n5: nums[4],
    n6: nums[5],
  }))

describe('analyzeNumbers', () => {
  it('returns 45 NumberStats entries', () => {
    const result = analyzeNumbers(makeDraws([{ round: 1, nums: [1, 2, 3, 4, 5, 6] }]))
    expect(result).toHaveLength(45)
  })

  it('counts total appearances correctly', () => {
    const result = analyzeNumbers(
      makeDraws([
        { round: 1, nums: [1, 2, 3, 4, 5, 6] },
        { round: 2, nums: [1, 7, 8, 9, 10, 11] },
      ]),
    )
    expect(result.find(s => s.number === 1)?.totalCount).toBe(2)
    expect(result.find(s => s.number === 45)?.totalCount).toBe(0)
  })

  it('calculates lastSeenGap correctly', () => {
    const result = analyzeNumbers(
      makeDraws([
        { round: 1, nums: [1, 2, 3, 4, 5, 6] },
        { round: 2, nums: [7, 8, 9, 10, 11, 12] },
        { round: 3, nums: [7, 8, 9, 10, 11, 12] },
      ]),
    )
    expect(result.find(s => s.number === 1)?.lastSeenGap).toBe(2)
    expect(result.find(s => s.number === 7)?.lastSeenGap).toBe(0)
  })

  it('sets lastSeenRound to null for numbers never appeared', () => {
    const result = analyzeNumbers(makeDraws([{ round: 1, nums: [1, 2, 3, 4, 5, 6] }]))
    expect(result.find(s => s.number === 45)?.lastSeenRound).toBeNull()
  })
})
