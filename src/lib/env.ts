export function hasDatabaseConfig(): boolean {
  const url = process.env.DATABASE_URL
  return Boolean(url && url.startsWith('postgresql://') && !url.includes('[YOUR-'))
}
