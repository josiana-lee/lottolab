'use client'

import { useEffect, useState } from 'react'

const SPLASH_KEY = 'lotto-lab:splash-shown'

// #lotto-splash 내부 마크업 (정적 SVG/텍스트) — CSS 애니메이션은 layout.tsx의 splashCSS가 담당
const splashInnerHTML = `
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
`

/**
 * 스플래시 오버레이.
 *
 * 표시/제거를 React state로 관리한다 (과거에는 원시 DOM API로 el.remove()를 호출했는데,
 * 이 경우 부모(RootLayout)가 어떤 이유로든 재렌더링되면 — 예: router.refresh() —
 * React가 dangerouslySetInnerHTML을 다시 적용하면서 이미 제거된 노드가 새 CSS 애니메이션과
 * 함께 되살아나는 문제가 있었다. 이 컴포넌트는 'use client' 경계이므로 부모가 서버에서
 * 다시 렌더링되어도 이 컴포넌트의 React state(hidden)는 그대로 유지된다).
 */
export function SplashScreen() {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    if (window.localStorage.getItem(SPLASH_KEY)) {
      setHidden(true)
      return
    }
    window.localStorage.setItem(SPLASH_KEY, '1')
    const timer = window.setTimeout(() => setHidden(true), 4200)
    return () => window.clearTimeout(timer)
  }, [])

  if (hidden) return null

  return <div id="lotto-splash" dangerouslySetInnerHTML={{ __html: splashInnerHTML }} />
}
