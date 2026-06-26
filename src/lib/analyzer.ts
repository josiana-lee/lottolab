import { NumberStats } from '@/types/lotto'

export type DrawRow = {
  round: number
  n1: number
  n2: number
  n3: number
  n4: number
  n5: number
  n6: number
}

export function getDrawNumbers(draw: DrawRow): number[] {
  return [draw.n1, draw.n2, draw.n3, draw.n4, draw.n5, draw.n6]
}

function emptyStats(): NumberStats[] {
  return Array.from({ length: 45 }, (_, i) => ({
    number: i + 1,
    totalCount: 0,
    recent30Count: 0,
    recent100Count: 0,
    lastSeenRound: null,
    lastSeenGap: 0,
    averageGap: 0,
    hotScore: 0,
    coldScore: 0,
    finalScore: 0,
  }))
}

export function analyzeNumbers(draws: DrawRow[]): NumberStats[] {
  if (draws.length === 0) return emptyStats()

  const sorted = [...draws].sort((a, b) => a.round - b.round)
  const latestRound = sorted[sorted.length - 1].round
  const recent30 = sorted.slice(-30)
  const recent100 = sorted.slice(-100)

  const appearances = new Map<number, number[]>()
  for (let n = 1; n <= 45; n += 1) appearances.set(n, [])

  for (const draw of sorted) {
    for (const n of getDrawNumbers(draw)) {
      appearances.get(n)?.push(draw.round)
    }
  }

  return Array.from({ length: 45 }, (_, i) => {
    const n = i + 1
    const rounds = appearances.get(n) ?? []
    const totalCount = rounds.length
    const recent30Count = recent30.filter(draw => getDrawNumbers(draw).includes(n)).length
    const recent100Count = recent100.filter(draw => getDrawNumbers(draw).includes(n)).length
    const lastSeenRound = rounds.at(-1) ?? null
    const lastSeenGap = lastSeenRound === null ? latestRound : latestRound - lastSeenRound
    const averageGap = totalCount > 0 ? sorted.length / totalCount : sorted.length
    const expected30 = Math.max(1, recent30.length * (6 / 45))
    const expected100 = Math.max(1, recent100.length * (6 / 45))
    const hotScore = Math.min(100, (recent30Count / expected30) * 60 + (recent100Count / expected100) * 40)
    const coldScore = Math.min(100, (lastSeenGap / Math.max(1, averageGap)) * 100)
    const finalScore = Math.min(100, Math.round(hotScore * 0.55 + coldScore * 0.45))

    return {
      number: n,
      totalCount,
      recent30Count,
      recent100Count,
      lastSeenRound,
      lastSeenGap,
      averageGap,
      hotScore,
      coldScore,
      finalScore,
    }
  })
}

export function calcPairScores(draws: DrawRow[]): Map<string, number> {
  const pairMap = new Map<string, number>()

  for (const draw of draws) {
    const nums = getDrawNumbers(draw).sort((a, b) => a - b)
    for (let i = 0; i < nums.length; i += 1) {
      for (let j = i + 1; j < nums.length; j += 1) {
        const key = `${nums[i]}-${nums[j]}`
        pairMap.set(key, (pairMap.get(key) ?? 0) + 1)
      }
    }
  }

  return pairMap
}
