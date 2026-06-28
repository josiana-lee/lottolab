import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { hasDatabaseConfig } from '@/lib/env'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const comboKey = req.nextUrl.searchParams.get('comboKey')
  if (!comboKey || !hasDatabaseConfig()) return NextResponse.json({ matchedRound: null })
  try {
    const draw = await prisma.draw.findUnique({ where: { comboKey } })
    return NextResponse.json({ matchedRound: draw?.round ?? null })
  } catch {
    return NextResponse.json({ matchedRound: null })
  }
}
