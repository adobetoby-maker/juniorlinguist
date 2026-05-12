import type { VercelRequest, VercelResponse } from '@vercel/node'
import { checkRateLimit } from './_ratelimit'

interface AnthropicMessage {
  content?: Array<{ type: string; input?: unknown }>
  error?: { type: string; message: string }
}

const LANG_NAMES: Record<string, string> = {
  es: 'Spanish', fr: 'French', ja: 'Japanese', it: 'Italian', pt: 'Portuguese',
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  if (await checkRateLimit(req, res)) return

  const { word, sentence, language = 'es' } = req.body ?? {}
  if (!word || !sentence) return res.status(400).json({ error: 'Missing word or sentence' })
  const langName = LANG_NAMES[language] ?? 'Spanish'

  const key = process.env.ANTHROPIC_API_KEY
  if (!key) return res.status(500).json({ error: 'AI not configured' })

  const tool = {
    name: 'return_word_card',
    description: `Return a simple, kid-friendly word card for the given ${langName} word.`,
    input_schema: {
      type: 'object',
      properties: {
        headword: { type: 'string', description: 'The base form of the word' },
        wordEmoji: { type: 'string', description: 'One emoji that best pictures this word — pick the most visual, kid-recognizable emoji.' },
        partOfSpeech: { type: 'string', description: 'noun, verb, adjective, adverb, etc.' },
        phonetic: { type: 'string', description: 'Simple pronunciation guide in English phonetics, e.g. "mah-REE-poh-sah"' },
        baseDefinition: { type: 'string', description: 'Simple English meaning in 8 words or less' },
        exampleSentence: { type: 'string', description: `A natural ${langName} sentence a child would say` },
        exampleTranslation: { type: 'string', description: 'English translation of the example sentence' },
      },
      required: ['headword', 'wordEmoji', 'partOfSpeech', 'phonetic', 'baseDefinition', 'exampleSentence', 'exampleTranslation'],
    },
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: 'claude-haiku-4-5',
        max_tokens: 400,
        system: `You are a friendly bilingual dictionary for ${langName} learners aged 7-14. Keep definitions short and simple.`,
        tools: [tool],
        tool_choice: { type: 'tool', name: 'return_word_card' },
        messages: [{ role: 'user', content: `${langName} word: "${word}"\nContext sentence: "${sentence}"` }],
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('Anthropic error', response.status, errText)
      return res.status(502).json({ error: 'AI service error' })
    }

    const data = await response.json() as AnthropicMessage
    if (data.error) {
      console.error('Anthropic API error', data.error)
      return res.status(502).json({ error: data.error.message })
    }
    const toolUse = data.content?.find(b => b.type === 'tool_use')
    if (!toolUse) return res.status(500).json({ error: 'No card returned' })
    return res.status(200).json({ card: toolUse.input })
  } catch (err) {
    console.error('word-lookup error:', err)
    return res.status(500).json({ error: 'Server error' })
  }
}
