import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { hasDatabaseConfig } from '@/lib/env'
import { generateCombos } from '@/lib/generator'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    if (!hasDatabaseConfig()) {
      return NextResponse.json({ error: 'DATABASE_URL 설정이 필요합니다.' }, { status: 503 })
    }

    const body = await req.json().catch(() => ({}))
    const count = Number(body.count ?? 5)

    if (!Number.isInteger(count) || count < 1 || count > 10) {
      return NextResponse.json({ error: 'count는 1~10 사이여야 합니다.' }, { status: 400 })
    }

    const draws = await prisma.draw.findMany({
      orderBy: { round: 'asc' },
      select: { round: true, n1: true, n2: true, n3: true, n4: true, n5: true, n6: true },
    })

    if (draws.length === 0) {
      return NextResponse.json({ error: '저장된 데이터가 없습니다. 먼저 동기화를 실행해주세요.' }, { status: 400 })
    }

    return NextResponse.json({ combos: generateCombos(draws, count) })
  } catch {
    return NextResponse.json({ error: '조합 생성 실패' }, { status: 500 })
  }
}
