import manifest from '../data/shared-spanish-recordings.json'

export function recordingPath(text: string, locale: string, gender: 'female' | 'male' = 'female'): string | null {
  if (!/^es(?:-|$)/i.test(locale) || /^es-ES/i.test(locale)) return null
  const key = text.normalize('NFC').trim().toLocaleLowerCase('es').replace(/\s+/g, ' ').replace(/[.!?¿¡,;:]+$/, '')
  const entries = manifest.entries as Record<string, Partial<Record<'female' | 'male', string>>>
  const name = entries[key]?.[gender]
  return name && name.endsWith(`-${gender}`) && /^(?:es-next-[a-f0-9]{20}|(?:v3|trade|cr)-[a-z0-9-]{1,120})-(female|male)$/.test(name) ? `/audio/shared-spanish/${name}.mp3` : null
}

let active: HTMLAudioElement | null = null
let settle: ((played: boolean | null) => void) | null = null
export function stopRecordedSpeech() {
  const audio = active
  active = null
  if (audio) { audio.onended = null; audio.onerror = null; audio.pause(); audio.removeAttribute('src'); audio.load() }
  settle?.(null); settle = null
}
export function playRecordedSpeech(text: string, locale: string, rate: number): Promise<boolean | null> {
  stopRecordedSpeech()
  const path = recordingPath(text, locale)
  if (!path || typeof Audio === 'undefined') return Promise.resolve(false)
  return new Promise(resolve => {
    const audio = new Audio(path)
    active = audio; settle = resolve
    audio.playbackRate = Math.max(0.5, Math.min(2, rate))
    const done = (played: boolean) => {
      if (active !== audio) return
      active = null; settle = null; audio.onended = null; audio.onerror = null; resolve(played)
    }
    audio.onended = () => done(true)
    audio.onerror = () => done(false)
    void audio.play().catch(() => done(false))
  })
}
