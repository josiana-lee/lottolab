'use client'

import { useGenerate } from '@/hooks/useGenerate'
import { GeneratedCombo } from '@/types/lotto'

type Props = {
  onResult: (combos: GeneratedCombo[]) => void
  totalRounds: number
}

export function GenerateButton({ onResult, totalRounds }: Props) {
  const generate = useGenerate()

  return (
    <section className="relative overflow-hidden rounded-3xl border border-cyan/10 bg-card px-6 py-12 text-center sm:px-10 sm:py-14">
      <div className="pointer-events-none absolute -right-[120px] -top-[120px] h-[400px] w-[400px] bg-[radial-gradient(circle,rgba(0,229,255,0.04)_0%,transparent_65%)]" />
      <div className="pointer-events-none absolute -bottom-[100px] -left-[100px] h-[320px] w-[320px] bg-[radial-gradient(circle,rgba(0,91,255,0.05)_0%,transparent_65%)]" />
      <div className="relative z-10">
        <p className="mx-auto mb-[22px] inline-flex items-center gap-[7px] rounded-[20px] border border-cyan/20 bg-cyan/[0.07] px-3.5 py-[5px]">
          <span className="h-[5px] w-[5px] rounded-full bg-cyan" />
          <span className="text-[11px] font-bold uppercase tracking-[1.8px] text-cyan">조합 생성기</span>
        </p>
        <h1 className="mb-3.5 text-[30px] font-bold leading-[1.25] tracking-[-0.8px]">아직 나오지 않은 분석 조합</h1>
        <p className="mx-auto mb-[38px] max-w-[420px] text-[15px] leading-[1.75] text-[#5A6A82]">
          과거 {totalRounds.toLocaleString()}회 당첨 데이터를 분석하여
          <br className="hidden sm:block" />
          한 번도 당첨된 적 없는 조합 5개를 생성합니다
        </p>
        <button
          type="button"
          onClick={() => generate.mutate(undefined, { onSuccess: data => onResult(data.combos) })}
          disabled={generate.isPending}
          className="min-h-[58px] w-full min-w-0 max-w-[290px] rounded-[14px] bg-gradient-to-br from-cyan to-cyan-blue px-6 text-[16px] font-bold tracking-[-0.3px] text-black disabled:opacity-60"
        >
          {generate.isPending ? '분석 중...' : '아직 나오지 않은 조합 5개 생성'}
        </button>
        {generate.error && <p className="mt-4 text-sm text-lotto-red">{generate.error.message}</p>}
        {generate.isPending && (
          <div className="mx-auto mt-5 h-11 w-11 rounded-full border-[3px] border-cyan/20 border-t-cyan animate-spin-fast" />
        )}
        <p className="mt-[18px] text-xs text-[#6B7A96]">모든 조합의 당첨 확률은 동일합니다 (1 / 8,145,060)</p>
      </div>
    </section>
  )
}
