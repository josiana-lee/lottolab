'use client'

import { useState } from 'react'
import { LottoBall } from './LottoBall'

type Match = {
  comboKey: string
  numbers: number[]
  matchedRound: number
  createdAt: string
}

type ApiResponse = {
  matches: Match[]
  total: number
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

export function ComboMatchCheck() {
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle')
  const [result, setResult] = useState<ApiResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function check() {
    setState('loading')
    setError(null)
    try {
      const res = await fetch('/api/combos/matches')
      const body = (await res.json()) as ApiResponse
      if (!res.ok) throw new Error((body as unknown as { error: string }).error ?? '조회 실패')
      setResult(body)
      setState('done')
    } catch (e) {
      setError(e instanceof Error ? e.message : '조회 실패')
      setState('idle')
    }
  }

  return (
    <section className="rounded-2xl border border-white/[0.07] bg-card px-6 py-[22px]">
      <p className="mb-4 text-[11px] font-semibold uppercase tracking-[1.4px] text-[#8A9BB0]">
        생성 조합 당첨 이력
      </p>

      {state === 'idle' && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted">
            {result !== null
              ? `저장된 조합 ${result.total.toLocaleString()}개`
              : '생성한 조합이 당첨된 적 있는지 확인합니다'}
          </p>
          <button
            type="button"
            onClick={check}
            className="shrink-0 rounded-[10px] border border-cyan/20 bg-cyan/[0.07] px-[18px] py-[9px] text-[13px] font-semibold text-cyan"
          >
            당첨 이력 확인하기
          </button>
        </div>
      )}

      {state === 'loading' && (
        <div className="flex items-center gap-3 text-sm text-muted">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-cyan/20 border-t-cyan" />
          조회 중...
        </div>
      )}

      {state === 'done' && result && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">저장된 조합 {result.total.toLocaleString()}개</p>
            <button
              type="button"
              onClick={() => setState('idle')}
              className="text-xs text-[#4A5A72] hover:text-muted"
            >
              닫기
            </button>
          </div>

          {result.matches.length === 0 ? (
            <p className="text-sm text-[#4A5A72]">아직 당첨된 조합이 없습니다.</p>
          ) : (
            <ul className="space-y-3">
              {result.matches.map(m => (
                <li
                  key={m.comboKey}
                  className="rounded-xl border border-white/[0.05] bg-white/[0.02] px-4 py-3"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded-full border border-lotto-red/30 bg-lotto-red/[0.12] px-2 py-[2px] font-lotto-mono text-[11px] font-bold text-lotto-red">
                      {m.matchedRound}회 당첨
                    </span>
                    <span className="text-[11px] text-[#4A5A72]">{formatDate(m.createdAt)} 생성</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {m.numbers.map(n => (
                      <LottoBall key={n} number={n} size="sm" />
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {error && <p className="mt-2 text-xs text-lotto-red">{error}</p>}
    </section>
  )
}
