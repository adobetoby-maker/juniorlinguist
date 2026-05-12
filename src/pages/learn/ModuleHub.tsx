import { useMemo } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { KIDS_MODULES } from '../../data/kidsModules'
import { getModuleProgress } from '../../state/progress'
import FluencyPath from '../../components/learn/FluencyPath'
import StarDisplay from '../../components/learn/StarDisplay'
import { sansFont, displayFont } from '../../constants'

export default function ModuleHub() {
  const { moduleId } = useParams<{ moduleId: string }>()
  const mod = KIDS_MODULES.find(m => m.id === moduleId)
  const progress = useMemo(() => moduleId ? getModuleProgress(moduleId) : null, [moduleId])

  if (!mod) return <Navigate to="/learn" replace />

  const extraActivities = [
    { label: 'Listening Drill', emoji: '👂', path: 'listening', desc: 'Hear & choose' },
    { label: 'Sentence Builder', emoji: '🧩', path: 'sentence-build', desc: 'Arrange the words' },
    { label: 'Memory Match', emoji: '🃏', path: 'memory', desc: 'Flip & match pairs' },
    { label: 'All Activities', emoji: '🎮', path: 'games', desc: 'See everything' },
  ]

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FDFCF9' }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${mod.color} 0%, ${mod.color}cc 100%)`, paddingTop: 64, paddingBottom: 28 }}>
        <div className="max-w-lg mx-auto px-5 text-center">
          <Link to="/learn" className="inline-flex items-center gap-1 mb-4 text-sm font-bold" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', ...sansFont }}>
            ← All Topics
          </Link>
          <div className="text-6xl mb-2">{mod.emoji}</div>
          <h1 className="text-2xl font-bold mb-1" style={{ ...displayFont, color: '#fff' }}>{mod.title}</h1>
          <p className="text-sm mb-0" style={{ ...sansFont, color: 'rgba(255,255,255,0.8)' }}>{mod.tagline}</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5 -mt-1 pb-12">

        {/* Fun fact */}
        <div className="rounded-2xl p-4 mb-5 mt-4" style={{ backgroundColor: '#F5F3FF', border: '1.5px solid rgba(124,58,237,0.12)' }}>
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ ...sansFont, color: '#7C3AED' }}>💡 Did you know?</p>
          <p className="text-sm leading-relaxed" style={{ ...sansFont, color: '#3F3F46' }}>{mod.funFact}</p>
        </div>

        {/* === FLUENCY PATH — the centerpiece === */}
        <div className="bg-white rounded-3xl p-5 shadow-sm mb-5" style={{ border: `1.5px solid ${mod.color}20` }}>
          <FluencyPath moduleId={mod.id} color={mod.color} progress={progress ?? undefined} />
        </div>

        {/* Core 3 games with stars */}
        <p className="text-xs font-bold uppercase tracking-widest mb-3 px-1" style={{ ...sansFont, color: '#71717A' }}>Play & Practice</p>
        <div className="space-y-2 mb-5">
          {[
            { label: 'Flashcards', emoji: '🃏', path: 'flashcards', stars: progress?.flashBestStars ?? 0, desc: 'Learn all 10 words' },
            { label: 'Word Match', emoji: '🔗', path: 'match', stars: progress?.matchBestStars ?? 0, desc: 'Match the pairs' },
            { label: 'Quick Quiz', emoji: '🎯', path: 'quiz', stars: progress?.quizBestStars ?? 0, desc: '10 questions' },
          ].map(g => (
            <Link key={g.path} to={`/learn/${mod.id}/${g.path}`} style={{ textDecoration: 'none' }}>
              <div
                className="flex items-center gap-4 rounded-2xl p-4 transition-all duration-150 hover:scale-[1.01]"
                style={{ backgroundColor: '#fff', border: `2px solid ${mod.color}22`, boxShadow: `0 1px 6px ${mod.color}10` }}
              >
                <span className="text-2xl">{g.emoji}</span>
                <div className="flex-1">
                  <p className="font-bold text-sm" style={{ ...sansFont, color: '#18181B' }}>{g.label}</p>
                  <p className="text-xs" style={{ ...sansFont, color: '#71717A' }}>{g.desc}</p>
                </div>
                <StarDisplay stars={g.stars as 0|1|2|3} size="sm" color={mod.color} />
              </div>
            </Link>
          ))}
        </div>

        {/* More activities 2×2 */}
        <p className="text-xs font-bold uppercase tracking-widest mb-3 px-1" style={{ ...sansFont, color: '#71717A' }}>More Fun</p>
        <div className="grid grid-cols-2 gap-2 mb-5">
          {extraActivities.map(a => (
            <Link key={a.path} to={`/learn/${mod.id}/${a.path}`} style={{ textDecoration: 'none' }}>
              <div
                className="flex items-center gap-2.5 rounded-2xl p-3 transition-all duration-150 hover:scale-[1.02]"
                style={{ backgroundColor: '#fff', border: `1.5px solid ${mod.color}22`, boxShadow: `0 1px 4px ${mod.color}10` }}
              >
                <span className="text-xl">{a.emoji}</span>
                <div>
                  <p className="font-bold text-xs" style={{ ...sansFont, color: '#18181B' }}>{a.label}</p>
                  <p className="text-xs" style={{ ...sansFont, color: '#71717A' }}>{a.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Dashboard link */}
        <Link to="/learn/dashboard" style={{ textDecoration: 'none' }}>
          <div
            className="rounded-2xl p-4 text-center"
            style={{ background: 'linear-gradient(135deg, #6366f118, #8b5cf610)', border: '1.5px solid #6366f130' }}
          >
            <p className="text-2xl mb-0.5">🏆</p>
            <p className="font-bold text-sm" style={{ ...sansFont, color: '#18181B' }}>My Progress & Achievements</p>
            <p className="text-xs mt-0.5" style={{ ...sansFont, color: '#71717A' }}>XP, streaks, word mastery</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
