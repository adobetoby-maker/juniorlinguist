import { useReducer, useCallback } from 'react'
import type { VocabPair } from '../data/kidsModules'

interface FlashState {
  queue: VocabPair[]
  flipped: boolean
  gotIt: number
  total: number
  wrongCount: number
  phase: 'playing' | 'result'
}

type FlashAction =
  | { type: 'FLIP' }
  | { type: 'GOT_IT' }
  | { type: 'NOT_YET' }
  | { type: 'RESET'; vocab: VocabPair[] }

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function reduce(state: FlashState, action: FlashAction): FlashState {
  switch (action.type) {
    case 'FLIP':
      return { ...state, flipped: true }
    case 'GOT_IT': {
      const newQueue = state.queue.slice(1)
      const newGotIt = state.gotIt + 1
      if (newQueue.length === 0) return { ...state, queue: newQueue, flipped: false, gotIt: newGotIt, phase: 'result' }
      return { ...state, queue: newQueue, flipped: false, gotIt: newGotIt }
    }
    case 'NOT_YET': {
      const [current, ...rest] = state.queue
      return { ...state, queue: [...rest, current], flipped: false, wrongCount: state.wrongCount + 1 }
    }
    case 'RESET':
      return init(action.vocab)
    default:
      return state
  }
}

function init(vocab: VocabPair[]): FlashState {
  return { queue: shuffle(vocab), flipped: false, gotIt: 0, total: vocab.length, wrongCount: 0, phase: 'playing' }
}

export function calcFlashStars(wrongCount: number): 1 | 2 | 3 {
  if (wrongCount === 0) return 3
  if (wrongCount <= 2) return 2
  return 1
}

export function useFlashSession(vocab: VocabPair[]) {
  const [state, dispatch] = useReducer(reduce, vocab, init)
  const flip = useCallback(() => dispatch({ type: 'FLIP' }), [])
  const gotIt = useCallback(() => dispatch({ type: 'GOT_IT' }), [])
  const notYet = useCallback(() => dispatch({ type: 'NOT_YET' }), [])
  const reset = useCallback(() => dispatch({ type: 'RESET', vocab }), [vocab])
  return { state, flip, gotIt, notYet, reset }
}
