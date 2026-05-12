import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { KIDS_MODULES } from '../../data/kidsModules'
import { getAllProgress, totalStars } from '../../state/progress'
import ModulePickerCard from '../../components/learn/ModulePickerCard'
import { PURPLE, sansFont, displayFont } from '../../constants'

export default function ModulePicker() {
  const progress = useMemo(() => getAllProgress(), [])
  const total = Object.values(progress).reduce((sum, p) => sum + totalStars(p), 0)
  const maxTotal = KIDS_MODULES.length * 9 // 3 stars × 3 games

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FDFCF9' }}>
      {/* Slim top bar */}
      <div
        className="fixed top-0 inset-x-0 z-40 flex items-center justify-between px-5"
        style={{ height: 56, backgroundColor: 'rgba(253,252,249,0.97)', backdropFilter: 'blur(8px)', borderBottom: '1px solid rgba(124,58,237,0.12)' }}
      >
        <Link to="/" style={{ textDecoration: 'none' }}>
          <span className="font-bold text-base" style={{ ...sansFont, color: PURPLE }}>← Junior Linguist</span>
        </Link>
        {total > 0 && (
          <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ ...sansFont, backgroundColor: `${PURPLE}14`, color: PURPLE }}>
            ⭐ {total} / {maxTotal} stars
          </span>
        )}
      </div>

      <div className="pt-20 pb-16 px-5 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2" style={{ ...displayFont, color: '#18181B' }}>
            Pick a Topic
          </h1>
          <p className="text-sm" style={{ ...sansFont, color: '#71717A' }}>
            Tap a topic to start — flashcards, word match, and quiz inside each one.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {KIDS_MODULES.map(mod => (
            <ModulePickerCard key={mod.id} mod={mod} progress={progress[mod.id]} />
          ))}
        </div>
      </div>
    </div>
  )
}
