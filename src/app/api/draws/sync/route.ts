import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { hasDatabaseConfig } from '@/lib/env'
import { fetchLottoDraw } from '@/lib/lotto-api'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    if (!hasDatabaseConfig()) {
      return NextResponse.json({ error: 'DATABASE_URL 설정이 필요합니다.' }, { status: 503 })
    }

    const lastDraw = await prisma.draw.findFirst({ orderBy: { round: 'desc' } })
    let round = (lastDraw?.round ?? 0) + 1
    const synced: number[] = []

    while (true) {
      const draw = await fetchLottoDraw(round)
      if (!draw) break

      await prisma.draw.upsert({
        where: { round: draw.round },
        update: {},
        create: {
          round: draw.round,
          drawDate: new Date(draw.drawDate),
          n1: draw.numbers[0],
          n2: draw.numbers[1],
          n3: draw.numbers[2],
          n4: draw.numbers[3],
          n5: draw.numbers[4],
          n6: draw.numbers[5],
          bonus: draw.bonus,
          comboKey: draw.comboKey,
        },
      })

      synced.push(round)
      round += 1
    }

    const unmatched = await prisma.savedCombo.findMany({ where: { matchedRound: null } })
    let matchedCombos = 0

    for (const saved of unmatched) {
      const matchedDraw = await prisma.draw.findUnique({ where: { comboKey: saved.comboKey } })
      if (!matchedDraw) continue

      await prisma.savedCombo.update({
        where: { id: saved.id },
        data: { matchedRound: matchedDraw.round, matchedDrawId: matchedDraw.id },
      })
      matchedCombos += 1
    }

    return NextResponse.json({
      synced,
      message: synced.length === 0 ? '새로운 회차가 없습니다.' : `${synced.join(', ')}회차 동기화 완료.`,
      matchedCombos,
    })
  } catch {
    return NextResponse.json({ error: '동기화 실패' }, { status: 500 })
  }
}
