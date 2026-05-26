import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PURPLE, sansFont, displayFont } from '../constants'
import { useSubscription } from '../state/subscription-state'

export default function SubscribeSuccess() {
  const { refresh } = useSubscription()

  useEffect(() => {
    const t = setTimeout(() => refresh(), 2000)
    return () => clearTimeout(t)
  }, [refresh])

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#FDFCF9' }}>
      <div className="max-w-sm w-full text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-3xl font-bold mb-3" style={{ ...displayFont, color: '#18181B' }}>
          You're in!
        </h1>
        <p className="text-sm mb-8" style={{ ...sansFont, color: '#71717A' }}>
          Your 7-day free trial has started. Dive into games, stories, and AI tutoring — cancel before day 7 and you pay nothing.
        </p>
        <Link
          to="/learn"
          className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
          style={{ ...sansFont, backgroundColor: PURPLE }}
        >
          Start learning →
        </Link>
        <p className="mt-8 text-xs" style={{ ...sansFont, color: '#A1A1AA' }}>
          A receipt has been sent to your email.
        </p>
      </div>
    </div>
  )
}
