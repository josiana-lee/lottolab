import { LottoDraw } from '@/types/lotto'
import { createComboKey } from './combo'
import { LOTTO_API_BASE } from './constants'

type LottoApiResponse = {
  returnValue: 'success' | 'fail'
  drwNo: number
  drwNoDate: string
  drwtNo1: number
  drwtNo2: number
  drwtNo3: number
  drwtNo4: number
  drwtNo5: number
  drwtNo6: number
  bnusNo: number
}

function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
}

function parseLottolyzerRows(html: string): LottoDraw[] {
  const tbody = html.match(/<tbody>([\s\S]*?)<\/tbody>/i)?.[1]
  if (!tbody) return []

  const rows = tbody.match(/<tr[^>]*>[\s\S]*?<\/tr>/gi) ?? []

  return rows.flatMap(row => {
    const cells = [...row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map(match => stripHtml(match[1]))
    const round = Number(cells[0])
    const drawDate = cells[1]
    const numbers = (cells[2] ?? '')
      .split(',')
      .map(value => Number(value.trim()))
      .filter(Number.isInteger)
      .sort((a, b) => a - b)
    const bonus = Number(cells[3])

    if (!round || !/^\d{4}-\d{2}-\d{2}$/.test(drawDate) || numbers.length !== 6 || !bonus) {
      return []
    }

    return [{
      round,
      drawDate,
      numbers,
      bonus,
      comboKey: createComboKey(numbers),
    }]
  })
}

export async function fetchLottolyzerPage(page: number, perPage = 50): Promise<LottoDraw[]> {
  try {
    const url = `https://kr.lottolyzer.com/history/south-korea/6_slash_45-lotto/page/${page}/per-page/${perPage}/summary-view`
    const res = await fetch(url, {
      cache: 'no-store',
      headers: { 'User-Agent': 'Mozilla/5.0' },
    })
    if (!res.ok) return []

    return parseLottolyzerRows(await res.text())
  } catch {
    return []
  }
}

export async function fetchLottoDraw(round: number): Promise<LottoDraw | null> {
  try {
    const url = `${LOTTO_API_BASE}?method=getLottoNumber&drwNo=${round}`
    const res = await fetch(url, {
      cache: 'no-store',
      headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'application/json' },
    })
    if (!res.ok) throw new Error('official API failed')

    const data = (await res.json()) as LottoApiResponse
    if (data.returnValue !== 'success') throw new Error('official API returned fail')

    const numbers = [
      data.drwtNo1,
      data.drwtNo2,
      data.drwtNo3,
      data.drwtNo4,
      data.drwtNo5,
      data.drwtNo6,
    ].sort((a, b) => a - b)

    return {
      round: data.drwNo,
      drawDate: data.drwNoDate,
      numbers,
      bonus: data.bnusNo,
      comboKey: createComboKey(numbers),
    }
  } catch {
    const recentDraws = await fetchLottolyzerPage(1)
    return recentDraws.find(draw => draw.round === round) ?? null
  }
}
