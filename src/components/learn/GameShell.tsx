import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { KIDS_MODULES } from '../../data/kidsModules'

export default function GameShell({
  moduleId,
  title,
  children,
}: {
  moduleId: string
  title: string
  children: ReactNode
}) {
  const mod = KIDS_MODULES.find(m => m.id === moduleId)
  const color = mod?.color ?? '#7C3AED'

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FDFCF9' }}>
      <div
        className="fixed top-0 inset-x-0 z-40 flex items-center gap-3 px-4"
        style={{
          height: 56,
          backgroundColor: color,
          boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
        }}
      >
        <Link
          to={`/learn/${moduleId}`}
          className="flex items-center justify-center rounded-full transition-opacity hover:opacity-80"
          style={{ width: 36, height: 36, backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff', textDecoration: 'none', fontSize: 18 }}
          aria-label="Back to module"
        >
          ←
        </Link>
        <span className="text-xl">{mod?.emoji}</span>
        <span className="font-bold text-base" style={{ color: '#fff', fontFamily: '"Nunito", sans-serif' }}>
          {title}
        </span>
      </div>
      <div className="pt-14">
        {children}
      </div>
    </div>
  )
}
