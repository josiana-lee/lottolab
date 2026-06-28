import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { hasDatabaseConfig } from '@/lib/env'

export const dynamic = 'force-dynamic'

export async function DELETE(req: NextRequest) {
  if (!hasDatabaseConfig()) return NextResponse.json({ error: 'DB 설정 없음' }, { status: 503 })
  try {
    const { endpoint } = await req.json()
    await prisma.pushSubscription.deleteMany({ where: { endpoint } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: '구독 해제 실패' }, { status: 500 })
  }
}
