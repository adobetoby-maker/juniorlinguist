import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import GameShell from '../../components/learn/GameShell'
import ResultScreen from '../../components/learn/ResultScreen'
import { useSpeech } from '../../state/SpeechProvider'
import { KIDS_MODULES } from '../../data/kidsModules'
import { useAppState } from '../../state/AppState'
import { saveQuizResult } from '../../state/progress'

interface SBQuestion {
  sentence: string
  translation: string
  tokens: string[]
}

type Phase = 'loading' | 'building' | 'checking' | 'result'

const TOTAL = 5

export default function SentenceBuild() {
  const { moduleId = 'animals' } = useParams<{ moduleId: string }>()
  const module = KIDS_MODULES.find(m => m.id === moduleId) ?? KIDS_MODULES[0]

  const [level, setLevel] = useState(1)
  const [phase, setPhase] = useState<Phase>('loading')
  const [questions, setQuestions] = useState<SBQuestion[]>([])
  const [current, setCurrent] = useState(0)
  const [tray, setTray] = useState<string[]>([])      // words placed in order by user
  const [bank, setBank] = useState<string[]>([])      // remaining shuffled tokens
  const [score, setScore] = useState(0)
  const [shake, setShake] = useState(false)
  const [avoided, setAvoided] = useState<string[]>([])
  const [error, setError] = useState('')

  const { speak } = useSpeech()
  const { dispatch } = useAppState()

  const fetchQuestion = useCallback(async () => {
    setPhase('loading')
    setError('')
    try {
      const res = await fetch('/api/sentence-build', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moduleId, level, avoid: avoided }),
      })
      const data = await res.json()
      if (data.sentence && data.tokens) {
        setQuestions(prev => [...prev, data])
        setAvoided(prev => [...prev, data.sentence].slice(-10))
        setBank(data.tokens)
        setTray([])
        setPhase('building')
      } else {
        setError('Could not load question.')
        setPhase('building')
      }
    } catch {
      setError('No connection. Try again.')
      setPhase('building')
    }
  }, [moduleId, level, avoided])

  useEffect(() => {
    if (questions.length === 0) fetchQuestion()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function pickToken(token: string, bankIdx: number) {
    setTray(t => [...t, token])
    setBank(b => b.filter((_, i) => i !== bankIdx))
  }

  function removeToken(trayIdx: number) {
    const token = tray[trayIdx]
    setTray(t => t.filter((_, i) => i !== trayIdx))
    setBank(b => [...b, token])
  }

  function handleCheck() {
    const q = questions[current]
    const correct = q.sentence.trim().toLowerCase()
    const attempt = tray.join(' ').trim().toLowerCase()
    if (attempt === correct) {
      setScore(s => s + 1)
      dispatch({ type: 'ADD_XP', amount: 10 })
      speak(correct, 'es')
      setPhase('checking')
    } else {
      setShake(true)
      setTimeout(() => setShake(false), 600)
    }
  }

  function handleNext() {
    if (current + 1 >= TOTAL) {
      const stars = score >= TOTAL ? 3 : score >= Math.ceil(TOTAL * 0.6) ? 2 : 1
      saveQuizResult(moduleId, score, stars)
      setPhase('result')
    } else {
      setCurrent(c => c + 1)
      setPhase('loading')
      if (questions[current + 1]) {
        const q = questions[current + 1]
        setBank(q.tokens)
        setTray([])
        setPhase('building')
      } else {
        fetchQuestion()
      }
    }
  }

  function handleReplay() {
    setQuestions([])
    setCurrent(0)
    setBank([])
    setTray([])
    setScore(0)
    setPhase('loading')
    fetchQuestion()
  }

  if (phase === 'result') {
    const stars = score >= TOTAL ? 3 : score >= Math.ceil(TOTAL * 0.6) ? 2 : 1
    return (
      <GameShell title="Sentence Builder" moduleId={moduleId}>
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
    <GameShell title="Sentence Builder" moduleId={moduleId}>
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
          <span>✅ {score} correct</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full mb-6 overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${(current / TOTAL) * 100}%`, background: module.color }}
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

        {q && (phase === 'building' || phase === 'checking') && (
          <div>
            {/* Translation hint */}
            <div
              className="rounded-2xl px-4 py-3 mb-6 text-center"
              style={{ background: `${module.color}12` }}
            >
              <p className="text-xs text-gray-500 mb-0.5">Arrange the Spanish words to say:</p>
              <p className="text-gray-800 font-semibold">{q.translation}</p>
            </div>

            {/* Answer tray */}
            <div
              className={`min-h-16 rounded-2xl border-2 p-3 mb-4 flex flex-wrap gap-2 items-start transition-all ${shake ? 'shake' : ''}`}
              style={{ borderColor: phase === 'checking' ? '#16a34a' : module.color, borderStyle: 'dashed' }}
            >
              {tray.length === 0 && (
                <p className="text-gray-400 text-sm self-center w-full text-center">Tap words below to build your sentence</p>
              )}
              {tray.map((token, i) => (
                <button
                  key={i}
                  onClick={() => phase === 'building' && removeToken(i)}
                  disabled={phase === 'checking'}
                  className="px-3 py-2 rounded-xl text-sm font-semibold text-white shadow-sm transition-transform active:scale-95"
                  style={{ background: module.color }}
                >
                  {token}
                </button>
              ))}
            </div>

            {/* Correct sentence reveal */}
            {phase === 'checking' && (
              <div className="bg-green-50 border-2 border-green-400 rounded-2xl px-4 py-3 mb-4 text-center">
                <p className="text-green-700 font-bold text-lg">🎉 ¡Perfecto!</p>
                <p className="text-green-800 text-sm mt-1">"{q.sentence}"</p>
              </div>
            )}

            {/* Token bank */}
            {phase === 'building' && (
              <div className="flex flex-wrap gap-2 mb-6 justify-center">
                {bank.map((token, i) => (
                  <button
                    key={i}
                    onClick={() => pickToken(token, i)}
                    className="px-3 py-2 rounded-xl text-sm font-semibold border-2 bg-white transition-transform active:scale-95 hover:shadow"
                    style={{ borderColor: module.color, color: module.color }}
                  >
                    {token}
                  </button>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-center gap-3">
              {phase === 'building' && (
                <>
                  <button
                    onClick={() => { setTray([]); setBank(q.tokens) }}
                    className="px-4 py-2.5 rounded-full border-2 border-gray-200 text-gray-600 font-semibold text-sm"
                  >
                    Reset
                  </button>
                  <button
                    onClick={handleCheck}
                    disabled={tray.length === 0}
                    className="px-8 py-2.5 rounded-full text-white font-bold text-sm shadow disabled:opacity-40 transition-transform active:scale-95"
                    style={{ background: module.color }}
                  >
                    Check ✓
                  </button>
                </>
              )}
              {phase === 'checking' && (
                <button
                  onClick={handleNext}
                  className="px-8 py-3 rounded-full text-white font-bold text-lg shadow transition-transform active:scale-95"
                  style={{ background: module.color }}
                >
                  {current + 1 >= TOTAL ? 'See Results' : 'Next →'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </GameShell>
  )
}
