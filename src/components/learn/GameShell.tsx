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
        className="fixed top-0 inset-x-0 z-40 flex items-center gap-3 px-4 safe-top"
        style={{
          paddingTop: 'max(12px, env(safe-area-inset-top, 0px))',
          paddingBottom: 12,
          backgroundColor: color,
          boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
        }}
      >
        <Link
          to={`/learn/${moduleId}`}
          className="flex items-center justify-center rounded-full transition-opacity hover:opacity-80 flex-shrink-0"
          style={{ width: 44, height: 44, backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff', textDecoration: 'none', fontSize: 20 }}
          aria-label="Back to module"
        >
          ←
        </Link>
        <span className="text-xl">{mod?.emoji}</span>
        <span className="font-bold text-base" style={{ color: '#fff', fontFamily: '"Nunito", sans-serif' }}>
          {title}
        </span>
      </div>
      <div style={{ paddingTop: 'calc(68px + env(safe-area-inset-top, 0px))' }}>
        {children}
      </div>
    </div>
  )
}
