import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Lotto Lab',
  description: '로또 과거 당첨 데이터를 분석하는 번호 연구소',
  icons: {
    icon: '/favicon.png',
    apple: '/icon-180.png',
  },
  openGraph: {
    title: 'Lotto Lab',
    description: '로또 과거 당첨 데이터를 분석하는 번호 연구소',
    images: [{ url: '/icon-512.png', width: 512, height: 512 }],
  },
  manifest: '/manifest.json',
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
