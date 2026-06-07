import { useState } from 'react'
import { APP_URL, displayFont, sansFont, PURPLE, BG } from '../constants'

type FormState = 'idle' | 'loading' | 'success' | 'error'

export default function EmailCaptureSection() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [state, setState] = useState<FormState>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) {
      setErrorMsg('Please enter your email address.')
      setState('error')
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      setErrorMsg('Please enter a valid email address.')
      setState('error')
      return
    }
    setState('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/email-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), name: name.trim() }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) {
        setErrorMsg(data.error ?? 'Something went wrong. Please try again.')
        setState('error')
        return
      }
      setState('success')
    } catch {
      setErrorMsg('Network error. Please check your connection and try again.')
      setState('error')
    }
  }

  return (
    <section
      className="py-20 px-6"
      style={{ backgroundColor: BG }}
    >
      <div className="max-w-2xl mx-auto text-center">
        {/* Tag chip */}
        <div className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full" style={{ backgroundColor: `${PURPLE}14`, border: `1px solid ${PURPLE}25` }}>
          <span className="text-xs font-bold tracking-widest uppercase" style={{ ...sansFont, color: PURPLE }}>
            FREE PHRASES
          </span>
        </div>

        {state === 'success' ? (
          /* Success state */
          <div className="py-10">
            <div className="text-5xl mb-5">📬</div>
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ ...displayFont, color: '#18181B' }}
            >
              Check your inbox!
            </h2>
            <p className="text-base leading-relaxed mb-8" style={{ ...sansFont, color: '#71717A' }}>
              Your phrases are on their way. Put them on the fridge and start today.
            </p>
            <a
              href={APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 rounded-full font-bold text-base transition-opacity hover:opacity-90"
              style={{ ...sansFont, backgroundColor: PURPLE, color: '#fff' }}
            >
              Or start learning now →
            </a>
          </div>
        ) : (
          /* Form state */
          <>
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ ...displayFont, color: '#18181B' }}
            >
              Start with 9 phrases.<br />
              <em style={{ color: PURPLE }}>We'll send them to your inbox.</em>
            </h2>

            <p className="text-base leading-relaxed mb-8 max-w-xl mx-auto" style={{ ...sansFont, color: '#71717A' }}>
              A printable starter list for ages 7–14. Add your email and we'll send it now,
              plus tips for making Spanish stick at home.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <input
                type="text"
                placeholder="Your name (optional)"
                value={name}
                onChange={e => setName(e.target.value)}
                disabled={state === 'loading'}
                className="flex-1 px-5 py-3.5 rounded-full text-sm outline-none transition-shadow focus:ring-2"
                style={{
                  ...sansFont,
                  border: `2px solid rgba(0,0,0,0.10)`,
                  backgroundColor: '#fff',
                  color: '#18181B',
                }}
              />
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                disabled={state === 'loading'}
                className="flex-1 px-5 py-3.5 rounded-full text-sm outline-none transition-shadow focus:ring-2"
                style={{
                  ...sansFont,
                  border: `2px solid rgba(0,0,0,0.10)`,
                  backgroundColor: '#fff',
                  color: '#18181B',
                }}
              />
              <button
                type="submit"
                disabled={state === 'loading'}
                className="px-7 py-3.5 rounded-full font-bold text-sm transition-opacity hover:opacity-90 whitespace-nowrap disabled:opacity-60"
                style={{ ...sansFont, backgroundColor: PURPLE, color: '#fff' }}
              >
                {state === 'loading' ? 'Sending…' : 'Send me the phrases →'}
              </button>
            </form>

            {state === 'error' && (
              <p className="mt-4 text-sm" style={{ ...sansFont, color: '#DC2626' }}>
                {errorMsg}
              </p>
            )}

            <p className="mt-5 text-xs" style={{ ...sansFont, color: '#A1A1AA' }}>
              No spam. Unsubscribe anytime. We send language tips, not junk.
            </p>
          </>
        )}
      </div>
    </section>
  )
}
