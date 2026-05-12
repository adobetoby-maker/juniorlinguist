import type { VercelRequest, VercelResponse } from '@vercel/node'

let limiter: import('@upstash/ratelimit').Ratelimit | null = null

async function getLimiter() {
  if (limiter) return limiter
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  const { Ratelimit } = await import('@upstash/ratelimit')
  const { Redis } = await import('@upstash/redis')
  limiter = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(60, '1 h'),
    analytics: false,
  })
  return limiter
}

export async function checkRateLimit(req: VercelRequest, res: VercelResponse): Promise<boolean> {
  const rl = await getLimiter()
  if (!rl) return false // env vars absent — allow all requests

  const ip =
    (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim() ?? '127.0.0.1'

  const { success } = await rl.limit(ip)
  if (!success) {
    res.status(429).json({ error: 'rateLimit', message: 'Take a quick break! 🌟' })
    return true
  }
  return false
}
