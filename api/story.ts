import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { moduleId = 'general', vocabWords = [] } = req.body ?? {}

  const key = process.env.ANTHROPIC_API_KEY
  if (!key) return res.status(500).json({ error: 'AI not configured' })

  const vocabHint = (vocabWords as string[]).length > 0
    ? `Try to use some of these vocabulary words naturally: ${(vocabWords as string[]).slice(0, 8).join(', ')}.`
    : ''

  const tool = {
    name: 'kids_story',
    input_schema: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'A short, fun story title in Spanish.' },
        titleEn: { type: 'string', description: 'English translation of the title.' },
        sentences: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              es: { type: 'string' },
              en: { type: 'string' },
            },
            required: ['es', 'en'],
          },
          description: '6-8 sentence pairs. Each sentence: simple A1-A2 Spanish + English translation. Age-appropriate theme.',
        },
        question: { type: 'string', description: 'One simple comprehension question in English about the story.' },
        answerHint: { type: 'string', description: 'The key word or phrase that answers the question.' },
      },
      required: ['title', 'titleEn', 'sentences', 'question', 'answerHint'],
    },
  }

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: 'claude-haiku-4-5',
        max_tokens: 800,
        system: `You write delightful, age-appropriate short stories for children ages 7-14 learning Spanish. Topic: ${moduleId}. Use simple A1-A2 vocabulary. Stories should be fun, positive, and educational. ${vocabHint}`,
        tools: [tool],
        tool_choice: { type: 'tool', name: 'kids_story' },
        messages: [{ role: 'user', content: 'Generate a short bilingual story for today.' }],
      }),
    })
    const d = await r.json()
    const toolUse = d.content?.find((b: { type: string }) => b.type === 'tool_use')
    if (!toolUse) return res.status(500).json({ error: 'No story returned' })
    return res.status(200).json(toolUse.input)
  } catch (err) {
    console.error('story error:', err)
    return res.status(500).json({ error: 'Server error' })
  }
}
