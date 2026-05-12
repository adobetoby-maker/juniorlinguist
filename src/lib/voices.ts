// Voice selection for browser SpeechSynthesis.
// Preference order: exact voiceURI match → Google voice for locale → any locale voice

const LISTENERS = new Set<() => void>()
let cached: SpeechSynthesisVoice[] = []

function refresh() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  cached = window.speechSynthesis.getVoices()
  LISTENERS.forEach(cb => cb())
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  refresh()
  window.speechSynthesis.onvoiceschanged = refresh
}

export function getAllVoices(): SpeechSynthesisVoice[] {
  if (cached.length === 0) refresh()
  return cached
}

export function subscribeVoices(cb: () => void): () => void {
  LISTENERS.add(cb)
  return () => LISTENERS.delete(cb)
}

export function pickVoice(locale: string, preferredURI?: string | null): SpeechSynthesisVoice | null {
  const all = getAllVoices()
  const family = locale.split('-')[0].toLowerCase()
  const exact = all.filter(v => v.lang.toLowerCase() === locale.toLowerCase())
  const fam = all.filter(v => v.lang.toLowerCase().startsWith(family + '-') && !exact.includes(v))
  const candidates = [...exact, ...fam].sort((a, b) => {
    const s = (a.name.includes('Google') ? 0 : 1) - (b.name.includes('Google') ? 0 : 1)
    return s !== 0 ? s : a.name.localeCompare(b.name)
  })
  if (preferredURI) {
    const match = candidates.find(v => v.voiceURI === preferredURI)
    if (match) return match
  }
  return candidates[0] ?? null
}

export function configureUtterance(
  u: SpeechSynthesisUtterance,
  locale: string,
  preferredURI?: string | null,
): SpeechSynthesisUtterance {
  u.lang = locale
  const v = pickVoice(locale, preferredURI)
  if (v) u.voice = v
  return u
}

export function speakText(text: string, locale = 'es-CR', rate = 0.85) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
  try {
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    configureUtterance(u, locale)
    u.rate = rate
    window.speechSynthesis.speak(u)
  } catch { /* TTS is enhancement-only */ }
}
