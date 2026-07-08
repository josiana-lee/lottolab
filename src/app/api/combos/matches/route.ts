import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { hasDatabaseConfig } from '@/lib/env'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    if (!hasDatabaseConfig()) {
      return NextResponse.json({ error: 'DATABASE_URL 설정이 필요합니다.' }, { status: 503 })
    }

    const [matches, total] = await Promise.all([
      prisma.savedCombo.findMany({
        where: { matchedRound: { not: null } },
        orderBy: { matchedRound: 'desc' },
        select: {
          comboKey: true,
          n1: true, n2: true, n3: true, n4: true, n5: true, n6: true,
          matchedRound: true,
          createdAt: true,
        },
      }),
      prisma.savedCombo.count(),
    ])

    return NextResponse.json({
      matches: matches.map(m => ({
        comboKey: m.comboKey,
        numbers: [m.n1, m.n2, m.n3, m.n4, m.n5, m.n6],
        matchedRound: m.matchedRound as number,
        createdAt: m.createdAt.toISOString(),
      })),
      total,
    })
  } catch {
    return NextResponse.json({ error: '조회 실패' }, { status: 500 })
  }
}
