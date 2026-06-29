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
#lotto-splash{position:fixed;inset:0;background:#07080F;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:9999;animation:splashFadeOut 4s ease forwards}
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

const splashHTML = `
<div id="lotto-splash">
  <div class="sp-glow"></div>
  <div class="sp-scan"></div>
  <div style="position:relative;display:flex;flex-direction:column;align-items:center">
    <div class="sp-flask">
      <svg width="120" height="170" viewBox="0 0 100 155" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id="spFlask2">
            <path d="M37,0 L37,42 L7,82 L7,147 Q7,154 14,154 L86,154 Q93,154 93,147 L93,82 L63,42 L63,0 Z"/>
          </clipPath>
        </defs>
        <path d="M35,0 L35,42 L5,82 L5,147 Q5,155 13,155 L87,155 Q95,155 95,147 L95,82 L65,42 L65,0 Z" fill="#08111F"/>
        <g clip-path="url(#spFlask2)">
          <g opacity="0">
            <animate attributeName="opacity" from="0" to="1" dur="0.05s" begin="0.7s" fill="freeze"/>
            <animateTransform attributeName="transform" type="translate" values="50,-25; 50,88; 20,143; 20,135" keyTimes="0;0.56;0.78;1" dur="0.58s" begin="0.7s" fill="freeze" calcMode="spline" keySplines="0.42,0,0.58,1;0.3,0,0.5,1;0,0,0.5,1"/>
            <circle cx="0" cy="0" r="11" fill="#FBC400"/>
            <text x="0" y="1" text-anchor="middle" dominant-baseline="middle" font-size="10" font-weight="700" fill="#1a1200" font-family="monospace">7</text>
          </g>
          <g opacity="0">
            <animate attributeName="opacity" from="0" to="1" dur="0.05s" begin="0.92s" fill="freeze"/>
            <animateTransform attributeName="transform" type="translate" values="50,-25; 50,88; 80,143; 80,135" keyTimes="0;0.56;0.78;1" dur="0.58s" begin="0.92s" fill="freeze" calcMode="spline" keySplines="0.42,0,0.58,1;0.3,0,0.5,1;0,0,0.5,1"/>
            <circle cx="0" cy="0" r="11" fill="#69C8F2"/>
            <text x="0" y="1" text-anchor="middle" dominant-baseline="middle" font-size="9" font-weight="700" fill="#012840" font-family="monospace">15</text>
          </g>
          <g opacity="0">
            <animate attributeName="opacity" from="0" to="1" dur="0.05s" begin="1.14s" fill="freeze"/>
            <animateTransform attributeName="transform" type="translate" values="50,-25; 50,143; 50,127; 50,135" keyTimes="0;0.66;0.83;1" dur="0.58s" begin="1.14s" fill="freeze" calcMode="spline" keySplines="0.42,0,1,1;0,0,0.5,1;0.4,0,0.6,1"/>
            <circle cx="0" cy="0" r="11" fill="#FF7272"/>
            <text x="0" y="1" text-anchor="middle" dominant-baseline="middle" font-size="9" font-weight="700" fill="#fff" font-family="monospace">23</text>
          </g>
          <g opacity="0">
            <animate attributeName="opacity" from="0" to="1" dur="0.05s" begin="1.36s" fill="freeze"/>
            <animateTransform attributeName="transform" type="translate" values="50,-25; 50,88; 35,122; 35,114" keyTimes="0;0.56;0.78;1" dur="0.58s" begin="1.36s" fill="freeze" calcMode="spline" keySplines="0.42,0,0.58,1;0.3,0,0.5,1;0,0,0.5,1"/>
            <circle cx="0" cy="0" r="11" fill="#AAB8CC"/>
            <text x="0" y="1" text-anchor="middle" dominant-baseline="middle" font-size="9" font-weight="700" fill="#1a2030" font-family="monospace">34</text>
          </g>
          <g opacity="0">
            <animate attributeName="opacity" from="0" to="1" dur="0.05s" begin="1.58s" fill="freeze"/>
            <animateTransform attributeName="transform" type="translate" values="50,-25; 50,88; 65,122; 65,114" keyTimes="0;0.56;0.78;1" dur="0.58s" begin="1.58s" fill="freeze" calcMode="spline" keySplines="0.42,0,0.58,1;0.3,0,0.5,1;0,0,0.5,1"/>
            <circle cx="0" cy="0" r="11" fill="#58D68D"/>
            <text x="0" y="1" text-anchor="middle" dominant-baseline="middle" font-size="9" font-weight="700" fill="#01301d" font-family="monospace">41</text>
          </g>
          <g opacity="0">
            <animate attributeName="opacity" from="0" to="1" dur="0.05s" begin="1.80s" fill="freeze"/>
            <animateTransform attributeName="transform" type="translate" values="50,-25; 50,101; 50,85; 50,93" keyTimes="0;0.66;0.83;1" dur="0.58s" begin="1.80s" fill="freeze" calcMode="spline" keySplines="0.42,0,1,1;0,0,0.5,1;0.4,0,0.6,1"/>
            <circle cx="0" cy="0" r="11" fill="#FBC400"/>
            <text x="0" y="1" text-anchor="middle" dominant-baseline="middle" font-size="10" font-weight="700" fill="#1a1200" font-family="monospace">9</text>
          </g>
          <rect x="0" y="80" width="100" height="80" fill="#005BFF" opacity="0">
            <animate attributeName="opacity" values="0;0;0.13" keyTimes="0;0.92;1" dur="2.5s" begin="0.7s" fill="freeze"/>
          </rect>
        </g>
        <path d="M35,0 L35,42 L5,82 L5,147 Q5,155 13,155 L87,155 Q95,155 95,147 L95,82 L65,42 L65,0 Z" fill="none" stroke="rgba(0,229,255,0.5)" stroke-width="2.2" stroke-linejoin="miter"/>
        <rect x="29" y="0" width="42" height="5" rx="2.5" fill="#08111F" stroke="rgba(0,229,255,0.38)" stroke-width="1.5"/>
        <line x1="35" y1="42" x2="65" y2="42" stroke="rgba(0,229,255,0.12)" stroke-width="1"/>
        <rect x="39" y="6" width="7" height="33" rx="3.5" fill="rgba(255,255,255,0.05)"/>
      </svg>
    </div>
    <div class="sp-text">
      <div style="display:flex;align-items:baseline;gap:10px">
        <span class="sp-title-lotto">Lotto</span>
        <span class="sp-title-lab">LAB</span>
      </div>
      <p class="sp-subtitle">확률은 같지만, 패턴은 볼 수 있다</p>
    </div>
  </div>
  <div class="sp-progress"><div class="sp-progress-fill"></div></div>
</div>
`

const splashHeadScript = `(function(){if(sessionStorage.getItem('lotto-lab:splash-shown')){var s=document.createElement('style');s.textContent='#lotto-splash{display:none!important}';document.head.appendChild(s);}})();`

const splashScript = `
(function(){
  var KEY='lotto-lab:splash-shown';
  var el=document.getElementById('lotto-splash');
  if(!el)return;
  if(sessionStorage.getItem(KEY)){el.remove();return;}
  sessionStorage.setItem(KEY,'1');
  setTimeout(function(){if(el&&el.parentNode)el.remove();},4200);
})();
`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <script dangerouslySetInnerHTML={{ __html: splashHeadScript }} />
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
