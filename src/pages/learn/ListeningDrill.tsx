import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import GameShell from '../../components/learn/GameShell'
import ResultScreen from '../../components/learn/ResultScreen'
import { useSpeech } from '../../state/SpeechProvider'
import { KIDS_MODULES } from '../../data/kidsModules'
import { useAppState } from '../../state/AppState'
import { saveQuizResult } from '../../state/progress'

interface Question {
  phrase: string
  translation: string
  options: string[]
  listenFor: string
}

type Phase = 'loading' | 'listen' | 'answered' | 'result'

const TOTAL = 6

export default function ListeningDrill() {
  const { moduleId = 'animals' } = useParams<{ moduleId: string }>()
  const module = KIDS_MODULES.find(m => m.id === moduleId) ?? KIDS_MODULES[0]

  const [level, setLevel] = useState(1)
  const [phase, setPhase] = useState<Phase>('loading')
  const [questions, setQuestions] = useState<Question[]>([])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [avoided, setAvoided] = useState<string[]>([])
  const [error, setError] = useState('')

  const { speak } = useSpeech()
  const { dispatch } = useAppState()

  const fetchQuestion = useCallback(async () => {
    setPhase('loading')
    setError('')
    try {
      const res = await fetch('/api/listening', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moduleId, level, avoid: avoided }),
      })
      const data = await res.json()
      if (data.phrase) {
        setQuestions(prev => [...prev, data])
        setAvoided(prev => [...prev, data.phrase].slice(-15))
        setPhase('listen')
        // Auto-play after short delay
        setTimeout(() => speak(data.phrase, 'es'), 600)
      } else {
        setError('Could not load question. Try again.')
        setPhase('listen')
      }
    } catch {
      setError('No connection. Try again.')
      setPhase('listen')
    }
  }, [moduleId, level, avoided, speak])

  useEffect(() => {
    if (questions.length === 0) fetchQuestion()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function handleSelect(option: string) {
    if (phase !== 'listen') return
    setSelected(option)
    setPhase('answered')
    const q = questions[current]
    if (option === q.phrase) {
      setScore(s => s + 1)
      dispatch({ type: 'ADD_XP', amount: 8 })
    }
  }

  function handleNext() {
    if (current + 1 >= TOTAL) {
      const stars = score >= TOTAL - 1 ? 3 : score >= Math.ceil(TOTAL * 0.6) ? 2 : 1
      saveQuizResult(moduleId, score, stars)
      setPhase('result')
    } else {
      setCurrent(c => c + 1)
      setSelected(null)
      if (questions[current + 1]) {
        setPhase('listen')
        setTimeout(() => speak(questions[current + 1].phrase, 'es'), 400)
      } else {
        fetchQuestion()
      }
    }
  }

  function handleReplay() {
    setQuestions([])
    setCurrent(0)
    setSelected(null)
    setScore(0)
    setPhase('loading')
    fetchQuestion()
  }

  if (phase === 'result') {
    const stars = score >= TOTAL - 1 ? 3 : score >= Math.ceil(TOTAL * 0.6) ? 2 : 1
    return (
      <GameShell title="Listening Drill" moduleId={moduleId}>
        <ResultScreen
          stars={stars}
          subline={`${score} of ${TOTAL} correct`}
          moduleId={moduleId}
          color={module.color}
          onPlayAgain={handleReplay}
        />
      </GameShell>
    )
  }

  const q = questions[current]

  return (
    <GameShell title="Listening Drill" moduleId={moduleId}>
      <div className="max-w-lg mx-auto px-4 pb-10">

        {/* Level selector */}
        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3].map(l => (
            <button
              key={l}
              onClick={() => { setLevel(l); handleReplay() }}
              className="px-4 py-1.5 rounded-full text-sm font-semibold border-2 transition-all"
              style={{
                borderColor: level === l ? module.color : '#e5e7eb',
                background: level === l ? module.color : 'white',
                color: level === l ? 'white' : '#6b7280',
              }}
            >
              Level {l}
            </button>
          ))}
        </div>

        {/* Progress */}
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Question {Math.min(current + 1, TOTAL)} of {TOTAL}</span>
          <span>⭐ {score} correct</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full mb-6 overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${((current) / TOTAL) * 100}%`, background: module.color }}
          />
        </div>

        {phase === 'loading' && (
          <div className="text-center py-16 text-gray-400">
            <div className="text-4xl mb-3">⏳</div>
            <p>Loading question…</p>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-red-500 mb-3">{error}</p>
            <button onClick={fetchQuestion} className="px-4 py-2 rounded-full text-white" style={{ background: module.color }}>
              Try Again
            </button>
          </div>
        )}

        {q && (phase === 'listen' || phase === 'answered') && (
          <div>
            {/* Big listen button */}
            <div className="text-center mb-8">
              <button
                onClick={() => speak(q.phrase, 'es')}
                className="w-28 h-28 rounded-full text-5xl shadow-lg flex items-center justify-center mx-auto transition-transform active:scale-95 hover:scale-105"
                style={{ background: `${module.color}18`, border: `3px solid ${module.color}` }}
              >
                🔊
              </button>
              <p className="text-gray-500 text-sm mt-3">Tap to hear again</p>
              {q.listenFor && (
                <p className="text-xs text-amber-600 mt-1 bg-amber-50 inline-block px-3 py-1 rounded-full">
                  💡 {q.listenFor}
                </p>
              )}
            </div>

            {/* Show translation after answer */}
            {phase === 'answered' && (
              <div className="text-center mb-4 animate-fade-in">
                <p className="text-lg font-semibold text-gray-800">"{q.phrase}"</p>
                <p className="text-gray-500 text-sm">{q.translation}</p>
              </div>
            )}

            {/* Options */}
            <div className="space-y-3">
              {q.options.map((opt, i) => {
                const isCorrect = opt === q.phrase
                const isSelected = opt === selected
                let bg = 'white'
                let border = '#e5e7eb'
                let textColor = '#374151'
                if (phase === 'answered') {
                  if (isCorrect) { bg = '#dcfce7'; border = '#16a34a'; textColor = '#166534' }
                  else if (isSelected) { bg = '#fee2e2'; border = '#dc2626'; textColor = '#991b1b' }
                  else { bg = '#f9fafb'; border = '#e5e7eb'; textColor = '#9ca3af' }
                }
                return (
                  <button
                    key={i}
                    onClick={() => handleSelect(opt)}
                    disabled={phase === 'answered'}
                    className="w-full px-4 py-4 rounded-2xl border-2 text-left font-medium transition-all text-sm leading-relaxed"
                    style={{ background: bg, borderColor: border, color: textColor }}
                  >
                    <span className="text-gray-400 mr-2">{String.fromCharCode(65 + i)}.</span>
                    {opt}
                  </button>
                )
              })}
            </div>

            {phase === 'answered' && (
              <div className="mt-6 text-center">
                <div className={`mb-4 text-lg font-semibold ${selected === q.phrase ? 'text-green-600' : 'text-red-500'}`}>
                  {selected === q.phrase ? '🎉 Correct!' : '❌ Not quite — listen again!'}
                </div>
                <button
                  onClick={handleNext}
                  className="px-8 py-3 rounded-full text-white font-bold text-lg shadow transition-transform active:scale-95"
                  style={{ background: module.color }}
                >
                  {current + 1 >= TOTAL ? 'See Results' : 'Next →'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  )
}
