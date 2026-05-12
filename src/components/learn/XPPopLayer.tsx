import { useState, useEffect, useCallback } from 'react'

interface Pop { id: number; amount: number; x: number; y: number }

let popId = 0

export default function XPPopLayer() {
  const [pops, setPops] = useState<Pop[]>([])

  const addPop = useCallback((amount: number) => {
    const x = 50 + (Math.random() - 0.5) * 40
    const y = 60 + Math.random() * 20
    const id = ++popId
    setPops(prev => [...prev, { id, amount, x, y }])
    setTimeout(() => setPops(prev => prev.filter(p => p.id !== id)), 1200)
  }, [])

  useEffect(() => {
    function handler(e: Event) {
      const detail = (e as CustomEvent).detail
      addPop(detail.amount)
    }
    window.addEventListener('jl:xp', handler)
    return () => window.removeEventListener('jl:xp', handler)
  }, [addPop])

  if (pops.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {pops.map(pop => (
        <div
          key={pop.id}
          className="absolute font-bold text-base select-none"
          style={{
            left: `${pop.x}%`,
            top: `${pop.y}%`,
            color: '#f59e0b',
            textShadow: '0 1px 4px rgba(0,0,0,0.2)',
            animation: 'xp-rise 1.2s ease-out forwards',
            fontFamily: '"Nunito", sans-serif',
          }}
        >
          +{pop.amount} XP ⭐
        </div>
      ))}
    </div>
  )
}
