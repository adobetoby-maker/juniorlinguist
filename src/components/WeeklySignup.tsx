import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { ArrowRight, Mail } from 'lucide-react'
import { displayFont, sansFont } from '../constants'
import { WEEKLY_ENDPOINT, WEEKLY_PRIVACY, WEEKLY_TRACKS, weeklyAvailability, weeklyRequest, weeklyRequestAccepted, type WeeklyAvailability, type WeeklyTrackId } from '../lib/weekly-signup'
import './WeeklySignup.css'

type Turnstile = {
  render: (container: HTMLElement, options: Record<string, unknown>) => string
  reset: (id: string) => void
  remove: (id: string) => void
}
declare global { interface Window { turnstile?: Turnstile } }
let widgetScript: Promise<Turnstile> | null = null
function loadTurnstile(): Promise<Turnstile> {
  if (window.turnstile) return Promise.resolve(window.turnstile)
  if (widgetScript) return widgetScript
  widgetScript = new Promise<Turnstile>((resolve, reject) => {
    const previous = document.getElementById('weekly-turnstile-script')
    previous?.remove()
    const script = document.createElement('script')
    script.id = 'weekly-turnstile-script'
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
    script.async = true; script.defer = true
    const timeout = window.setTimeout(() => { widgetScript = null; reject(new Error('Verification is unavailable.')) }, 15000)
    script.onload = () => { clearTimeout(timeout); if (window.turnstile) resolve(window.turnstile); else { widgetScript = null; reject(new Error('Verification is unavailable.')) } }
    script.onerror = () => { clearTimeout(timeout); widgetScript = null; reject(new Error('Verification is unavailable.')) }
    document.head.appendChild(script)
  })
  return widgetScript
}

export default function WeeklySignup() {
  const id = useId(), widgetContainer = useRef<HTMLDivElement>(null), widgetId = useRef<string | null>(null)
  const [availability, setAvailability] = useState<WeeklyAvailability | null>(null), [checking, setChecking] = useState(true), [availabilityAttempt, setAvailabilityAttempt] = useState(0)
  const [email, setEmail] = useState(''), [trackId, setTrackId] = useState<WeeklyTrackId | ''>(''), [adult, setAdult] = useState(false), [consent, setConsent] = useState(false), [website, setWebsite] = useState('')
  const [requestId, setRequestId] = useState(() => crypto.randomUUID()), [token, setToken] = useState(''), [widgetAttempt, setWidgetAttempt] = useState(0), [widgetError, setWidgetError] = useState('')
  const [busy, setBusy] = useState(false), [received, setReceived] = useState(false), [error, setError] = useState('')
  const mounted = useRef(true), busyRef = useRef(false), submitted = useRef(false), sendController = useRef<AbortController | null>(null)
  useEffect(() => {
    const controller = new AbortController(), timer = window.setTimeout(() => controller.abort(), 8000)
    let live = true
    setChecking(true); setAvailability(null)
    void fetch(`${WEEKLY_ENDPOINT}?availability=1`, { signal: controller.signal, credentials: 'omit', cache: 'no-store' })
      .then(async response => response.ok ? weeklyAvailability(await response.json()) : null)
      .then(value => { if (live) { setAvailability(value); setTrackId(current => value?.tracks.includes(current as WeeklyTrackId) ? current : '') } })
      .catch(() => { if (live) setAvailability(null) })
      .finally(() => { clearTimeout(timer); if (live) setChecking(false) })
    return () => { live = false; clearTimeout(timer); controller.abort() }
  }, [availabilityAttempt])
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; sendController.current?.abort() } }, [])
  useEffect(() => {
    if (!availability || !widgetContainer.current || received) return
    let live = true, instance: string | null = null
    setToken(''); setWidgetError('')
    void loadTurnstile().then(api => {
      if (!live || !widgetContainer.current) return
      instance = api.render(widgetContainer.current, {
        sitekey: availability.siteKey, action: 'weekly_signup', cData: requestId, theme: 'light', size: 'flexible', 'response-field': false,
        callback: (value: string) => { if (live) { setToken(value); setWidgetError('') } },
        'expired-callback': () => { if (live) setToken('') },
        'error-callback': () => { if (live) { setToken(''); setWidgetError('Verification needs another try.') } },
      })
      widgetId.current = instance
    }).catch(() => { if (live) setWidgetError('Verification is unavailable right now. Please try again.') })
    return () => { live = false; if (instance) window.turnstile?.remove(instance); if (widgetId.current === instance) widgetId.current = null }
  }, [availability, requestId, widgetAttempt, received])
  function changedRequest() {
    setError('')
    if (submitted.current) { submitted.current = false; setToken(''); setRequestId(crypto.randomUUID()) }
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busyRef.current || !availability) return
    let body
    try { body = weeklyRequest({ email, trackId, adult, consent, token, requestId, website }, availability) }
    catch { setError('Complete your email, series choice, permission, and verification first.'); return }
    submitted.current = true; busyRef.current = true; setBusy(true); setError('')
    const controller = new AbortController(); sendController.current = controller
    const timer = window.setTimeout(() => controller.abort(), 15000)
    try {
      const response = await fetch(WEEKLY_ENDPOINT, { method: 'POST', credentials: 'omit', signal: controller.signal, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const value: unknown = await response.json()
      if (controller.signal.aborted || !mounted.current) return
      if (weeklyRequestAccepted(response.status, value)) setReceived(true)
      else setError(response.status === 429 ? 'Please wait a little before trying again.' : response.status === 503 ? 'Weekly lessons are unavailable right now. Please try again later.' : 'The request could not be confirmed. Check the form and try again.')
    } catch { if (mounted.current && sendController.current === controller) setError('The request could not be confirmed. Please try again.') }
    finally {
      clearTimeout(timer); busyRef.current = false; if (mounted.current) { setBusy(false); setToken('') }
      // The request ID remains stable for a network retry; the token is single-use.
      if (mounted.current && widgetId.current) window.turnstile?.reset(widgetId.current)
    }
  }
  return <section className="weekly-signup" style={sansFont} aria-labelledby={`${id}-title`}>
    <div className="weekly-signup-intro"><span className="weekly-eyebrow"><Mail size={16} aria-hidden="true" />An optional weekly lesson</span><h2 id={`${id}-title`} style={displayFont}>A small next step,<br />once a week.</h2><p>Choose one series for a useful lesson and its learning companion. Your free practice and downloads stay separate from email signup.</p></div>
    <div className="weekly-signup-panel">
      {received ? <div role="status" className="weekly-received"><h3 style={displayFont}>Request received.</h3><p>If this address is eligible, a confirmation email will arrive. Weekly lessons start only after you confirm the invitation.</p><p>You can unsubscribe at any time.</p></div> : checking ? <p role="status">Checking weekly lesson availability…</p> : !availability ? <div><h3 style={displayFont}>Weekly lessons are not available right now.</h3><p>Keep exploring the free practice and learning companions. You don’t need an email subscription to use them.</p><button className="weekly-secondary" type="button" onClick={() => setAvailabilityAttempt(value => value + 1)}>Check again</button></div> : <form onSubmit={submit}>
        <label className="weekly-field-label" htmlFor={`${id}-email`}>Your adult email</label><input id={`${id}-email`} name="email" type="email" autoComplete="email" maxLength={254} required value={email} disabled={busy} onChange={event => { changedRequest(); setEmail(event.target.value) }} />
        <fieldset disabled={busy}><legend>Choose one weekly series</legend><div className="weekly-track-options">{WEEKLY_TRACKS.map(track => { const available = availability.tracks.includes(track.id); return <label className={`weekly-track ${trackId === track.id ? 'selected' : ''}`} key={track.id}><input type="radio" name={`${id}-track`} value={track.id} required checked={trackId === track.id} disabled={!available} onChange={() => { changedRequest(); setTrackId(track.id) }} /><span><strong>{track.label}</strong><small>{track.detail} {available ? `${track.weeks} weekly lessons.` : 'Coming soon.'}</small></span></label> })}</div></fieldset>
        <label className="weekly-checkbox"><input type="checkbox" required checked={adult} disabled={busy} onChange={event => setAdult(event.target.checked)} /><span>I am a parent, educator, or adult learner.</span></label>
        <label className="weekly-checkbox"><input type="checkbox" required checked={consent} disabled={busy} onChange={event => setConsent(event.target.checked)} /><span>I want one weekly lesson email, with useful downloads, from my chosen series. I can unsubscribe at any time. Weekly emails start only after I confirm the email invitation.</span></label>
        <p className="weekly-privacy">Use an adult email address. We don’t ask for child names or learning records here. <a href={WEEKLY_PRIVACY} target="_blank" rel="noopener noreferrer">Privacy policy</a></p>
        <div className="weekly-trap" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" value={website} onChange={event => setWebsite(event.target.value)} /></label></div>
        <div className="weekly-verification" ref={widgetContainer} />
        {widgetError && <div role="status"><p>{widgetError}</p><button className="weekly-secondary" type="button" onClick={() => setWidgetAttempt(value => value + 1)}>Try verification again</button></div>}
        {error && <p className="weekly-error" role="alert">{error}</p>}
        <button className="weekly-submit" type="submit" disabled={busy || !email.trim() || !trackId || !adult || !consent || !token}>{busy ? 'Requesting invitation…' : 'Request the weekly invitation'}<ArrowRight size={16} aria-hidden="true" /></button>
      </form>}
    </div>
  </section>
}
