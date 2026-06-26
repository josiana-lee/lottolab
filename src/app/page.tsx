import { format } from 'date-fns'
import { prisma } from '@/lib/db'
import { hasDatabaseConfig } from '@/lib/env'
import { MainDashboard } from './MainDashboard'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  let totalRounds = 0
  let latestRound = 0
  let lastSync = '없음'

  try {
    if (!hasDatabaseConfig()) throw new Error('DATABASE_URL is not configured')

    const [count, latestDraw] = await Promise.all([
      prisma.draw.count(),
      prisma.draw.findFirst({ orderBy: { round: 'desc' } }),
    ])

    totalRounds = count
    latestRound = latestDraw?.round ?? 0
    lastSync = latestDraw ? format(latestDraw.updatedAt, 'yyyy-MM-dd HH:mm') : '없음'
  } catch {
    lastSync = 'DB 연결 필요'
  }

  return <MainDashboard totalRounds={totalRounds} latestRound={latestRound} lastSync={lastSync} />
}
