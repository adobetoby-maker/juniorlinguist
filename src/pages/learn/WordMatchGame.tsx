import { useEffect, useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { KIDS_MODULES } from '../../data/kidsModules'
import { useMatchSession, calcMatchStars } from '../../state/useMatchSession'
import { saveMatchResult } from '../../state/progress'
import GameShell from '../../components/learn/GameShell'
import MatchTile from '../../components/learn/MatchTile'
import ResultScreen from '../../components/learn/ResultScreen'
import { sansFont } from '../../constants'

export default function WordMatchGame() {
  const { moduleId } = useParams<{ moduleId: string }>()
  const mod = KIDS_MODULES.find(m => m.id === moduleId)
  const { state, selectLeft, selectRight, clearShake, nextRound, reset } = useMatchSession(mod?.vocab ?? [])
  const [saved, setSaved] = useState(false)

  if (!mod) return <Navigate to="/learn" replace />

  const stars = calcMatchStars(state.mistakes)

  // Auto-clear shake after 600ms
  useEffect(() => {
    const hasShake = state.leftCol.some(i => i.status === 'shake') || state.rightCol.some(i => i.status === 'shake')
    if (hasShake) {
      const t = setTimeout(clearShake, 600)
      return () => clearTimeout(t)
    }
  }, [state.leftCol, state.rightCol, clearShake])

  // Auto-advance between rounds after 1.2s
  useEffect(() => {
    if (state.phase === 'between') {
      const t = setTimeout(nextRound, 1200)
      return () => clearTimeout(t)
    }
  }, [state.phase, nextRound])

  useEffect(() => {
    if (state.phase === 'result' && !saved) {
      saveMatchResult(mod.id, stars)
      setSaved(true)
    }
  }, [state.phase, saved, mod.id, stars])

  if (state.phase === 'result') {
    return (
      <GameShell moduleId={mod.id} title="Word Match">
        <ResultScreen
          stars={stars}
          subline={state.mistakes === 0 ? 'Zero mistakes — flawless!' : `${state.mistakes} mistake${state.mistakes !== 1 ? 's' : ''} total`}
          moduleId={mod.id}
          color={mod.color}
          onPlayAgain={() => { setSaved(false); reset() }}
        />
      </GameShell>
    )
  }

  return (
    <GameShell moduleId={mod.id} title="Word Match">
      <div className="max-w-md mx-auto px-4 pt-6 pb-16">
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm font-bold" style={{ ...sansFont, color: '#71717A' }}>
            Round {state.roundIndex + 1} of 2
          </span>
          {state.mistakes > 0 && (
            <span className="text-sm font-bold" style={{ ...sansFont, color: '#DC2626' }}>
              {state.mistakes} mistake{state.mistakes !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {state.phase === 'between' ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">✅</div>
            <p className="text-xl font-bold" style={{ ...sansFont, color: '#18181B' }}>Round 1 done! Next 5...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-3">
              <p className="text-xs font-bold uppercase tracking-widest text-center mb-1" style={{ ...sansFont, color: '#71717A' }}>English</p>
              {state.leftCol.map((item, i) => (
                <MatchTile
                  key={`${item.vocab.en}-l`}
                  text={item.vocab.en}
                  status={item.status}
                  color={mod.color}
                  onTap={() => selectLeft(i)}
                />
              ))}
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-xs font-bold uppercase tracking-widest text-center mb-1" style={{ ...sansFont, color: '#71717A' }}>Spanish</p>
              {state.rightCol.map((item, i) => (
                <MatchTile
                  key={`${item.vocab.es}-r`}
                  text={item.vocab.es}
                  status={item.status}
                  color={mod.color}
                  onTap={() => selectRight(i)}
                />
              ))}
            </div>
          </div>
        )}

        <p className="text-center text-xs mt-6" style={{ ...sansFont, color: '#A1A1AA' }}>
          Tap an English word, then tap its Spanish match
        </p>
      </div>
    </GameShell>
  )
}
