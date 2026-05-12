const STATUS_STYLES = {
  idle:    { bg: '#fff',     border: 'rgba(0,0,0,0.1)', text: '#18181B', opacity: 1 },
  correct: { bg: '#D1FAE5', border: '#34D399',          text: '#065F46', opacity: 1 },
  wrong:   { bg: '#FEE2E2', border: '#F87171',          text: '#991B1B', opacity: 1 },
  dimmed:  { bg: '#F4F4F5', border: 'rgba(0,0,0,0.06)', text: '#A1A1AA', opacity: 0.6 },
}

export default function QuizOption({
  text,
  status,
  onTap,
}: {
  text: string
  status: 'idle' | 'correct' | 'wrong' | 'dimmed'
  onTap: () => void
}) {
  const s = STATUS_STYLES[status]
  return (
    <button
      onClick={onTap}
      disabled={status !== 'idle'}
      style={{
        width: '100%',
        minHeight: 54,
        padding: '12px 16px',
        borderRadius: 14,
        border: `2px solid ${s.border}`,
        backgroundColor: s.bg,
        color: s.text,
        fontFamily: '"Nunito", sans-serif',
        fontWeight: 700,
        fontSize: 16,
        cursor: status === 'idle' ? 'pointer' : 'default',
        transition: 'all 0.15s ease',
        opacity: s.opacity,
        textAlign: 'center',
      }}
    >
      {text}
    </button>
  )
}
