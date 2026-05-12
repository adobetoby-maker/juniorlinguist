import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { moduleId = 'general', level = 1, avoid = [] } = req.body ?? {}

  const key = process.env.ANTHROPIC_API_KEY
  if (!key) return res.status(500).json({ error: 'AI not configured' })

  const tokenCounts: Record<number, string> = { 1: '4-6', 2: '6-9', 3: '9-13' }
  const tc = tokenCounts[level] ?? '4-6'

  const tool = {
    name: 'sentence_question',
    input_schema: {
      type: 'object',
      properties: {
        sentence: { type: 'string', description: `A complete, correct Spanish sentence (${tc} words). Age-appropriate.` },
        translation: { type: 'string', description: 'English translation.' },
        tokens: { type: 'array', items: { type: 'string' }, description: 'Each word/punctuation as a separate token, in SHUFFLED order.' },
      },
      required: ['sentence', 'translation', 'tokens'],
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
        system: `Generate sentence-building exercises for children ages 7-14 learning Spanish. Topic: ${moduleId}. Tokens must be SHUFFLED — never in the correct order. Keep vocabulary simple.${avoidList ? ` Don't repeat: ${avoidList}.` : ''}`,
        tools: [tool],
        tool_choice: { type: 'tool', name: 'sentence_question' },
        messages: [{ role: 'user', content: `Generate a level ${level} sentence building question.` }],
      }),
    })
    const d = await r.json()
    const toolUse = d.content?.find((b: { type: string }) => b.type === 'tool_use')
    if (!toolUse) return res.status(500).json({ error: 'No question returned' })
    return res.status(200).json(toolUse.input)
  } catch (err) {
    console.error('sentence-build error:', err)
    return res.status(500).json({ error: 'Server error' })
  }
}
