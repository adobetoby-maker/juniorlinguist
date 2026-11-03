import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { configureUtterance } from '../lib/voices'
import { playRecordedSpeech, stopRecordedSpeech } from '../lib/recordedSpeech'

export const ACCENT = 'es-CR'

interface SpeechCtx {
  playing: boolean
  activeSentenceIndex: number
  rate: number
  setRate: (n: number) => void
  accent: string
  setAccent: (code: string) => void
  speak: (text: string, lang?: string) => void
  speakQueue: (items: { text: string; index: number }[], onMove?: (i: number) => void) => void
  stop: () => void
  supported: boolean
}

const Ctx = createContext<SpeechCtx | null>(null)
const STORAGE_KEY = 'jl_speech_v1'

export function SpeechProvider({ children }: { children: ReactNode }) {
  const [rate, setRateState] = useState(0.85)
  const [accent, setAccentState] = useState(ACCENT)
  const [playing, setPlaying] = useState(false)
  const [activeSentenceIndex, setActiveSentenceIndex] = useState(-1)
  const cancelledRef = useRef(false)
  const generationRef = useRef(0)
  const supported = typeof window !== 'undefined' && ('Audio' in window || 'speechSynthesis' in window)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const s = JSON.parse(raw)
        if (s.rate) setRateState(s.rate)
        if (s.accent) setAccentState(s.accent)
      }
    } catch {}
  }, [])

  function persist(r: number, a: string) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ rate: r, accent: a })) } catch {}
  }

  function setRate(n: number) { setRateState(n); persist(n, accent) }
  function setAccent(code: string) { setAccentState(code); persist(rate, code) }

  const stop = useCallback(() => {
    generationRef.current += 1
    stopRecordedSpeech()
    cancelledRef.current = true
    if (supported) try { window.speechSynthesis.cancel() } catch {}
    setPlaying(false)
    setActiveSentenceIndex(-1)
  }, [supported])

  const speak = useCallback((text: string, lang?: string) => {
    stop()
    const generation = generationRef.current
    void playRecordedSpeech(text, lang ?? accent, rate).then(played => {
      if (played === null || played || generation !== generationRef.current || !('speechSynthesis' in window)) return
      const u = new SpeechSynthesisUtterance(text)
      configureUtterance(u, lang ?? accent); u.rate = rate
      window.speechSynthesis.speak(u)
    })
  }, [stop, accent, rate])

  const speakQueue = useCallback((
    items: { text: string; index: number }[],
    onMove?: (i: number) => void,
  ) => {
    if (!supported || items.length === 0) return
    stop()
    const generation = generationRef.current
    cancelledRef.current = false
    setPlaying(true)

    async function next(pos: number) {
      if (generation !== generationRef.current) return
      if (cancelledRef.current || pos >= items.length) {
        setPlaying(false)
        setActiveSentenceIndex(-1)
        return
      }
      const item = items[pos]
      setActiveSentenceIndex(item.index)
      onMove?.(item.index)
      const played = await playRecordedSpeech(item.text, accent, rate)
      if (cancelledRef.current || generation !== generationRef.current) return
      if (played === null) { setPlaying(false); setActiveSentenceIndex(-1); return }
      if (played) { void next(pos + 1); return }
      if (!('speechSynthesis' in window)) { setPlaying(false); setActiveSentenceIndex(-1); return }
      const u = new SpeechSynthesisUtterance(item.text)
      configureUtterance(u, accent)
      u.rate = rate
      u.onend = () => next(pos + 1)
      u.onerror = () => next(pos + 1)
      try {
        window.speechSynthesis.cancel()
        window.speechSynthesis.speak(u)
      } catch { next(pos + 1) }
    }

    next(0)
  }, [supported, accent, rate, stop])

  useEffect(() => stop, [stop])

  return (
    <Ctx.Provider value={{ playing, activeSentenceIndex, rate, setRate, accent, setAccent, speak, speakQueue, stop, supported }}>
      {children}
    </Ctx.Provider>
  )
}

export function useSpeech() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useSpeech must be inside SpeechProvider')
  return ctx
}
