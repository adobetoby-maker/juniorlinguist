import type { VercelRequest, VercelResponse } from '@vercel/node'
import { checkRateLimit } from './_ratelimit'

const LANG_NAMES: Record<string, string> = {
  es: 'Spanish', fr: 'French', ja: 'Japanese', it: 'Italian', pt: 'Portuguese',
}

const FRIENDS: Record<string, Record<string, { name: string; city: string; country: string; age: number; about: string }>> = {
  es: {
    animals:  { name: 'Sofía',     city: 'Oaxaca',           country: 'México',     age: 10, about: 'loves birds, butterflies, and her dog Canela' },
    school:   { name: 'Mateo',     city: 'Madrid',           country: 'España',     age: 11, about: 'loves math, comics, and his school science club' },
    family:   { name: 'Isabella',  city: 'Bogotá',           country: 'Colombia',   age:  9, about: 'cooks with her abuela every weekend' },
    sports:   { name: 'Lucas',     city: 'Buenos Aires',     country: 'Argentina',  age: 12, about: 'plays on the neighborhood fútbol team' },
    food:     { name: 'Valentina', city: 'Lima',             country: 'Perú',       age: 10, about: 'helps at her family restaurant every morning' },
    travel:   { name: 'Diego',     city: 'Ciudad de México', country: 'México',     age: 11, about: 'visits a new city every summer' },
    arts:     { name: 'Camila',    city: 'Sevilla',          country: 'España',     age: 10, about: 'paints every afternoon' },
    science:  { name: 'Andrés',    city: 'Santiago',         country: 'Chile',      age: 12, about: 'studies constellations from his roof with a telescope' },
    body:     { name: 'Mariana',   city: 'Guadalajara',      country: 'México',     age:  9, about: 'loves yoga and writes in her feelings journal' },
    general:  { name: 'Carlos',    city: 'San José',         country: 'Costa Rica', age: 10, about: 'is curious about everything' },
  },
  fr: {
    animals:  { name: 'Chloé',   city: 'Lyon',          country: 'France',   age: 10, about: 'loves animals and visits the nature reserve every weekend' },
    school:   { name: 'Hugo',    city: 'Paris',         country: 'France',   age: 11, about: 'loves reading and the school chess club' },
    family:   { name: 'Élise',   city: 'Bordeaux',      country: 'France',   age:  9, about: 'bakes with her grand-mère on Sundays' },
    sports:   { name: 'Antoine', city: 'Marseille',     country: 'France',   age: 12, about: 'plays football and loves the Tour de France' },
    food:     { name: 'Lucie',   city: 'Lyon',          country: 'France',   age: 10, about: 'learns French recipes with her dad every evening' },
    travel:   { name: 'Théo',    city: 'Nice',          country: 'France',   age: 11, about: 'travels by train every summer with his family' },
    arts:     { name: 'Manon',   city: 'Paris',         country: 'France',   age: 10, about: 'takes painting classes near the Louvre' },
    science:  { name: 'Raphaël', city: 'Toulouse',      country: 'France',   age: 12, about: 'loves astronomy and visits the space center' },
    body:     { name: 'Emma',    city: 'Strasbourg',    country: 'France',   age:  9, about: 'does dance and keeps a feelings journal' },
    general:  { name: 'Léa',     city: 'Montréal',      country: 'Canada',   age: 10, about: 'loves learning and making new friends' },
  },
  ja: {
    animals:  { name: 'Hana',   city: 'Sapporo',   country: 'Japan', age: 10, about: 'loves animals and visits Hokkaido\'s deer park' },
    school:   { name: 'Kenji',  city: 'Tokyo',     country: 'Japan', age: 11, about: 'loves manga and the school robotics club' },
    family:   { name: 'Yuki',   city: 'Kyoto',     country: 'Japan', age:  9, about: 'makes onigiri with her obaachan every weekend' },
    sports:   { name: 'Ren',    city: 'Osaka',     country: 'Japan', age: 12, about: 'plays baseball and practices kendo' },
    food:     { name: 'Momo',   city: 'Tokyo',     country: 'Japan', age: 10, about: 'loves trying new foods at the weekend market' },
    travel:   { name: 'Sota',   city: 'Nagoya',    country: 'Japan', age: 11, about: 'explores Japan by shinkansen every school holiday' },
    arts:     { name: 'Aoi',    city: 'Kyoto',     country: 'Japan', age: 10, about: 'practices calligraphy and origami every afternoon' },
    science:  { name: 'Haruto', city: 'Tsukuba',   country: 'Japan', age: 12, about: 'loves science and visits JAXA with his school' },
    body:     { name: 'Sakura', city: 'Nara',      country: 'Japan', age:  9, about: 'practices yoga and writes in her diary every night' },
    general:  { name: 'Yuna',   city: 'Tokyo',     country: 'Japan', age: 10, about: 'is curious about everything and loves making friends worldwide' },
  },
  it: {
    animals:  { name: 'Giulia',  city: 'Palermo',  country: 'Italia', age: 10, about: 'loves animals and visits the nature park near Etna' },
    school:   { name: 'Lorenzo', city: 'Bologna',  country: 'Italia', age: 11, about: 'loves science and the school robotics competition' },
    family:   { name: 'Sofia',   city: 'Napoli',   country: 'Italia', age:  9, about: 'makes pizza with her nonna every Sunday' },
    sports:   { name: 'Marco',   city: 'Torino',   country: 'Italia', age: 12, about: 'plays calcio and supports Juventus' },
    food:     { name: 'Chiara',  city: 'Firenze',  country: 'Italia', age: 10, about: 'helps at her family\'s gelateria' },
    travel:   { name: 'Luca',    city: 'Roma',     country: 'Italia', age: 11, about: 'explores ancient ruins near his home' },
    arts:     { name: 'Alice',   city: 'Venezia',  country: 'Italia', age: 10, about: 'paints and visits the Biennale with her parents' },
    science:  { name: 'Matteo',  city: 'Milano',   country: 'Italia', age: 12, about: 'loves astronomy and Leonardo da Vinci\'s inventions' },
    body:     { name: 'Emma',    city: 'Genova',   country: 'Italia', age:  9, about: 'does gymnastics and loves writing in her diary' },
    general:  { name: 'Mia',     city: 'Milano',   country: 'Italia', age: 10, about: 'loves making friends and learning new things' },
  },
  pt: {
    animals:  { name: 'Isabela', city: 'Manaus',        country: 'Brasil',   age: 10, about: 'loves animals and the Amazon forest' },
    school:   { name: 'Pedro',   city: 'São Paulo',     country: 'Brasil',   age: 11, about: 'loves soccer and the school science fair' },
    family:   { name: 'Ana',     city: 'Lisboa',        country: 'Portugal', age:  9, about: 'bakes pastéis de nata with her avó' },
    sports:   { name: 'Gabriel', city: 'Rio de Janeiro', country: 'Brasil',  age: 12, about: 'loves futebol and plays on the beach' },
    food:     { name: 'Beatriz', city: 'Salvador',      country: 'Brasil',   age: 10, about: 'helps at her family\'s acarajé stall' },
    travel:   { name: 'Miguel',  city: 'Porto',         country: 'Portugal', age: 11, about: 'travels along the Douro river with his family' },
    arts:     { name: 'Laura',   city: 'Belo Horizonte', country: 'Brasil',  age: 10, about: 'loves samba, art, and Carnaval costumes' },
    science:  { name: 'Thiago',  city: 'Campinas',      country: 'Brasil',   age: 12, about: 'loves math and wants to be an astronaut' },
    body:     { name: 'Sofia',   city: 'Recife',        country: 'Brasil',   age:  9, about: 'does capoeira and keeps a feelings journal' },
    general:  { name: 'Mateus',  city: 'Brasília',      country: 'Brasil',   age: 10, about: 'is curious about the world and loves to write letters' },
  },
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  if (await checkRateLimit(req, res)) return

  const { moduleId = 'general', userLetter = '', letterCount = 0, language = 'es' } = req.body ?? {}
  const langName = LANG_NAMES[language] ?? 'Spanish'
  const baseId = String(moduleId).replace(/-(fr|ja|it|pt)$/, '')

  const key = process.env.ANTHROPIC_API_KEY
  if (!key) return res.status(500).json({ error: 'AI not configured' })

  const langFriends = FRIENDS[language] ?? FRIENDS.es
  const friend = langFriends[baseId] ?? langFriends.general
  const isFirstLetter = letterCount === 0

  const tool = {
    name: 'penpal_reply',
    description: `Write a warm, short letter reply from a ${langName}-speaking kid pen pal.`,
    input_schema: {
      type: 'object',
      properties: {
        sentences: {
          type: 'array',
          description: `4-6 bilingual sentence pairs forming the letter body. Simple A1-A2 ${langName}.`,
          items: {
            type: 'object',
            properties: {
              es: { type: 'string', description: `One sentence of the letter in ${langName}.` },
              en: { type: 'string', description: 'English translation of that sentence.' },
            },
            required: ['es', 'en'],
          },
        },
        question: { type: 'string', description: `One friendly question in ${langName} for the child to answer next time.` },
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
          `You are writing a pen pal letter to a child ages 7-14 in the United States who is learning ${langName}.`,
          `Write in very simple A1-A2 ${langName} — short sentences, common vocabulary, no slang.`,
          `Be warm, curious, and encouraging. Reference the topic naturally.`,
          `The topic connection: ${baseId}.`,
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
