import type { VercelRequest, VercelResponse } from '@vercel/node'

const MODULE_TITLES: Record<string, string> = {
  animals: 'Animals & Nature', school: 'School & Learning', family: 'Family & Home',
  sports: 'Sports & Games', food: 'Food & Eating', travel: 'Travel & Places',
  arts: 'Arts & Music', science: 'Science & Discovery', body: 'Body & Feelings', general: 'Spanish',
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { mode = 'chat', messages = [], userText, moduleId = 'general' } = req.body ?? {}

  const key = process.env.ANTHROPIC_API_KEY
  if (!key) return res.status(500).json({ error: 'AI not configured' })

  const title = MODULE_TITLES[moduleId] ?? 'Spanish'

  if (mode === 'tip' && userText) {
    // Return a gentle grammar tip for what the child said
    const tipTool = {
      name: 'grammar_tip',
      description: 'Return a short, encouraging grammar tip for a kids Spanish learner.',
      input_schema: {
        type: 'object',
        properties: {
          tip: { type: 'string', description: 'One sentence tip in English. If perfect, return null.' },
          correct: { type: 'boolean' },
        },
        required: ['correct'],
      },
    }
    try {
      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({
          model: 'claude-haiku-4-5',
          max_tokens: 200,
          system: 'You are a friendly Spanish teacher for kids ages 7-14. Give very short, encouraging grammar tips. Never be negative. If the Spanish is perfect, say so.',
          tools: [tipTool],
          tool_choice: { type: 'tool', name: 'grammar_tip' },
          messages: [{ role: 'user', content: `What the child said in Spanish: "${userText}"` }],
        }),
      })
      const d = await r.json()
      const toolUse = d.content?.find((b: { type: string }) => b.type === 'tool_use')
      return res.status(200).json({ tip: toolUse?.input?.tip ?? null, correct: toolUse?.input?.correct ?? true })
    } catch { return res.status(200).json({ tip: null, correct: true }) }
  }

  // chat mode
  const system = [
    `You are Lingo, a warm and encouraging Spanish conversation partner for kids ages 7-14.`,
    `Today's topic: ${title}.`,
    `Keep every response to 2-3 short sentences. Use simple A1-A2 level Spanish.`,
    `Respond ONLY in Spanish (the child is practicing). If they speak English to you, gently reply in Spanish and encourage them.`,
    `Be enthusiastic! Use exclamation marks. React warmly to every attempt.`,
    `Never discuss adult topics, violence, or anything inappropriate for children.`,
  ].join(' ')

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: 'claude-haiku-4-5',
        max_tokens: 300,
        system,
        messages: messages.slice(-10),
      }),
    })
    const d = await r.json()
    const message = d.content?.[0]?.text ?? '¡Hola! ¿Cómo estás?'
    return res.status(200).json({ message })
  } catch (err) {
    console.error('speak error:', err)
    return res.status(500).json({ error: 'Server error' })
  }
}
