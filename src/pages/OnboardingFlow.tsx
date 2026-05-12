import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { displayFont, sansFont } from '../constants'

declare global {
  interface Window { va?: (event: string, name: string, data?: Record<string, unknown>) => void }
}

const LANG_TABS = [
  { key: 'es' as const, flag: '🇪🇸', label: 'Spanish' },
  { key: 'fr' as const, flag: '🇫🇷', label: 'French' },
  { key: 'ja' as const, flag: '🇯🇵', label: 'Japanese' },
  { key: 'it' as const, flag: '🇮🇹', label: 'Italian' },
  { key: 'pt' as const, flag: '🇧🇷', label: 'Portuguese' },
]

type LangKey = 'es' | 'fr' | 'ja' | 'it' | 'pt'

export default function OnboardingFlow() {
  const navigate = useNavigate()
  const [screen, setScreen] = useState(1)
  const [lang, setLang] = useState<LangKey>('es')

  function finish(heritage: boolean) {
    localStorage.setItem('jl_onboarded_v1', 'true')
    localStorage.setItem('jl_default_lang', lang)
    window.va?.('track', heritage ? 'onboarding_heritage_yes' : 'onboarding_heritage_no', { lang })
    navigate('/learn', { replace: true })
  }

  if (screen === 1) {
    return (
      <Screen>
        <div className="text-6xl mb-6">🌍</div>
        <h1 className="text-3xl font-extrabold mb-3 text-center leading-tight" style={{ ...displayFont, color: '#18181B' }}>
          Real conversations,<br />not just flashcards.
        </h1>
        <p className="text-base text-center mb-10" style={{ ...sansFont, color: '#71717A', maxWidth: 300 }}>
          Junior Linguist teaches kids to actually speak, not just memorize.
        </p>
        <button
          onClick={() => setScreen(2)}
          className="w-full max-w-xs py-4 rounded-full font-bold text-base text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#7C3AED', fontFamily: '"Nunito", sans-serif', border: 'none', cursor: 'pointer' }}
        >
          Let's start →
        </button>
      </Screen>
    )
  }

  if (screen === 2) {
    return (
      <Screen>
        <div className="text-5xl mb-4">🗣️</div>
        <h2 className="text-2xl font-extrabold mb-2 text-center" style={{ ...displayFont, color: '#18181B' }}>
          Pick a language
        </h2>
        <p className="text-sm text-center mb-8" style={{ ...sansFont, color: '#71717A' }}>
          You can always add more later.
        </p>
        <div className="flex flex-col gap-3 w-full max-w-xs mb-8">
          {LANG_TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setLang(t.key)}
              className="w-full py-4 rounded-2xl font-bold text-base transition-all"
              style={{
                fontFamily: '"Nunito", sans-serif',
                border: `2px solid ${lang === t.key ? '#7C3AED' : '#E4E4E7'}`,
                backgroundColor: lang === t.key ? '#F5F3FF' : '#fff',
                color: lang === t.key ? '#7C3AED' : '#18181B',
                cursor: 'pointer',
              }}
            >
              {t.flag} {t.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => setScreen(3)}
          className="w-full max-w-xs py-4 rounded-full font-bold text-base text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#7C3AED', fontFamily: '"Nunito", sans-serif', border: 'none', cursor: 'pointer' }}
        >
          Continue →
        </button>
      </Screen>
    )
  }

  // Screen 3 — Heritage track (E2)
  const langLabel = LANG_TABS.find(t => t.key === lang)?.label ?? 'this language'
  return (
    <Screen>
      <div className="text-5xl mb-4">👨‍👩‍👧</div>
      <h2 className="text-2xl font-extrabold mb-3 text-center" style={{ ...displayFont, color: '#18181B' }}>
        Are you reconnecting with<br />your family's language?
      </h2>
      <div className="flex flex-col gap-3 w-full max-w-xs mb-8 mt-2">
        <button
          onClick={() => {
            window.va?.('track', 'onboarding_heritage_yes', { lang })
            // Show heritage copy briefly then finish
            finish(true)
          }}
          className="w-full py-4 rounded-2xl font-bold text-base transition-all hover:opacity-90"
          style={{ backgroundColor: '#F5F3FF', color: '#7C3AED', fontFamily: '"Nunito", sans-serif', border: '2px solid #7C3AED', cursor: 'pointer' }}
        >
          Yes, we want our kids to speak {langLabel}!
        </button>
        <button
          onClick={() => finish(false)}
          className="w-full py-4 rounded-2xl font-bold text-base transition-all hover:opacity-90"
          style={{ backgroundColor: '#fff', color: '#52525B', fontFamily: '"Nunito", sans-serif', border: '2px solid #E4E4E7', cursor: 'pointer' }}
        >
          No, we're starting fresh
        </button>
      </div>
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
