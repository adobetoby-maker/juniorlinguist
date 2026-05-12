import { useState, useEffect, useRef } from 'react'
import { useAppState } from '../../state/AppState'
import { useSpeech } from '../../state/SpeechProvider'
import { PURPLE, sansFont } from '../../constants'

export interface WordCardData {
  headword: string
  partOfSpeech: string
  phonetic: string
  baseDefinition: string
  exampleSentence: string
  exampleTranslation: string
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
  const [error, setError] = useState(false)
  const [added, setAdded] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { dispatch, state } = useAppState()
  const { speak } = useSpeech()

  // Position: below click, clamped to viewport
  const cardW = 300
  let left = x - cardW / 2
  if (typeof window !== 'undefined') {
    left = Math.max(8, Math.min(left, window.innerWidth - cardW - 8))
  }
  const top = y + 12

  useEffect(() => {
    const exists = state.vocab.some(v => v.word === word)
    setAdded(exists)
  }, [word, state.vocab])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(false)
    setCard(null)

    fetch('/api/word-lookup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ word, sentence }),
    })
      .then(r => r.json())
      .then(data => {
        if (cancelled) return
        if (data.card) { setCard(data.card); dispatch({ type: 'ADD_XP', amount: 2 }) }
        else setError(true)
      })
      .catch(() => { if (!cancelled) setError(true) })
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
        <div>
          <p style={{ color: '#fff', fontFamily: '"Nunito", sans-serif', fontSize: 22, fontWeight: 800, margin: 0 }}>{word}</p>
          {card && (
            <p style={{ color: 'rgba(255,255,255,0.75)', fontFamily: '"Nunito", sans-serif', fontSize: 12, margin: 0 }}>
              {card.partOfSpeech} {card.phonetic ? `· ${card.phonetic}` : ''}
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', fontSize: 18, cursor: 'pointer', padding: '0 0 0 8px' }}
        >×</button>
      </div>

      <div style={{ padding: '14px 16px' }}>
        {loading && (
          <p style={{ ...sansFont, color: '#71717A', fontSize: 14, textAlign: 'center', margin: '8px 0' }}>
            Looking it up...
          </p>
        )}
        {error && (
          <p style={{ ...sansFont, color: '#DC2626', fontSize: 14 }}>
            Couldn't look that up. Try again!
          </p>
        )}
        {card && (
          <>
            <p style={{ ...sansFont, fontSize: 18, fontWeight: 700, color: '#18181B', margin: '0 0 10px' }}>
              {card.baseDefinition}
            </p>
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
                  flex: 1, height: 36, borderRadius: 18, border: `1.5px solid ${color}40`,
                  backgroundColor: 'transparent', color: color, ...sansFont, fontSize: 13,
                  fontWeight: 700, cursor: 'pointer',
                }}
              >
                🔊 Listen
              </button>
              <button
                onClick={addToVocab}
                disabled={added}
                style={{
                  flex: 1, height: 36, borderRadius: 18, border: 'none',
                  backgroundColor: added ? '#D1FAE5' : color,
                  color: added ? '#065F46' : '#fff',
                  ...sansFont, fontSize: 13, fontWeight: 700,
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
