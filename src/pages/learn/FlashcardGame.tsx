import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { KIDS_MODULES } from '../../data/kidsModules'
import { useFlashSession, calcFlashStars } from '../../state/useFlashSession'
import { saveFlashResult } from '../../state/progress'
import { updateSM2, sortByDue } from '../../state/useSM2'
import { useAppState } from '../../state/AppState'
import GameShell from '../../components/learn/GameShell'
import FlipCard from '../../components/learn/FlipCard'
import ProgressBar from '../../components/learn/ProgressBar'
import ResultScreen from '../../components/learn/ResultScreen'
import FeedbackToast from '../../components/learn/FeedbackToast'
import { ding, thud } from '../../utils/haptics'
import { sansFont } from '../../constants'
import { speakText } from '../../lib/voices'

const LANG_LABELS: Record<string, string> = { es: 'Spanish', fr: 'French', ja: 'Japanese', it: 'Italian', pt: 'Portuguese' }
const LANG_LOCALE: Record<string, string> = { es: 'es-MX', fr: 'fr-FR', ja: 'ja-JP', it: 'it-IT', pt: 'pt-BR' }
const FEEDBACK_CORRECT = ['You got it! ✨', 'Nice! 🎉', 'Perfecto! 🌟', 'Yes! 💪', 'Amazing!']
const FEEDBACK_WRONG = ['Almost! Try again 💪', 'Not yet — keep going!', 'Good try! 🙌', "Close! You'll get it!"]
function pick(arr: string[]) { return arr[Math.floor(Math.random() * arr.length)] }

export default function FlashcardGame() {
  const { moduleId } = useParams<{ moduleId: string }>()
  const mod = KIDS_MODULES.find(m => m.id === moduleId)
  const sortedVocab = mod ? sortByDue(mod.id, mod.vocab) : []
  const { state, flip, gotIt, notYet, alreadyKnew, reset } = useFlashSession(sortedVocab)
  const { dispatch } = useAppState()
  const [toast, setToast] = useState<{ msg: string; variant: 'correct' | 'wrong'; visible: boolean }>({ msg: '', variant: 'correct', visible: false })
  const [saved, setSaved] = useState(false)
  const [pronouncing, setPronouncing] = useState(false)
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)
  const targetLocale = LANG_LOCALE[mod?.language ?? 'es'] ?? 'es-MX'

  useEffect(() => {
    if (state.flipped && state.queue[0]) {
      setPronouncing(true)
      speakText(state.queue[0].es, targetLocale)
      const t = setTimeout(() => setPronouncing(false), 1800)
      return () => clearTimeout(t)
    }
  }, [state.flipped, state.queue[0]?.en]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { setPronouncing(false) }, [state.queue[0]?.en])

  const handlePronounce = useCallback((word: string, face: 'front' | 'back') => {
    const locale = face === 'front' ? 'en-US' : targetLocale
    setPronouncing(true)
    speakText(word, locale)
    setTimeout(() => setPronouncing(false), 1800)
  }, [targetLocale])

  if (!mod) return <Navigate to="/learn" replace />
  const langLabel = LANG_LABELS[mod.language] ?? mod.language
  const current = state.queue[0]
  const progress = state.gotIt / state.total
  const stars = calcFlashStars(state.wrongCount)

  useEffect(() => {
    if (state.phase === 'result' && !saved) {
      saveFlashResult(mod.id, stars)
      dispatch({ type: 'RECORD_ACTIVITY', activityId: `flash-${mod.id}` })
      setSaved(true)
    }
  }, [state.phase, saved, mod.id, stars, dispatch])

  function showToast(msg: string, variant: 'correct' | 'wrong') {
    setToast({ msg, variant, visible: true })
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 1200)
  }
  function handleGotIt() {
    if (!state.flipped) return; ding(); updateSM2(mod!.id, state.queue[0].en, 3); showToast(pick(FEEDBACK_CORRECT), 'correct'); gotIt()
  }
  function handleNotYet() {
    if (!state.flipped) return; thud(); updateSM2(mod!.id, state.queue[0].en, 0); showToast(pick(FEEDBACK_WRONG), 'wrong'); notYet()
  }
  function handleAlreadyKnew() {
    ding(); updateSM2(mod!.id, state.queue[0].en, 5); dispatch({ type: 'ADD_XP', amount: 1 }); showToast('Already knew it! ⚡', 'correct'); alreadyKnew()
  }

  if (state.phase === 'result') {
    return (
      <GameShell moduleId={mod.id} title="Flashcards">
        <ResultScreen stars={stars} subline={`${state.total - state.wrongCount} of ${state.total} on the first try!`} moduleId={mod.id} color={mod.color} onPlayAgain={() => { setSaved(false); reset() }} got={state.gotIt} total={state.total} lang={mod.language} />
      </GameShell>
    )
  }

  return (
    <GameShell moduleId={mod.id} title="Flashcards">
      <FeedbackToast message={toast.msg} variant={toast.variant} visible={toast.visible} />
      <div className="max-w-sm mx-auto px-5 pt-6 pb-16">
        <ProgressBar value={progress} color={mod.color} className="mb-6" />
        <p className="text-center text-sm mb-4" style={{ ...sansFont, color: '#71717A' }}>{state.gotIt} of {state.total} learned</p>
        <div className="mb-6" onTouchStart={e => { touchStartX.current = e.touches[0].clientX; touchStartY.current = e.touches[0].clientY }} onTouchEnd={e => { if (touchStartX.current === null || touchStartY.current === null) return; const dx = e.changedTouches[0].clientX - touchStartX.current; const dy = e.changedTouches[0].clientY - touchStartY.current; touchStartX.current = null; touchStartY.current = null; if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return; if (!state.flipped) { flip(); return }; if (dx > 0) handleGotIt(); else handleNotYet() }}>
          {current && <FlipCard front={current.en} back={current.es} flipped={state.flipped} color={mod.color} onClick={() => !state.flipped && flip()} language={langLabel} onPronounce={handlePronounce} pronouncing={pronouncing} />}
        </div>
        {state.flipped && (
          <div className="flex gap-2">
            <button onClick={handleNotYet} className="flex-1 py-4 rounded-full font-bold text-sm transition-opacity hover:opacity-90" style={{ backgroundColor: '#FEE2E2', color: '#991B1B', fontFamily: '"Nunito", sans-serif', border: 'none', cursor: 'pointer' }}>Not yet ✗</button>
            <button onClick={handleAlreadyKnew} className="flex-shrink-0 px-3 py-4 rounded-full font-bold text-sm transition-opacity hover:opacity-90" style={{ backgroundColor: '#FEF3C7', color: '#D97706', fontFamily: '"Nunito", sans-serif', border: 'none', cursor: 'pointer' }}>⚡</button>
            <button onClick={handleGotIt} className="flex-1 py-4 rounded-full font-bold text-sm transition-opacity hover:opacity-90" style={{ backgroundColor: '#D1FAE5', color: '#065F46', fontFamily: '"Nunito", sans-serif', border: 'none', cursor: 'pointer' }}>Got it ✓</button>
          </div>
        )}
        {!state.flipped && <p className="text-center text-sm mt-4" style={{ ...sansFont, color: '#A1A1AA' }}>Tap the card to reveal the {langLabel} word</p>}
        {state.flipped && <p className="text-center text-xs mt-3" style={{ ...sansFont, color: '#C4C4CC' }}>✗ swipe left · tap ⚡ for instant skip · swipe right ✓</p>}
      </div>
    </GameShell>
  )
}
