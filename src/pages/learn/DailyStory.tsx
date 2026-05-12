import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import GameShell from '../../components/learn/GameShell'
import ClickableWord from '../../components/learn/ClickableWord'
import KidsWordCard from '../../components/learn/KidsWordCard'
import { useSpeech } from '../../state/SpeechProvider'
import { KIDS_MODULES } from '../../data/kidsModules'
import { useAppState } from '../../state/AppState'

interface StoryPair { en: string; es: string }
interface AIStory {
  title: string
  titleEn: string
  sentences: StoryPair[]
  question: string
  answerHint: string
}

interface WordPos { word: string; sentence: string; x: number; y: number }

const CACHE_KEY_PREFIX = 'jl_daily_'

function cacheKey(moduleId: string) {
  const d = new Date().toISOString().slice(0, 10)
  return `${CACHE_KEY_PREFIX}${moduleId}_${d}`
}

export default function DailyStory() {
  const { moduleId = 'animals' } = useParams<{ moduleId: string }>()
  const module = KIDS_MODULES.find(m => m.id === moduleId) ?? KIDS_MODULES[0]

  const [story, setStory] = useState<AIStory | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [popup, setPopup] = useState<WordPos | null>(null)
  const [answered, setAnswered] = useState(false)
  const [userAnswer, setUserAnswer] = useState('')
  const [activeIdx, setActiveIdx] = useState(-1)

  const { speak, speakQueue, stop, playing } = useSpeech()
  const { dispatch } = useAppState()

  useEffect(() => {
    const key = cacheKey(moduleId)
    try {
      const raw = localStorage.getItem(key)
      if (raw) { setStory(JSON.parse(raw)); return }
    } catch {}
    fetchStory()
  }, [moduleId]) // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchStory() {
    setLoading(true)
    setError('')
    setStory(null)
    try {
      const vocabWords = module.vocab.slice(0, 8).map(v => v.es)
      const res = await fetch('/api/story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moduleId, vocabWords }),
      })
      const data = await res.json()
      if (data.title && data.sentences) {
        setStory(data)
        try { localStorage.setItem(cacheKey(moduleId), JSON.stringify(data)) } catch {}
      } else {
        setError('Could not generate story. Try again.')
      }
    } catch {
      setError('No connection. Try again.')
    } finally {
      setLoading(false)
    }
  }

  function handlePlayAll() {
    if (!story) return
    if (playing) { stop(); return }
    const items = story.sentences.map((s, i) => ({ text: s.es, index: i }))
    speakQueue(items, i => setActiveIdx(i))
  }

  function handleAnswerSubmit() {
    if (!story || !userAnswer.trim()) return
    setAnswered(true)
    dispatch({ type: 'ADD_XP', amount: 15 })
  }

  const isCorrect = story && answered &&
    userAnswer.toLowerCase().includes(story.answerHint.toLowerCase())

  return (
    <GameShell title="Daily Story" moduleId={moduleId}>
      <div className="relative max-w-2xl mx-auto px-4 pb-12">

        {/* Header */}
        <div className="text-center mb-6">
          <div
            className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white mb-2"
            style={{ background: module.color }}
          >
            ✨ Today's AI Story
          </div>
          <p className="text-xs text-gray-400">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {loading && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4 animate-pulse">✨</div>
            <p className="text-gray-500 font-medium">Lingo is writing your story…</p>
            <p className="text-gray-400 text-sm mt-1">This takes about 5 seconds</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={fetchStory}
              className="px-6 py-3 rounded-full text-white font-semibold"
              style={{ background: module.color }}
            >
              Try Again
            </button>
          </div>
        )}

        {story && !loading && (
          <>
            {/* Story title */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">{story.title}</h2>
              <p className="text-gray-500 text-sm mt-1">{story.titleEn}</p>
            </div>

            {/* Play button */}
            <div className="flex justify-center mb-6 gap-3">
              <button
                onClick={handlePlayAll}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-white shadow transition-transform active:scale-95"
                style={{ background: playing ? '#6b7280' : module.color }}
              >
                {playing ? '⏹ Stop' : '▶ Read Aloud'}
              </button>
              <button
                onClick={() => { localStorage.removeItem(cacheKey(moduleId)); fetchStory() }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full font-semibold border-2 border-gray-200 text-gray-600 text-sm"
              >
                🔄 New Story
              </button>
            </div>

            {/* Sentences */}
            <div className="space-y-3">
              {story.sentences.map((pair, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border-2 overflow-hidden transition-all"
                  style={{
                    borderColor: activeIdx === idx ? module.color : '#f3f4f6',
                    background: activeIdx === idx ? `${module.color}08` : 'white',
                  }}
                >
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                    <p className="text-gray-500 text-sm leading-relaxed">{pair.en}</p>
                  </div>
                  <div className="px-4 py-3 flex items-center justify-between gap-3">
                    <p className="text-gray-800 font-medium leading-relaxed flex-1">
                      <ClickableWord
                        text={pair.es}
                        color={module.color}
                        onWord={(w, _s, x, y) => { stop(); setPopup({ word: w, sentence: pair.es, x, y }) }}
                      />
                    </p>
                    <button
                      onClick={() => { stop(); speak(pair.es, 'es') }}
                      className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                    >
                      🔊
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Question */}
            <div
              className="mt-8 rounded-2xl p-5 border-2"
              style={{ borderColor: module.color, background: `${module.color}08` }}
            >
              <p className="font-semibold text-gray-800 mb-3">🤔 {story.question}</p>
              {!answered ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={e => setUserAnswer(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAnswerSubmit()}
                    placeholder="Your answer…"
                    className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-300"
                  />
                  <button
                    onClick={handleAnswerSubmit}
                    className="px-4 py-2 rounded-xl text-white font-semibold text-sm"
                    style={{ background: module.color }}
                  >
                    Check
                  </button>
                </div>
              ) : (
                <div className={`rounded-xl px-4 py-3 text-sm font-medium ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                  {isCorrect
                    ? `✅ Great job! Key word: "${story.answerHint}" — +15 XP!`
                    : `💡 The key was "${story.answerHint}". You got +15 XP for trying!`}
                </div>
              )}
            </div>

            <p className="text-center text-xs text-gray-400 mt-4">
              Tap any Spanish word to look it up 👆
            </p>
          </>
        )}
      </div>

      {popup && (
        <KidsWordCard
          word={popup.word}
          sentence={popup.sentence}
          x={popup.x}
          y={popup.y}
          moduleId={moduleId}
          color={module.color}
          onClose={() => setPopup(null)}
        />
      )}
    </GameShell>
  )
}
