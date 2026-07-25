/**
 * 格式化缓存过期时间
 * @param ttl 过期时间（秒），-1 表示永不过期
 * @returns 格式化后的字符串
 */
export function formatTtl(ttl: number): string {
  if (ttl === -1) return '永不过期'
  if (ttl <= 0) return '已过期'

  const days = Math.floor(ttl / 86400)
  const hours = Math.floor((ttl % 86400) / 3600)
  const minutes = Math.floor((ttl % 3600) / 60)
  const seconds = ttl % 60

  const parts: string[] = []
  if (days > 0) parts.push(`${days}天`)
  if (hours > 0) parts.push(`${hours}小时`)
  if (minutes > 0) parts.push(`${minutes}分钟`)
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds}秒`)

  return parts.join('')
}
