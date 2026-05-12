import { PURPLE } from '../../constants'

export default function SplashLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center" style={{ backgroundColor: '#FDFCF9' }}>
      <div
        style={{
          width: 40,
          height: 40,
          border: `3px solid rgba(124,58,237,0.15)`,
          borderTopColor: PURPLE,
          borderRadius: '50%',
          animation: 'spin 0.7s linear infinite',
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
