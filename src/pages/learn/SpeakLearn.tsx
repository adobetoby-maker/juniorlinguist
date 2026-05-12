import { useState, useRef, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import GameShell from '../../components/learn/GameShell'
import { useSpeech } from '../../state/SpeechProvider'
import { KIDS_MODULES } from '../../data/kidsModules'
import { useAppState } from '../../state/AppState'
import { saveSpeakSession } from '../../state/progress'

interface Message { role: 'user' | 'assistant'; content: string }

interface GrammarTip { tip: string | null; correct: boolean }

const STARTER_PROMPTS: Record<string, string[]> = {
  animals: ['¿Cuál es tu animal favorito?', 'Me gusta el perro.', '¿Tienes una mascota?'],
  food: ['¿Qué comes en el desayuno?', 'Me gusta la pizza.', 'Tengo hambre.'],
  school: ['¿Cómo se llama tu maestra?', 'Mi materia favorita es arte.', '¿Tienes tarea hoy?'],
  family: ['¿Cuántas personas hay en tu familia?', 'Mi mamá es muy simpática.', 'Vivo con mis abuelos.'],
  sports: ['¿Cuál es tu deporte favorito?', 'Juego fútbol con mis amigos.', 'Mi equipo ganó.'],
  travel: ['¿Adónde quieres viajar?', 'Me gustaría visitar México.', 'El avión es muy rápido.'],
  arts: ['¿Sabes tocar un instrumento?', 'Me gusta dibujar.', 'Mi canción favorita es bonita.'],
  science: ['¿Cuál es tu planeta favorito?', 'Los dinosaurios son fascinantes.', 'Quiero ser científico.'],
  body: ['¿Cómo te sientes hoy?', 'Estoy muy emocionado.', 'Tengo sueño.'],
  general: ['Hola, ¿cómo estás?', 'Me llamo…', '¿Qué hora es?'],
}

type RecState = 'idle' | 'listening' | 'processing'

export default function SpeakLearn() {
  const { moduleId = 'general' } = useParams<{ moduleId: string }>()
  const module = KIDS_MODULES.find(m => m.id === moduleId) ?? KIDS_MODULES[0]

  const STORAGE_KEY = `jl_speak_${moduleId}`

  const [messages, setMessages] = useState<Message[]>(() => {
    try { const r = localStorage.getItem(STORAGE_KEY); if (r) return JSON.parse(r) } catch {}
    return []
  })
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const sessionSavedRef = useRef(false)
  const [tip, setTip] = useState<GrammarTip | null>(null)
  const [recState, setRecState] = useState<RecState>('idle')

  const { speak } = useSpeech()
  const { dispatch } = useAppState()
  const bottomRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null)

  const GREETING: Message = {
    role: 'assistant',
    content: '¡Hola! Soy Lingo, tu compañero de conversación. 🌟 Puedes escribir o hablar en español. ¡Empieza cuando quieras!',
  }

  const displayed = messages.length === 0 ? [GREETING] : messages

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(messages)) } catch {}
  }, [messages, STORAGE_KEY])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, tip])

  async function sendMessage(text: string) {
    if (!text.trim() || sending) return
    setTip(null)
    setSending(true)
    const userMsg: Message = { role: 'user', content: text }
    const updated = [...messages, userMsg]
    setMessages(updated)
    setInput('')

    // Fire grammar tip check in parallel
    checkGrammar(text)

    try {
      const res = await fetch('/api/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'chat',
          moduleId,
          messages: updated.map(m => ({ role: m.role, content: m.content })),
        }),
      })
      const data = await res.json()
      const reply = data.message ?? '¡Bien! Sigue intentando.'
      const assistantMsg: Message = { role: 'assistant', content: reply }
      setMessages(prev => [...prev, assistantMsg])
      dispatch({ type: 'ADD_XP', amount: 5 })
      if (!sessionSavedRef.current) {
        saveSpeakSession(moduleId)
        sessionSavedRef.current = true
      }
      speak(reply, 'es')
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: '¡Ups! Intenta de nuevo.' }])
    } finally {
      setSending(false)
    }
  }

  async function checkGrammar(text: string) {
    try {
      const res = await fetch('/api/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'tip', userText: text, moduleId }),
      })
      const data = await res.json()
      if (data.tip) setTip(data)
    } catch {}
  }

  function startVoice() {
    const SpeechRecognition = (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) return
    const rec = new SpeechRecognition()
    rec.lang = 'es-419'
    rec.interimResults = false
    rec.maxAlternatives = 1
    rec.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript
      setInput(transcript)
      setRecState('idle')
      sendMessage(transcript)
    }
    rec.onerror = () => setRecState('idle')
    rec.onend = () => setRecState('idle')
    rec.start()
    recognitionRef.current = rec
    setRecState('listening')
  }

  function stopVoice() {
    recognitionRef.current?.stop()
    setRecState('idle')
  }

  const starters = STARTER_PROMPTS[moduleId] ?? STARTER_PROMPTS.general

  return (
    <GameShell title="Speak with Lingo" moduleId={moduleId}>
      <div className="flex flex-col h-[calc(100vh-120px)] max-w-lg mx-auto">

        {/* Conversation */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {displayed.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-2`}>
              {msg.role === 'assistant' && (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-1"
                  style={{ background: module.color }}
                >
                  L
                </div>
              )}
              <div
                className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'text-white rounded-br-sm'
                    : 'bg-white border border-gray-100 text-gray-800 rounded-bl-sm shadow-sm'
                }`}
                style={msg.role === 'user' ? { background: module.color } : undefined}
              >
                {msg.content}
                {msg.role === 'assistant' && (
                  <button
                    onClick={() => speak(msg.content, 'es')}
                    className="ml-2 text-gray-400 hover:text-gray-600 text-xs"
                    aria-label="Play"
                  >
                    🔊
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Grammar tip */}
          {tip?.tip && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 text-xs text-amber-800 mx-4">
              💡 {tip.tip}
            </div>
          )}

          {sending && (
            <div className="flex gap-2 items-center">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: module.color }}>L</div>
              <div className="bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm">
                <span className="inline-flex gap-1">
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Starter prompts (when empty) */}
        {messages.length === 0 && (
          <div className="px-4 pb-2">
            <p className="text-xs text-gray-400 mb-2">Try saying:</p>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {starters.map((s, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(s)}
                  className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs border border-gray-200 bg-white text-gray-600 hover:border-gray-400 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input bar */}
        <div className="px-4 pb-4 pt-2 border-t border-gray-100 bg-white flex gap-2 items-end">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); if (!sending) sendMessage(input) } }}
            placeholder="Escribe en español…"
            rows={1}
            className="flex-1 px-3 py-2.5 rounded-2xl border border-gray-200 text-base resize-none outline-none focus:border-blue-300 leading-relaxed"
            style={{ maxHeight: '100px', overflowY: 'auto' }}
          />

          {/* Voice button */}
          {('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) && (
            <button
              onMouseDown={startVoice}
              onMouseUp={stopVoice}
              onTouchStart={startVoice}
              onTouchEnd={stopVoice}
              className={`w-11 h-11 rounded-full flex items-center justify-center text-xl transition-all flex-shrink-0 ${
                recState === 'listening' ? 'bg-red-500 scale-110' : 'bg-gray-100 hover:bg-gray-200'
              }`}
              aria-label="Hold to speak"
            >
              {recState === 'listening' ? '🔴' : '🎤'}
            </button>
          )}

          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || sending}
            className="w-11 h-11 rounded-full text-white flex items-center justify-center flex-shrink-0 disabled:opacity-40 transition-transform active:scale-95"
            style={{ background: module.color }}
          >
            →
          </button>
        </div>

        {/* Clear chat */}
        {messages.length > 0 && (
          <button
            onClick={() => { setMessages([]); localStorage.removeItem(STORAGE_KEY) }}
            className="text-xs text-gray-400 text-center pb-2 hover:text-gray-600"
          >
            Clear conversation
          </button>
        )}
      </div>
    </GameShell>
  )
}
