import { Link, useLocation } from 'react-router-dom'
import { useSubscription } from '../state/subscription-state'
import { PURPLE, sansFont, displayFont } from '../constants'
import type { ReactNode } from 'react'

export function SubscriptionGate({ children }: { children: ReactNode }) {
  const { isActive, loading } = useSubscription()
  const isDemo = typeof window !== 'undefined' && localStorage.getItem('jl_demo') === 'true'
  const location = useLocation()

  if (loading) return <>{children}</>
  if (isActive || isDemo) return <>{children}</>

  // Derive context from the current path to personalise the gate message
  const pathSegments = location.pathname.replace('/learn/', '').replace('/learn', '').split('/')
  const moduleSlug = pathSegments[0] || ''
  const moduleLabel = moduleSlug
    ? moduleSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    : ''

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FDFCF9' }}>
      {/* Minimal nav header so users are never stranded */}
      <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(124,58,237,0.10)' }}>
        <Link to="/" className="flex items-center gap-2 no-underline">
          <svg width="24" height="24" viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <circle cx="14" cy="14" r="12" stroke={PURPLE} strokeWidth="2" />
            <text x="14" y="19" textAnchor="middle" fontSize="13" fontFamily="Playfair Display, serif" fill={PURPLE} fontWeight="700">J</text>
          </svg>
          <span className="font-bold text-base" style={{ fontFamily: '"Playfair Display", serif', color: '#18181B' }}>
            Junior Linguist
          </span>
        </Link>
        <div className="flex items-center gap-4 text-sm" style={sansFont}>
          <Link to="/pricing" className="font-semibold hover:opacity-70" style={{ color: '#71717A' }}>Pricing</Link>
          <Link to="/login" className="font-semibold hover:opacity-70" style={{ color: '#71717A' }}>Log in</Link>
        </div>
      </div>

      {/* Gate content */}
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-sm w-full text-center">
          <div className="text-5xl mb-4">🌍</div>
          <h2 className="text-2xl font-bold mb-2" style={{ ...displayFont, color: '#18181B' }}>
            {moduleLabel ? `Start practicing ${moduleLabel}` : 'Start your free trial'}
          </h2>
          <p className="text-sm mb-2" style={{ ...sansFont, color: '#71717A' }}>
            {moduleLabel
              ? `Unlock ${moduleLabel} and all 25 topics with a 7-day free trial.`
              : '7 days free, then $9.99/month.'}
          </p>
          <p className="text-xs mb-8" style={{ ...sansFont, color: '#A1A1AA' }}>
            You will not be charged for 7 days — cancel anytime.
          </p>
          <Link
            to="/pricing"
            className="flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold text-white transition-opacity hover:opacity-90 mb-4"
            style={{ ...sansFont, backgroundColor: PURPLE }}
          >
            See plans &amp; start free trial →
          </Link>
          <p className="text-xs" style={{ ...sansFont, color: '#A1A1AA' }}>
            Already subscribed?{' '}
            <Link to="/login?mode=parent" className="underline" style={{ color: PURPLE }}>
              Sign in
            </Link>
          </p>
          <div className="mt-8 pt-6" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
            <Link to="/#modules" className="text-xs font-semibold hover:opacity-70" style={{ ...sansFont, color: '#71717A' }}>
              ← Browse free topic previews
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
