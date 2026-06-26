import { PrismaClient } from '@prisma/client'
import { fetchLottoDraw, fetchLottolyzerPage } from '../src/lib/lotto-api'
import { LottoDraw } from '../src/types/lotto'

const prisma = new PrismaClient()

async function saveDraw(draw: LottoDraw) {
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
}

async function seedFromLottolyzer(startRound: number): Promise<number> {
  const collected = new Map<number, LottoDraw>()

  for (let page = 1; page <= 40; page += 1) {
    const draws = await fetchLottolyzerPage(page, 50)
    if (draws.length === 0) break

    for (const draw of draws) {
      if (draw.round >= startRound) collected.set(draw.round, draw)
    }

    if (draws.some(draw => draw.round < startRound)) break
  }

  const sorted = [...collected.values()].sort((a, b) => a.round - b.round)
  const result = await prisma.draw.createMany({
    data: sorted.map(draw => ({
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
    })),
    skipDuplicates: true,
  })

  return result.count
}

async function seed() {
  const lastDraw = await prisma.draw.findFirst({ orderBy: { round: 'desc' } })
  let round = (lastDraw?.round ?? 0) + 1
  let saved = 0
  let misses = 0

  console.log(`Starting from round ${round}`)

  while (misses < 3) {
    const draw = await fetchLottoDraw(round)

    if (!draw) {
      misses += 1
      console.log(`Round ${round}: not available`)
      round += 1
      continue
    }

    misses = 0
    await saveDraw(draw)

    saved += 1
    if (saved % 100 === 0) console.log(`Saved ${saved} rounds`)
    round += 1
    await new Promise(resolve => setTimeout(resolve, 5))
  }

  if (saved === 0) {
    console.log('Official API returned no draw data. Trying Lottolyzer fallback...')
    saved = await seedFromLottolyzer(1)
  }

  console.log(`Seed complete. Saved ${saved} rounds.`)
}

seed()
  .catch(error => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
