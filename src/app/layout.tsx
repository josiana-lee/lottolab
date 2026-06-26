import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Lotto Lab',
  description: '로또 과거 당첨 데이터 분석 도구',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-base text-primary font-lotto-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
