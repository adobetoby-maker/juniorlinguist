function SpeakerIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  )
}

export default function FlipCard({
  front, back, flipped, color, onClick, language = 'Spanish', onPronounce, pronouncing = false,
}: {
  front: string; back: string; flipped: boolean; color: string
  onClick: () => void; language?: string
  onPronounce?: (word: string, face: 'front' | 'back') => void
  pronouncing?: boolean
}) {
  return (
    <div className="flip-card w-full cursor-pointer select-none" style={{ height: 220 }} onClick={onClick} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && onClick()}>
      <div className={`flip-inner w-full h-full${flipped ? ' flipped' : ''}`}>
        <div className="flip-face absolute inset-0 rounded-2xl flex flex-col items-center justify-center gap-3 p-6" style={{ backgroundColor: '#fff', border: `2px solid ${color}30`, boxShadow: `0 4px 24px ${color}18` }}>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color, fontFamily: '"Nunito", sans-serif' }}>English</p>
          <p className="text-3xl font-bold text-center" style={{ color: '#18181B', fontFamily: '"Nunito", sans-serif' }}>{front}</p>
          <div className="flex items-center gap-3">
            <p className="text-sm font-semibold" style={{ color: '#71717A', fontFamily: '"Nunito", sans-serif' }}>Tap to reveal {language} →</p>
            {onPronounce && (
              <button onClick={e => { e.stopPropagation(); onPronounce(front, 'front') }} title="Hear it in English" className="flex items-center justify-center rounded-full transition-all hover:scale-110 active:scale-95" style={{ width: 32, height: 32, backgroundColor: pronouncing ? `${color}20` : '#F4F4F5', border: `1.5px solid ${pronouncing ? color : '#E4E4E7'}`, color: pronouncing ? color : '#71717A', cursor: 'pointer' }}>
                <SpeakerIcon size={14} />
              </button>
            )}
          </div>
        </div>
        <div className="flip-face flip-back absolute inset-0 rounded-2xl flex flex-col items-center justify-center gap-3 p-6" style={{ backgroundColor: color, boxShadow: `0 4px 24px ${color}40` }}>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.7)', fontFamily: '"Nunito", sans-serif' }}>{language}</p>
          <p className="text-3xl font-bold text-center" style={{ color: '#fff', fontFamily: '"Nunito", sans-serif' }}>{back}</p>
          {onPronounce && (
            <button onClick={e => { e.stopPropagation(); onPronounce(back, 'back') }} title={`Hear it in ${language}`} className="flex items-center gap-1.5 rounded-full px-3 py-1.5 font-bold text-xs transition-all hover:scale-105 active:scale-95" style={{ backgroundColor: 'rgba(255,255,255,0.25)', border: '1.5px solid rgba(255,255,255,0.5)', color: '#fff', cursor: 'pointer', fontFamily: '"Nunito", sans-serif' }}>
              <SpeakerIcon size={13} />
              {pronouncing ? 'Playing…' : `Hear ${language}`}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
