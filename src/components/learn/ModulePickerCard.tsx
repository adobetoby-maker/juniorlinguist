import { Link } from 'react-router-dom'
import type { KidsModule } from '../../data/kidsModules'
import type { ModuleProgress } from '../../state/progress'
import { fluencyPct } from '../../state/progress'

export default function ModulePickerCard({
  mod,
  progress,
}: {
  mod: KidsModule
  progress: ModuleProgress | undefined
}) {
  const pct = progress ? fluencyPct(progress, mod.id) : 0
  const played = !!progress?.lastPlayedAt

  const label =
    pct === 100 ? '🌟 Fluent!'
    : pct >= 60  ? `${pct}% done`
    : pct >= 20  ? `${pct}% done`
    : played     ? 'Started'
    : 'Start'

  const barColor = pct === 100
    ? 'linear-gradient(90deg, #f59e0b, #f97316)'
    : mod.color

  return (
    <Link to={`/learn/${mod.id}`} style={{ textDecoration: 'none' }}>
      <div
        className="rounded-2xl transition-all duration-200 hover:scale-[1.03] cursor-pointer"
        style={{
          backgroundColor: '#fff',
          border: `2px solid ${pct === 100 ? '#f59e0b' : mod.color}22`,
          boxShadow: pct === 100
            ? '0 2px 12px rgba(245,158,11,0.18)'
            : `0 2px 12px ${mod.color}14`,
          overflow: 'hidden',
        }}
      >
        {/* Color top bar + fluency fill */}
        <div style={{ height: 6, backgroundColor: '#f3f4f6', position: 'relative' }}>
          <div
            style={{
              position: 'absolute', inset: 0,
              width: `${pct}%`,
              background: barColor,
              transition: 'width 0.6s ease',
            }}
          />
        </div>

        <div className="p-4">
          <div className="text-4xl mb-2">{mod.emoji}</div>
          <h3 className="font-bold text-sm mb-0.5 leading-tight" style={{ fontFamily: '"Nunito", sans-serif', color: '#18181B' }}>
            {mod.title}
          </h3>
          <p className="text-xs leading-relaxed mb-3" style={{ fontFamily: '"Nunito", sans-serif', color: '#71717A' }}>
            {mod.tagline}
          </p>

          {/* Fluency row */}
          <div className="flex items-center justify-between">
            {pct > 0 ? (
              <div className="flex items-center gap-1.5 flex-1 mr-2">
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, background: barColor }}
                  />
                </div>
                <span className="text-xs font-bold" style={{ color: pct === 100 ? '#f59e0b' : '#9ca3af', fontFamily: '"Nunito", sans-serif' }}>
                  {pct}%
                </span>
              </div>
            ) : (
              <div className="flex-1" />
            )}
            <span
              className="text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0"
              style={{
                backgroundColor: pct === 100 ? '#fef3c7' : `${mod.color}18`,
                color: pct === 100 ? '#d97706' : mod.color,
                fontFamily: '"Nunito", sans-serif',
              }}
            >
              {label}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
