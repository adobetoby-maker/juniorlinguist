import type { VercelRequest, VercelResponse } from '@vercel/node'

const KNOWN_MODULE_IDS = new Set([
  'animals', 'school', 'family', 'sports', 'food', 'travel', 'arts', 'science', 'body', 'general',
])

const FRIENDS: Record<string, { name: string; city: string; country: string; age: number; about: string }> = {
  animals:  { name: 'Sofía',     city: 'Oaxaca',         country: 'México',     age: 10, about: 'loves birds, butterflies, and her dog Canela' },
  school:   { name: 'Mateo',     city: 'Madrid',         country: 'España',     age: 11, about: 'loves math, comics, and his school science club' },
  family:   { name: 'Isabella',  city: 'Bogotá',         country: 'Colombia',   age:  9, about: 'cooks with her abuela every weekend' },
  sports:   { name: 'Lucas',     city: 'Buenos Aires',   country: 'Argentina',  age: 12, about: 'plays on the neighborhood fútbol team' },
  food:     { name: 'Valentina', city: 'Lima',           country: 'Perú',       age: 10, about: 'helps at her family restaurant every morning' },
  travel:   { name: 'Diego',     city: 'Ciudad de México', country: 'México',   age: 11, about: 'visits a new city every summer' },
  arts:     { name: 'Camila',    city: 'Sevilla',        country: 'España',     age: 10, about: 'paints every afternoon' },
  science:  { name: 'Andrés',    city: 'Santiago',       country: 'Chile',      age: 12, about: 'studies constellations from his roof with a telescope' },
  body:     { name: 'Mariana',   city: 'Guadalajara',    country: 'México',     age:  9, about: 'loves yoga and writes in her feelings journal' },
  general:  { name: 'Carlos',    city: 'San José',       country: 'Costa Rica', age: 10, about: 'is curious about everything' },
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { moduleId = 'general', userLetter = '', letterCount = 0 } = req.body ?? {}
  const safeModuleId = KNOWN_MODULE_IDS.has(moduleId) ? moduleId : 'general'

  const key = process.env.ANTHROPIC_API_KEY
  if (!key) return res.status(500).json({ error: 'AI not configured' })

  const friend = FRIENDS[safeModuleId] ?? FRIENDS.general
  const isFirstLetter = letterCount === 0

  const tool = {
    name: 'penpal_reply',
    description: 'Write a warm, short letter reply from a Spanish-speaking kid pen pal.',
    input_schema: {
      type: 'object',
      properties: {
        sentences: {
          type: 'array',
          description: '4-6 bilingual sentence pairs forming the letter body. Simple A1-A2 Spanish.',
          items: {
            type: 'object',
            properties: {
              es: { type: 'string', description: 'One sentence of the letter in Spanish.' },
              en: { type: 'string', description: 'English translation of that sentence.' },
            },
            required: ['es', 'en'],
          },
        },
        question: { type: 'string', description: 'One friendly question in Spanish for the child to answer next time.' },
        questionEn: { type: 'string', description: 'English translation of the question.' },
      },
      required: ['sentences', 'question', 'questionEn'],
    },
  }

  const intro = isFirstLetter
    ? `This is the first letter between them. Introduce yourself warmly.`
    : `The child wrote: "${String(userLetter).slice(0, 300)}". Reply naturally to what they said.`

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: 'claude-haiku-4-5',
        max_tokens: 600,
        system: [
          `You are ${friend.name}, a friendly ${friend.age}-year-old kid from ${friend.city}, ${friend.country} who ${friend.about}.`,
          `You are writing a pen pal letter to a child ages 7-14 in the United States who is learning Spanish.`,
          `Write in very simple A1-A2 Spanish — short sentences, common vocabulary, no slang.`,
          `Be warm, curious, and encouraging. Reference the topic naturally.`,
          `The topic connection: ${safeModuleId}.`,
          intro,
          `Do NOT use overly formal language. Write like a real kid would.`,
        ].join(' '),
        tools: [tool],
        tool_choice: { type: 'tool', name: 'penpal_reply' },
        messages: [{ role: 'user', content: 'Write the pen pal reply letter.' }],
      }),
    })
    const d = await r.json()
    const toolUse = d.content?.find((b: { type: string }) => b.type === 'tool_use')
    if (!toolUse) return res.status(500).json({ error: 'No reply generated' })
    return res.status(200).json({ ...toolUse.input, friend })
  } catch (err) {
    console.error('penpal error:', err)
    return res.status(500).json({ error: 'Server error' })
  }
}
