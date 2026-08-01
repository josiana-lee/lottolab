import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '번호별 통계 · Lotto Lab',
  description: '로또 번호별 출현 빈도, 최근 30/100회 추세, 미출현 기간, 페어 빈도, 합계 분포 등 통계 시각화',
}

export default function StatsLayout({ children }: { children: React.ReactNode }) {
  return children
}
