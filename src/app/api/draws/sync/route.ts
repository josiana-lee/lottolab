import { NextResponse } from 'next/server'
import webpush from 'web-push'
import { prisma } from '@/lib/db'
import { hasDatabaseConfig } from '@/lib/env'
import { fetchLottoDraw } from '@/lib/lotto-api'

if (process.env.VAPID_EMAIL && process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    process.env.VAPID_EMAIL,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY,
  )
}

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

    const latestStoredDraw = await prisma.draw.findFirst({ orderBy: { round: 'desc' } })
    const latestDraw = latestStoredDraw
      ? {
          round: latestStoredDraw.round,
          numbers: [
            latestStoredDraw.n1,
            latestStoredDraw.n2,
            latestStoredDraw.n3,
            latestStoredDraw.n4,
            latestStoredDraw.n5,
            latestStoredDraw.n6,
          ],
          bonus: latestStoredDraw.bonus,
        }
      : null

    // 새 회차가 있으면 푸시 알림 발송
    if (synced.length > 0 && latestDraw) {
      const subs = await prisma.pushSubscription.findMany()
      const payload = JSON.stringify({
        title: `${latestDraw.round}회 당첨번호 발표 🎱`,
        body: `${latestDraw.numbers.join('  ')}  +  ${latestDraw.bonus}`,
        url: '/',
      })
      await Promise.allSettled(
        subs.map(sub =>
          webpush.sendNotification(
            { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
            payload,
          ).catch(() => prisma.pushSubscription.delete({ where: { endpoint: sub.endpoint } }))
        )
      )
    }

    return NextResponse.json({
      synced,
      message: synced.length === 0 ? '새로운 회차가 없습니다.' : `${synced.join(', ')}회차 동기화 완료.`,
      latestDraw,
    })
  } catch {
    return NextResponse.json({ error: '동기화 실패' }, { status: 500 })
  }
}
