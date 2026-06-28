import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { hasDatabaseConfig } from '@/lib/env'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  if (!hasDatabaseConfig()) return NextResponse.json({ error: 'DB 설정 없음' }, { status: 503 })
  try {
    const sub = await req.json()
    await prisma.pushSubscription.upsert({
      where: { endpoint: sub.endpoint },
      update: { p256dh: sub.keys.p256dh, auth: sub.keys.auth },
      create: { endpoint: sub.endpoint, p256dh: sub.keys.p256dh, auth: sub.keys.auth },
    })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: '구독 실패' }, { status: 500 })
  }
}
