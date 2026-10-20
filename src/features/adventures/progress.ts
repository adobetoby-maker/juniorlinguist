import { ADVENTURES } from './content'

export interface AdventureProgress { version: 1; actor: string; completed: string[] }
export interface ProgressStorage { getItem(key: string): string | null; setItem(key: string, value: string): void }
const lessonIds = new Set(ADVENTURES.flatMap(series => series.lessons.map(lesson => lesson.id)))
export const progressKey = (actor: string) => `jl_adventures_v1:${encodeURIComponent(actor)}`
const empty = (actor: string): AdventureProgress => ({ version: 1, actor, completed: [] })

export function readAdventureProgress(storage: ProgressStorage | undefined, actor: string): { progress: AdventureProgress; error?: string } {
  try {
    if (!storage) return { progress: empty(actor), error: 'Progress storage is unavailable. Your lessons still work, but progress cannot be saved.' }
    const raw = storage.getItem(progressKey(actor))
    if (!raw) return { progress: empty(actor) }
    const data: unknown = JSON.parse(raw)
    if (!data || typeof data !== 'object' || !('version' in data) || data.version !== 1 || !('actor' in data) || data.actor !== actor || !('completed' in data) || !Array.isArray(data.completed) || !data.completed.every(id => typeof id === 'string' && lessonIds.has(id))) {
      return { progress: empty(actor), error: 'Saved adventure progress could not be read. It has been left untouched.' }
    }
    return { progress: { version: 1, actor, completed: [...new Set(data.completed)] } }
  } catch {
    return { progress: empty(actor), error: 'Adventure progress is unavailable on this device. Your lessons still work.' }
  }
}

export function completeAdventureLesson(storage: ProgressStorage | undefined, actor: string, lessonId: string) {
  const current = readAdventureProgress(storage, actor)
  if (current.error || !lessonIds.has(lessonId)) return { ...current, saved: false, error: current.error ?? 'This lesson could not be saved.' }
  const progress = { ...current.progress, completed: [...new Set([...current.progress.completed, lessonId])] }
  try {
    if (!storage) throw new Error('Storage unavailable')
    storage.setItem(progressKey(actor), JSON.stringify(progress))
    return { progress, saved: true }
  } catch {
    return { progress: current.progress, saved: false, error: 'Lesson finished, but progress could not be saved. Free up device storage and try saving again.' }
  }
}

export function adventureStorage(): ProgressStorage | undefined {
  try { return window.localStorage } catch { return undefined }
}
