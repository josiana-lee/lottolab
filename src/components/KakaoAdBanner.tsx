'use client'

import Script from 'next/script'

export function KakaoAdBanner() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex justify-center border-t border-white/[0.06] bg-base/95 backdrop-blur sm:hidden">
      <ins
        className="kakao_ad_area"
        style={{ display: 'none' }}
        data-ad-unit="DAN-sO45D6IuxIN6648R"
        data-ad-width="320"
        data-ad-height="50"
      />
      <Script src="//t1.kakaocdn.net/kas/static/ba.min.js" strategy="afterInteractive" async />
    </div>
  )
}
