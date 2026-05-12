export interface SM2Card {
  easeFactor: number    // starts 2.5; minimum 1.3
  interval: number      // days until next review
  repetition: number    // successful review count
  nextReviewDate: string // YYYY-MM-DD
}

type SM2Store = Record<string, Record<string, SM2Card>> // moduleId → wordEn → card

const STORAGE_KEY = 'jl_sm2_v1'

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

function addDays(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString().slice(0, 10)
}

function load(): SM2Store {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as SM2Store
  } catch {}
  return {}
}

function save(store: SM2Store) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(store)) } catch {}
}

export function getSM2Card(moduleId: string, wordEn: string): SM2Card {
  const store = load()
  return store[moduleId]?.[wordEn] ?? { easeFactor: 2.5, interval: 1, repetition: 0, nextReviewDate: today() }
}

// grade: 0=not-yet (forgot), 3=got-it, 5=already-knew-it
export function updateSM2(moduleId: string, wordEn: string, grade: 0 | 3 | 5): SM2Card {
  const store = load()
  if (!store[moduleId]) store[moduleId] = {}
  const card = store[moduleId][wordEn] ?? { easeFactor: 2.5, interval: 1, repetition: 0, nextReviewDate: today() }

  let { easeFactor, interval, repetition } = card

  if (grade < 3) {
    repetition = 0
    interval = 1
  } else {
    if (repetition === 0) interval = 1
    else if (repetition === 1) interval = 6
    else interval = Math.round(interval * easeFactor)
    easeFactor = Math.max(1.3, easeFactor + 0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02))
    repetition += 1
  }

  const updated: SM2Card = { easeFactor, interval, repetition, nextReviewDate: addDays(interval) }
  store[moduleId][wordEn] = updated
  save(store)
  return updated
}

export function getDueCount(moduleId: string, vocab: { en: string }[]): number {
  const t = today()
  const store = load()
  const cards = store[moduleId] ?? {}
  return vocab.filter(v => (cards[v.en]?.nextReviewDate ?? t) <= t).length
}

// Sort vocab: due words first, then the rest
export function sortByDue(moduleId: string, vocab: { en: string; es: string }[]): { en: string; es: string }[] {
  const t = today()
  const store = load()
  const cards = store[moduleId] ?? {}
  return [...vocab].sort((a, b) => {
    const aDue = (cards[a.en]?.nextReviewDate ?? t) <= t ? 0 : 1
    const bDue = (cards[b.en]?.nextReviewDate ?? t) <= t ? 0 : 1
    return aDue - bDue
  })
}
