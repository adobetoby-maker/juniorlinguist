import type { VercelRequest, VercelResponse } from '@vercel/node'
import { parentMarketingStatus } from '../server/parent-marketing.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store')
  res.setHeader('X-Robots-Tag', 'noindex')
  if (req.method === 'GET' && req.query?.status === 'marketing') {
    try { return res.status(200).json(await parentMarketingStatus(process.env.VERCEL_DEPLOYMENT_ID)) }
    catch { return res.status(503).json({ error: 'Parent lesson signup is temporarily unavailable.' }) }
  }
  // Retire the old unprotected sender. The current form submits only to the
  // shared weekly intake, which verifies Turnstile, consent and durable retries.
  if (req.method === 'POST') return res.status(410).json({
    ok: false,
    error: 'This email form has changed. Refresh Junior Linguist and use the family study guide signup.',
  })
  res.setHeader('Allow', 'GET')
  return res.status(405).json({ error: 'Method not allowed' })
}
