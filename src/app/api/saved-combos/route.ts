import { NextRequest, NextResponse } from 'next/server'
import { createComboKey, parseNumbers } from '@/lib/combo'
import { MAX_SAVED_COMBOS } from '@/lib/constants'
import { prisma } from '@/lib/db'
import { hasDatabaseConfig } from '@/lib/env'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    if (!hasDatabaseConfig()) {
      return NextResponse.json({ error: 'DATABASE_URL 설정이 필요합니다.' }, { status: 503 })
    }

    const saved = await prisma.savedCombo.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json({
      savedCombos: saved.map(combo => ({
        id: combo.id,
        numbers: parseNumbers(combo.numbers),
        comboKey: combo.comboKey,
        score: combo.score,
        matchedRound: combo.matchedRound,
        createdAt: combo.createdAt.toISOString(),
      })),
    })
  } catch {
    return NextResponse.json({ error: '조회 실패' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!hasDatabaseConfig()) {
      return NextResponse.json({ error: 'DATABASE_URL 설정이 필요합니다.' }, { status: 503 })
    }

    const body = await req.json()
    const numbers = body.numbers as unknown
    const score = typeof body.score === 'number' ? body.score : null

    if (!Array.isArray(numbers) || numbers.length !== 6) {
      return NextResponse.json({ error: '번호는 6개여야 합니다.' }, { status: 400 })
    }

    if (numbers.some(n => !Number.isInteger(n) || n < 1 || n > 45)) {
      return NextResponse.json({ error: '번호는 1~45 사이 정수여야 합니다.' }, { status: 400 })
    }

    if (new Set(numbers).size !== 6) {
      return NextResponse.json({ error: '중복 번호가 있습니다.' }, { status: 400 })
    }

    const sorted = [...numbers].sort((a, b) => a - b)
    const comboKey = createComboKey(sorted)
    const existing = await prisma.savedCombo.findUnique({ where: { comboKey } })

    if (existing) {
      return NextResponse.json({ error: '이미 저장한 조합입니다.' }, { status: 409 })
    }

    const count = await prisma.savedCombo.count()
    if (count >= MAX_SAVED_COMBOS) {
      return NextResponse.json(
        { error: `저장 가능한 조합은 최대 ${MAX_SAVED_COMBOS}개입니다.` },
        { status: 400 },
      )
    }

    const matchedDraw = await prisma.draw.findUnique({ where: { comboKey } })
    const saved = await prisma.savedCombo.create({
      data: {
        numbers: sorted.join(','),
        comboKey,
        score,
        matchedRound: matchedDraw?.round ?? null,
        matchedDrawId: matchedDraw?.id ?? null,
      },
    })

    return NextResponse.json(
      {
        savedCombo: {
          id: saved.id,
          numbers: sorted,
          comboKey: saved.comboKey,
          score: saved.score,
          matchedRound: saved.matchedRound,
          createdAt: saved.createdAt.toISOString(),
        },
      },
      { status: 201 },
    )
  } catch {
    return NextResponse.json({ error: '저장 실패' }, { status: 500 })
  }
}
