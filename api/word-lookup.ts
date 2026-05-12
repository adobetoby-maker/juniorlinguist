import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { word, sentence } = req.body ?? {}
  if (!word || !sentence) return res.status(400).json({ error: 'Missing word or sentence' })

  const key = process.env.ANTHROPIC_API_KEY
  if (!key) return res.status(500).json({ error: 'AI not configured' })

  const system = `You are a friendly bilingual dictionary for Spanish learners aged 7-14. Always explain words simply, like you are talking to a smart child. Use short, clear sentences. The example sentence should be something a kid would actually say.`

  const tool = {
    name: 'return_word_card',
    description: 'Return a simple, kid-friendly word card for the given Spanish word.',
    input_schema: {
      type: 'object',
      properties: {
        headword: { type: 'string', description: 'The base form of the word' },
        partOfSpeech: { type: 'string', description: 'noun, verb, adjective, adverb, etc.' },
        phonetic: { type: 'string', description: 'Simple pronunciation guide, e.g. "mah-REE-poh-sah"' },
        baseDefinition: { type: 'string', description: 'Simple English meaning in 10 words or less' },
        exampleSentence: { type: 'string', description: 'A natural Spanish sentence a kid would say' },
        exampleTranslation: { type: 'string', description: 'English translation of the example sentence' },
      },
      required: ['headword', 'partOfSpeech', 'phonetic', 'baseDefinition', 'exampleSentence', 'exampleTranslation'],
    },
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: 'claude-haiku-4-5',
        max_tokens: 400,
        system,
        tools: [tool],
        tool_choice: { type: 'tool', name: 'return_word_card' },
        messages: [{ role: 'user', content: `Word: "${word}"\nSentence: "${sentence}"\nLanguage: Spanish` }],
      }),
    })

    const data = await response.json()
    const toolUse = data.content?.find((b: { type: string }) => b.type === 'tool_use')
    if (!toolUse) return res.status(500).json({ error: 'No card returned' })
    return res.status(200).json({ card: toolUse.input })
  } catch (err) {
    console.error('word-lookup error:', err)
    return res.status(500).json({ error: 'Server error' })
  }
}
