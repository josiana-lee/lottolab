export type LottoDraw = {
  round: number
  drawDate: string
  numbers: number[]
  bonus: number
  comboKey: string
}

export type NumberStats = {
  number: number
  totalCount: number
  recent30Count: number
  recent100Count: number
  lastSeenRound: number | null
  lastSeenGap: number
  averageGap: number
  hotScore: number
  coldScore: number
  finalScore: number
}

export type GeneratedCombo = {
  numbers: number[]
  score: number
  sum: number
  oddCount: number
  evenCount: number
  lowCount: number
  highCount: number
  consecutivePairCount: number
  reason: string[]
}

export type SavedComboRecord = {
  id: number
  numbers: number[]
  comboKey: string
  score: number | null
  matchedRound: number | null
  createdAt: string
}

export type SyncResult = {
  synced: number[]
  message: string
  matchedCombos: number
}

export type DistributionStats = {
  sumDistribution: { range: string; count: number }[]
  oddEvenDistribution: { label: string; count: number }[]
  lowHighDistribution: { label: string; count: number }[]
  consecutiveFrequency: { pairs: number; frequency: number }[]
}
