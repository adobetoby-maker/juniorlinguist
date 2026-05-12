import { useReducer, useCallback } from 'react'
import type { VocabPair } from '../data/kidsModules'

export interface MatchItem {
  vocab: VocabPair
  status: 'idle' | 'selected' | 'matched' | 'shake'
}

interface MatchState {
  allPairs: VocabPair[]
  roundIndex: 0 | 1
  leftCol: MatchItem[]
  rightCol: MatchItem[]
  selectedLeft: number | null
  selectedRight: number | null
  mistakes: number
  phase: 'playing' | 'between' | 'result'
}

type MatchAction =
  | { type: 'SELECT_LEFT'; index: number }
  | { type: 'SELECT_RIGHT'; index: number }
  | { type: 'CLEAR_SHAKE' }
  | { type: 'NEXT_ROUND' }
  | { type: 'RESET'; pairs: VocabPair[] }

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildRound(pairs: VocabPair[], roundIdx: 0 | 1): Pick<MatchState, 'leftCol' | 'rightCol'> {
  const slice = pairs.slice(roundIdx * 5, roundIdx * 5 + 5)
  const leftCol: MatchItem[] = slice.map(v => ({ vocab: v, status: 'idle' }))
  const rightCol: MatchItem[] = shuffle(slice).map(v => ({ vocab: v, status: 'idle' }))
  return { leftCol, rightCol }
}

function init(pairs: VocabPair[]): MatchState {
  const shuffled = shuffle(pairs)
  return {
    allPairs: shuffled,
    roundIndex: 0,
    ...buildRound(shuffled, 0),
    selectedLeft: null,
    selectedRight: null,
    mistakes: 0,
    phase: 'playing',
  }
}

function reduce(state: MatchState, action: MatchAction): MatchState {
  switch (action.type) {
    case 'SELECT_LEFT': {
      if (state.leftCol[action.index].status === 'matched') return state
      const leftCol = state.leftCol.map((item, i) => ({
        ...item,
        status: (i === action.index ? 'selected' : item.status === 'selected' ? 'idle' : item.status) as MatchItem['status'],
      }))
      return { ...state, leftCol, selectedLeft: action.index, selectedRight: null }
    }
    case 'SELECT_RIGHT': {
      if (state.rightCol[action.index].status === 'matched') return state
      if (state.selectedLeft === null) {
        const rightCol = state.rightCol.map((item, i) => ({
          ...item,
          status: (i === action.index ? 'selected' : item.status === 'selected' ? 'idle' : item.status) as MatchItem['status'],
        }))
        return { ...state, rightCol, selectedRight: action.index }
      }
      const li = state.selectedLeft
      const ri = action.index
      const leftKey = state.leftCol[li].vocab.en
      const rightKey = state.rightCol[ri].vocab.en
      if (leftKey === rightKey) {
        // match
        const leftCol = state.leftCol.map((item, i) => ({ ...item, status: (i === li ? 'matched' : item.status) as MatchItem['status'] }))
        const rightCol = state.rightCol.map((item, i) => ({ ...item, status: (i === ri ? 'matched' : item.status) as MatchItem['status'] }))
        const allMatched = leftCol.every(it => it.status === 'matched')
        if (allMatched && state.roundIndex === 1) {
          return { ...state, leftCol, rightCol, selectedLeft: null, selectedRight: null, phase: 'result' }
        }
        if (allMatched) {
          return { ...state, leftCol, rightCol, selectedLeft: null, selectedRight: null, phase: 'between' }
        }
        return { ...state, leftCol, rightCol, selectedLeft: null, selectedRight: null }
      } else {
        // no match — shake
        const leftCol = state.leftCol.map((item, i) => ({ ...item, status: (i === li ? 'shake' : item.status) as MatchItem['status'] }))
        const rightCol = state.rightCol.map((item, i) => ({ ...item, status: (i === ri ? 'shake' : item.status) as MatchItem['status'] }))
        return { ...state, leftCol, rightCol, selectedLeft: null, selectedRight: null, mistakes: state.mistakes + 1 }
      }
    }
    case 'CLEAR_SHAKE': {
      const leftCol = state.leftCol.map(item => ({ ...item, status: (item.status === 'shake' ? 'idle' : item.status) as MatchItem['status'] }))
      const rightCol = state.rightCol.map(item => ({ ...item, status: (item.status === 'shake' ? 'idle' : item.status) as MatchItem['status'] }))
      return { ...state, leftCol, rightCol }
    }
    case 'NEXT_ROUND': {
      const nextRound = 1 as const
      return { ...state, roundIndex: nextRound, ...buildRound(state.allPairs, nextRound), selectedLeft: null, selectedRight: null, phase: 'playing' }
    }
    case 'RESET':
      return init(action.pairs)
    default:
      return state
  }
}

export function calcMatchStars(mistakes: number): 1 | 2 | 3 {
  if (mistakes === 0) return 3
  if (mistakes <= 2) return 2
  return 1
}

export function useMatchSession(vocab: VocabPair[]) {
  const [state, dispatch] = useReducer(reduce, vocab, init)
  const selectLeft = useCallback((i: number) => dispatch({ type: 'SELECT_LEFT', index: i }), [])
  const selectRight = useCallback((i: number) => dispatch({ type: 'SELECT_RIGHT', index: i }), [])
  const clearShake = useCallback(() => dispatch({ type: 'CLEAR_SHAKE' }), [])
  const nextRound = useCallback(() => dispatch({ type: 'NEXT_ROUND' }), [])
  const reset = useCallback(() => dispatch({ type: 'RESET', pairs: vocab }), [vocab])
  return { state, selectLeft, selectRight, clearShake, nextRound, reset }
}
