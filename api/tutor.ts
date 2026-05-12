import type { VercelRequest, VercelResponse } from '@vercel/node'
import { checkRateLimit } from './_ratelimit'

const LANG_NAMES: Record<string, string> = {
  es: 'Spanish', fr: 'French', ja: 'Japanese', it: 'Italian', pt: 'Portuguese',
}

const MODULE_TITLES: Record<string, string> = {
  animals: 'Animals & Nature', school: 'School & Learning', family: 'Family & Home',
  sports: 'Sports & Games', food: 'Food & Eating', travel: 'Travel & Places',
  arts: 'Arts & Music', science: 'Science & Discovery', body: 'Body & Feelings',
  weather: 'Weather', colors: 'Colors & Shapes', numbers: 'Numbers & Math',
  clothing: 'Clothing', house: 'House & Home', emotions: 'Emotions',
  transportation: 'Transportation', jobs: 'Jobs & Careers', nature: 'Nature',
  seasons: 'Seasons', time: 'Time & Calendar', restaurant: 'Restaurant & Ordering',
  shopping: 'Shopping', community: 'Community Helpers', opposites: 'Opposites',
  general: 'General',
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  if (await checkRateLimit(req, res)) return

  const { moduleId = 'general', messages = [], language = 'es' } = req.body ?? {}
  const baseId = String(moduleId).replace(/-(fr|ja|it|pt)$/, '')
  const title = MODULE_TITLES[baseId] ?? 'General'
  const langName = LANG_NAMES[language] ?? 'Spanish'

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'AI not configured' })

  const system = `You are Lingo, a friendly and encouraging ${langName} tutor for kids ages 7-14. Keep every response to 2-3 sentences maximum. Use simple, fun vocabulary — no complex grammar terms. React warmly to correct answers and effort. Today's topic is: ${title}. Always respond in English unless you are teaching or practicing a specific ${langName} word or phrase. If the child uses a ${langName} word correctly, briefly celebrate it before moving on.`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: 'claude-haiku-4-5',
        max_tokens: 500,
        system,
        messages: messages.slice(-10),
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('Anthropic error:', err)
      return res.status(500).json({ error: 'AI request failed' })
    }

    const data = await response.json()
    const message = data.content?.[0]?.text ?? "I didn't catch that. Try again!"
    return res.status(200).json({ message })
  } catch (err) {
    console.error('Tutor error:', err)
    return res.status(500).json({ error: 'Server error' })
  }
}
