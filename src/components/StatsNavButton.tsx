'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function StatsNavButton() {
  const pathname = usePathname()
  const isStats = pathname === '/stats'

  return (
    <Link
      href={isStats ? '/' : '/stats'}
      className="inline-flex items-center gap-1.5 rounded-[8px] border border-cyan/20 bg-cyan/[0.07] px-3 py-1.5 text-[12px] font-semibold text-cyan sm:hidden"
    >
      {isStats ? (
        <>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M5 12l7-7M5 12l7 7" />
          </svg>
          나가기
        </>
      ) : (
        <>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
          최신 통계 보기
        </>
      )}
    </Link>
  )
}
