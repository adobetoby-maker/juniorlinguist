import { useUpdateCheck } from '../hooks/useUpdateCheck'

export default function UpdateBanner() {
  const ready = useUpdateCheck()
  if (!ready) return null

  return (
    <div style={{
      position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
      zIndex: 9999, display: 'flex', alignItems: 'center', gap: 12,
      backgroundColor: '#18181B', color: '#fff',
      padding: '12px 20px', borderRadius: 999,
      boxShadow: '0 4px 32px rgba(0,0,0,0.35)',
      fontFamily: '"Nunito", sans-serif', fontSize: 14, fontWeight: 700,
      whiteSpace: 'nowrap',
    }}>
      🎉 New update available!
      <button
        onClick={() => window.location.reload()}
        style={{
          backgroundColor: '#7C3AED', color: '#fff',
          border: 'none', borderRadius: 999,
          padding: '6px 18px', fontSize: 13, fontWeight: 800,
          cursor: 'pointer', fontFamily: '"Nunito", sans-serif',
          transition: 'opacity 0.15s',
        }}
        onMouseOver={e => (e.currentTarget.style.opacity = '0.85')}
        onMouseOut={e => (e.currentTarget.style.opacity = '1')}
      >
        Reload
      </button>
    </div>
  )
}
