import { useState, useRef, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { KIDS_MODULES } from '../../data/kidsModules'
import TutorBubble, { type TutorMessage } from '../../components/learn/TutorBubble'
import { PURPLE, sansFont } from '../../constants'
import { useAppState } from '../../state/AppState'
import { saveSpeakSession } from '../../state/progress'

const GREETING: TutorMessage = {
  role: 'assistant',
  content: "Hola! I'm Lingo, your Spanish tutor! 🌟 What would you like to practice today? You can ask me anything about Spanish, or tell me which words you're learning.",
}

function loadHistory(moduleId: string): TutorMessage[] {
  try {
    const raw = localStorage.getItem(`jl_tutor_${moduleId}`)
    if (raw) return JSON.parse(raw)
  } catch {}
  return [GREETING]
}

function saveHistory(moduleId: string, msgs: TutorMessage[]) {
  try {
    const trimmed = msgs.slice(-40)
    localStorage.setItem(`jl_tutor_${moduleId}`, JSON.stringify(trimmed))
  } catch {}
}

export default function TutorChat() {
  const { moduleId } = useParams<{ moduleId: string }>()
  const mod = KIDS_MODULES.find(m => m.id === moduleId)
  const color = mod?.color ?? PURPLE
  const [messages, setMessages] = useState<TutorMessage[]>(() => loadHistory(moduleId ?? 'general'))
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const sessionSavedRef = useRef(false)
  const { dispatch } = useAppState()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    saveHistory(moduleId ?? 'general', messages)
  }, [messages, moduleId])

  async function send() {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    const userMsg: TutorMessage = { role: 'user', content: text }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)
    try {
      const history = [...messages, userMsg].slice(-10)
      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moduleId: moduleId ?? 'general', messages: history }),
      })
      const data = await res.json()
      const reply: TutorMessage = { role: 'assistant', content: data.message ?? "Sorry, I didn't catch that. Try again!" }
      setMessages(prev => [...prev, reply])
      dispatch({ type: 'ADD_XP', amount: 2 })
      if (!sessionSavedRef.current) {
        saveSpeakSession(moduleId ?? 'general')
        sessionSavedRef.current = true
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "Oops! I had a little trouble. Try again in a moment! 😊" }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FDFCF9' }}>
      {/* Header */}
      <div
        className="fixed top-0 inset-x-0 z-40 flex items-center gap-3 px-4"
        style={{ height: 56, backgroundColor: color, boxShadow: '0 2px 12px rgba(0,0,0,0.15)' }}
      >
        <Link
          to={mod ? `/learn/${mod.id}` : '/learn'}
          className="flex items-center justify-center rounded-full transition-opacity hover:opacity-80"
          style={{ width: 36, height: 36, backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff', textDecoration: 'none', fontSize: 18 }}
        >
          ←
        </Link>
        <span className="text-xl">🤖</span>
        <div>
          <p className="font-bold text-sm" style={{ color: '#fff', ...sansFont }}>Lingo</p>
          {mod && <p className="text-xs" style={{ color: 'rgba(255,255,255,0.75)', ...sansFont }}>{mod.title}</p>}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto pt-16 pb-24 px-4">
        <div className="max-w-md mx-auto pt-4">
          {messages.map((msg, i) => (
            <TutorBubble key={i} message={msg} color={color} />
          ))}
          {loading && (
            <div className="flex justify-start mb-3">
              <div style={{ backgroundColor: '#fff', border: '1.5px solid rgba(0,0,0,0.08)', borderRadius: '18px 18px 18px 4px', padding: '12px 16px' }}>
                <span style={{ ...sansFont, color: '#71717A', fontSize: 14 }}>Lingo is thinking...</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div
        className="fixed bottom-0 inset-x-0 px-4 py-3"
        style={{ backgroundColor: 'rgba(253,252,249,0.97)', backdropFilter: 'blur(8px)', borderTop: '1px solid rgba(124,58,237,0.1)' }}
      >
        <div className="max-w-md mx-auto flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Type a message..."
            style={{
              flex: 1,
              height: 48,
              borderRadius: 24,
              border: '2px solid rgba(124,58,237,0.2)',
              padding: '0 16px',
              fontFamily: '"Nunito", sans-serif',
              fontSize: 15,
              fontWeight: 600,
              backgroundColor: '#fff',
              color: '#18181B',
              outline: 'none',
            }}
          />
          <button
            onClick={send}
            disabled={!input.trim() || loading}
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              backgroundColor: color,
              border: 'none',
              color: '#fff',
              fontSize: 20,
              cursor: input.trim() && !loading ? 'pointer' : 'default',
              opacity: input.trim() && !loading ? 1 : 0.5,
              transition: 'opacity 0.15s',
            }}
          >
            →
          </button>
        </div>
      </div>
    </div>
  )
}
