// formatUptime renders a server uptime.
//
// 0 seconds means "just started", not "no data": the old `!seconds` check
// collapsed both into "00:00:00". A timestamp that cannot be parsed used to
// produce NaN, which compares false against every threshold and ended up as
// "< 1m" — a wrong uptime instead of an explicit unknown.
export const formatUptime = (seconds: number | string | null | undefined): string => {
  if (seconds === null || seconds === undefined || seconds === '') return '—'

  let totalSeconds: number
  if (typeof seconds === 'string') {
    const startedAt = new Date(seconds).getTime()
    if (Number.isNaN(startedAt)) return 'Unknown'
    totalSeconds = Math.floor((Date.now() - startedAt) / 1000)
  } else {
    totalSeconds = seconds
  }

  if (!Number.isFinite(totalSeconds)) return 'Unknown'
  if (totalSeconds < 0) return 'Starting...'

  if (totalSeconds < 60) return `${totalSeconds}s`
  if (totalSeconds < 3600) return `${Math.floor(totalSeconds / 60)}m`

  const days = Math.floor(totalSeconds / (24 * 3600))
  const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)

  const parts = []
  if (days > 0) parts.push(`${days}d`)
  if (hours > 0) parts.push(`${hours}h`)
  if (minutes > 0) parts.push(`${minutes}m`)

  return parts.join(' ') || '< 1m'
}
