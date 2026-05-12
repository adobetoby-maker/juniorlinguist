import { useState, useRef, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import GameShell from '../../components/learn/GameShell'
import ClickableWord from '../../components/learn/ClickableWord'
import KidsWordCard from '../../components/learn/KidsWordCard'
import { useSpeech } from '../../state/SpeechProvider'
import { useAppState } from '../../state/AppState'
import { saveSpeakSession } from '../../state/progress'
import { getFriend } from '../../data/penPalFriends'
import { KIDS_MODULES } from '../../data/kidsModules'

interface SentencePair { es: string; en: string }

interface PenPalLetter {
  id: string
  sentAt: string
  userLetter: string
  sentences: SentencePair[]
  question: string
  questionEn: string
}

interface WordPos { word: string; sentence: string; x: number; y: number }

type View = 'inbox' | 'compose' | 'reading'

const STORAGE_PREFIX = 'jl_penpal_'

function loadLetters(moduleId: string): PenPalLetter[] {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + moduleId)
    if (raw) return JSON.parse(raw)
  } catch {}
  return []
}

function saveLetters(moduleId: string, letters: PenPalLetter[]) {
  try { localStorage.setItem(STORAGE_PREFIX + moduleId, JSON.stringify(letters.slice(-20))) } catch {}
}

export default function PenPal() {
  const { moduleId = 'general' } = useParams<{ moduleId: string }>()
  const module = KIDS_MODULES.find(m => m.id === moduleId) ?? KIDS_MODULES[0]
  const friend = getFriend(moduleId)

  const [letters, setLetters] = useState<PenPalLetter[]>(() => loadLetters(moduleId))
  const [view, setView] = useState<View>(letters.length === 0 ? 'compose' : 'inbox')
  const [readingLetter, setReadingLetter] = useState<PenPalLetter | null>(null)
  const [draftText, setDraftText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [popup, setPopup] = useState<WordPos | null>(null)
  const [activeIdx, setActiveIdx] = useState(-1)

  const { speak, speakQueue, stop, playing } = useSpeech()
  const { dispatch } = useAppState()
  const sessionSavedRef = useRef(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    saveLetters(moduleId, letters)
  }, [letters, moduleId])

  // Auto-read latest letter when arriving from compose
  useEffect(() => {
    if (view === 'reading' && readingLetter && letters.length > 0) {
      setTimeout(() => speak(readingLetter.sentences[0]?.es ?? '', 'es'), 800)
    }
  }, [view, readingLetter]) // eslint-disable-line react-hooks/exhaustive-deps

  async function sendLetter() {
    const text = draftText.trim()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/penpal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moduleId, userLetter: text, letterCount: letters.length }),
      })
      const data = await res.json()
      if (data.error === 'rateLimit') { setError("Lingo needs a rest! Come back in a bit. 🌟"); return }
      if (data.sentences?.length) {
        const newLetter: PenPalLetter = {
          id: Date.now().toString(),
          sentAt: new Date().toISOString(),
          userLetter: text,
          sentences: data.sentences,
          question: data.question,
          questionEn: data.questionEn,
        }
        const updated = [...letters, newLetter]
        setLetters(updated)
        setReadingLetter(newLetter)
        setDraftText('')
        setView('reading')
        dispatch({ type: 'ADD_XP', amount: 15 })
        if (!sessionSavedRef.current) {
          saveSpeakSession(moduleId)
          sessionSavedRef.current = true
        }
      } else {
        setError('Could not get a reply. Try again.')
      }
    } catch {
      setError('No connection. Try again.')
    } finally {
      setLoading(false)
    }
  }

  function handlePlayAll(letter: PenPalLetter) {
    if (playing) { stop(); return }
    const items = letter.sentences.map((s, i) => ({ text: s.es, index: i }))
    speakQueue(items, i => setActiveIdx(i))
  }

  function openLetter(letter: PenPalLetter) {
    setReadingLetter(letter)
    setActiveIdx(-1)
    stop()
    setView('reading')
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  // ── INBOX ──────────────────────────────────────────────────────────────
  if (view === 'inbox') {
    return (
      <GameShell title={`Letters from ${friend.name}`} moduleId={moduleId}>
        <div className="max-w-lg mx-auto px-4 pb-12">

          {/* Friend header */}
          <div className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-5">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-3xl flex-shrink-0"
              style={{ background: `${module.color}18` }}
            >
              {friend.emoji}
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-800">{friend.name}</p>
              <p className="text-sm text-gray-500">{friend.city}, {friend.country} · Age {friend.age}</p>
              <p className="text-xs text-gray-400 mt-0.5">{friend.intro}</p>
            </div>
          </div>

          {/* Write new letter */}
          <button
            onClick={() => setView('compose')}
            className="w-full py-3 rounded-2xl font-bold text-white mb-5 flex items-center justify-center gap-2"
            style={{ background: module.color }}
          >
            ✉️ Write a New Letter
          </button>

          {/* Letters list */}
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
            Received Letters ({letters.length})
          </p>
          <div className="space-y-3">
            {[...letters].reverse().map(letter => (
              <button
                key={letter.id}
                onClick={() => openLetter(letter)}
                className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-left hover:shadow transition-shadow"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm truncate">
                      {friend.emoji} Letter from {friend.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{formatDate(letter.sentAt)}</p>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-1 italic">
                      "{letter.sentences[0]?.es}"
                    </p>
                  </div>
                  <div
                    className="px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0"
                    style={{ background: `${module.color}15`, color: module.color }}
                  >
                    Read →
                  </div>
                </div>
              </button>
            ))}

            {letters.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <p className="text-4xl mb-2">📬</p>
                <p>No letters yet. Write your first one!</p>
              </div>
            )}
          </div>
        </div>

        {popup && (
          <KidsWordCard
            word={popup.word} sentence={popup.sentence}
            x={popup.x} y={popup.y}
            moduleId={moduleId} color={module.color}
            onClose={() => setPopup(null)}
          />
        )}
      </GameShell>
    )
  }

  // ── COMPOSE ────────────────────────────────────────────────────────────
  if (view === 'compose') {
    const lastQuestion = letters.length > 0 ? letters[letters.length - 1] : null
    return (
      <GameShell title={`Write to ${friend.name}`} moduleId={moduleId}>
        <div className="max-w-lg mx-auto px-4 pb-12">

          {/* Friend chip */}
          <div
            className="flex items-center gap-3 rounded-2xl p-3 mb-5"
            style={{ background: `${module.color}10` }}
          >
            <span className="text-2xl">{friend.emoji}</span>
            <div>
              <p className="font-bold text-sm text-gray-800">{friend.name} · {friend.city}, {friend.country}</p>
              <p className="text-xs text-gray-500">{friend.intro}</p>
            </div>
          </div>

          {/* Last question reminder */}
          {lastQuestion && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 mb-4 text-sm text-amber-800">
              <p className="font-semibold mb-0.5">💬 {friend.name} asked you:</p>
              <p className="italic">"{lastQuestion.question}"</p>
              <p className="text-amber-600 text-xs mt-0.5">"{lastQuestion.questionEn}"</p>
            </div>
          )}

          {/* Tips */}
          <div className="bg-gray-50 rounded-2xl p-3 mb-4 text-xs text-gray-500">
            <p className="font-semibold text-gray-700 mb-1">✏️ Tips for your letter:</p>
            <p>• Write in English or Spanish — {friend.name} will reply in Spanish!</p>
            <p>• Tell {friend.name} something about yourself</p>
            <p>• Ask {friend.name} a question too</p>
          </div>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={draftText}
            onChange={e => setDraftText(e.target.value)}
            placeholder={`Dear ${friend.name},\n\nHello! My name is...`}
            rows={8}
            className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 text-sm outline-none focus:border-blue-300 leading-relaxed resize-none mb-4"
            style={{ fontFamily: '"Nunito", sans-serif' }}
          />

          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          <div className="flex gap-3">
            {letters.length > 0 && (
              <button
                onClick={() => setView('inbox')}
                className="px-4 py-3 rounded-2xl border-2 border-gray-200 text-gray-600 font-semibold text-sm"
              >
                ← Inbox
              </button>
            )}
            <button
              onClick={sendLetter}
              disabled={loading || draftText.trim().length < 5}
              className="flex-1 py-3 rounded-2xl font-bold text-white text-sm disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ background: module.color }}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  {friend.name} is writing back…
                </>
              ) : (
                `Send Letter ✉️`
              )}
            </button>
          </div>
        </div>
      </GameShell>
    )
  }

  // ── READING ────────────────────────────────────────────────────────────
  const letter = readingLetter
  if (!letter) return null

  return (
    <GameShell title={`Letter from ${friend.name}`} moduleId={moduleId}>
      <div className="max-w-2xl mx-auto px-4 pb-12 relative">

        {/* Letter card */}
        <div
          className="bg-white rounded-3xl shadow-md overflow-hidden mb-5"
          style={{ border: `1.5px solid ${module.color}25` }}
        >
          {/* Letter header */}
          <div
            className="px-5 pt-5 pb-4 flex items-center gap-3"
            style={{ background: `${module.color}10`, borderBottom: `1px solid ${module.color}20` }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: `${module.color}20` }}
            >
              {friend.emoji}
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-800">{friend.name}</p>
              <p className="text-xs text-gray-500">{friend.city}, {friend.country} · {formatDate(letter.sentAt)}</p>
            </div>
            {/* Play all */}
            <button
              onClick={() => handlePlayAll(letter)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-xs font-semibold"
              style={{ background: playing ? '#6b7280' : module.color }}
            >
              {playing ? '⏹' : '▶'} {playing ? 'Stop' : 'Read Aloud'}
            </button>
          </div>

          {/* Letter body — side-by-side bilingual columns */}
          <div className="px-4 py-3 space-y-2">
            {letter.sentences.map((pair, idx) => {
              const isActive = (playing ? activeIdx : -1) === idx
              return (
                <div
                  key={idx}
                  className="rounded-xl overflow-hidden border-2 transition-all"
                  style={{
                    borderColor: isActive ? module.color : '#f3f4f6',
                    background: isActive ? `${module.color}06` : 'white',
                  }}
                >
                  <div className="grid grid-cols-2">
                    {/* Spanish column */}
                    <div className="px-3 py-2.5 border-r border-gray-100 flex items-start gap-1.5">
                      <p className="flex-1 text-gray-800 font-semibold leading-relaxed text-sm">
                        <ClickableWord
                          text={pair.es}
                          color={module.color}
                          onWord={(w, _s, x, y) => { stop(); setPopup({ word: w, sentence: pair.es, x, y }) }}
                        />
                      </p>
                      <button
                        onClick={() => { stop(); speak(pair.es, 'es'); setActiveIdx(idx); setTimeout(() => setActiveIdx(-1), 2500) }}
                        className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm hover:bg-gray-100 transition-colors mt-0.5"
                      >
                        🔊
                      </button>
                    </div>
                    {/* English column */}
                    <div className="px-3 py-2.5 bg-gray-50">
                      <p className="text-xs text-gray-400 leading-relaxed">{pair.en}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Question prompt */}
          <div
            className="mx-5 mb-5 rounded-2xl p-4"
            style={{ background: `${module.color}10`, border: `1px solid ${module.color}25` }}
          >
            <p className="text-xs font-bold text-gray-500 mb-1">💬 {friend.name} is asking you:</p>
            <p className="font-semibold text-gray-800 text-sm">{letter.question}</p>
            <p className="text-xs text-gray-500 italic mt-0.5">{letter.questionEn}</p>
          </div>
        </div>

        {/* Tap hint */}
        <p className="text-center text-xs text-gray-400 mb-5">
          Tap any Spanish word to look it up 👆
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => setView('inbox')}
            className="px-4 py-3 rounded-2xl border-2 border-gray-200 text-gray-600 font-semibold text-sm"
          >
            📬 Inbox
          </button>
          <button
            onClick={() => { setView('compose'); stop() }}
            className="flex-1 py-3 rounded-2xl font-bold text-white text-sm"
            style={{ background: module.color }}
          >
            ✏️ Write Back to {friend.name}
          </button>
        </div>
      </div>

      {popup && (
        <KidsWordCard
          word={popup.word} sentence={popup.sentence}
          x={popup.x} y={popup.y}
          moduleId={moduleId} color={module.color}
          onClose={() => setPopup(null)}
        />
      )}
    </GameShell>
  )
}
