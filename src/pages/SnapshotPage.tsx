import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { KIDS_MODULES } from '../data/kidsModules'

const LANG_LABELS: Record<string, string> = { es: 'Spanish', fr: 'French', ja: 'Japanese', it: 'Italian', pt: 'Portuguese' }
const LANG_FLAGS: Record<string, string> = { es: '🇪🇸', fr: '🇫🇷', ja: '🇯🇵', it: '🇮🇹', pt: '🇧🇷' }

const WAITLIST_URL = 'mailto:adobetoby@gmail.com?subject=Junior%20Linguist%20Waitlist&body=I%20want%20to%20track%20my%20child%27s%20progress%20in%20Junior%20Linguist!'

declare global {
  interface Window { va?: (event: string, name: string, data?: Record<string, unknown>) => void }
}

export default function SnapshotPage() {
  const [params] = useSearchParams()
  const [copied, setCopied] = useState(false)

  const moduleId = params.get('m') ?? ''
  const got = Number(params.get('got') ?? 0)
  const total = Number(params.get('total') ?? 0)
  const lang = params.get('lang') ?? 'es'

  const mod = KIDS_MODULES.find(m => m.id === moduleId)
  const langLabel = LANG_LABELS[lang] ?? lang
  const flag = LANG_FLAGS[lang] ?? '🌍'
  const moduleName = mod?.title ?? moduleId

  useEffect(() => {
    window.va?.('track', 'snapshot_view', { moduleId, lang, got, total })
  }, [moduleId, lang, got, total])

  function handleWaitlist() {
    window.va?.('track', 'snapshot_waitlist_click', { moduleId, lang })
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16" style={{ backgroundColor: '#FDFCF9', fontFamily: '"Nunito", sans-serif' }}>
      {/* Card */}
      <div
        className="w-full max-w-sm rounded-3xl p-8 text-center"
        style={{ backgroundColor: '#fff', boxShadow: '0 8px 40px rgba(0,0,0,0.10)', border: '1.5px solid #f0f0f0' }}
      >
        <div className="text-5xl mb-4">{flag}</div>
        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#A1A1AA' }}>
          Junior Linguist Progress
        </p>
        <h1 className="text-2xl font-extrabold mb-2" style={{ color: '#18181B' }}>
          {got} {langLabel} {total > 0 ? `word${total !== 1 ? 's' : ''}` : 'words'} learned!
        </h1>
        {moduleName && (
          <p className="text-base mb-6" style={{ color: '#71717A' }}>
            Topic: <span className="font-semibold" style={{ color: '#18181B' }}>{moduleName}</span>
          </p>
        )}

        {/* Progress bar */}
        {total > 0 && (
          <div className="rounded-full overflow-hidden mb-6" style={{ height: 10, backgroundColor: '#F3F4F6' }}>
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${Math.round((got / total) * 100)}%`, backgroundColor: mod?.color ?? '#7C3AED' }}
            />
          </div>
        )}

        <p className="text-sm mb-6" style={{ color: '#71717A' }}>
          {got >= total && total > 0
            ? `All ${total} words mastered in this session! 🏆`
            : `${got} of ${total} words mastered this session.`}
        </p>

        {/* Waitlist CTA */}
        <div className="rounded-2xl p-5 mb-4" style={{ backgroundColor: '#F5F3FF' }}>
          <p className="font-bold text-base mb-1" style={{ color: '#18181B' }}>
            Want to track their progress?
          </p>
          <p className="text-sm mb-4" style={{ color: '#71717A' }}>
            Junior Linguist teaches real conversations, not just flashcards. Get early access.
          </p>
          <a
            href={WAITLIST_URL}
            onClick={handleWaitlist}
            className="block w-full py-3 rounded-full font-bold text-base text-white text-center transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#7C3AED', textDecoration: 'none' }}
          >
            Join the waitlist →
          </a>
        </div>

        {/* Copy link */}
        <button
          onClick={handleCopyLink}
          className="w-full py-3 rounded-full font-semibold text-sm transition-opacity hover:opacity-80"
          style={{ backgroundColor: '#F4F4F5', color: '#52525B', border: 'none', cursor: 'pointer' }}
        >
          {copied ? '✓ Link copied!' : '📋 Copy this link'}
        </button>
      </div>

      {/* Footer link */}
      <p className="text-xs mt-8" style={{ color: '#A1A1AA' }}>
        <Link to="/learn" style={{ color: '#7C3AED', textDecoration: 'none', fontWeight: 700 }}>
          Try Junior Linguist free →
        </Link>
      </p>
    </div>
  )
}
