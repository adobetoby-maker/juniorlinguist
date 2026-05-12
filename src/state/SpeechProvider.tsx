import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { configureUtterance } from '../lib/voices'

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
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window

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
    cancelledRef.current = true
    if (supported) try { window.speechSynthesis.cancel() } catch {}
    setPlaying(false)
    setActiveSentenceIndex(-1)
  }, [supported])

  const speak = useCallback((text: string, lang?: string) => {
    if (!supported) return
    try {
      window.speechSynthesis.cancel()
      const u = new SpeechSynthesisUtterance(text)
      configureUtterance(u, lang ?? accent)
      u.rate = rate
      window.speechSynthesis.speak(u)
    } catch {}
  }, [supported, accent, rate])

  const speakQueue = useCallback((
    items: { text: string; index: number }[],
    onMove?: (i: number) => void,
  ) => {
    if (!supported || items.length === 0) return
    cancelledRef.current = false
    setPlaying(true)

    function next(pos: number) {
      if (cancelledRef.current || pos >= items.length) {
        setPlaying(false)
        setActiveSentenceIndex(-1)
        return
      }
      const item = items[pos]
      setActiveSentenceIndex(item.index)
      onMove?.(item.index)
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
  }, [supported, accent, rate])

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
