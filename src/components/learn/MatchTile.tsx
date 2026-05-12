const STATUS_STYLES: Record<string, { bg: string; border: string; text: string; extra?: string }> = {
  idle:     { bg: '#fff',     border: 'rgba(0,0,0,0.1)', text: '#18181B' },
  selected: { bg: '',        border: '',                 text: '#fff' },
  matched:  { bg: '#D1FAE5', border: '#34D399',          text: '#065F46' },
  shake:    { bg: '#FEE2E2', border: '#F87171',          text: '#991B1B', extra: 'shake' },
}

export default function MatchTile({
  text,
  status,
  color,
  onTap,
}: {
  text: string
  status: 'idle' | 'selected' | 'matched' | 'shake'
  color: string
  onTap: () => void
}) {
  const s = STATUS_STYLES[status]
  const bg = status === 'selected' ? color : s.bg
  const border = status === 'selected' ? color : s.border

  return (
    <button
      onClick={onTap}
      disabled={status === 'matched'}
      className={s.extra ?? ''}
      style={{
        minHeight: 52,
        width: '100%',
        padding: '10px 14px',
        borderRadius: 12,
        border: `2px solid ${border}`,
        backgroundColor: bg,
        color: s.text,
        fontFamily: '"Nunito", sans-serif',
        fontWeight: 700,
        fontSize: 15,
        cursor: status === 'matched' ? 'default' : 'pointer',
        transition: 'all 0.15s ease',
        opacity: status === 'matched' ? 0.4 : 1,
        textAlign: 'center',
      }}
    >
      {text}
    </button>
  )
}
