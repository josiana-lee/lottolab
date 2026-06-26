import Link from 'next/link'

export function LottoHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-base/95 backdrop-blur-[14px]">
      <nav className="mx-auto flex h-[62px] max-w-none items-center justify-between gap-4 px-5 sm:px-9">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[9px] bg-gradient-to-br from-cyan to-cyan-blue font-lotto-mono text-[16px] font-bold tracking-[-1px] text-black">
            L²
          </span>
          <span className="text-[17px] font-bold tracking-[-0.5px]">
            Lotto <span className="font-lotto-mono text-[16px] tracking-[1px] text-cyan">LAB</span>
          </span>
        </Link>
        <span className="hidden items-center gap-1.5 rounded-[20px] border border-white/[0.07] bg-white/[0.04] px-3.5 py-[5px] text-[13px] text-[#4A5A72] sm:inline-flex">
          <span className="h-[5px] w-[5px] rounded-full bg-cyan" />
          결과 보장 없음 · 과거 분포 분석 도구
        </span>
      </nav>
    </header>
  )
}
