import { format } from 'date-fns'
import { prisma } from '@/lib/db'
import { hasDatabaseConfig } from '@/lib/env'
import { MainDashboard } from './MainDashboard'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  let latestRound = 0
  let lastSync = '없음'
  let latestNumbers: number[] = []
  let latestBonus = 0

  try {
    if (!hasDatabaseConfig()) throw new Error('DATABASE_URL is not configured')

    const latestDraw = await prisma.draw.findFirst({ orderBy: { round: 'desc' } })

    if (latestDraw) {
      latestRound = latestDraw.round
      lastSync = format(latestDraw.updatedAt, 'yyyy-MM-dd HH:mm')
      latestNumbers = [latestDraw.n1, latestDraw.n2, latestDraw.n3, latestDraw.n4, latestDraw.n5, latestDraw.n6]
      latestBonus = latestDraw.bonus
    }
  } catch {
    lastSync = 'DB 연결 필요'
  }

  return (
    <MainDashboard
      latestRound={latestRound}
      lastSync={lastSync}
      latestNumbers={latestNumbers}
      latestBonus={latestBonus}
    />
  )
}
