import { PURPLE } from '../../constants'

export default function ProgressBar({
  value,
  color = PURPLE,
  className = '',
}: {
  value: number  // 0 to 1
  color?: string
  className?: string
}) {
  return (
    <div className={`w-full rounded-full overflow-hidden ${className}`} style={{ height: 8, backgroundColor: 'rgba(0,0,0,0.08)' }}>
      <div
        style={{
          height: '100%',
          width: `${Math.min(1, Math.max(0, value)) * 100}%`,
          backgroundColor: color,
          borderRadius: 9999,
          transition: 'width 0.3s ease',
        }}
      />
    </div>
  )
}
