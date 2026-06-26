export const LOTTO_API_BASE = 'https://www.dhlottery.co.kr/common.do'

export const SCORE_WEIGHTS = {
  totalFrequency: 0.15,
  recent30Trend: 0.15,
  recent100Trend: 0.1,
  coldGap: 0.15,
  pairFrequency: 0.15,
  tripleFrequency: 0.1,
  sumDistribution: 0.1,
  balance: 0.1,
} as const

export const MAX_SAVED_COMBOS = 10
export const LOW_NUMBER_THRESHOLD = 22
export const COMBO_CANDIDATES = 50_000
export const MIN_SUM = 90
export const MAX_SUM = 190
