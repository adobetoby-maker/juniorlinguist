import { useState } from 'react'
import { useParams } from 'react-router-dom'
import GameShell from '../../components/learn/GameShell'
import { KIDS_MODULES } from '../../data/kidsModules'
import { useAppState } from '../../state/AppState'

interface PatternExample { en: string; es: string }
interface QuizItem { q: string; a: string; choices: string[] }

interface Pattern {
  id: string; color: string; emoji: string
  en: string; es: string; rule: string
  examples: PatternExample[]
  quiz: QuizItem[]
}

const PATTERNS: Pattern[] = [
  {
    id: 'tion', color: '#6366f1', emoji: '📝',
    en: '-tion', es: '-ción',
    rule: 'Almost every English word ending in "-tion" ends in "-ción" in Spanish!',
    examples: [
      { en: 'action', es: 'acción' },
      { en: 'education', es: 'educación' },
      { en: 'nation', es: 'nación' },
      { en: 'direction', es: 'dirección' },
    ],
    quiz: [
      { q: '"construction" in Spanish?', a: 'construcción', choices: ['construcción', 'constructión', 'construcible', 'constructo'] },
      { q: '"conversation" in Spanish?', a: 'conversación', choices: ['conversación', 'conversa', 'conversión', 'conversionable'] },
      { q: '"population" in Spanish?', a: 'población', choices: ['población', 'populación', 'populacidad', 'pobladón'] },
    ],
  },
  {
    id: 'ity', color: '#0891b2', emoji: '⚡',
    en: '-ity', es: '-idad',
    rule: 'English words ending in "-ity" end in "-idad" in Spanish!',
    examples: [
      { en: 'electricity', es: 'electricidad' },
      { en: 'university', es: 'universidad' },
      { en: 'community', es: 'comunidad' },
      { en: 'activity', es: 'actividad' },
    ],
    quiz: [
      { q: '"possibility" in Spanish?', a: 'posibilidad', choices: ['posibilidad', 'possibilidad', 'posiblidación', 'posibleidad'] },
      { q: '"reality" in Spanish?', a: 'realidad', choices: ['realidad', 'realción', 'realicion', 'reales'] },
      { q: '"security" in Spanish?', a: 'seguridad', choices: ['seguridad', 'securidad', 'seguración', 'secureidad'] },
    ],
  },
  {
    id: 'al', color: '#059669', emoji: '🤝',
    en: '-al', es: '-al',
    rule: 'Great news! Hundreds of "-al" words are the SAME in both languages!',
    examples: [
      { en: 'final', es: 'final' },
      { en: 'natural', es: 'natural' },
      { en: 'animal', es: 'animal' },
      { en: 'hospital', es: 'hospital' },
    ],
    quiz: [
      { q: '"musical" in Spanish?', a: 'musical', choices: ['musical', 'músicale', 'musica', 'musición'] },
      { q: '"original" in Spanish?', a: 'original', choices: ['original', 'oríginal', 'originals', 'orijinal'] },
      { q: '"principal" in Spanish?', a: 'principal', choices: ['principal', 'principali', 'principales', 'principál'] },
    ],
  },
  {
    id: 'ous', color: '#dc2626', emoji: '✨',
    en: '-ous', es: '-oso/a',
    rule: 'English "-ous" becomes "-oso" (boys/things) or "-osa" (girls) in Spanish!',
    examples: [
      { en: 'famous', es: 'famoso' },
      { en: 'curious', es: 'curioso' },
      { en: 'delicious', es: 'delicioso' },
      { en: 'nervous', es: 'nervioso' },
    ],
    quiz: [
      { q: '"furious" in Spanish?', a: 'furioso', choices: ['furioso', 'furiable', 'furiar', 'furiación'] },
      { q: '"mysterious" in Spanish?', a: 'misterioso', choices: ['misterioso', 'misternable', 'misterción', 'mysterable'] },
      { q: '"glorious" in Spanish?', a: 'glorioso', choices: ['glorioso', 'gloriable', 'gloriar', 'gloriación'] },
    ],
  },
  {
    id: 'ist', color: '#7c3aed', emoji: '👩‍🎨',
    en: '-ist', es: '-ista',
    rule: 'Jobs ending in "-ist" become "-ista" in Spanish — same word for men and women!',
    examples: [
      { en: 'artist', es: 'artista' },
      { en: 'dentist', es: 'dentista' },
      { en: 'pianist', es: 'pianista' },
      { en: 'cyclist', es: 'ciclista' },
    ],
    quiz: [
      { q: '"optimist" in Spanish?', a: 'optimista', choices: ['optimista', 'optimismo', 'optime', 'optimable'] },
      { q: '"realist" in Spanish?', a: 'realista', choices: ['realista', 'realismo', 'reale', 'realable'] },
      { q: '"specialist" in Spanish?', a: 'especialista', choices: ['especialista', 'specialista', 'especialismo', 'speciale'] },
    ],
  },
]

type Phase = 'learn' | 'quiz'

interface AnswerState { chosen: string | null; correct: boolean }

export default function CognateBooster() {
  const { moduleId = 'animals' } = useParams<{ moduleId: string }>()
  const module = KIDS_MODULES.find(m => m.id === moduleId) ?? KIDS_MODULES[0]
  const { dispatch } = useAppState()

  const [patternIdx, setPatternIdx] = useState(0)
  const [phase, setPhase] = useState<Phase>('learn')
  const [qIdx, setQIdx] = useState(0)
  const [answers, setAnswers] = useState<AnswerState[]>([])
  const [done, setDone] = useState(false)
  const [totalCorrect, setTotalCorrect] = useState(0)

  const pat = PATTERNS[patternIdx]

  function chooseAnswer(choice: string) {
    if (answers[qIdx]?.chosen) return
    const correct = choice === pat.quiz[qIdx].a
    const newAns: AnswerState = { chosen: choice, correct }
    setAnswers(prev => { const a = [...prev]; a[qIdx] = newAns; return a })
    if (correct) {
      dispatch({ type: 'ADD_XP', amount: 8 })
      setTotalCorrect(c => c + 1)
    }
  }

  function nextQuestion() {
    if (qIdx < pat.quiz.length - 1) {
      setQIdx(qIdx + 1)
    } else {
      // Move to next pattern or finish
      if (patternIdx < PATTERNS.length - 1) {
        setPatternIdx(patternIdx + 1)
        setPhase('learn')
        setQIdx(0)
        setAnswers([])
      } else {
        setDone(true)
      }
    }
  }

  function startQuiz() {
    setPhase('quiz')
    setQIdx(0)
    setAnswers([])
  }

  // ── DONE SCREEN ──────────────────────────────────────────────────────────
  if (done) {
    const totalQ = PATTERNS.reduce((s, p) => s + p.quiz.length, 0)
    return (
      <GameShell title="Cognate Patterns" moduleId={moduleId}>
        <div className="max-w-md mx-auto px-4 pb-12 text-center">
          <div className="text-6xl mb-4 mt-8">🎉</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Pattern Master!</h2>
          <p className="text-gray-500 mb-6">
            You scored <span className="font-bold text-gray-800">{totalCorrect}/{totalQ}</span> — you now know 5 patterns that unlock hundreds of Spanish words!
          </p>
          <div className="grid grid-cols-5 gap-2 mb-8">
            {PATTERNS.map(p => (
              <div key={p.id} className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{ background: `${p.color}18` }}>
                  {p.emoji}
                </div>
                <span className="text-xs font-bold" style={{ color: p.color }}>{p.en}</span>
                <span className="text-xs text-gray-400">{p.es}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => { setPatternIdx(0); setPhase('learn'); setQIdx(0); setAnswers([]); setDone(false); setTotalCorrect(0) }}
            className="px-8 py-3 rounded-2xl font-bold text-white text-base"
            style={{ background: module.color }}
          >
            Practice Again
          </button>
        </div>
      </GameShell>
    )
  }

  const currentQ = pat.quiz[qIdx]
  const currentAns = answers[qIdx] ?? null

  return (
    <GameShell title="Cognate Patterns" moduleId={moduleId}>
      <div className="max-w-lg mx-auto px-4 pb-12">

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {PATTERNS.map((p, i) => (
            <div
              key={p.id}
              className="transition-all duration-300"
              style={{
                width: i === patternIdx ? 24 : 8,
                height: 8,
                borderRadius: 4,
                background: i < patternIdx ? p.color : i === patternIdx ? pat.color : '#e5e7eb',
              }}
            />
          ))}
        </div>

        {/* ── LEARN PHASE ── */}
        {phase === 'learn' && (
          <>
            {/* Pattern header */}
            <div
              className="rounded-3xl p-5 mb-5 text-center"
              style={{ background: `linear-gradient(135deg, ${pat.color}18, ${pat.color}08)`, border: `2px solid ${pat.color}30` }}
            >
              <div className="text-4xl mb-3">{pat.emoji}</div>
              <div className="flex items-center justify-center gap-3 mb-3">
                <span className="text-xl font-bold text-gray-500 bg-white rounded-xl px-3 py-1 shadow-sm">{pat.en}</span>
                <span className="text-2xl text-gray-400">→</span>
                <span className="text-xl font-bold rounded-xl px-3 py-1 shadow-sm text-white" style={{ background: pat.color }}>{pat.es}</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{pat.rule}</p>
            </div>

            {/* Examples table */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm mb-5" style={{ border: `1.5px solid ${pat.color}20` }}>
              <div className="grid grid-cols-2 text-xs font-bold uppercase tracking-widest text-gray-400 px-4 py-2.5" style={{ background: `${pat.color}10`, borderBottom: `1px solid ${pat.color}20` }}>
                <span>🇺🇸 English</span>
                <span>🇲🇽 Spanish</span>
              </div>
              {pat.examples.map((ex, i) => (
                <div
                  key={i}
                  className="grid grid-cols-2 px-4 py-3 items-center"
                  style={{ borderBottom: i < pat.examples.length - 1 ? '1px solid #f3f4f6' : 'none' }}
                >
                  <p className="text-sm font-semibold text-gray-700">{ex.en}</p>
                  <p className="text-sm font-bold" style={{ color: pat.color }}>{ex.es}</p>
                </div>
              ))}
            </div>

            <button
              onClick={startQuiz}
              className="w-full py-3.5 rounded-2xl font-bold text-white text-base flex items-center justify-center gap-2"
              style={{ background: pat.color }}
            >
              Practice This Pattern! →
            </button>
          </>
        )}

        {/* ── QUIZ PHASE ── */}
        {phase === 'quiz' && (
          <>
            {/* Question header */}
            <div className="text-center mb-6">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                Pattern {patternIdx + 1}/{PATTERNS.length} · Question {qIdx + 1}/{pat.quiz.length}
              </p>
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold text-white mb-4"
                style={{ background: pat.color }}
              >
                <span>{pat.en}</span>
                <span className="opacity-70">→</span>
                <span>{pat.es}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800">{currentQ.q}</h3>
            </div>

            {/* Choices */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {currentQ.choices.map((c, i) => {
                const chosen = currentAns?.chosen === c
                const isCorrect = c === currentQ.a
                let bg = 'white'
                let border = '#e5e7eb'
                let textColor = '#374151'
                if (currentAns) {
                  if (isCorrect) { bg = '#D1FAE5'; border = '#34D399'; textColor = '#065F46' }
                  else if (chosen) { bg = '#FEE2E2'; border = '#F87171'; textColor = '#991B1B' }
                }
                return (
                  <button
                    key={i}
                    onClick={() => chooseAnswer(c)}
                    className="py-3 px-4 rounded-2xl text-sm font-semibold transition-all text-left border-2"
                    style={{ background: bg, borderColor: border, color: textColor }}
                    disabled={!!currentAns?.chosen}
                  >
                    {isCorrect && currentAns ? '✓ ' : ''}{c}
                  </button>
                )
              })}
            </div>

            {/* Feedback */}
            {currentAns && (
              <div
                className="rounded-2xl px-4 py-3 mb-5 text-sm"
                style={{
                  background: currentAns.correct ? '#D1FAE520' : '#FEE2E220',
                  border: `1.5px solid ${currentAns.correct ? '#34D399' : '#F87171'}`,
                }}
              >
                {currentAns.correct ? (
                  <p className="font-semibold text-green-700">
                    ✅ Yes! The -{pat.en.replace('-', '')} ending → -{pat.es.replace('-', '')} +8 XP
                  </p>
                ) : (
                  <p className="font-semibold text-red-700">
                    The correct answer is <span className="font-bold">{currentQ.a}</span> — remember: {pat.en} → {pat.es}
                  </p>
                )}
              </div>
            )}

            {currentAns && (
              <button
                onClick={nextQuestion}
                className="w-full py-3.5 rounded-2xl font-bold text-white text-base"
                style={{ background: pat.color }}
              >
                {patternIdx < PATTERNS.length - 1 || qIdx < pat.quiz.length - 1 ? 'Next →' : 'See Results 🎉'}
              </button>
            )}
          </>
        )}
      </div>
    </GameShell>
  )
}
