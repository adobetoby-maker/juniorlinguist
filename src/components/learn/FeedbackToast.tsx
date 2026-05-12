const COLORS = {
  correct: { bg: '#D1FAE5', text: '#065F46', border: '#34D399' },
  wrong:   { bg: '#FEE2E2', text: '#991B1B', border: '#F87171' },
  complete:{ bg: '#EDE9FE', text: '#5B21B6', border: '#7C3AED' },
}

export default function FeedbackToast({
  message,
  variant,
  visible,
}: {
  message: string
  variant: 'correct' | 'wrong' | 'complete'
  visible: boolean
}) {
  const c = COLORS[variant]
  return (
    <div
      style={{
        position: 'fixed',
        top: 80,
        left: '50%',
        transform: `translateX(-50%) translateY(${visible ? 0 : -20}px)`,
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.2s ease, transform 0.2s ease',
        pointerEvents: 'none',
        zIndex: 100,
        backgroundColor: c.bg,
        border: `1.5px solid ${c.border}`,
        color: c.text,
        fontFamily: '"Nunito", sans-serif',
        fontWeight: 700,
        fontSize: 16,
        padding: '10px 24px',
        borderRadius: 999,
        whiteSpace: 'nowrap',
        boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
      }}
    >
      {message}
    </div>
  )
}
