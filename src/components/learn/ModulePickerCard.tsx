import { Link } from 'react-router-dom'
import type { KidsModule } from '../../data/kidsModules'
import type { ModuleProgress } from '../../state/progress'
import { totalStars } from '../../state/progress'
import StarDisplay from './StarDisplay'

export default function ModulePickerCard({
  mod,
  progress,
}: {
  mod: KidsModule
  progress: ModuleProgress | undefined
}) {
  const stars = progress ? Math.min(3, Math.round(totalStars(progress) / 3)) as 0 | 1 | 2 | 3 : 0
  const played = !!progress?.lastPlayedAt

  return (
    <Link
      to={`/learn/${mod.id}`}
      style={{ textDecoration: 'none' }}
    >
      <div
        className="rounded-2xl transition-all duration-200 hover:scale-[1.03] cursor-pointer"
        style={{
          backgroundColor: '#fff',
          border: `2px solid ${mod.color}22`,
          boxShadow: `0 2px 12px ${mod.color}14`,
          overflow: 'hidden',
        }}
      >
        <div style={{ height: 6, backgroundColor: mod.color }} />
        <div className="p-5">
          <div className="text-4xl mb-3">{mod.emoji}</div>
          <h3 className="font-bold text-base mb-1" style={{ fontFamily: '"Nunito", sans-serif', color: '#18181B' }}>
            {mod.title}
          </h3>
          <p className="text-xs leading-relaxed mb-4" style={{ fontFamily: '"Nunito", sans-serif', color: '#71717A' }}>
            {mod.tagline}
          </p>
          <div className="flex items-center justify-between">
            <StarDisplay stars={stars} size="sm" color={mod.color} />
            <span
              className="text-xs font-bold px-3 py-1 rounded-full"
              style={{ backgroundColor: `${mod.color}18`, color: mod.color, fontFamily: '"Nunito", sans-serif' }}
            >
              {played ? 'Continue' : 'Start'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
