import { useId, useMemo } from 'react'
import { useAppState, getTier, xpForNextTier } from '../../state/AppState'
import { KIDS_MODULES } from '../../data/kidsModules'
import { getAllProgress, fluencyPct, emptyProgress } from '../../state/progress'

type Stage = 1 | 2 | 3 | 4 | 5

const TIER_STAGE: Record<string, Stage> = {
  Explorer: 1, Adventurer: 2, Hero: 3, Champion: 4, Legend: 5,
}

const SKY: Record<Stage, [string, string]> = {
  1: ['#BFDBFE', '#EFF6FF'],
  2: ['#DDD6FE', '#F5F3FF'],
  3: ['#BBF7D0', '#ECFDF5'],
  4: ['#FDE68A', '#FFFBEB'],
  5: ['#FBCFE8', '#FFF1F2'],
}

const LEAF: Record<Stage, [string, string]> = {
  1: ['#86EFAC', '#BBF7D0'],
  2: ['#4ADE80', '#86EFAC'],
  3: ['#22C55E', '#4ADE80'],
  4: ['#16A34A', '#22C55E'],
  5: ['#15803D', '#16A34A'],
}

const TRUNK: Record<Stage, [string, string]> = {
  1: ['#D4B896', '#A0785A'],
  2: ['#C4956A', '#8B5E3C'],
  3: ['#B8834E', '#7C5835'],
  4: ['#A07038', '#6B4F2E'],
  5: ['#8B6040', '#5C3D1E'],
}

// Per-stage tree geometry: trunk top Y, trunk width, canopy center Y, rx, ry
const GEO: Record<Stage, { topY: number; w: number; cy: number; rx: number; ry: number }> = {
  1: { topY: 96, w: 5,  cy: 0,  rx: 0,  ry: 0  },
  2: { topY: 80, w: 7,  cy: 73, rx: 20, ry: 15 },
  3: { topY: 64, w: 9,  cy: 57, rx: 26, ry: 21 },
  4: { topY: 50, w: 11, cy: 43, rx: 32, ry: 26 },
  5: { topY: 36, w: 13, cy: 28, rx: 37, ry: 30 },
}

const GY = 116

function TreeSVG({ stage, pct, uid }: { stage: Stage; pct: number; uid: string }) {
  const sky = SKY[stage]
  const leaf = LEAF[stage]
  const tc = TRUNK[stage]
  const g = GEO[stage]
  const f = Math.max(0, Math.min(1, pct / 100))
  const trunkH = GY - g.topY
  const filledH = trunkH * f
  const filledY = GY - filledH
  const tx = 50 - g.w / 2

  return (
    <svg viewBox="0 0 100 130" style={{ width: '100%', height: '100%', display: 'block' }}>
      <defs>
        <linearGradient id={`${uid}sky`} x1="0" y1="0" x2="0" y2="130" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={sky[0]} />
          <stop offset="100%" stopColor={sky[1]} />
        </linearGradient>
        {stage > 1 && (
          <clipPath id={`${uid}clip`}>
            <rect x={tx} y={g.topY} width={g.w} height={trunkH} rx={g.w / 2} />
          </clipPath>
        )}
      </defs>

      {/* Sky */}
      <rect x="0" y="0" width="100" height="130" fill={`url(#${uid}sky)`} rx="14" />

      {/* Sun */}
      <circle cx="78" cy="16" r="9" fill={stage >= 4 ? '#FCD34D' : '#FEF9C3'} opacity={stage >= 4 ? 0.85 : 0.6} />
      {stage === 5 && <circle cx="78" cy="16" r="15" fill="#FEF9C3" opacity="0.3" />}

      {/* Ground */}
      <ellipse cx="50" cy="123" rx="40" ry="7" fill={leaf[1]} opacity="0.55" />
      <rect x="32" y="116" width="36" height="7" rx="3.5" fill={leaf[0]} opacity="0.45" />

      {stage === 1 ? (
        /* Seedling */
        <>
          <line x1="50" y1={GY} x2="50" y2={GY - 18 - f * 12}
            stroke={tc[1]} strokeWidth="3" strokeLinecap="round" />
          <circle cx="50" cy={GY - 23 - f * 12} r={3 + f * 2.5} fill={leaf[0]} />
          <ellipse cx={44 - f} cy={GY - 14 - f * 6} rx={3.5 + f * 3} ry="3"
            fill={leaf[0]} opacity={0.65 + f * 0.35}
            transform={`rotate(-35 ${44 - f} ${GY - 14 - f * 6})`} />
          <ellipse cx={56 + f} cy={GY - 14 - f * 6} rx={3.5 + f * 3} ry="3"
            fill={leaf[0]} opacity={0.65 + f * 0.35}
            transform={`rotate(35 ${56 + f} ${GY - 14 - f * 6})`} />
        </>
      ) : (
        /* Stages 2–5: full tree */
        <>
          {/* Branch stubs (stage 3+) */}
          {stage >= 3 && (
            <>
              <line x1="50" y1={g.topY + 18} x2={50 - g.rx * 0.72} y2={g.topY + 5}
                stroke={tc[0]} strokeWidth={g.w - 4} strokeLinecap="round" opacity="0.55" />
              <line x1="50" y1={g.topY + 18} x2={50 + g.rx * 0.72} y2={g.topY + 5}
                stroke={tc[0]} strokeWidth={g.w - 4} strokeLinecap="round" opacity="0.55" />
            </>
          )}
          {/* Trunk bg */}
          <rect x={tx} y={g.topY} width={g.w} height={trunkH} rx={g.w / 2} fill={tc[0]} opacity="0.35" />
          {/* Trunk XP fill */}
          {filledH > 0.5 && (
            <rect x={tx} y={filledY} width={g.w} height={filledH + 1}
              fill={tc[1]} clipPath={`url(#${uid}clip)`}
              style={{ transition: 'all 0.8s ease-out' }} />
          )}
          {/* Canopy shadow */}
          <ellipse cx="52" cy={g.cy + 5} rx={g.rx * 0.8} ry={g.ry * 0.45} fill="#000" opacity="0.05" />
          {/* Side canopy blobs */}
          <ellipse cx={50 - g.rx * 0.62} cy={g.cy + 4} rx={g.rx * 0.5} ry={g.ry * 0.65} fill={leaf[1]} opacity="0.85" />
          <ellipse cx={50 + g.rx * 0.62} cy={g.cy + 4} rx={g.rx * 0.5} ry={g.ry * 0.65} fill={leaf[1]} opacity="0.85" />
          {/* Main canopy */}
          <ellipse cx="50" cy={g.cy} rx={g.rx} ry={g.ry} fill={leaf[0]} />
          {/* Highlight shimmer */}
          <ellipse cx="46" cy={g.cy - g.ry * 0.35} rx={g.rx * 0.35} ry={g.ry * 0.3} fill="#fff" opacity="0.1" />
          {/* Stage 4+: blossoms */}
          {stage >= 4 && [0, 1, 2, 3, 4, 5].map(i => {
            const a = (i / 6) * Math.PI * 2
            return (
              <circle key={i}
                cx={50 + Math.cos(a) * g.rx * 0.52}
                cy={g.cy + Math.sin(a) * g.ry * 0.52}
                r="3.5"
                fill={stage === 5 ? '#FCD34D' : '#FCA5A5'}
                opacity="0.88" />
            )
          })}
          {/* Stage 5: glow rings + sparkles */}
          {stage === 5 && (
            <>
              <ellipse cx="50" cy={g.cy} rx={g.rx + 8} ry={g.ry + 7} fill="#FEFCE8" opacity="0.28" />
              <ellipse cx="50" cy={g.cy} rx={g.rx + 16} ry={g.ry + 14} fill="#FFFBEB" opacity="0.14" />
              {[0, 1, 2, 3].map(i => {
                const a = i * (Math.PI / 2) + Math.PI / 4
                return (
                  <circle key={i}
                    cx={50 + Math.cos(a) * (g.rx + 6)}
                    cy={g.cy + Math.sin(a) * (g.ry + 5)}
                    r="2.5" fill="#FCD34D" opacity="0.75" />
                )
              })}
            </>
          )}
        </>
      )}
    </svg>
  )
}

export default function LanguageTree({ compact = false }: { compact?: boolean }) {
  const { state } = useAppState()
  const rawId = useId()
  const uid = 'lt' + rawId.replace(/[^a-zA-Z0-9]/g, '')
  const tier = getTier(state.xp)
  const { pct, needed, label: nextLabel } = xpForNextTier(state.xp)
  const stage = (TIER_STAGE[tier.label] ?? 1) as Stage

  const allProgress = useMemo(() => getAllProgress(), [])
  const moduleDots = KIDS_MODULES.map(m => ({
    emoji: m.emoji,
    color: m.color,
    fp: fluencyPct(allProgress[m.id] ?? emptyProgress(m.id), m.id),
  }))

  if (compact) {
    return (
      <div className="flex items-center gap-3 bg-white rounded-2xl p-4 shadow-sm mb-4" style={{ border: '1.5px solid #f4f4f5' }}>
        <div style={{ width: 68, height: 68, flexShrink: 0 }}>
          <TreeSVG stage={stage} pct={pct} uid={uid} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="text-base">{tier.emoji}</span>
            <span className="font-bold text-sm text-gray-800">{tier.label}</span>
            <span className="ml-auto text-xs font-semibold text-gray-400">{state.xp} XP</span>
          </div>
          <div className="h-2 rounded-full bg-gray-100 overflow-hidden mb-1">
            <div
              className="h-full rounded-full"
              style={{
                width: `${Math.min(pct, 100)}%`,
                background: 'linear-gradient(90deg,#6366f1,#8b5cf6)',
                transition: 'width 0.8s ease-out',
              }}
            />
          </div>
          <p className="text-xs text-gray-400">
            {needed > 0 ? `${needed} XP to ${nextLabel}` : '🌟 Max tier reached!'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm mb-6" style={{ border: '1.5px solid #f0f0f0' }}>
      <div className="flex items-center gap-4 px-5 pt-5 pb-4">
        <div style={{ width: 112, height: 112, flexShrink: 0 }}>
          <TreeSVG stage={stage} pct={pct} uid={uid} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Your Fluency Tree</p>
          <div className="flex items-center gap-2 mb-2.5">
            <span className="text-2xl">{tier.emoji}</span>
            <div>
              <p className="font-bold text-gray-800 leading-tight">{tier.label}</p>
              <p className="text-xs text-gray-400">{state.xp} XP total</p>
            </div>
          </div>
          <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden mb-1.5">
            <div
              className="h-full rounded-full"
              style={{
                width: `${Math.min(pct, 100)}%`,
                background: 'linear-gradient(90deg,#6366f1,#8b5cf6)',
                transition: 'width 0.8s ease-out',
              }}
            />
          </div>
          <p className="text-xs text-gray-400">
            {needed > 0
              ? `${needed} XP to reach ${nextLabel}`
              : '🌟 You are a Legend!'}
          </p>
        </div>
      </div>

      {/* Module progress dots */}
      <div className="flex items-center justify-between px-4 pb-4 pt-1">
        {moduleDots.map((m, i) => (
          <div key={i} className="relative flex flex-col items-center">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all duration-500"
              style={{
                background: m.fp > 0 ? `${m.color}22` : '#f4f4f5',
                border: m.fp >= 100
                  ? `2px solid ${m.color}`
                  : `1.5px solid ${m.fp > 0 ? m.color + '55' : '#e4e4e7'}`,
                opacity: m.fp > 0 ? 1 : 0.4,
                boxShadow: m.fp >= 100 ? `0 0 7px ${m.color}66` : 'none',
              }}
            >
              {m.emoji}
            </div>
            {m.fp >= 100 && (
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-yellow-400 flex items-center justify-center text-white font-bold" style={{ fontSize: 8 }}>
                ✓
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
