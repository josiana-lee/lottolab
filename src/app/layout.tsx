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

const splashCSS = `
#lotto-splash{position:fixed;inset:0;background:#07080F;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:9999;animation:splashFadeOut 3.2s ease forwards}
#lotto-splash.hidden{display:none}
@keyframes splashFadeOut{0%,85%{opacity:1}100%{opacity:0;pointer-events:none}}
@keyframes glowPulse{0%,100%{opacity:.6;transform:scale(1)}50%{opacity:1;transform:scale(1.12)}}
@keyframes iconDrop{0%{opacity:0;transform:translateY(-36px) scale(.7)}60%{opacity:1;transform:translateY(5px) scale(1.04)}80%{transform:translateY(-3px) scale(.98)}100%{opacity:1;transform:translateY(0) scale(1)}}
@keyframes liquidFill{0%{transform:scaleY(0);opacity:0}100%{transform:scaleY(1);opacity:1}}
@keyframes bubbleUp{0%{transform:translateY(0) scale(1);opacity:.7}100%{transform:translateY(-22px) scale(.5);opacity:0}}
@keyframes textRise{0%{opacity:0;transform:translateY(22px)}100%{opacity:1;transform:translateY(0)}}
@keyframes tagFade{0%{opacity:0}100%{opacity:1}}
@keyframes ballPop{0%{opacity:0;transform:scale(0) translateY(10px)}60%{transform:scale(1.15) translateY(-4px)}80%{transform:scale(.95) translateY(1px)}100%{opacity:1;transform:scale(1) translateY(0)}}
@keyframes splashProgressBar{0%{width:0}100%{width:100%}}
@keyframes scanLine{0%{top:-4px;opacity:.06}100%{top:100%;opacity:0}}
@keyframes particle1{0%{opacity:0;transform:translate(0,0) scale(0)}30%{opacity:1}100%{opacity:0;transform:translate(-60px,-80px) scale(.3)}}
@keyframes particle2{0%{opacity:0;transform:translate(0,0) scale(0)}30%{opacity:1}100%{opacity:0;transform:translate(70px,-60px) scale(.3)}}
@keyframes particle3{0%{opacity:0;transform:translate(0,0) scale(0)}30%{opacity:1}100%{opacity:0;transform:translate(-40px,70px) scale(.3)}}
@keyframes particle4{0%{opacity:0;transform:translate(0,0) scale(0)}30%{opacity:1}100%{opacity:0;transform:translate(80px,55px) scale(.3)}}
.sp-glow1{position:absolute;width:420px;height:420px;border-radius:50%;background:radial-gradient(circle,rgba(0,91,255,.12) 0%,transparent 70%);animation:glowPulse 2s ease-in-out infinite;pointer-events:none}
.sp-glow2{position:absolute;width:280px;height:280px;border-radius:50%;background:radial-gradient(circle,rgba(0,229,255,.08) 0%,transparent 70%);animation:glowPulse 2s ease-in-out .4s infinite;pointer-events:none}
.sp-scan{position:absolute;left:0;right:0;height:3px;background:linear-gradient(90deg,transparent,rgba(0,229,255,.06),transparent);animation:scanLine 2.4s linear infinite;pointer-events:none}
.sp-p1{position:absolute;width:8px;height:8px;border-radius:50%;background:#FBC400;animation:particle1 2.5s ease .8s 1 forwards;opacity:0}
.sp-p2{position:absolute;width:6px;height:6px;border-radius:50%;background:#00E5FF;animation:particle2 2.5s ease 1s 1 forwards;opacity:0}
.sp-p3{position:absolute;width:7px;height:7px;border-radius:50%;background:#FF7272;animation:particle3 2.5s ease 1.1s 1 forwards;opacity:0}
.sp-p4{position:absolute;width:5px;height:5px;border-radius:50%;background:#58D68D;animation:particle4 2.5s ease .9s 1 forwards;opacity:0}
.sp-icon{width:100px;height:100px;border-radius:26px;background:linear-gradient(145deg,#0D1829 0%,#07080F 100%);border:1px solid rgba(0,229,255,.15);display:flex;align-items:center;justify-content:center;margin-bottom:28px;position:relative;overflow:hidden;animation:iconDrop .65s cubic-bezier(.34,1.56,.64,1) .2s 1 both;box-shadow:rgba(0,229,255,.06) 0 0 0 1px,rgba(0,0,0,.7) 0 24px 60px,rgba(0,91,255,.12) 0 0 40px}
.sp-icon-glow{position:absolute;inset:0;background:radial-gradient(circle at 70% 30%,rgba(0,91,255,.18) 0%,transparent 60%);pointer-events:none}
.sp-liquid{transform-origin:0 62px;animation:liquidFill .9s cubic-bezier(.22,1,.36,1) .65s 1 both}
.sp-bubble1{animation:bubbleUp 1.3s ease 1.1s infinite}
.sp-bubble2{animation:bubbleUp 1.5s ease 1.45s infinite}
.sp-bubble3{animation:bubbleUp 1.7s ease 1.75s infinite}
.sp-text{display:flex;flex-direction:column;align-items:center;gap:8px;animation:textRise .55s ease .85s 1 both}
.sp-title-lotto{font-family:'Space Grotesk',sans-serif;font-size:42px;font-weight:700;color:#E8EDF5;letter-spacing:-1.5px;line-height:1}
.sp-title-lab{font-family:'JetBrains Mono',monospace;font-size:36px;font-weight:700;color:#00E5FF;letter-spacing:5px;line-height:1}
.sp-subtitle{font-family:'JetBrains Mono',monospace;font-size:13px;color:#3D4A5E;letter-spacing:1.8px;text-transform:uppercase;font-weight:600;animation:tagFade .5s ease 1.3s 1 both;opacity:0}
.sp-balls{display:flex;gap:12px;margin-top:34px;align-items:center}
.sp-ball{width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'JetBrains Mono',monospace;font-weight:700;font-size:15px;opacity:0}
.sp-ball:nth-child(1){background:#FBC400;color:#1a1200;box-shadow:rgba(251,196,0,.4) 0 4px 20px;animation:ballPop .5s cubic-bezier(.34,1.56,.64,1) 1.35s 1 both}
.sp-ball:nth-child(2){background:#69C8F2;color:#012840;box-shadow:rgba(105,200,242,.4) 0 4px 20px;animation:ballPop .5s cubic-bezier(.34,1.56,.64,1) 1.5s 1 both}
.sp-ball:nth-child(3){background:#FF7272;color:#fff;box-shadow:rgba(255,114,114,.4) 0 4px 20px;animation:ballPop .5s cubic-bezier(.34,1.56,.64,1) 1.65s 1 both}
.sp-ball:nth-child(4){background:#AAB8CC;color:#1a2030;box-shadow:rgba(170,184,204,.3) 0 4px 20px;animation:ballPop .5s cubic-bezier(.34,1.56,.64,1) 1.8s 1 both}
.sp-ball:nth-child(5){background:#58D68D;color:#01301d;box-shadow:rgba(88,214,141,.4) 0 4px 20px;animation:ballPop .5s cubic-bezier(.34,1.56,.64,1) 1.95s 1 both}
.sp-progress{position:absolute;bottom:0;left:0;right:0;height:2px;background:rgba(255,255,255,.04)}
.sp-progress-fill{height:100%;background:linear-gradient(90deg,#005BFF,#00E5FF);animation:splashProgressBar 3s linear .2s 1 both;width:0}
`

const splashHTML = `
<div id="lotto-splash">
  <div class="sp-glow1"></div>
  <div class="sp-glow2"></div>
  <div class="sp-scan"></div>
  <div class="sp-p1"></div><div class="sp-p2"></div><div class="sp-p3"></div><div class="sp-p4"></div>
  <div style="position:relative;display:flex;flex-direction:column;align-items:center">
    <div class="sp-icon">
      <div class="sp-icon-glow"></div>
      <svg width="56" height="60" viewBox="0 0 56 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="spLiquid" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#00E5FF" stop-opacity=".7"/><stop offset="100%" stop-color="#005BFF" stop-opacity="1"/></linearGradient>
          <linearGradient id="spNeck" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="rgba(255,255,255,.08)"/><stop offset="100%" stop-color="rgba(255,255,255,.18)"/></linearGradient>
          <clipPath id="spFlask"><path d="M17 22 L6 42 Q2 52 10 57 Q14 60 28 60 Q42 60 46 57 Q54 52 50 42 L39 22 Z"/></clipPath>
        </defs>
        <rect x="13" y="21" width="30" height="3" rx="1.5" fill="rgba(0,229,255,.25)"/>
        <rect x="19" y="2" width="18" height="21" rx="4" fill="url(#spNeck)" stroke="rgba(0,229,255,.3)" stroke-width="1.2"/>
        <rect x="22" y="5" width="6" height="14" rx="3" fill="rgba(255,255,255,.12)"/>
        <path d="M17 22 L6 42 Q2 52 10 57 Q14 60 28 60 Q42 60 46 57 Q54 52 50 42 L39 22 Z" fill="rgba(13,24,41,.95)" stroke="rgba(0,229,255,.22)" stroke-width="1.2"/>
        <g clip-path="url(#spFlask)">
          <rect x="0" y="38" width="56" height="24" fill="url(#spLiquid)" class="sp-liquid"/>
          <ellipse cx="28" cy="38" rx="22" ry="3" fill="rgba(0,229,255,.25)" class="sp-liquid"/>
        </g>
        <circle cx="19" cy="50" r="3" fill="rgba(255,255,255,.4)" class="sp-bubble1"/>
        <circle cx="33" cy="46" r="2" fill="rgba(255,255,255,.3)" class="sp-bubble2"/>
        <circle cx="26" cy="53" r="1.5" fill="rgba(255,255,255,.25)" class="sp-bubble3"/>
        <path d="M10 40 Q7 50 11 56" stroke="rgba(255,255,255,.08)" stroke-width="3" stroke-linecap="round"/>
      </svg>
    </div>
    <div class="sp-text">
      <div style="display:flex;align-items:baseline;gap:10px">
        <span class="sp-title-lotto">Lotto</span>
        <span class="sp-title-lab">LAB</span>
      </div>
      <p class="sp-subtitle">확률은 같지만, 패턴은 볼 수 있다</p>
    </div>
    <div class="sp-balls">
      <div class="sp-ball">7</div>
      <div class="sp-ball">15</div>
      <div class="sp-ball">27</div>
      <div class="sp-ball">34</div>
      <div class="sp-ball">41</div>
    </div>
  </div>
  <div class="sp-progress"><div class="sp-progress-fill"></div></div>
</div>
`

const splashScript = `
(function(){
  var KEY='lotto-lab:splash-shown';
  var el=document.getElementById('lotto-splash');
  if(!el)return;
  if(sessionStorage.getItem(KEY)){el.remove();return;}
  sessionStorage.setItem(KEY,'1');
  setTimeout(function(){if(el&&el.parentNode)el.remove();},3400);
})();
`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <style dangerouslySetInnerHTML={{ __html: splashCSS }} />
      </head>
      <body className="bg-base text-primary font-lotto-sans antialiased">
        <div dangerouslySetInnerHTML={{ __html: splashHTML }} />
        <script dangerouslySetInnerHTML={{ __html: splashScript }} />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
