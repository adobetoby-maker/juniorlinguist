import { useState } from 'react'
import { useParams } from 'react-router-dom'
import GameShell from '../../components/learn/GameShell'
import { KIDS_MODULES } from '../../data/kidsModules'
import { useAppState } from '../../state/AppState'
import { useSpeech } from '../../state/SpeechProvider'

// ── Data ──────────────────────────────────────────────────────────────────────

interface SoundRule {
  id: string
  title: string
  symbol: string    // the letter(s)
  sound: string     // how it sounds in English
  tip: string
  color: string
  examples: { word: string; phonetic: string; meaning: string }[]
}

const VOWELS: SoundRule[] = [
  {
    id: 'a', title: 'The letter A', symbol: 'A', sound: '"ah"',
    tip: 'Always sounds like "ah" — like saying "ahh" at the doctor!',
    color: '#ef4444',
    examples: [
      { word: 'mamá', phonetic: 'mah-MAH', meaning: 'mom' },
      { word: 'casa', phonetic: 'KAH-sah', meaning: 'house' },
      { word: 'agua', phonetic: 'AH-gwah', meaning: 'water' },
    ],
  },
  {
    id: 'e', title: 'The letter E', symbol: 'E', sound: '"eh"',
    tip: 'Always sounds like "eh" — like the start of "egg"!',
    color: '#f97316',
    examples: [
      { word: 'mesa', phonetic: 'MEH-sah', meaning: 'table' },
      { word: 'leche', phonetic: 'LEH-cheh', meaning: 'milk' },
      { word: 'verde', phonetic: 'BEHR-deh', meaning: 'green' },
    ],
  },
  {
    id: 'i', title: 'The letter I', symbol: 'I', sound: '"ee"',
    tip: 'Always sounds like "ee" — like in "feet"!',
    color: '#eab308',
    examples: [
      { word: 'libro', phonetic: 'LEE-broh', meaning: 'book' },
      { word: 'niño', phonetic: 'NEE-nyoh', meaning: 'boy' },
      { word: 'tigre', phonetic: 'TEE-greh', meaning: 'tiger' },
    ],
  },
  {
    id: 'o', title: 'The letter O', symbol: 'O', sound: '"oh"',
    tip: 'Always sounds like "oh" — like in "go"!',
    color: '#22c55e',
    examples: [
      { word: 'lobo', phonetic: 'LOH-boh', meaning: 'wolf' },
      { word: 'rojo', phonetic: 'ROH-hoh', meaning: 'red' },
      { word: 'foto', phonetic: 'FOH-toh', meaning: 'photo' },
    ],
  },
  {
    id: 'u', title: 'The letter U', symbol: 'U', sound: '"oo"',
    tip: 'Always sounds like "oo" — like in "moon"!',
    color: '#3b82f6',
    examples: [
      { word: 'uva', phonetic: 'OO-bah', meaning: 'grape' },
      { word: 'luna', phonetic: 'LOO-nah', meaning: 'moon' },
      { word: 'gusto', phonetic: 'GOOS-toh', meaning: 'pleasure' },
    ],
  },
]

const CONSONANT_TRICKS: SoundRule[] = [
  {
    id: 'h', title: 'H is always silent', symbol: 'H', sound: '(silent!)',
    tip: 'In Spanish, H is ALWAYS silent. Never say it!',
    color: '#8b5cf6',
    examples: [
      { word: 'hola', phonetic: 'OH-lah', meaning: 'hello' },
      { word: 'hora', phonetic: 'OH-rah', meaning: 'hour' },
      { word: 'hermano', phonetic: 'ehr-MAH-noh', meaning: 'brother' },
    ],
  },
  {
    id: 'j', title: 'J sounds like H', symbol: 'J', sound: '"h"',
    tip: 'Spanish J sounds like a breathy English H. Say "hota" not "jota"!',
    color: '#06b6d4',
    examples: [
      { word: 'jamón', phonetic: 'hah-MON', meaning: 'ham' },
      { word: 'jugo', phonetic: 'HOO-goh', meaning: 'juice' },
      { word: 'jardín', phonetic: 'har-DEEN', meaning: 'garden' },
    ],
  },
  {
    id: 'n', title: 'Ñ sounds like NY', symbol: 'Ñ', sound: '"ny"',
    tip: 'Ñ is its own letter! It sounds like the NY in "canyon".',
    color: '#ec4899',
    examples: [
      { word: 'niño', phonetic: 'NEE-nyoh', meaning: 'boy' },
      { word: 'año', phonetic: 'AH-nyoh', meaning: 'year' },
      { word: 'mañana', phonetic: 'mah-NYAH-nah', meaning: 'tomorrow' },
    ],
  },
  {
    id: 'll', title: 'LL sounds like Y', symbol: 'LL', sound: '"y"',
    tip: 'In most Spanish, LL sounds like the English Y in "yes"!',
    color: '#f59e0b',
    examples: [
      { word: 'llama', phonetic: 'YAH-mah', meaning: 'llama / flame' },
      { word: 'pollo', phonetic: 'POH-yoh', meaning: 'chicken' },
      { word: 'calle', phonetic: 'KAH-yeh', meaning: 'street' },
    ],
  },
  {
    id: 'rr', title: 'RR is trilled', symbol: 'RR', sound: 'trilled r',
    tip: 'RR is a trilled R — vibrate your tongue behind your upper teeth!',
    color: '#10b981',
    examples: [
      { word: 'perro', phonetic: 'PEH-rroh', meaning: 'dog' },
      { word: 'arroz', phonetic: 'ah-RROS', meaning: 'rice' },
      { word: 'carro', phonetic: 'KAH-rroh', meaning: 'car' },
    ],
  },
]

interface QuizQ {
  word: string
  correct: string
  choices: string[]
  meaning: string
}

const QUIZ_QUESTIONS: QuizQ[] = [
  { word: 'hola', correct: 'OH-lah', choices: ['OH-lah', 'HOH-lah', 'hoh-LAH', 'HOH-LAH'], meaning: 'hello' },
  { word: 'leche', correct: 'LEH-cheh', choices: ['LEH-cheh', 'LEE-sheh', 'LAY-chay', 'LEH-chay'], meaning: 'milk' },
  { word: 'niño', correct: 'NEE-nyoh', choices: ['NEE-nyoh', 'NEE-noh', 'NI-nyoh', 'NYE-noh'], meaning: 'boy' },
  { word: 'pollo', correct: 'POH-yoh', choices: ['POH-yoh', 'POH-lyoh', 'POL-loh', 'POH-loh'], meaning: 'chicken' },
  { word: 'jamón', correct: 'hah-MON', choices: ['hah-MON', 'jah-MON', 'yah-MON', 'hah-mon'], meaning: 'ham' },
  { word: 'perro', correct: 'PEH-rroh', choices: ['PEH-rroh', 'PEH-roh', 'peh-ROH', 'PE-rroh'], meaning: 'dog' },
  { word: 'agua', correct: 'AH-gwah', choices: ['AH-gwah', 'AY-gwah', 'AH-wah', 'AH-gwha'], meaning: 'water' },
  { word: 'mañana', correct: 'mah-NYAH-nah', choices: ['mah-NYAH-nah', 'mah-NAH-nah', 'man-YAH-nah', 'mah-nah-NAH'], meaning: 'tomorrow' },
]

// ── Component ─────────────────────────────────────────────────────────────────

type Section = 'menu' | 'vowels' | 'tricks' | 'quiz'

export default function PronunciationCoach() {
  const { moduleId = 'animals' } = useParams<{ moduleId: string }>()
  const module = KIDS_MODULES.find(m => m.id === moduleId) ?? KIDS_MODULES[0]
  const { dispatch } = useAppState()
  const { speak } = useSpeech()

  const [section, setSection] = useState<Section>('menu')
  const [ruleIdx, setRuleIdx] = useState(0)
  const [qIdx, setQIdx] = useState(0)
  const [chosen, setChosen] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [quizDone, setQuizDone] = useState(false)

  const rules = section === 'vowels' ? VOWELS : CONSONANT_TRICKS
  const currentRule = rules[ruleIdx]

  function pickAnswer(c: string) {
    if (chosen) return
    setChosen(c)
    const correct = c === QUIZ_QUESTIONS[qIdx].correct
    if (correct) {
      dispatch({ type: 'ADD_XP', amount: 5 })
      setScore(s => s + 1)
    }
  }

  function nextQuizQ() {
    if (qIdx < QUIZ_QUESTIONS.length - 1) {
      setQIdx(qIdx + 1)
      setChosen(null)
    } else {
      setQuizDone(true)
    }
  }

  // ── MENU ──────────────────────────────────────────────────────────────────
  if (section === 'menu') {
    return (
      <GameShell title="Pronunciation Coach" moduleId={moduleId}>
        <div className="max-w-md mx-auto px-4 pb-12">
          <div className="text-center mb-8 mt-2">
            <div className="text-5xl mb-3">🗣️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Sound Like a Native!</h2>
            <p className="text-sm text-gray-500">Spanish sounds are consistent — once you know the rules, you can read anything!</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => { setSection('vowels'); setRuleIdx(0) }}
              className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow transition-shadow text-left"
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: '#ef444420' }}>🔡</div>
              <div>
                <p className="font-bold text-gray-800">The 5 Vowel Sounds</p>
                <p className="text-xs text-gray-500">A E I O U — always the same!</p>
              </div>
              <span className="ml-auto text-gray-400 text-sm">→</span>
            </button>

            <button
              onClick={() => { setSection('tricks'); setRuleIdx(0) }}
              className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow transition-shadow text-left"
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: '#8b5cf620' }}>🔮</div>
              <div>
                <p className="font-bold text-gray-800">Tricky Consonants</p>
                <p className="text-xs text-gray-500">H, J, Ñ, LL, RR — learn the surprises</p>
              </div>
              <span className="ml-auto text-gray-400 text-sm">→</span>
            </button>

            <button
              onClick={() => { setSection('quiz'); setQIdx(0); setChosen(null); setScore(0); setQuizDone(false) }}
              className="w-full rounded-2xl p-4 flex items-center gap-4 text-left text-white"
              style={{ background: module.color }}
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 bg-white/20">🎯</div>
              <div>
                <p className="font-bold">Pronunciation Quiz</p>
                <p className="text-xs opacity-80">8 questions — match the sound!</p>
              </div>
              <span className="ml-auto text-sm opacity-80">→</span>
            </button>
          </div>
        </div>
      </GameShell>
    )
  }

  // ── QUIZ ──────────────────────────────────────────────────────────────────
  if (section === 'quiz') {
    if (quizDone) {
      return (
        <GameShell title="Pronunciation Coach" moduleId={moduleId}>
          <div className="max-w-md mx-auto px-4 pb-12 text-center mt-8">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Nice work!</h2>
            <p className="text-gray-500 mb-6">
              You got <span className="font-bold text-gray-800">{score}/{QUIZ_QUESTIONS.length}</span> correct!
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => { setSection('quiz'); setQIdx(0); setChosen(null); setScore(0); setQuizDone(false) }}
                className="px-6 py-3 rounded-2xl border-2 border-gray-200 font-bold text-gray-700"
              >
                Try Again
              </button>
              <button
                onClick={() => setSection('menu')}
                className="px-6 py-3 rounded-2xl font-bold text-white"
                style={{ background: module.color }}
              >
                ← Menu
              </button>
            </div>
          </div>
        </GameShell>
      )
    }

    const q = QUIZ_QUESTIONS[qIdx]
    return (
      <GameShell title="Pronunciation Quiz" moduleId={moduleId}>
        <div className="max-w-md mx-auto px-4 pb-12">
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Question {qIdx + 1}/{QUIZ_QUESTIONS.length}</p>
            <p className="text-xs font-bold text-gray-400">{score} correct</p>
          </div>

          <div className="text-center mb-8">
            <div
              className="inline-block px-8 py-4 rounded-3xl mb-4"
              style={{ background: `${module.color}15`, border: `2px solid ${module.color}30` }}
            >
              <p className="text-4xl font-bold text-gray-800" style={{ letterSpacing: '0.05em' }}>{q.word}</p>
              <p className="text-sm text-gray-500 mt-1">{q.meaning}</p>
            </div>
            <p className="text-sm font-semibold text-gray-600">How do you pronounce this?</p>
            <button
              onClick={() => speak(q.word, 'es')}
              className="mt-2 px-4 py-1.5 rounded-full text-xs font-bold border"
              style={{ borderColor: module.color, color: module.color }}
            >
              🔊 Hear it
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {q.choices.map((c, i) => {
              const isChosen = chosen === c
              const isCorrect = c === q.correct
              let style = { background: 'white', borderColor: '#e5e7eb', color: '#374151' }
              if (chosen) {
                if (isCorrect) style = { background: '#D1FAE5', borderColor: '#34D399', color: '#065F46' }
                else if (isChosen) style = { background: '#FEE2E2', borderColor: '#F87171', color: '#991B1B' }
              }
              return (
                <button
                  key={i}
                  onClick={() => pickAnswer(c)}
                  disabled={!!chosen}
                  className="py-3 px-3 rounded-2xl text-sm font-mono font-bold border-2 transition-all"
                  style={style}
                >
                  {c}
                </button>
              )
            })}
          </div>

          {chosen && (
            <div className="mb-5">
              <div
                className="rounded-2xl px-4 py-3 text-sm mb-3"
                style={{
                  background: chosen === q.correct ? '#D1FAE520' : '#FEE2E220',
                  border: `1.5px solid ${chosen === q.correct ? '#34D399' : '#F87171'}`,
                }}
              >
                {chosen === q.correct
                  ? <p className="font-semibold text-green-700">✅ Perfect! +5 XP</p>
                  : <p className="font-semibold text-red-700">The right pronunciation is <span className="font-mono font-bold">{q.correct}</span></p>}
              </div>
              <button
                onClick={nextQuizQ}
                className="w-full py-3 rounded-2xl font-bold text-white"
                style={{ background: module.color }}
              >
                {qIdx < QUIZ_QUESTIONS.length - 1 ? 'Next →' : 'See Results 🎉'}
              </button>
            </div>
          )}
        </div>
      </GameShell>
    )
  }

  // ── LESSON (vowels or tricks) ──────────────────────────────────────────────
  return (
    <GameShell title={section === 'vowels' ? 'Vowel Sounds' : 'Tricky Consonants'} moduleId={moduleId}>
      <div className="max-w-md mx-auto px-4 pb-12">

        {/* Rule dots */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {rules.map((r, i) => (
            <button
              key={r.id}
              onClick={() => setRuleIdx(i)}
              className="transition-all duration-300 rounded-full"
              style={{
                width: i === ruleIdx ? 28 : 10,
                height: 10,
                background: i <= ruleIdx ? currentRule.color : '#e5e7eb',
              }}
            />
          ))}
        </div>

        {/* Rule card */}
        <div
          className="rounded-3xl p-6 mb-5 text-center"
          style={{ background: `linear-gradient(135deg, ${currentRule.color}18, ${currentRule.color}08)`, border: `2px solid ${currentRule.color}30` }}
        >
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl font-black mx-auto mb-4 text-white shadow-lg"
            style={{ background: currentRule.color }}
          >
            {currentRule.symbol}
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-1">{currentRule.title}</h2>
          <p className="text-2xl font-bold mb-3" style={{ color: currentRule.color }}>sounds like {currentRule.sound}</p>
          <p className="text-sm text-gray-600 leading-relaxed">{currentRule.tip}</p>
        </div>

        {/* Examples */}
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 px-1">Examples</p>
        <div className="space-y-2 mb-6">
          {currentRule.examples.map((ex, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl px-4 py-3 flex items-center gap-3 shadow-sm border border-gray-100"
            >
              <button
                onClick={() => speak(ex.word, 'es')}
                className="w-9 h-9 rounded-full flex items-center justify-center text-base flex-shrink-0 transition-colors hover:bg-gray-100"
                style={{ color: currentRule.color }}
              >
                🔊
              </button>
              <div className="flex-1">
                <span className="font-bold text-gray-800 text-base">{ex.word}</span>
                <span className="text-xs text-gray-400 ml-2">{ex.meaning}</span>
              </div>
              <span className="text-xs font-mono font-bold" style={{ color: currentRule.color }}>{ex.phonetic}</span>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          {ruleIdx > 0 && (
            <button
              onClick={() => setRuleIdx(ruleIdx - 1)}
              className="px-5 py-3 rounded-2xl border-2 border-gray-200 font-bold text-gray-600"
            >
              ← Back
            </button>
          )}
          {ruleIdx < rules.length - 1 ? (
            <button
              onClick={() => setRuleIdx(ruleIdx + 1)}
              className="flex-1 py-3 rounded-2xl font-bold text-white"
              style={{ background: currentRule.color }}
            >
              Next Sound →
            </button>
          ) : (
            <button
              onClick={() => setSection('menu')}
              className="flex-1 py-3 rounded-2xl font-bold text-white"
              style={{ background: module.color }}
            >
              {section === 'vowels' ? 'Try Consonants →' : 'Take the Quiz →'}
            </button>
          )}
        </div>
      </div>
    </GameShell>
  )
}
