export interface ModuleProgress {
  moduleId: string
  flashBestStars: 0 | 1 | 2 | 3
  matchBestStars: 0 | 1 | 2 | 3
  quizBestScore: number
  quizBestStars: 0 | 1 | 2 | 3
  storiesRead: number
  speakSessions: number
  lastPlayedAt: string | null
}

export interface ProgressStore {
  version: 1
  modules: Record<string, ModuleProgress>
}

export function emptyProgress(moduleId: string): ModuleProgress {
  return {
    moduleId,
    flashBestStars: 0,
    matchBestStars: 0,
    quizBestScore: 0,
    quizBestStars: 0,
    storiesRead: 0,
    speakSessions: 0,
    lastPlayedAt: null,
  }
}

export function totalStars(p: ModuleProgress): number {
  return p.flashBestStars + p.matchBestStars + p.quizBestStars
}

// 5-step fluency: Learn → Practice → Read → Speak → Quiz
export interface FluencyStep {
  id: string
  label: string
  emoji: string
  done: boolean
  paths: string[]
}

export function getFluencySteps(p: ModuleProgress, moduleId: string): FluencyStep[] {
  return [
    { id: 'learn', label: 'Learn Words', emoji: '🃏', done: p.flashBestStars > 0, paths: [`/learn/${moduleId}/flashcards`] },
    { id: 'practice', label: 'Play Games', emoji: '🎮', done: p.matchBestStars > 0, paths: [`/learn/${moduleId}/match`, `/learn/${moduleId}/memory`, `/learn/${moduleId}/listening`] },
    { id: 'read', label: 'Read a Story', emoji: '📖', done: p.storiesRead > 0, paths: [`/learn/${moduleId}/reader`, `/learn/${moduleId}/daily-story`] },
    { id: 'speak', label: 'Have a Chat', emoji: '🗣️', done: p.speakSessions > 0, paths: [`/learn/${moduleId}/speak`, `/learn/${moduleId}/tutor`] },
    { id: 'quiz', label: 'Prove It!', emoji: '🎯', done: p.quizBestStars > 0, paths: [`/learn/${moduleId}/quiz`] },
  ]
}

export function fluencyPct(p: ModuleProgress, moduleId: string): number {
  const steps = getFluencySteps(p, moduleId)
  return Math.round((steps.filter(s => s.done).length / steps.length) * 100)
}

const STORAGE_KEY = 'jl_progress_v1'

function load(): ProgressStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as ProgressStore
  } catch {}
  return { version: 1, modules: {} }
}

function save(store: ProgressStore) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(store)) } catch {}
}

export function getModuleProgress(moduleId: string): ModuleProgress {
  const store = load()
  return store.modules[moduleId] ?? emptyProgress(moduleId)
}

function patch(moduleId: string, update: Partial<ModuleProgress>) {
  const store = load()
  const prev = store.modules[moduleId] ?? emptyProgress(moduleId)
  store.modules[moduleId] = { ...prev, ...update, lastPlayedAt: new Date().toISOString() }
  save(store)
}

export function saveFlashResult(moduleId: string, stars: 1 | 2 | 3) {
  const prev = getModuleProgress(moduleId)
  patch(moduleId, { flashBestStars: Math.max(prev.flashBestStars, stars) as 0 | 1 | 2 | 3 })
}

export function saveMatchResult(moduleId: string, stars: 1 | 2 | 3) {
  const prev = getModuleProgress(moduleId)
  patch(moduleId, { matchBestStars: Math.max(prev.matchBestStars, stars) as 0 | 1 | 2 | 3 })
}

export function saveQuizResult(moduleId: string, score: number, stars: 1 | 2 | 3) {
  const prev = getModuleProgress(moduleId)
  patch(moduleId, {
    quizBestScore: Math.max(prev.quizBestScore, score),
    quizBestStars: Math.max(prev.quizBestStars, stars) as 0 | 1 | 2 | 3,
  })
}

export function saveStoryRead(moduleId: string) {
  const prev = getModuleProgress(moduleId)
  patch(moduleId, { storiesRead: (prev.storiesRead ?? 0) + 1 })
}

export function saveSpeakSession(moduleId: string) {
  const prev = getModuleProgress(moduleId)
  patch(moduleId, { speakSessions: (prev.speakSessions ?? 0) + 1 })
}

export function getAllProgress(): Record<string, ModuleProgress> {
  return load().modules
}
