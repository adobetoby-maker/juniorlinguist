import type { VercelRequest, VercelResponse } from '@vercel/node'

const KNOWN_MODULE_IDS = new Set([
  'animals', 'school', 'family', 'sports', 'food', 'travel', 'arts', 'science', 'body', 'general',
])

const MODULE_TITLES: Record<string, string> = {
  animals: 'Animals & Nature',
  school: 'School & Learning',
  family: 'Family & Home',
  sports: 'Sports & Games',
  food: 'Food & Eating',
  travel: 'Travel & Places',
  arts: 'Arts & Music',
  science: 'Science & Discovery',
  body: 'Body & Feelings',
  general: 'Spanish',
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { moduleId = 'general', messages = [] } = req.body ?? {}

  if (!KNOWN_MODULE_IDS.has(moduleId)) {
    return res.status(400).json({ error: 'Unknown module' })
  }

  const title = MODULE_TITLES[moduleId] ?? 'Spanish'
  const system = `You are Lingo, a friendly and encouraging Spanish tutor for kids ages 7-14. Keep every response to 2-3 sentences maximum. Use simple, fun vocabulary — no complex grammar terms. React warmly to correct answers and effort. Today's topic is: ${title}. Always respond in English unless you are teaching or practicing a specific Spanish word or phrase. If the child uses a Spanish word correctly, briefly celebrate it before moving on.`

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'AI not configured' })

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
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
