export const formatUptime = (seconds: number | string | null) => {
  if (!seconds) return '00:00:00'
  
  let totalSeconds: number
  if (typeof seconds === 'string') {
    const start = new Date(seconds)
    const now = new Date()
    totalSeconds = Math.floor((now.getTime() - start.getTime()) / 1000)
  } else {
    totalSeconds = seconds
  }

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
