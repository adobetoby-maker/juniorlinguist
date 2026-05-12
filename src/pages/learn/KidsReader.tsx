import { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import GameShell from '../../components/learn/GameShell'
import ClickableWord from '../../components/learn/ClickableWord'
import KidsWordCard from '../../components/learn/KidsWordCard'
import { useSpeech } from '../../state/SpeechProvider'
import { KIDS_STORIES, type KidsStory } from '../../data/kidsStories'
import { KIDS_MODULES } from '../../data/kidsModules'
import { useAppState } from '../../state/AppState'
import { saveStoryRead } from '../../state/progress'

interface WordPos { word: string; sentence: string; x: number; y: number }

const LANG_LABELS: Record<string, string> = { es: 'Spanish', fr: 'French', ja: 'Japanese', it: 'Italian', pt: 'Portuguese' }

export default function KidsReader() {
  const { moduleId = 'animals' } = useParams<{ moduleId: string }>()
  const module = KIDS_MODULES.find(m => m.id === moduleId) ?? KIDS_MODULES[0]
  const langLabel = LANG_LABELS[module.language] ?? module.language
  const stories = KIDS_STORIES.filter(s => s.moduleId === moduleId)
  const navigate = useNavigate()

  const [activeStory, setActiveStory] = useState<KidsStory | null>(stories[0] ?? null)
  const [popup, setPopup] = useState<WordPos | null>(null)
  const [activeIdx, setActiveIdx] = useState(-1)
  const [answered, setAnswered] = useState(false)
  const [userAnswer, setUserAnswer] = useState('')

  const { speak, speakQueue, stop, playing, activeSentenceIndex } = useSpeech()
  const { dispatch } = useAppState()
  const containerRef = useRef<HTMLDivElement>(null)

  const allStories = KIDS_STORIES

  function handleWord(word: string, sentence: string, x: number, y: number) {
    stop()
    setPopup({ word, sentence, x, y })
  }

  function handlePlayAll() {
    if (!activeStory) return
    if (playing) { stop(); return }
    const items = activeStory.sentences.map((s, i) => ({ text: s.es, index: i }))
    speakQueue(items, i => setActiveIdx(i))
  }

  function handlePlaySentence(es: string, idx: number) {
    stop()
    setActiveIdx(idx)
    speak(es, 'es')
    setTimeout(() => setActiveIdx(-1), 2500)
  }

  useEffect(() => {
    if (answered && activeStory) {
      saveStoryRead(moduleId)
      dispatch({ type: 'EARN_ACHIEVEMENT', name: 'read_story' })
    }
  }, [answered]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleAnswerSubmit() {
    if (!userAnswer.trim() || !activeStory) return
    setAnswered(true)
    dispatch({ type: 'ADD_XP', amount: 10 })
  }

  const correct = activeStory?.answerHint.toLowerCase() ?? ''
  const isCorrect = answered && userAnswer.toLowerCase().includes(correct)

  if (!activeStory) {
    return (
      <GameShell title="Story Reader" moduleId={moduleId}>
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
          <div className="text-6xl mb-4">📖</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No stories yet for {module.title}</h3>
          <p className="text-gray-500 text-sm mb-6">Try the Daily Story — Lingo writes a fresh one every day just for this topic!</p>
          <button
            onClick={() => navigate(`/learn/${moduleId}/daily-story`)}
            className="px-6 py-3 rounded-full text-white font-bold text-base shadow"
            style={{ background: module.color }}
          >
            ✨ Read Today's Story
          </button>
        </div>
      </GameShell>
    )
  }

  return (
    <GameShell title="Story Reader" moduleId={moduleId}>
      <div ref={containerRef} className="relative max-w-2xl mx-auto px-4 pb-12">

        {/* Story picker */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
          {allStories.map(s => (
            <button
              key={s.id}
              onClick={() => { setActiveStory(s as KidsStory); setAnswered(false); setUserAnswer(''); stop(); setActiveIdx(-1) }}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border-2 transition-all"
              style={{
                borderColor: activeStory.id === s.id ? module.color : '#e5e7eb',
                background: activeStory.id === s.id ? module.color : 'white',
                color: activeStory.id === s.id ? 'white' : '#374151',
              }}
            >
              <span>{s.emoji}</span>
              <span className="hidden sm:block">{s.title}</span>
            </button>
          ))}
        </div>

        {/* Story header */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-2">{activeStory.emoji}</div>
          <h2 className="text-2xl font-bold text-gray-800">{activeStory.titleEs}</h2>
          <p className="text-gray-500 text-sm mt-1">{activeStory.title}</p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              Level {activeStory.level}
            </span>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              {activeStory.sentences.length} sentences
            </span>
          </div>
        </div>

        {/* Play all button */}
        <div className="flex justify-center mb-6">
          <button
            onClick={handlePlayAll}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-white shadow transition-transform active:scale-95"
            style={{ background: playing ? '#6b7280' : module.color }}
          >
            {playing ? '⏹ Stop' : '▶ Play Story'}
          </button>
        </div>

        {/* Sentences — side-by-side columns */}
        <div className="space-y-2">
          {activeStory.sentences.map((pair, idx) => {
            const isActive = (playing ? activeSentenceIndex : activeIdx) === idx
            return (
              <div
                key={idx}
                className="rounded-2xl border-2 overflow-hidden transition-all"
                style={{
                  borderColor: isActive ? module.color : '#f3f4f6',
                  background: isActive ? `${module.color}06` : 'white',
                }}
              >
                <div className="grid grid-cols-2">
                  {/* Target language column */}
                  <div className="px-3 py-3 border-r border-gray-100 flex items-start gap-2">
                    <p className="text-gray-800 font-semibold text-sm leading-relaxed flex-1">
                      <ClickableWord
                        text={pair.es}
                        color={module.color}
                        onWord={(w, _s, x, y) => handleWord(w, pair.es, x, y)}
                      />
                    </p>
                    <button
                      onClick={() => handlePlaySentence(pair.es, idx)}
                      className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm hover:bg-gray-100 transition-colors mt-0.5"
                      aria-label="Listen"
                    >
                      🔊
                    </button>
                  </div>
                  {/* English column */}
                  <div className="px-3 py-3 bg-gray-50">
                    <p className="text-gray-500 text-xs leading-relaxed">{pair.en}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Comprehension question */}
        <div
          className="mt-8 rounded-2xl p-5 border-2"
          style={{ borderColor: module.color, background: `${module.color}08` }}
        >
          <p className="font-semibold text-gray-800 mb-3">
            🤔 {activeStory.question}
          </p>
          {!answered ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={userAnswer}
                onChange={e => setUserAnswer(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAnswerSubmit()}
                placeholder="Type your answer..."
                className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-400"
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
                ? `✅ Great answer! The key word was "${activeStory.answerHint}". +10 XP!`
                : `💡 The answer included "${activeStory.answerHint}". You got +10 XP for trying!`}
            </div>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Tap any {langLabel} word to look it up 👆
        </p>
      </div>

      {/* Word card popup */}
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
