import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'
import { KakaoAdBanner } from '@/components/KakaoAdBanner'
import { SplashScreen } from '@/components/SplashScreen'
import { SITE_URL } from '@/lib/constants'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
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

const splashCSS = `
#lotto-splash{position:fixed;inset:0;background:#07080F;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:9999;animation:splashFadeOut 4s ease forwards}
html[data-splash-hidden] #lotto-splash{display:none!important}
@keyframes splashFadeOut{0%,82%{opacity:1}100%{opacity:0;pointer-events:none}}
@keyframes glowPulse{0%,100%{opacity:.6;transform:scale(1)}50%{opacity:1;transform:scale(1.12)}}
@keyframes iconDrop{0%{opacity:0;transform:translateY(-36px) scale(.7)}60%{opacity:1;transform:translateY(5px) scale(1.04)}80%{transform:translateY(-3px) scale(.98)}100%{opacity:1;transform:translateY(0) scale(1)}}
@keyframes textRise{0%{opacity:0;transform:translateY(20px)}100%{opacity:1;transform:translateY(0)}}
@keyframes tagFade{0%{opacity:0}100%{opacity:1}}
@keyframes splashProgress{0%{width:0}100%{width:100%}}
@keyframes splashScan{0%{top:-4px;opacity:.05}100%{top:100%;opacity:0}}
.sp-glow{position:absolute;width:420px;height:420px;border-radius:50%;background:radial-gradient(circle,rgba(0,91,255,.1) 0%,transparent 70%);animation:glowPulse 2s ease-in-out infinite;pointer-events:none}
.sp-scan{position:absolute;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,rgba(0,229,255,.05),transparent);animation:splashScan 2.8s linear infinite;pointer-events:none}
.sp-flask{margin-bottom:28px;animation:iconDrop .65s cubic-bezier(.34,1.56,.64,1) .2s 1 both}
.sp-text{display:flex;flex-direction:column;align-items:center;gap:9px;animation:textRise .55s ease 2s 1 both;opacity:0}
.sp-title-lotto{font-family:'Space Grotesk',sans-serif;font-size:44px;font-weight:700;color:#E8EDF5;letter-spacing:-1.5px;line-height:1}
.sp-title-lab{font-family:'JetBrains Mono',monospace;font-size:38px;font-weight:700;color:#00E5FF;letter-spacing:6px;line-height:1}
.sp-subtitle{font-family:'JetBrains Mono',monospace;font-size:12px;color:#6B7A96;letter-spacing:2px;text-transform:uppercase;font-weight:600;animation:tagFade .5s ease 2.4s 1 both;opacity:0}
.sp-progress{position:absolute;bottom:0;left:0;right:0;height:2px;background:rgba(255,255,255,.04)}
.sp-progress-fill{height:100%;background:linear-gradient(90deg,#005BFF,#00E5FF);animation:splashProgress 3.5s linear .2s 1 both;width:0}
`

// 하이드레이션 이전(HTML 파싱 직후) 동기 실행 스크립트.
// 이미 스플래시를 본 사용자는 <html> 태그에 속성만 세팅해 CSS로 즉시 숨긴다.
// (과거에는 document.head.appendChild로 새 <style> 태그를 head에 끼워넣었는데,
// 이 경우 React가 기대하는 head 자식 순서와 실제 DOM이 어긋나면서
// "#lotto-splash{display:none!important}" 스타일 태그가 splashCSS 자리로 오인되어
// 하이드레이션 불일치(mismatch) 경고와 예기치 않은 재렌더링을 유발했다.
// html 엘리먼트에 속성 하나만 추가하면 DOM 자식 개수가 바뀌지 않으므로 이 문제가 없다.)
const splashHeadScript = `(function(){if(localStorage.getItem('lotto-lab:splash-shown')){document.documentElement.setAttribute('data-splash-hidden','1');}})();`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: splashHeadScript }} />
        <style dangerouslySetInnerHTML={{ __html: splashCSS }} />
      </head>
      <body className="bg-base text-primary font-lotto-sans antialiased pb-[62px] sm:pb-[102px]">
        <SplashScreen />
        <Providers>{children}</Providers>
        <KakaoAdBanner />
      </body>
    </html>
  )
}
