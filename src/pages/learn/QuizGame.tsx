import { useEffect, useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { KIDS_MODULES } from '../../data/kidsModules'
import { useQuizSession, calcQuizStars } from '../../state/useQuizSession'
import { saveQuizResult } from '../../state/progress'
import { useAppState } from '../../state/AppState'
import GameShell from '../../components/learn/GameShell'
import QuizOption from '../../components/learn/QuizOption'
import ProgressBar from '../../components/learn/ProgressBar'
import ResultScreen from '../../components/learn/ResultScreen'
import { ding, thud } from '../../utils/haptics'
import { sansFont, displayFont } from '../../constants'

export default function QuizGame() {
  const { moduleId } = useParams<{ moduleId: string }>()
  const mod = KIDS_MODULES.find(m => m.id === moduleId)
  const { state, selectAnswer, advance, reset } = useQuizSession(mod?.vocab ?? [], moduleId ?? '')
  const { dispatch } = useAppState()
  const [saved, setSaved] = useState(false)

  if (!mod) return <Navigate to="/learn" replace />

  const stars = calcQuizStars(state.score)

  // Haptics when answer is selected
  useEffect(() => {
    if (state.feedbackActive && state.selectedAnswer) {
      const q = state.questions[state.currentIndex]
      if (state.selectedAnswer === q?.correctAnswer) ding()
      else thud()
    }
  }, [state.feedbackActive, state.selectedAnswer, state.currentIndex, state.questions])

  // Auto-advance 800ms after answering
  useEffect(() => {
    if (state.feedbackActive) {
      const t = setTimeout(advance, 800)
      return () => clearTimeout(t)
    }
  }, [state.feedbackActive, state.currentIndex, advance])

  useEffect(() => {
    if (state.phase === 'result' && !saved) {
      saveQuizResult(mod.id, state.score, stars)
      dispatch({ type: 'RECORD_ACTIVITY', activityId: `quiz-${mod.id}` })
      setSaved(true)
    }
  }, [state.phase, saved, mod.id, state.score, stars, dispatch])

  if (state.phase === 'result') {
    return (
      <GameShell moduleId={mod.id} title="Quiz">
        <ResultScreen
          stars={stars}
          subline={`${state.score} out of ${state.questions.length} correct!`}
          moduleId={mod.id}
          color={mod.color}
          onPlayAgain={() => { setSaved(false); reset() }}
        />
      </GameShell>
    )
  }

  const q = state.questions[state.currentIndex]
  if (!q) return null

  function getOptionStatus(opt: string): 'idle' | 'correct' | 'wrong' | 'dimmed' {
    if (!state.feedbackActive) return 'idle'
    if (opt === q.correctAnswer) return 'correct'
    if (opt === state.selectedAnswer) return 'wrong'
    return 'dimmed'
  }

  return (
    <GameShell moduleId={mod.id} title="Quiz">
      <div className="max-w-sm mx-auto px-5 pt-6 pb-16">
        <ProgressBar value={state.currentIndex / state.questions.length} color={mod.color} className="mb-2" />
        <p className="text-center text-xs mb-8" style={{ ...sansFont, color: '#71717A' }}>
          Question {state.currentIndex + 1} of {state.questions.length}
        </p>

        <div className="rounded-2xl p-6 mb-8 text-center" style={{ backgroundColor: mod.color }}>
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ ...sansFont, color: 'rgba(255,255,255,0.7)' }}>
            What does this mean in English?
          </p>
          <p className="text-4xl font-bold" style={{ ...displayFont, color: '#fff' }}>
            {q.vocab.es}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {q.options.map(opt => (
            <QuizOption
              key={opt}
              text={opt}
              status={getOptionStatus(opt)}
              onTap={() => selectAnswer(opt)}
            />
          ))}
        </div>

        <p className="text-center text-xs mt-6" style={{ ...sansFont, color: '#A1A1AA' }}>
          Score: {state.score} / {state.currentIndex}
        </p>
      </div>
    </GameShell>
  )
}
