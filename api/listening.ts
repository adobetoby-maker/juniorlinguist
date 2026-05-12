import type { VercelRequest, VercelResponse } from '@vercel/node'
import { checkRateLimit } from './_ratelimit'

const LANG_NAMES: Record<string, string> = {
  es: 'Spanish', fr: 'French', ja: 'Japanese', it: 'Italian', pt: 'Portuguese',
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  if (await checkRateLimit(req, res)) return

  const { moduleId = 'general', level = 1, avoid = [], language = 'es' } = req.body ?? {}
  const langName = LANG_NAMES[language] ?? 'Spanish'
  const baseId = String(moduleId).replace(/-(fr|ja|it|pt)$/, '')

  const key = process.env.ANTHROPIC_API_KEY
  if (!key) return res.status(500).json({ error: 'AI not configured' })

  const wordCounts: Record<number, string> = { 1: '4-7', 2: '7-12', 3: '12-18' }
  const wordCount = wordCounts[level] ?? '4-7'

  const tool = {
    name: 'listening_question',
    description: `Generate a listening drill question for kids learning ${langName}.`,
    input_schema: {
      type: 'object',
      properties: {
        phrase: { type: 'string', description: `A natural ${langName} phrase, ${wordCount} words. Age-appropriate for a child.` },
        translation: { type: 'string', description: 'English translation of the phrase.' },
        options: {
          type: 'array',
          items: { type: 'string' },
          description: `4 options: the correct ${langName} phrase + 3 plausible distractors. Mix up word order or swap similar words.`,
        },
        listenFor: { type: 'string', description: 'One short tip about what to listen for (e.g. "Listen for the verb ending").' },
      },
      required: ['phrase', 'translation', 'options', 'listenFor'],
    },
  }

  try {
    const avoidList = (avoid as string[]).slice(0, 10).join(', ')
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: 'claude-haiku-4-5',
        max_tokens: 400,
        system: `Generate listening drill content for children ages 7-14 learning ${langName}. Topic: ${baseId}. Keep vocabulary simple and age-appropriate.${avoidList ? ` Avoid repeating: ${avoidList}.` : ''}`,
        tools: [tool],
        tool_choice: { type: 'tool', name: 'listening_question' },
        messages: [{ role: 'user', content: `Generate a level ${level} listening drill question.` }],
      }),
    })
    const d = await r.json()
    const toolUse = d.content?.find((b: { type: string }) => b.type === 'tool_use')
    if (!toolUse) return res.status(500).json({ error: 'No question returned' })
    return res.status(200).json(toolUse.input)
  } catch (err) {
    console.error('listening error:', err)
    return res.status(500).json({ error: 'Server error' })
  }
}
