import { createContext, useContext, useReducer, useEffect, useRef, type ReactNode } from 'react'

export interface VocabItem {
  word: string       // Spanish
  english: string
  moduleId: string
  correctCount: number   // mastered at 5
  addedAt: string
}

export interface AppState {
  xp: number
  streak: number
  lastActiveDate: string | null
  vocab: VocabItem[]
  achievements: string[]
}

type AppAction =
  | { type: 'ADD_XP'; amount: number }
  | { type: 'ADD_VOCAB'; item: Omit<VocabItem, 'correctCount' | 'addedAt'> }
  | { type: 'INCREMENT_VOCAB'; word: string }
  | { type: 'TOUCH_STREAK' }
  | { type: 'EARN_ACHIEVEMENT'; name: string }

const TIERS = [
  { min: 1500, label: 'Legend', emoji: '🌟' },
  { min: 700,  label: 'Champion', emoji: '🏆' },
  { min: 300,  label: 'Hero', emoji: '⭐' },
  { min: 100,  label: 'Adventurer', emoji: '🚀' },
  { min: 0,    label: 'Explorer', emoji: '🌱' },
] as const

export function getTier(xp: number) {
  return TIERS.find(t => xp >= t.min) ?? TIERS[TIERS.length - 1]
}

export function xpForNextTier(xp: number): { pct: number; needed: number; label: string } {
  const tiers = [...TIERS].reverse()
  const idx = tiers.findIndex(t => xp >= t.min)
  const next = tiers[idx + 1]
  if (!next) return { pct: 100, needed: 0, label: 'Legend' }
  const cur = tiers[idx]
  const pct = ((xp - cur.min) / (next.min - cur.min)) * 100
  return { pct, needed: next.min - xp, label: next.label }
}

export const VOCAB_MASTERY = 5

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

function reduce(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_XP':
      return { ...state, xp: state.xp + action.amount }
    case 'ADD_VOCAB': {
      const exists = state.vocab.find(v => v.word === action.item.word)
      if (exists) return state
      return { ...state, vocab: [...state.vocab, { ...action.item, correctCount: 0, addedAt: new Date().toISOString() }] }
    }
    case 'INCREMENT_VOCAB':
      return {
        ...state,
        vocab: state.vocab.map(v =>
          v.word === action.word ? { ...v, correctCount: Math.min(v.correctCount + 1, 10) } : v
        ),
      }
    case 'TOUCH_STREAK': {
      const t = today()
      if (state.lastActiveDate === t) return state
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
      const newStreak = state.lastActiveDate === yesterday ? state.streak + 1 : 1
      return { ...state, streak: newStreak, lastActiveDate: t }
    }
    case 'EARN_ACHIEVEMENT':
      if (state.achievements.includes(action.name)) return state
      return { ...state, achievements: [...state.achievements, action.name] }
    default:
      return state
  }
}

const INITIAL: AppState = { xp: 0, streak: 0, lastActiveDate: null, vocab: [], achievements: [] }
const STORAGE_KEY = 'jl_app_v1'

function load(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...INITIAL, ...JSON.parse(raw) }
  } catch {}
  return INITIAL
}

interface AppCtx { state: AppState; dispatch: (a: AppAction) => void }
const Ctx = createContext<AppCtx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reduce, undefined, load)
  const prevXpRef = useRef(state.xp)
  const prevTierRef = useRef(getTier(state.xp).label)

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch {}
  }, [state])

  // Touch streak on mount
  useEffect(() => { dispatch({ type: 'TOUCH_STREAK' }) }, [])

  // Emit XP pop event when XP increases
  useEffect(() => {
    if (state.xp > prevXpRef.current) {
      const amount = state.xp - prevXpRef.current
      window.dispatchEvent(new CustomEvent('jl:xp', { detail: { amount } }))
    }
    prevXpRef.current = state.xp
  }, [state.xp])

  // Emit level-up event when tier advances
  useEffect(() => {
    const tier = getTier(state.xp)
    if (tier.label !== prevTierRef.current) {
      window.dispatchEvent(new CustomEvent('jl:levelup', { detail: { tier } }))
    }
    prevTierRef.current = tier.label
  }, [state.xp])

  return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>
}

export function useAppState() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAppState must be inside AppProvider')
  return ctx
}
