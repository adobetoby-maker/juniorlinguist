import { useReducer, useCallback, useMemo } from 'react'
import type { VocabPair } from '../data/kidsModules'
import { KIDS_MODULES } from '../data/kidsModules'

export interface QuizQuestion {
  vocab: VocabPair
  options: string[]
  correctAnswer: string
}

interface QuizState {
  questions: QuizQuestion[]
  currentIndex: number
  score: number
  selectedAnswer: string | null
  feedbackActive: boolean
  phase: 'playing' | 'result'
}

type QuizAction =
  | { type: 'SELECT'; answer: string }
  | { type: 'ADVANCE' }
  | { type: 'RESET'; questions: QuizQuestion[] }

function reduce(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'SELECT': {
      if (state.feedbackActive || state.selectedAnswer) return state
      const correct = state.questions[state.currentIndex].correctAnswer
      const isCorrect = action.answer === correct
      return { ...state, selectedAnswer: action.answer, feedbackActive: true, score: state.score + (isCorrect ? 1 : 0) }
    }
    case 'ADVANCE': {
      const next = state.currentIndex + 1
      if (next >= state.questions.length) return { ...state, feedbackActive: false, phase: 'result' }
      return { ...state, currentIndex: next, selectedAnswer: null, feedbackActive: false }
    }
    case 'RESET':
      return initState(action.questions)
    default:
      return state
  }
}

function initState(questions: QuizQuestion[]): QuizState {
  return { questions, currentIndex: 0, score: 0, selectedAnswer: null, feedbackActive: false, phase: 'playing' }
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildQuestions(vocab: VocabPair[], moduleId: string): QuizQuestion[] {
  // Distractor pool: English words from other modules
  const distractorPool = KIDS_MODULES
    .filter(m => m.id !== moduleId)
    .flatMap(m => m.vocab.map(v => v.en))
  const shuffledVocab = shuffle(vocab)
  return shuffledVocab.map(pair => {
    const distractors = shuffle(distractorPool.filter(e => e !== pair.en)).slice(0, 3)
    const options = shuffle([pair.en, ...distractors])
    return { vocab: pair, options, correctAnswer: pair.en }
  })
}

export function calcQuizStars(score: number): 1 | 2 | 3 {
  if (score >= 9) return 3
  if (score >= 7) return 2
  return 1
}

export function useQuizSession(vocab: VocabPair[], moduleId: string) {
  const questions = useMemo(() => buildQuestions(vocab, moduleId), [vocab, moduleId])
  const [state, dispatch] = useReducer(reduce, questions, initState)
  const selectAnswer = useCallback((answer: string) => dispatch({ type: 'SELECT', answer }), [])
  const advance = useCallback(() => dispatch({ type: 'ADVANCE' }), [])
  const reset = useCallback(() => dispatch({ type: 'RESET', questions: buildQuestions(vocab, moduleId) }), [vocab, moduleId])
  return { state, selectAnswer, advance, reset }
}
