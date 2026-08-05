export function hasDatabaseConfig(): boolean {
  const url = process.env.DATABASE_URL
  return Boolean(url && url.startsWith('postgresql://') && !url.includes('[YOUR-'))
}

/**
 * 아래 둘 중 하나면 통과시킨다.
 * 1. CRON_SECRET 일치 — Vercel Cron/GitHub Actions 같은 서버 간 호출용.
 *    Vercel Cron은 이 값을 `Bearer ${CRON_SECRET}` 형태로 자동 전송한다.
 * 2. 브라우저의 same-origin 요청 — 사이트 내 "최신 회차 동기화" 버튼 클릭용.
 *    Sec-Fetch-Site는 브라우저가 자동으로 붙이는 헤더라 클라이언트 JS로 위조할 수 없다.
 * 시크릿이 없으면(로컬 개발 등) 기존처럼 통과시킨다.
 */
export function isSyncRequestAuthorized(headers: {
  authorization: string | null
  secFetchSite: string | null
}): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) return true
  if (headers.authorization === `Bearer ${secret}`) return true
  return headers.secFetchSite === 'same-origin'
}
