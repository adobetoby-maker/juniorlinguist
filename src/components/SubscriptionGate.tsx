import { Link } from 'react-router-dom'
import { useSubscription } from '../state/subscription-state'
import { PURPLE, sansFont, displayFont } from '../constants'
import type { ReactNode } from 'react'

export function SubscriptionGate({ children }: { children: ReactNode }) {
  const { isActive, loading } = useSubscription()
  const isDemo = typeof window !== 'undefined' && localStorage.getItem('jl_demo') === 'true'

  if (loading) return <>{children}</>
  if (isActive || isDemo) return <>{children}</>

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#FDFCF9' }}>
      <div className="max-w-sm w-full text-center">
        <div className="text-5xl mb-4">🔒</div>
        <h2 className="text-2xl font-bold mb-2" style={{ ...displayFont, color: '#18181B' }}>
          Start your free trial
        </h2>
        <p className="text-sm mb-6" style={{ ...sansFont, color: '#71717A' }}>
          7 days free, then $9.99/month. Cancel anytime.
          <br />
          Language Threshold subscribers get 50% off.
        </p>
        <Link
          to="/pricing"
          className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
          style={{ ...sansFont, backgroundColor: PURPLE }}
        >
          See plans →
        </Link>
        <p className="mt-4 text-xs" style={{ ...sansFont, color: '#A1A1AA' }}>
          Already subscribed?{' '}
          <Link to="/login" className="underline" style={{ color: PURPLE }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
