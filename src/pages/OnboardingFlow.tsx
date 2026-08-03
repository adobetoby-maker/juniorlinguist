import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { displayFont, sansFont, PURPLE } from '../constants'

declare global {
  interface Window { va?: (event: string, name: string, data?: Record<string, unknown>) => void }
}

const LANG_TABS = [
  { key: 'es' as const, flag: '🇪🇸', label: 'Spanish', topics: 25 },
  { key: 'fr' as const, flag: '🇫🇷', label: 'French', topics: 9 },
  { key: 'ja' as const, flag: '🇯🇵', label: 'Japanese', topics: 9 },
  { key: 'it' as const, flag: '🇮🇹', label: 'Italian', topics: 9 },
  { key: 'pt' as const, flag: '🇧🇷', label: 'Portuguese', topics: 9 },
]

const TOTAL_STEPS = 3

type LangKey = 'es' | 'fr' | 'ja' | 'it' | 'pt'

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex flex-col items-center gap-2 mb-8">
      <div className="flex items-center gap-2">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-300"
            style={{
              width: i + 1 === current ? 24 : 8,
              height: 8,
              backgroundColor: i + 1 <= current ? PURPLE : '#E4E4E7',
            }}
          />
        ))}
      </div>
      <p className="text-xs font-semibold" style={{ ...sansFont, color: '#A1A1AA' }}>
        Step {current} of {total}
      </p>
    </div>
  )
}

export default function OnboardingFlow() {
  const navigate = useNavigate()
  const [screen, setScreen] = useState(1)
  const [lang, setLang] = useState<LangKey>('es')

  function finish(heritage: boolean) {
    localStorage.setItem('jl_onboarded_v1', 'true')
    localStorage.setItem('jl_default_lang', lang)
    window.va?.('track', heritage ? 'onboarding_heritage_yes' : 'onboarding_heritage_no', { lang })
    // Route to pricing so users can start their trial — not to /learn dead-end
    navigate('/pricing', { replace: true })
  }

  if (screen === 1) {
    return (
      <Screen>
        <StepIndicator current={1} total={TOTAL_STEPS} />
        <div className="text-6xl mb-6">🌍</div>
        <h1 className="text-3xl font-extrabold mb-3 text-center leading-tight" style={{ ...displayFont, color: '#18181B' }}>
          Real conversations,<br />not just flashcards.
        </h1>
        <p className="text-base text-center mb-10" style={{ ...sansFont, color: '#71717A', maxWidth: 300 }}>
          Junior Linguist teaches kids to actually speak, not just memorize.
          Pick a language and we'll show you exactly what your child will learn.
        </p>
        <button
          onClick={() => setScreen(2)}
          className="w-full max-w-xs py-4 rounded-full font-bold text-base text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: PURPLE, fontFamily: '"Nunito", sans-serif', border: 'none', cursor: 'pointer' }}
        >
          Let's start →
        </button>
        <Link
          to="/"
          className="mt-4 text-xs hover:opacity-70"
          style={{ ...sansFont, color: '#A1A1AA' }}
        >
          ← Back to homepage
        </Link>
      </Screen>
    )
  }

  if (screen === 2) {
    return (
      <Screen>
        <StepIndicator current={2} total={TOTAL_STEPS} />
        <div className="text-5xl mb-4">🗣️</div>
        <h2 className="text-2xl font-extrabold mb-2 text-center" style={{ ...displayFont, color: '#18181B' }}>
          Which language will your<br />child be learning?
        </h2>
        <p className="text-sm text-center mb-8" style={{ ...sansFont, color: '#71717A' }}>
          You can switch or add more languages any time in the app.
        </p>
        <div className="flex flex-col gap-3 w-full max-w-xs mb-8">
          {LANG_TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setLang(t.key)}
              className="w-full py-3.5 px-4 rounded-2xl font-bold text-base transition-all flex items-center justify-between"
              style={{
                fontFamily: '"Nunito", sans-serif',
                border: `2px solid ${lang === t.key ? PURPLE : '#E4E4E7'}`,
                backgroundColor: lang === t.key ? '#F5F3FF' : '#fff',
                color: lang === t.key ? PURPLE : '#18181B',
                cursor: 'pointer',
              }}
            >
              <span>{t.flag} {t.label}</span>
              <span className="text-xs font-semibold" style={{ color: lang === t.key ? PURPLE : '#A1A1AA' }}>
                {t.topics} topics
              </span>
            </button>
          ))}
        </div>
        <button
          onClick={() => setScreen(3)}
          className="w-full max-w-xs py-4 rounded-full font-bold text-base text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: PURPLE, fontFamily: '"Nunito", sans-serif', border: 'none', cursor: 'pointer' }}
        >
          Continue →
        </button>
        <button
          onClick={() => setScreen(1)}
          className="mt-4 text-xs hover:opacity-70"
          style={{ ...sansFont, color: '#A1A1AA', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          ← Back
        </button>
      </Screen>
    )
  }

  // Screen 3 — Goal framing, then route to pricing
  const langLabel = LANG_TABS.find(t => t.key === lang)?.label ?? 'this language'
  const langFlag = LANG_TABS.find(t => t.key === lang)?.flag ?? '🌍'
  return (
    <Screen>
      <StepIndicator current={3} total={TOTAL_STEPS} />
      <div className="text-5xl mb-4">{langFlag}</div>
      <h2 className="text-2xl font-extrabold mb-2 text-center" style={{ ...displayFont, color: '#18181B' }}>
        Great choice — {langLabel}!
      </h2>
      <p className="text-sm text-center mb-8" style={{ ...sansFont, color: '#71717A', maxWidth: 280 }}>
        What best describes your goal?
        This helps us personalise your child's learning experience.
      </p>
      <div className="flex flex-col gap-3 w-full max-w-xs mb-6">
        <button
          onClick={() => {
            window.va?.('track', 'onboarding_heritage_yes', { lang })
            finish(true)
          }}
          className="w-full py-4 px-5 rounded-2xl font-bold text-base transition-all hover:opacity-90 text-left"
          style={{ backgroundColor: '#F5F3FF', color: PURPLE, fontFamily: '"Nunito", sans-serif', border: `2px solid ${PURPLE}`, cursor: 'pointer' }}
        >
          🏡 Reconnecting with family heritage
          <p className="text-xs font-normal mt-0.5" style={{ color: '#6D28D9' }}>
            We want our kids to speak the family language
          </p>
        </button>
        <button
          onClick={() => finish(false)}
          className="w-full py-4 px-5 rounded-2xl font-bold text-base transition-all hover:opacity-90 text-left"
          style={{ backgroundColor: '#fff', color: '#18181B', fontFamily: '"Nunito", sans-serif', border: '2px solid #E4E4E7', cursor: 'pointer' }}
        >
          🌱 Starting fresh
          <p className="text-xs font-normal mt-0.5" style={{ color: '#71717A' }}>
            No prior exposure — building from the ground up
          </p>
        </button>
        <button
          onClick={() => finish(false)}
          className="w-full py-4 px-5 rounded-2xl font-bold text-base transition-all hover:opacity-90 text-left"
          style={{ backgroundColor: '#fff', color: '#18181B', fontFamily: '"Nunito", sans-serif', border: '2px solid #E4E4E7', cursor: 'pointer' }}
        >
          📚 Homeschool curriculum
          <p className="text-xs font-normal mt-0.5" style={{ color: '#71717A' }}>
            Adding language to our homeschool plan
          </p>
        </button>
      </div>
      <button
        onClick={() => setScreen(2)}
        className="text-xs hover:opacity-70"
        style={{ ...sansFont, color: '#A1A1AA', background: 'none', border: 'none', cursor: 'pointer' }}
      >
        ← Back
      </button>
    </Screen>
  )
}

function Screen({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-16"
      style={{ backgroundColor: '#FDFCF9', fontFamily: '"Nunito", sans-serif' }}
    >
      <div className="flex flex-col items-center w-full max-w-xs">
        {children}
      </div>
    </div>
  )
}
