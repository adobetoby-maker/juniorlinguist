export interface PenPalFriend {
  name: string
  age: number
  city: string
  country: string
  emoji: string
  intro: string
}

export const PEN_PAL_FRIENDS: Record<string, PenPalFriend> = {
  animals: {
    name: 'Sofía',
    age: 10,
    city: 'Oaxaca',
    country: 'México',
    emoji: '🌿',
    intro: 'She lives near a forest and loves birds, butterflies, and her dog Canela.',
  },
  school: {
    name: 'Mateo',
    age: 11,
    city: 'Madrid',
    country: 'España',
    emoji: '📚',
    intro: 'He loves math, comic books, and his school\'s science club.',
  },
  family: {
    name: 'Isabella',
    age: 9,
    city: 'Bogotá',
    country: 'Colombia',
    emoji: '🏡',
    intro: 'She lives with her grandparents and three cousins and cooks with her abuela every weekend.',
  },
  sports: {
    name: 'Lucas',
    age: 12,
    city: 'Buenos Aires',
    country: 'Argentina',
    emoji: '⚽',
    intro: 'He plays on the neighborhood fútbol team and dreams of being a professional player.',
  },
  food: {
    name: 'Valentina',
    age: 10,
    city: 'Lima',
    country: 'Perú',
    emoji: '🍋',
    intro: 'Her family runs a small restaurant and she helps make fresh juice every morning.',
  },
  travel: {
    name: 'Diego',
    age: 11,
    city: 'Ciudad de México',
    country: 'México',
    emoji: '🗺️',
    intro: 'He visits a new city every summer and has a map on his bedroom wall with every place marked.',
  },
  arts: {
    name: 'Camila',
    age: 10,
    city: 'Sevilla',
    country: 'España',
    emoji: '🎨',
    intro: 'She paints every afternoon and her drawings have been displayed at the town hall.',
  },
  science: {
    name: 'Andrés',
    age: 12,
    city: 'Santiago',
    country: 'Chile',
    emoji: '🔭',
    intro: 'He has a small telescope and is trying to name all the constellations visible from his roof.',
  },
  body: {
    name: 'Mariana',
    age: 9,
    city: 'Guadalajara',
    country: 'México',
    emoji: '💛',
    intro: 'She loves yoga in the mornings and writes in her feelings journal every night.',
  },
  general: {
    name: 'Carlos',
    age: 10,
    city: 'San José',
    country: 'Costa Rica',
    emoji: '🌟',
    intro: 'He is curious about everything — animals, machines, food, and making new friends.',
  },
}

export function getFriend(moduleId: string): PenPalFriend {
  return PEN_PAL_FRIENDS[moduleId] ?? PEN_PAL_FRIENDS.general
}
