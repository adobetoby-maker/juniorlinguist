import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { PURPLE, sansFont, displayFont } from '../constants'
import { supabase } from '../state/subscription-state'

export default function Login() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/learn` },
    })
    if (!error) setSent(true)
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#FDFCF9' }}>
        <div className="max-w-sm w-full text-center">
          <div className="text-5xl mb-4">📬</div>
          <h2 className="text-2xl font-bold mb-2" style={{ ...displayFont, color: '#18181B' }}>Check your email</h2>
          <p className="text-sm" style={{ ...sansFont, color: '#71717A' }}>We sent a magic link to <strong>{email}</strong>. Click it to sign in.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#FDFCF9' }}>
      <div className="max-w-sm w-full">
        <Link to="/" className="text-xs mb-8 inline-block hover:opacity-70" style={{ ...sansFont, color: '#71717A' }}>← Back</Link>
        <h1 className="text-2xl font-bold mb-2" style={{ ...displayFont, color: '#18181B' }}>Sign in</h1>
        <p className="text-sm mb-6" style={{ ...sansFont, color: '#71717A' }}>We'll email you a magic link — no password needed.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full rounded-xl border px-4 py-3 text-sm outline-none"
            style={{ ...sansFont, borderColor: `${PURPLE}30`, color: '#18181B' }}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ ...sansFont, backgroundColor: PURPLE }}
          >
            {loading ? 'Sending…' : 'Send magic link →'}
          </button>
        </form>
        <p className="mt-6 text-xs text-center" style={{ ...sansFont, color: '#A1A1AA' }}>
          Don't have an account?{' '}
          <Link to="/pricing" className="underline" style={{ color: PURPLE }}>Start free trial</Link>
        </p>
      </div>
    </div>
  )
}
