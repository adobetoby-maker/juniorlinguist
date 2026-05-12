import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import GameShell from '../../components/learn/GameShell'
import ResultScreen from '../../components/learn/ResultScreen'
import { useSpeech } from '../../state/SpeechProvider'
import { KIDS_MODULES } from '../../data/kidsModules'
import { useAppState } from '../../state/AppState'
import { saveMatchResult } from '../../state/progress'

interface Card {
  id: string
  content: string
  lang: 'en' | 'es'
  pairId: string
  matched: boolean
  flipped: boolean
}

type Phase = 'playing' | 'result'

const PAIRS_COUNT = 6

export default function MemoryGame() {
  const { moduleId = 'animals' } = useParams<{ moduleId: string }>()
  const module = KIDS_MODULES.find(m => m.id === moduleId) ?? KIDS_MODULES[0]

  const [cards, setCards] = useState<Card[]>([])
  const [flipped, setFlipped] = useState<string[]>([])
  const [matched, setMatched] = useState(0)
  const [moves, setMoves] = useState(0)
  const [phase, setPhase] = useState<Phase>('playing')
  const [lockBoard, setLockBoard] = useState(false)
  const [shakeIds, setShakeIds] = useState<string[]>([])
  const [elapsed, setElapsed] = useState(0)
  const [timerActive, setTimerActive] = useState(true)

  const { speak } = useSpeech()
  const { dispatch } = useAppState()

  const buildDeck = useCallback(() => {
    const vocab = [...module.vocab].sort(() => Math.random() - 0.5).slice(0, PAIRS_COUNT)
    const cards: Card[] = []
    vocab.forEach((v, i) => {
      cards.push({ id: `en-${i}`, content: v.en, lang: 'en', pairId: String(i), matched: false, flipped: false })
      cards.push({ id: `es-${i}`, content: v.es, lang: 'es', pairId: String(i), matched: false, flipped: false })
    })
    return cards.sort(() => Math.random() - 0.5)
  }, [module.vocab])

  function init() {
    setCards(buildDeck())
    setFlipped([])
    setMatched(0)
    setMoves(0)
    setPhase('playing')
    setLockBoard(false)
    setElapsed(0)
    setTimerActive(true)
  }

  useEffect(() => { init() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!timerActive) return
    const t = setInterval(() => setElapsed(e => e + 1), 1000)
    return () => clearInterval(t)
  }, [timerActive])

  function flipCard(id: string) {
    if (lockBoard) return
    setCards(prev => prev.map(c => c.id === id ? { ...c, flipped: true } : c))
    const newFlipped = [...flipped, id]
    setFlipped(newFlipped)

    if (newFlipped.length === 2) {
      setLockBoard(true)
      setMoves(m => m + 1)
      const [a, b] = newFlipped.map(fid => cards.find(c => c.id === fid)!)
      if (a.pairId === b.pairId) {
        // Match!
        speak(a.lang === 'es' ? a.content : b.content, 'es')
        setTimeout(() => {
          setCards(prev => prev.map(c => newFlipped.includes(c.id) ? { ...c, matched: true, flipped: true } : c))
          setMatched(m => {
            const next = m + 1
            if (next === PAIRS_COUNT) {
              setTimerActive(false)
              const stars = elapsed < 30 ? 3 : elapsed < 60 ? 2 : 1
              saveMatchResult(moduleId, stars)
              dispatch({ type: 'ADD_XP', amount: 15 })
              setTimeout(() => setPhase('result'), 600)
            }
            return next
          })
          setFlipped([])
          setLockBoard(false)
        }, 600)
      } else {
        // No match
        setShakeIds(newFlipped)
        setTimeout(() => {
          setCards(prev => prev.map(c => newFlipped.includes(c.id) ? { ...c, flipped: false } : c))
          setFlipped([])
          setShakeIds([])
          setLockBoard(false)
        }, 900)
      }
    }
  }

  const stars = elapsed < 30 ? 3 : elapsed < 60 ? 2 : 1
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  if (phase === 'result') {
    return (
      <GameShell title="Memory Match" moduleId={moduleId}>
        <ResultScreen
          stars={stars}
          subline={`All ${PAIRS_COUNT} pairs matched!`}
          moduleId={moduleId}
          color={module.color}
          onPlayAgain={init}
        />
      </GameShell>
    )
  }

  return (
    <GameShell title="Memory Match" moduleId={moduleId}>
      <div className="max-w-lg mx-auto px-4 pb-10">

        {/* Stats bar */}
        <div className="flex justify-between items-center mb-4 text-sm text-gray-500">
          <span>⏱ {fmt(elapsed)}</span>
          <span>✅ {matched} / {PAIRS_COUNT}</span>
          <span>🔄 {moves} moves</span>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-gray-100 rounded-full mb-6 overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${(matched / PAIRS_COUNT) * 100}%`, background: module.color }}
          />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-4 gap-2">
          {cards.map(card => {
            const isFlipped = card.flipped || card.matched
            const isShaking = shakeIds.includes(card.id)
            return (
              <button
                key={card.id}
                onClick={() => !isFlipped && flipCard(card.id)}
                disabled={isFlipped && !card.matched}
                className={`aspect-square rounded-2xl text-xs font-semibold leading-tight p-1 transition-all duration-300 ${isShaking ? 'shake' : ''}`}
                style={{
                  background: card.matched
                    ? `${module.color}22`
                    : isFlipped
                    ? card.lang === 'es' ? module.color : 'white'
                    : '#f3f4f6',
                  border: `2px solid ${card.matched ? module.color : isFlipped ? (card.lang === 'es' ? module.color : '#e5e7eb') : '#e5e7eb'}`,
                  color: card.matched
                    ? module.color
                    : isFlipped
                    ? card.lang === 'es' ? 'white' : '#374151'
                    : 'transparent',
                  transform: isFlipped ? 'rotateY(0deg)' : 'rotateY(90deg)',
                  cursor: card.matched ? 'default' : isFlipped ? 'default' : 'pointer',
                }}
              >
                {isFlipped ? card.content : '?'}
              </button>
            )
          })}
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Match each English word to its Spanish translation
        </p>
      </div>
    </GameShell>
  )
}
