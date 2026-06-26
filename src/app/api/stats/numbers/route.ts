import { NextResponse } from 'next/server'
import { analyzeNumbers } from '@/lib/analyzer'
import { prisma } from '@/lib/db'
import { hasDatabaseConfig } from '@/lib/env'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    if (!hasDatabaseConfig()) {
      return NextResponse.json({ error: 'DATABASE_URL 설정이 필요합니다.' }, { status: 503 })
    }

    const draws = await prisma.draw.findMany({
      orderBy: { round: 'asc' },
      select: { round: true, n1: true, n2: true, n3: true, n4: true, n5: true, n6: true },
    })

    return NextResponse.json(analyzeNumbers(draws))
  } catch {
    return NextResponse.json({ error: '통계 조회 실패' }, { status: 500 })
  }
}
