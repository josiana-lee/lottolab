import { NextRequest, NextResponse } from 'next/server'
import webpush from 'web-push'
import { prisma } from '@/lib/db'
import { hasDatabaseConfig } from '@/lib/env'

export const dynamic = 'force-dynamic'

if (process.env.VAPID_EMAIL && process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    process.env.VAPID_EMAIL,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY,
  )
}

export async function POST(req: NextRequest) {
  if (!hasDatabaseConfig()) {
    return NextResponse.json({ error: 'DB 설정 없음' }, { status: 503 })
  }
  try {
    const { endpoint } = await req.json()
    if (typeof endpoint !== 'string' || !endpoint) {
      return NextResponse.json({ error: 'endpoint가 필요합니다.' }, { status: 400 })
    }

    // 클라이언트가 보낸 키가 아니라, /push/subscribe로 이미 등록된 구독만 신뢰한다.
    const sub = await prisma.pushSubscription.findUnique({ where: { endpoint } })
    if (!sub) {
      return NextResponse.json({ error: '등록되지 않은 구독입니다.' }, { status: 404 })
    }

    await webpush.sendNotification(
      { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
      JSON.stringify({
        title: 'Lotto Lab 테스트 알림',
        body: '알림이 정상적으로 도착했습니다.',
        url: '/',
      }),
    )
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: '테스트 알림 발송 실패' }, { status: 500 })
  }
}
