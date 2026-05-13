import { useState, useEffect, useRef } from 'react'
import { useAppState } from '../../state/AppState'
import { useSpeech } from '../../state/SpeechProvider'
import { PURPLE, sansFont } from '../../constants'

export interface WordCardData {
  headword: string
  wordEmoji: string
  partOfSpeech: string
  phonetic: string
  baseDefinition: string
  exampleSentence: string
  exampleTranslation: string
  morphStem?: string
  morphEnding?: string
  morphConjugations?: Array<{ ending: string; full: string }>
  commonPhrases?: string[]
}

interface Props {
  word: string
  sentence: string
  x: number
  y: number
  moduleId: string
  color: string
  onClose: () => void
}

export default function KidsWordCard({ word, sentence, x, y, moduleId, color, onClose }: Props) {
  const [card, setCard] = useState<WordCardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [added, setAdded] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { dispatch, state } = useAppState()
  const { speak } = useSpeech()

  // Position the card near the tapped word, clamped to viewport
  const cardW = 320
  const cardH = 460  // estimated
  let left = x - cardW / 2
  let top = y + 14
  if (typeof window !== 'undefined') {
    left = Math.max(8, Math.min(left, window.innerWidth - cardW - 8))
    // If card would go below viewport, flip it above the tap point
    if (top + cardH > window.innerHeight - 8) {
      top = Math.max(8, y - cardH - 14)
    }
  }

  useEffect(() => {
    const exists = state.vocab.some(v => v.word === word)
    setAdded(exists)
  }, [word, state.vocab])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    setCard(null)

    fetch('/api/word-lookup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ word, sentence }),
    })
      .then(r => r.json())
      .then(data => {
        if (cancelled) return
        if (data.error === 'rateLimit') { setError("Lingo needs a rest! Come back in a bit. 🌟"); return }
        if (data.card) { setCard(data.card); dispatch({ type: 'ADD_XP', amount: 2 }) }
        else setError("Couldn't look that up. Tap to try again!")
      })
      .catch(() => { if (!cancelled) setError("Couldn't look that up. Tap to try again!") })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [word, sentence, dispatch])

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  function addToVocab() {
    if (!card || added) return
    dispatch({ type: 'ADD_VOCAB', item: { word: card.headword, english: card.baseDefinition, moduleId } })
    dispatch({ type: 'ADD_XP', amount: 5 })
    setAdded(true)
  }

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        top,
        left,
        width: cardW,
        zIndex: 200,
        backgroundColor: '#fff',
        border: `2px solid ${color}30`,
        borderRadius: 18,
        boxShadow: `0 8px 32px ${color}24, 0 2px 8px rgba(0,0,0,0.1)`,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{ backgroundColor: color, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Emoji "picture" */}
          {card?.wordEmoji && (
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              backgroundColor: 'rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, flexShrink: 0,
            }}>
              {card.wordEmoji}
            </div>
          )}
          {!card?.wordEmoji && loading && (
            <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.15)', flexShrink: 0 }} />
          )}
          <div>
            <p style={{ color: '#fff', fontFamily: '"Nunito", sans-serif', fontSize: 20, fontWeight: 800, margin: 0 }}>{word}</p>
            {card && (
              <p style={{ color: 'rgba(255,255,255,0.75)', fontFamily: '"Nunito", sans-serif', fontSize: 12, margin: 0 }}>
                {card.partOfSpeech}{card.phonetic ? ` · ${card.phonetic}` : ''}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', fontSize: 18, cursor: 'pointer', padding: '0 0 0 8px' }}
        >×</button>
      </div>

      <div style={{ padding: '14px 16px' }}>
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, margin: '12px 0' }}>
            <span style={{ width: 14, height: 14, border: `2px solid ${color}40`, borderTopColor: color, borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
            <p style={{ ...sansFont, color: '#71717A', fontSize: 13, margin: 0 }}>Looking it up…</p>
          </div>
        )}
        {error && (
          <p style={{ ...sansFont, color: '#DC2626', fontSize: 13, textAlign: 'center', margin: '10px 0' }}>
            {error}
          </p>
        )}
        {card && (
          <>
            <p style={{ ...sansFont, fontSize: 17, fontWeight: 700, color: '#18181B', margin: '0 0 10px' }}>
              {card.baseDefinition}
            </p>

            {/* Morphology breakdown */}
            {card.morphStem && card.morphEnding && (
              <div style={{ marginBottom: 12 }}>
                {/* Base form split */}
                <p style={{ ...sansFont, fontSize: 11, fontWeight: 700, color: '#A1A1AA', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 6px' }}>
                  How it changes
                </p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 0, marginBottom: 8 }}>
                  <span style={{ ...sansFont, fontSize: 22, fontWeight: 800, color: '#18181B' }}>{card.morphStem}</span>
                  <span style={{ ...sansFont, fontSize: 22, fontWeight: 800, color }}>·{card.morphEnding}</span>
                </div>
                {/* Conjugation chips */}
                {card.morphConjugations && card.morphConjugations.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                    {card.morphConjugations.map(({ ending, full }) => {
                      const stem = full.slice(0, full.length - ending.length)
                      return (
                        <span key={full} style={{
                          backgroundColor: `${color}12`, borderRadius: 8,
                          padding: '3px 8px', ...sansFont, fontSize: 14, fontWeight: 700,
                        }}>
                          <span style={{ color: '#18181B' }}>{stem}</span>
                          <span style={{ color }}>·{ending}</span>
                        </span>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Common phrases */}
            {card.commonPhrases && card.commonPhrases.length > 0 && (
              <div style={{ marginBottom: 10 }}>
                <p style={{ ...sansFont, fontSize: 11, fontWeight: 700, color: '#A1A1AA', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 5px' }}>
                  You might say
                </p>
                {card.commonPhrases.map((phrase, i) => (
                  <p key={i} style={{ ...sansFont, fontSize: 13, color: '#3F3F46', margin: '0 0 2px' }}>
                    {phrase}
                  </p>
                ))}
              </div>
            )}

            <div style={{ backgroundColor: `${color}0d`, borderRadius: 10, padding: '10px 12px', marginBottom: 12, border: `1px solid ${color}20` }}>
              <p style={{ ...sansFont, fontSize: 13, fontWeight: 700, color: '#18181B', margin: '0 0 2px' }}>
                "{card.exampleSentence}"
              </p>
              <p style={{ ...sansFont, fontSize: 12, color: '#71717A', margin: 0 }}>
                "{card.exampleTranslation}"
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => speak(card.headword)}
                style={{
                  flex: 1, height: 44, borderRadius: 22, border: `1.5px solid ${color}40`,
                  backgroundColor: 'transparent', color: color, ...sansFont, fontSize: 14,
                  fontWeight: 700, cursor: 'pointer',
                }}
              >
                🔊 Listen
              </button>
              <button
                onClick={addToVocab}
                disabled={added}
                style={{
                  flex: 1, height: 44, borderRadius: 22, border: 'none',
                  backgroundColor: added ? '#D1FAE5' : color,
                  color: added ? '#065F46' : '#fff',
                  ...sansFont, fontSize: 14, fontWeight: 700,
                  cursor: added ? 'default' : 'pointer',
                  opacity: added ? 0.9 : 1,
                }}
              >
                {added ? '✓ Saved' : '+ My Words'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
