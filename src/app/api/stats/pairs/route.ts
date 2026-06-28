import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { hasDatabaseConfig } from '@/lib/env'

export const dynamic = 'force-dynamic'

export type PairStat = {
  pair: string
  n1: number
  n2: number
  count: number
  pct: number
}

export async function GET() {
  if (!hasDatabaseConfig()) return NextResponse.json([], { status: 503 })
  try {
    const draws = await prisma.draw.findMany({
      select: { n1: true, n2: true, n3: true, n4: true, n5: true, n6: true },
    })

    const pairCounts: Record<string, number> = {}
    for (const draw of draws) {
      const nums = [draw.n1, draw.n2, draw.n3, draw.n4, draw.n5, draw.n6].sort((a, b) => a - b)
      for (let i = 0; i < nums.length; i++) {
        for (let j = i + 1; j < nums.length; j++) {
          const key = `${nums[i]}-${nums[j]}`
          pairCounts[key] = (pairCounts[key] ?? 0) + 1
        }
      }
    }

    const total = draws.length
    const result: PairStat[] = Object.entries(pairCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([pair, count]) => {
        const [n1, n2] = pair.split('-').map(Number)
        return { pair, n1, n2, count, pct: Math.round((count / total) * 1000) / 10 }
      })

    return NextResponse.json(result)
  } catch {
    return NextResponse.json([], { status: 500 })
  }
}
