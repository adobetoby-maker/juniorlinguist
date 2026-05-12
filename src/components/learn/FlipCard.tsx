export default function FlipCard({
  front,
  back,
  flipped,
  color,
  onClick,
  language = 'Spanish',
}: {
  front: string
  back: string
  flipped: boolean
  color: string
  onClick: () => void
  language?: string
}) {
  return (
    <div
      className="flip-card w-full cursor-pointer select-none"
      style={{ height: 220 }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}
    >
      <div className={`flip-inner w-full h-full${flipped ? ' flipped' : ''}`}>
        {/* Front — English */}
        <div
          className="flip-face absolute inset-0 rounded-2xl flex flex-col items-center justify-center gap-3 p-6"
          style={{ backgroundColor: '#fff', border: `2px solid ${color}30`, boxShadow: `0 4px 24px ${color}18` }}
        >
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color, fontFamily: '"Nunito", sans-serif' }}>English</p>
          <p className="text-3xl font-bold text-center" style={{ color: '#18181B', fontFamily: '"Nunito", sans-serif' }}>{front}</p>
          <p className="text-sm font-semibold" style={{ color: '#71717A', fontFamily: '"Nunito", sans-serif' }}>Tap to reveal {language} →</p>
        </div>
        {/* Back — Spanish */}
        <div
          className="flip-face flip-back absolute inset-0 rounded-2xl flex flex-col items-center justify-center gap-3 p-6"
          style={{ backgroundColor: color, boxShadow: `0 4px 24px ${color}40` }}
        >
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.7)', fontFamily: '"Nunito", sans-serif' }}>{language}</p>
          <p className="text-3xl font-bold text-center" style={{ color: '#fff', fontFamily: '"Nunito", sans-serif' }}>{back}</p>
        </div>
      </div>
    </div>
  )
}
