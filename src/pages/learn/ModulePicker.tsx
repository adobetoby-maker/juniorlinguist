import { useMemo, useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { KIDS_MODULES } from '../../data/kidsModules'
import { getAllProgress, fluencyPct } from '../../state/progress'
import { useAppState } from '../../state/AppState'
import ModulePickerCard from '../../components/learn/ModulePickerCard'
import LanguageTree from '../../components/learn/LanguageTree'
import { PURPLE, sansFont, displayFont } from '../../constants'
import { HELLO_LITTLE_ONE } from '../../data/booklets'

const LANG_TABS = [
  { key: 'es' as const, flag: '🇪🇸', label: 'Spanish' },
  { key: 'fr' as const, flag: '🇫🇷', label: 'French' },
  { key: 'ja' as const, flag: '🇯🇵', label: 'Japanese' },
  { key: 'it' as const, flag: '🇮🇹', label: 'Italian' },
  { key: 'pt' as const, flag: '🇧🇷', label: 'Portuguese' },
]

export default function ModulePicker() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  useEffect(() => {
    if (!localStorage.getItem('jl_onboarded_v1')) navigate('/onboarding', { replace: true })
  }, [navigate])
  useEffect(() => {
    const moduleId = searchParams.get('module')
    if (moduleId && KIDS_MODULES.some(m => m.id === moduleId)) {
      navigate(`/learn/${moduleId}`, { replace: true })
    }
  }, [searchParams, navigate])

  const savedLang = localStorage.getItem('jl_default_lang') as 'es' | 'fr' | 'ja' | 'it' | 'pt' | null
  const [lang, setLang] = useState<'es' | 'fr' | 'ja' | 'it' | 'pt'>(savedLang ?? 'es')
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

        {lang === 'es' && (
          <section aria-labelledby="picture-books-heading" className="mb-8 rounded-3xl border border-violet-100 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <h2 id="picture-books-heading" className="text-xl font-black text-slate-950">Picture Books</h2>
                <p className="text-sm text-slate-600">Read English and Spanish together.</p>
              </div>
              <Link
                to="/learn/books"
                className="rounded-full px-3 py-2 text-sm font-black text-violet-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
              >
                See all →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Link
                to="/learn/books/hello-little-one"
                className="group rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700"
              >
                <div className="aspect-square overflow-hidden rounded-2xl bg-violet-50">
                  <img
                    src={HELLO_LITTLE_ONE.pages[0].image.url}
                    alt={HELLO_LITTLE_ONE.pages[0].image.altText.target}
                    width={2048}
                    height={2048}
                    className="h-full w-full object-contain transition group-hover:scale-[1.02] motion-reduce:transform-none"
                  />
                </div>
                <p className="mt-2 text-sm font-black leading-tight text-slate-950">{HELLO_LITTLE_ONE.title}</p>
                <p className="text-xs font-semibold text-slate-600">{HELLO_LITTLE_ONE.pages.length} pages · Español</p>
              </Link>
              <div aria-disabled="true" className="aspect-square rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50">
                <div className="flex h-full flex-col items-center justify-center p-3 text-center text-slate-600">
                  <span aria-hidden="true" className="text-3xl">📚</span>
                  <p className="mt-2 text-sm font-black">More books</p>
                  <p className="text-xs">Coming soon</p>
                </div>
              </div>
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {visibleModules.map(mod => (
            <ModulePickerCard key={mod.id} mod={mod} progress={progress[mod.id]} />
          ))}
        </div>
      </div>
    </div>
  )
}
