export function hasDatabaseConfig(): boolean {
  const url = process.env.DATABASE_URL
  return Boolean(url && url.startsWith('postgresql://') && !url.includes('[YOUR-'))
}

/**
 * CRON_SECRET이 설정된 경우에만 Authorization 헤더를 검사한다.
 * Vercel Cron은 이 값을 `Bearer ${CRON_SECRET}` 형태로 자동 전송한다.
 * 시크릿이 없으면(로컬 개발 등) 기존처럼 통과시킨다.
 */
export function isCronAuthorized(authorizationHeader: string | null): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) return true
  return authorizationHeader === `Bearer ${secret}`
}
