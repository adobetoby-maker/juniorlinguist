import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { KIDS_MODULES } from '../../data/kidsModules'
import { getAllProgress, fluencyPct } from '../../state/progress'
import { useAppState } from '../../state/AppState'
import ModulePickerCard from '../../components/learn/ModulePickerCard'
import LanguageTree from '../../components/learn/LanguageTree'
import { PURPLE, sansFont, displayFont } from '../../constants'

const LANG_TABS = [
  { key: 'es' as const, flag: '🇪🇸', label: 'Spanish' },
  { key: 'fr' as const, flag: '🇫🇷', label: 'French' },
  { key: 'ja' as const, flag: '🇯🇵', label: 'Japanese' },
  { key: 'it' as const, flag: '🇮🇹', label: 'Italian' },
  { key: 'pt' as const, flag: '🇧🇷', label: 'Portuguese' },
]

export default function ModulePicker() {
  const [lang, setLang] = useState<'es' | 'fr' | 'ja' | 'it' | 'pt'>('es')
  const { state } = useAppState()
  const progress = useMemo(() => getAllProgress(), [])
  const visibleModules = useMemo(() => KIDS_MODULES.filter(m => m.language === lang), [lang])
  const totalFluency = useMemo(() => {
    if (visibleModules.length === 0) return 0
    return Math.round(
      visibleModules.reduce((sum, m) => sum + fluencyPct(progress[m.id] ?? { moduleId: m.id, flashBestStars: 0, matchBestStars: 0, quizBestScore: 0, quizBestStars: 0, storiesRead: 0, speakSessions: 0, lastPlayedAt: null }, m.id), 0)
      / visibleModules.length
    )
  }, [progress, visibleModules])

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FDFCF9' }}>
      {/* Slim top bar */}
      <div
        className="fixed top-0 inset-x-0 z-40 flex items-center justify-between px-5"
        style={{ height: 56, backgroundColor: 'rgba(253,252,249,0.97)', backdropFilter: 'blur(8px)', borderBottom: '1px solid rgba(124,58,237,0.12)' }}
      >
        <Link to="/" style={{ textDecoration: 'none' }}>
          <span className="font-bold text-base" style={{ ...sansFont, color: PURPLE }}>← Junior Linguist</span>
        </Link>
        <div className="flex items-center gap-2">
          {state.shieldActive && (
            <span title="Streak Shield active" style={{ fontSize: 18 }}>🛡️</span>
          )}
          <Link to="/learn/dashboard" style={{ textDecoration: 'none' }}>
            <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ ...sansFont, backgroundColor: `${PURPLE}14`, color: PURPLE }}>
              🏆 {totalFluency}% fluent
            </span>
          </Link>
        </div>
      </div>

      <div className="pt-20 pb-16 px-5 max-w-4xl mx-auto">
        <div className="text-center mb-5">
          <h1 className="text-3xl font-bold mb-1" style={{ ...displayFont, color: '#18181B' }}>
            Pick a Topic
          </h1>
          <p className="text-sm" style={{ ...sansFont, color: '#71717A' }}>
            10 activities per topic — stories, games, speaking, and more!
          </p>
        </div>

        {/* Language selector */}
        <div className="flex justify-center gap-2 mb-6">
          {LANG_TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setLang(tab.key)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-sm transition-all"
              style={{
                fontFamily: '"Nunito", sans-serif',
                backgroundColor: lang === tab.key ? PURPLE : `${PURPLE}14`,
                color: lang === tab.key ? '#fff' : PURPLE,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {tab.flag} {tab.label}
            </button>
          ))}
        </div>

        {/* Fluency tree hero — only for ES (primary language) */}
        {lang === 'es' && <LanguageTree />}

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {visibleModules.map(mod => (
            <ModulePickerCard key={mod.id} mod={mod} progress={progress[mod.id]} />
          ))}
        </div>
      </div>
    </div>
  )
}
