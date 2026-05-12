export interface ModuleProgress {
  moduleId: string
  flashBestStars: 0 | 1 | 2 | 3
  matchBestStars: 0 | 1 | 2 | 3
  quizBestScore: number
  quizBestStars: 0 | 1 | 2 | 3
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
    lastPlayedAt: null,
  }
}

export function totalStars(p: ModuleProgress): number {
  return p.flashBestStars + p.matchBestStars + p.quizBestStars
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
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  } catch {}
}

export function getModuleProgress(moduleId: string): ModuleProgress {
  const store = load()
  return store.modules[moduleId] ?? emptyProgress(moduleId)
}

export function saveFlashResult(moduleId: string, stars: 1 | 2 | 3) {
  const store = load()
  const prev = store.modules[moduleId] ?? emptyProgress(moduleId)
  store.modules[moduleId] = {
    ...prev,
    flashBestStars: Math.max(prev.flashBestStars, stars) as 0 | 1 | 2 | 3,
    lastPlayedAt: new Date().toISOString(),
  }
  save(store)
}

export function saveMatchResult(moduleId: string, stars: 1 | 2 | 3) {
  const store = load()
  const prev = store.modules[moduleId] ?? emptyProgress(moduleId)
  store.modules[moduleId] = {
    ...prev,
    matchBestStars: Math.max(prev.matchBestStars, stars) as 0 | 1 | 2 | 3,
    lastPlayedAt: new Date().toISOString(),
  }
  save(store)
}

export function saveQuizResult(moduleId: string, score: number, stars: 1 | 2 | 3) {
  const store = load()
  const prev = store.modules[moduleId] ?? emptyProgress(moduleId)
  store.modules[moduleId] = {
    ...prev,
    quizBestScore: Math.max(prev.quizBestScore, score),
    quizBestStars: Math.max(prev.quizBestStars, stars) as 0 | 1 | 2 | 3,
    lastPlayedAt: new Date().toISOString(),
  }
  save(store)
}

export function getAllProgress(): Record<string, ModuleProgress> {
  return load().modules
}
