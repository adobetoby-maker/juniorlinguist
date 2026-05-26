import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { PURPLE, sansFont, displayFont, BG, TEXT, MUTED } from '../constants'
import { supabase } from '../state/subscription-state'

type Mode = 'signin' | 'signup' | 'forgot' | 'check-email'

export default function Login() {
  const [mode, setMode] = useState<Mode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [checkMsg, setCheckMsg] = useState('')
  const navigate = useNavigate()

  function reset(m: Mode) { setErr(null); setMode(m) }

  async function handleOAuth(provider: 'google' | 'apple') {
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/learn` },
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErr(null)
    if (!email.includes('@')) { setErr('Enter a valid email.'); return }

    if (mode === 'forgot') {
      setLoading(true)
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      })
      setLoading(false)
      if (error) { setErr(error.message); return }
      setCheckMsg('Password reset link sent — check your inbox.')
      setMode('check-email')
      return
    }

    if (password.length < 6) { setErr('Password must be at least 6 characters.'); return }
    setLoading(true)

    if (mode === 'signin') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      setLoading(false)
      if (error) {
        const m = error.message.toLowerCase()
        if (m.includes('invalid') || m.includes('credentials') || m.includes('wrong'))
          setErr('Incorrect email or password.')
        else if (m.includes('email not confirmed'))
          setErr('Please confirm your email first — check your inbox.')
        else setErr(error.message)
        return
      }
      navigate('/learn')
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/learn` },
      })
      setLoading(false)
      if (error) { setErr(error.message); return }
      if (!data.session) {
        setCheckMsg(`Confirmation link sent to ${email}. Click it to activate your account, then sign in.`)
        setMode('check-email')
      } else {
        navigate('/learn')
      }
    }
  }

  if (mode === 'check-email') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: BG }}>
        <div className="max-w-sm w-full text-center">
          <div className="text-5xl mb-4">📬</div>
          <h2 className="text-2xl font-bold mb-2" style={{ ...displayFont, color: TEXT }}>Check your email</h2>
          <p className="text-sm mb-6" style={{ ...sansFont, color: MUTED }}>{checkMsg}</p>
          <button onClick={() => reset('signin')} className="text-xs underline" style={{ ...sansFont, color: PURPLE }}>
            ← Back to sign in
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: BG }}>
      <div className="max-w-sm w-full">
        <Link to="/" className="text-xs mb-8 inline-block hover:opacity-70" style={{ ...sansFont, color: MUTED }}>
          ← Back
        </Link>

        <h1 className="text-2xl font-bold mb-1" style={{ ...displayFont, color: TEXT }}>
          {mode === 'signin' ? 'Sign in' : mode === 'signup' ? 'Create account' : 'Reset password'}
        </h1>
        <p className="text-sm mb-6" style={{ ...sansFont, color: MUTED }}>
          {mode === 'signin'
            ? 'Welcome back to Junior Linguist.'
            : mode === 'signup'
            ? 'Start your 7-day free trial.'
            : "We'll send a reset link to your email."}
        </p>

        {/* OAuth buttons — hidden on forgot screen */}
        {mode !== 'forgot' && (
          <>
            <div className="space-y-2 mb-4">
              <button
                type="button"
                onClick={() => handleOAuth('google')}
                className="w-full flex items-center justify-center gap-2.5 rounded-xl border px-4 py-3 text-sm font-medium transition-opacity hover:opacity-80"
                style={{ ...sansFont, borderColor: '#E4E4E7', color: TEXT, backgroundColor: 'white' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              <button
                type="button"
                onClick={() => handleOAuth('apple')}
                className="w-full flex items-center justify-center gap-2.5 rounded-xl border px-4 py-3 text-sm font-medium transition-opacity hover:opacity-80"
                style={{ ...sansFont, borderColor: '#18181B', color: 'white', backgroundColor: '#18181B' }}
              >
                <svg width="15" height="18" viewBox="0 0 814 1000" aria-hidden>
                  <path fill="currentColor" d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-37.5-155.5-122.6C142.6 742.7 112 631.1 112 523.2 112 291.8 247.8 174 381.7 174c60.5 0 110.6 39.5 148.4 39.5 36.4 0 93.5-41.9 162.5-41.9 25.2 0 131.2 2.3 199.3 79.3zm-234.5-156.3c28.1-36.5 47.9-87.5 47.9-138.5 0-7.1-.6-14.3-1.9-20.1-44.9 1.9-98.5 30.3-130.7 71.9-24.5 29.7-48.2 80.4-48.2 131.4 0 7.7 1.3 15.5 1.9 17.8 3.2.6 8.4 1.3 13.6 1.3 39.5 0 89.2-26.3 117.4-63.8z"/>
                </svg>
                Continue with Apple
              </button>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px" style={{ backgroundColor: '#E4E4E7' }} />
              <span className="text-xs" style={{ ...sansFont, color: '#A1A1AA' }}>or</span>
              <div className="flex-1 h-px" style={{ backgroundColor: '#E4E4E7' }} />
            </div>
          </>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            autoComplete="email"
            className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2"
            style={{ ...sansFont, borderColor: `${PURPLE}30`, color: TEXT }}
          />

          {mode !== 'forgot' && (
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={mode === 'signin' ? 'Password' : 'Password (min 6 characters)'}
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                className="w-full rounded-xl border px-4 py-3 pr-11 text-sm outline-none focus:ring-2"
                style={{ ...sansFont, borderColor: `${PURPLE}30`, color: TEXT }}
              />
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-70"
                style={{ color: MUTED, opacity: 0.5 }}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          )}

          {err && (
            <p className="text-xs" style={{ ...sansFont, color: '#EF4444' }}>{err}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-full py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ ...sansFont, backgroundColor: PURPLE }}
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {mode === 'signin' ? 'Sign in →' : mode === 'signup' ? 'Create account →' : 'Send reset link →'}
          </button>
        </form>

        <div className="mt-4 space-y-2 text-center">
          {mode === 'signin' && (
            <>
              <button
                onClick={() => reset('forgot')}
                className="block w-full text-xs transition-opacity hover:opacity-70"
                style={{ ...sansFont, color: '#A1A1AA' }}
              >
                Forgot password?
              </button>
              <p className="text-xs" style={{ ...sansFont, color: '#A1A1AA' }}>
                No account?{' '}
                <button onClick={() => reset('signup')} className="underline" style={{ color: PURPLE }}>
                  Start free trial
                </button>
              </p>
            </>
          )}
          {(mode === 'signup' || mode === 'forgot') && (
            <button
              onClick={() => reset('signin')}
              className="text-xs underline transition-opacity hover:opacity-70"
              style={{ ...sansFont, color: PURPLE }}
            >
              ← Back to sign in
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
