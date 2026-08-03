import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PURPLE, sansFont, displayFont, SURFACE } from '../constants'
import { useSubscription } from '../state/subscription-state'

const MONTHLY_LINK = 'https://buy.stripe.com/7sY14pce701nguBaiybfO0b'
const ANNUAL_LINK = 'https://buy.stripe.com/bJe8wRgun8xT6U1eyObfO0d'
const LT50_LINK = 'https://buy.stripe.com/eVqeVf0vpcO9guB2Q6bfO0c'

const FEATURES = [
  '25 Spanish topics · 9 topics each in French, Japanese, Italian & Portuguese',
  'Flashcards, quizzes, and memory games',
  'AI tutor chat and pronunciation coach',
  'Daily stories + listening drills',
  'Sentence builder and pen pal',
  'XP streaks and achievement badges',
  'Works on any device',
]

export default function Pricing() {
  const { isActive, status } = useSubscription()
  const [billing, setBilling] = useState<'monthly' | 'annual'>('annual')
  const [showLT, setShowLT] = useState(false)

  const checkoutLink = billing === 'annual' ? ANNUAL_LINK : MONTHLY_LINK

  return (
    <div className="min-h-screen px-4 py-16" style={{ backgroundColor: '#FDFCF9' }}>
      <div className="max-w-md mx-auto">
        <Link to="/" className="text-xs mb-8 inline-block hover:opacity-70" style={{ ...sansFont, color: '#71717A' }}>
          ← Back
        </Link>

        <div className="text-center mb-10">
          <span
            className="inline-block rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider mb-4"
            style={{ ...sansFont, backgroundColor: `${PURPLE}18`, color: PURPLE }}
          >
            7-day free trial
          </span>
          <h1 className="text-3xl font-bold mb-2" style={{ ...displayFont, color: '#18181B' }}>
            Junior Linguist
          </h1>
          <p className="text-sm" style={{ ...sansFont, color: '#71717A' }}>
            Language learning for kids ages 7–14 — games, stories, and AI tutoring.
          </p>
          <p className="text-xs mt-1" style={{ ...sansFont, color: '#A1A1AA' }}>
            Spanish (25 topics) · French · Japanese · Italian · Portuguese (9 topics each)
          </p>
        </div>

        {isActive && (
          <div className="rounded-xl border px-5 py-4 text-center mb-8" style={{ borderColor: `${PURPLE}40`, backgroundColor: `${PURPLE}08` }}>
            <p className="text-sm font-semibold" style={{ color: PURPLE }}>
              {status === 'trialing' ? "You're in your free trial — enjoy!" : 'You have an active subscription.'}
            </p>
            <Link to="/learn" className="mt-2 inline-block text-xs underline" style={{ ...sansFont, color: '#71717A' }}>
              Back to learning →
            </Link>
          </div>
        )}

        {!isActive && (
          <>
            {/* Billing toggle */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex rounded-xl p-1 text-sm" style={{ backgroundColor: '#F4F0EB', border: '1px solid rgba(0,0,0,0.08)' }}>
                <button
                  onClick={() => setBilling('monthly')}
                  className="rounded-lg px-4 py-2 text-sm font-medium transition-all"
                  style={{
                    ...sansFont,
                    backgroundColor: billing === 'monthly' ? '#fff' : 'transparent',
                    color: billing === 'monthly' ? '#18181B' : '#71717A',
                    boxShadow: billing === 'monthly' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  }}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBilling('annual')}
                  className="rounded-lg px-4 py-2 text-sm font-medium transition-all flex items-center gap-1.5"
                  style={{
                    ...sansFont,
                    backgroundColor: billing === 'annual' ? '#fff' : 'transparent',
                    color: billing === 'annual' ? '#18181B' : '#71717A',
                    boxShadow: billing === 'annual' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  }}
                >
                  Annual
                  <span className="rounded text-[9px] font-bold px-1.5 py-0.5" style={{ backgroundColor: `${PURPLE}20`, color: PURPLE }}>
                    SAVE 34%
                  </span>
                </button>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden mb-4" style={{ border: `2px solid ${PURPLE}40`, backgroundColor: '#fff' }}>
              <div className="px-6 py-5" style={{ background: `linear-gradient(135deg, ${PURPLE}14 0%, transparent 100%)`, borderBottom: `1px solid ${PURPLE}20` }}>
                <div className="flex items-baseline gap-2">
                  {billing === 'annual' ? (
                    <>
                      <span className="text-4xl font-bold" style={{ ...displayFont, color: '#18181B' }}>$79</span>
                      <span className="text-sm" style={{ ...sansFont, color: '#71717A' }}>/year</span>
                      <span className="text-xs line-through" style={{ ...sansFont, color: '#A1A1AA' }}>$119.88</span>
                    </>
                  ) : (
                    <>
                      <span className="text-4xl font-bold" style={{ ...displayFont, color: '#18181B' }}>$9.99</span>
                      <span className="text-sm" style={{ ...sansFont, color: '#71717A' }}>/month</span>
                    </>
                  )}
                </div>
                {billing === 'annual' && (
                  <p className="text-xs mt-1 font-semibold" style={{ ...sansFont, color: PURPLE }}>
                    ~$6.58/month · Best value
                  </p>
                )}
                <p className="text-xs mt-1" style={{ ...sansFont, color: '#71717A' }}>First 7 days free — cancel anytime</p>
              </div>
              <div className="px-6 py-5">
                <ul className="space-y-2.5 mb-6">
                  {FEATURES.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm" style={{ ...sansFont, color: '#18181B' }}>
                      <span style={{ color: PURPLE }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href={checkoutLink}
                  className="flex items-center justify-center w-full rounded-full py-3.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
                  style={{ ...sansFont, backgroundColor: PURPLE }}
                >
                  Start free trial →
                </a>
                <p className="mt-3 text-center text-xs" style={{ ...sansFont, color: '#A1A1AA' }}>
                  You will not be charged for 7 days — cancel anytime
                </p>
              </div>
            </div>

            <div className="rounded-xl px-5 py-4" style={{ backgroundColor: SURFACE }}>
              <button
                onClick={() => setShowLT(v => !v)}
                className="w-full text-left text-sm font-semibold flex items-center justify-between"
                style={{ ...sansFont, color: '#18181B' }}
              >
                <span>Already a Language Threshold subscriber?</span>
                <span style={{ color: PURPLE }}>{showLT ? '↑' : '↓'}</span>
              </button>
              {showLT && (
                <div className="mt-3">
                  <p className="text-xs mb-3" style={{ ...sansFont, color: '#71717A' }}>
                    Get Junior Linguist for <strong style={{ color: PURPLE }}>$4.99/month</strong> — 50% off, exclusive for Language Threshold subscribers.
                  </p>
                  <a
                    href={LT50_LINK}
                    className="inline-flex items-center gap-1 rounded-full px-4 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90"
                    style={{ ...sansFont, backgroundColor: PURPLE }}
                  >
                    Get 50% off →
                  </a>
                </div>
              )}
            </div>
          </>
        )}

        <div className="mt-8 text-center text-xs" style={{ ...sansFont, color: '#A1A1AA' }}>
          Questions?{' '}
          <a href="mailto:support@languagethreshold.com" className="underline" style={{ color: '#71717A' }}>
            support@languagethreshold.com
          </a>
          <br />
          <span style={{ color: '#C4C4C4' }}>Junior Linguist is part of the Language Threshold family.</span>
        </div>
      </div>
    </div>
  )
}
