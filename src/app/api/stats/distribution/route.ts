import { NextResponse } from 'next/server'
import { LOW_NUMBER_THRESHOLD } from '@/lib/constants'
import { prisma } from '@/lib/db'
import { hasDatabaseConfig } from '@/lib/env'
import { DistributionStats } from '@/types/lotto'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    if (!hasDatabaseConfig()) {
      return NextResponse.json({ error: 'DATABASE_URL 설정이 필요합니다.' }, { status: 503 })
    }

    const draws = await prisma.draw.findMany({
      orderBy: { round: 'asc' },
      select: { n1: true, n2: true, n3: true, n4: true, n5: true, n6: true },
    })
    const sumBuckets = new Map<string, number>()
    const oddEvenMap = new Map<string, number>()
    const lowHighMap = new Map<string, number>()
    const consecutiveMap = new Map<number, number>()

    for (const draw of draws) {
      const nums = [draw.n1, draw.n2, draw.n3, draw.n4, draw.n5, draw.n6].sort((a, b) => a - b)
      const sum = nums.reduce((total, n) => total + n, 0)
      const bucketStart = Math.floor(sum / 10) * 10
      const bucket = `${bucketStart}~${bucketStart + 9}`
      const oddCount = nums.filter(n => n % 2 === 1).length
      const lowCount = nums.filter(n => n <= LOW_NUMBER_THRESHOLD).length
      let pairs = 0

      for (let i = 1; i < nums.length; i += 1) {
        if (nums[i] === nums[i - 1] + 1) pairs += 1
      }

      sumBuckets.set(bucket, (sumBuckets.get(bucket) ?? 0) + 1)
      oddEvenMap.set(`${oddCount}홀 ${6 - oddCount}짝`, (oddEvenMap.get(`${oddCount}홀 ${6 - oddCount}짝`) ?? 0) + 1)
      lowHighMap.set(`저${lowCount} 고${6 - lowCount}`, (lowHighMap.get(`저${lowCount} 고${6 - lowCount}`) ?? 0) + 1)
      consecutiveMap.set(pairs, (consecutiveMap.get(pairs) ?? 0) + 1)
    }

    const result: DistributionStats = {
      sumDistribution: [...sumBuckets.entries()]
        .map(([range, count]) => ({ range, count }))
        .sort((a, b) => parseInt(a.range, 10) - parseInt(b.range, 10)),
      oddEvenDistribution: [...oddEvenMap.entries()].map(([label, count]) => ({ label, count })),
      lowHighDistribution: [...lowHighMap.entries()].map(([label, count]) => ({ label, count })),
      consecutiveFrequency: [...consecutiveMap.entries()]
        .map(([pairs, frequency]) => ({ pairs, frequency }))
        .sort((a, b) => a.pairs - b.pairs),
    }

    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: '분포 통계 조회 실패' }, { status: 500 })
  }
}
