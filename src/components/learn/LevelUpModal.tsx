import { useState, useEffect } from 'react'

interface TierInfo { label: string; emoji: string }

export default function LevelUpModal() {
  const [tier, setTier] = useState<TierInfo | null>(null)

  useEffect(() => {
    function handler(e: Event) {
      const detail = (e as CustomEvent).detail
      setTier(detail.tier)
    }
    window.addEventListener('jl:levelup', handler)
    return () => window.removeEventListener('jl:levelup', handler)
  }, [])

  if (!tier) return null

  return (
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={() => setTier(null)}
    >
      <div
        className="bg-white rounded-3xl px-10 py-10 text-center shadow-2xl max-w-xs mx-4"
        style={{ animation: 'pop-in 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="text-7xl mb-4" style={{ animation: 'spin-once 0.6s ease-out' }}>
          {tier.emoji}
        </div>
        <div
          className="text-xs font-bold uppercase tracking-widest mb-2"
          style={{ color: '#f59e0b' }}
        >
          Level Up!
        </div>
        <h2
          className="text-3xl font-black mb-2"
          style={{ fontFamily: '"Nunito", sans-serif', color: '#18181B' }}
        >
          {tier.label}
        </h2>
        <p style={{ fontFamily: '"Nunito", sans-serif', color: '#71717A', fontSize: 14 }}>
          Your brain is growing! Keep learning Spanish 🌟
        </p>
        <button
          onClick={() => setTier(null)}
          className="mt-6 px-8 py-3 rounded-full font-bold text-white text-base"
          style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)', fontFamily: '"Nunito", sans-serif' }}
        >
          Keep Going! →
        </button>
      </div>
    </div>
  )
}
