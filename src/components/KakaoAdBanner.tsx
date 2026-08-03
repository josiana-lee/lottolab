'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'

const MOBILE_AD = { unit: 'DAN-sO45D6IuxIN6648R', width: 320, height: 50 }
const DESKTOP_AD = { unit: 'DAN-Du5tOm05w5z6gjE5', width: 728, height: 90 }
const DESKTOP_BREAKPOINT = '(min-width: 640px)'

export function KakaoAdBanner() {
  const [ad, setAd] = useState<typeof MOBILE_AD | null>(null)

  useEffect(() => {
    setAd(window.matchMedia(DESKTOP_BREAKPOINT).matches ? DESKTOP_AD : MOBILE_AD)
  }, [])

  if (!ad) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex justify-center border-t border-white/[0.06] bg-base/95 backdrop-blur">
      <ins
        className="kakao_ad_area"
        style={{ display: 'none' }}
        data-ad-unit={ad.unit}
        data-ad-width={String(ad.width)}
        data-ad-height={String(ad.height)}
      />
      <Script src="//t1.kakaocdn.net/kas/static/ba.min.js" strategy="afterInteractive" async />
    </div>
  )
}
