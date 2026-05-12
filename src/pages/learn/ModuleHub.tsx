import { useMemo } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { KIDS_MODULES } from '../../data/kidsModules'
import { getModuleProgress, totalStars } from '../../state/progress'
import StarDisplay from '../../components/learn/StarDisplay'
import { sansFont, displayFont } from '../../constants'

export default function ModuleHub() {
  const { moduleId } = useParams<{ moduleId: string }>()
  const mod = KIDS_MODULES.find(m => m.id === moduleId)
  const progress = useMemo(() => moduleId ? getModuleProgress(moduleId) : null, [moduleId])

  if (!mod) return <Navigate to="/learn" replace />

  const allStars = progress ? totalStars(progress) : 0

  const games = [
    { label: 'Flashcards', emoji: '🃏', path: 'flashcards', stars: progress?.flashBestStars ?? 0, desc: '10 vocab words — tap to flip' },
    { label: 'Word Match', emoji: '🔗', path: 'match',      stars: progress?.matchBestStars ?? 0, desc: 'Match the pairs' },
    { label: 'Quiz',       emoji: '🎯', path: 'quiz',       stars: progress?.quizBestStars ?? 0,  desc: '10 questions, 4 choices each' },
  ] as const

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FDFCF9' }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${mod.color} 0%, ${mod.color}cc 100%)`, paddingTop: 64, paddingBottom: 32 }}>
        <div className="max-w-lg mx-auto px-5 text-center">
          <Link to="/learn" className="inline-flex items-center gap-1 mb-5 text-sm font-bold" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', ...sansFont }}>
            ← All Topics
          </Link>
          <div className="text-6xl mb-3">{mod.emoji}</div>
          <h1 className="text-2xl font-bold mb-1" style={{ ...displayFont, color: '#fff' }}>{mod.title}</h1>
          <p className="text-sm mb-4" style={{ ...sansFont, color: 'rgba(255,255,255,0.8)' }}>{mod.tagline}</p>
          {allStars > 0 && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
              <StarDisplay stars={Math.min(3, Math.round(allStars / 3)) as 0 | 1 | 2 | 3} size="sm" color="#fff" />
              <span className="text-xs font-bold" style={{ ...sansFont, color: '#fff' }}>{allStars} / 9 stars</span>
            </div>
          )}
        </div>
      </div>

      {/* Fun fact */}
      <div className="max-w-lg mx-auto px-5 -mt-3">
        <div className="rounded-2xl p-4 mb-6 mt-5" style={{ backgroundColor: '#F5F3FF', border: '1.5px solid rgba(124,58,237,0.12)' }}>
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ ...sansFont, color: '#7C3AED' }}>💡 Fun fact</p>
          <p className="text-sm leading-relaxed" style={{ ...sansFont, color: '#3F3F46' }}>{mod.funFact}</p>
        </div>

        {/* Game cards */}
        <div className="space-y-3 mb-8">
          {games.map(g => (
            <Link
              key={g.path}
              to={`/learn/${mod.id}/${g.path}`}
              style={{ textDecoration: 'none' }}
            >
              <div
                className="flex items-center gap-4 rounded-2xl p-4 transition-all duration-150 hover:scale-[1.02]"
                style={{ backgroundColor: '#fff', border: `2px solid ${mod.color}22`, boxShadow: `0 2px 8px ${mod.color}12` }}
              >
                <span className="text-3xl">{g.emoji}</span>
                <div className="flex-1">
                  <p className="font-bold text-base" style={{ ...sansFont, color: '#18181B' }}>{g.label}</p>
                  <p className="text-xs" style={{ ...sansFont, color: '#71717A' }}>{g.desc}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <StarDisplay stars={g.stars as 0|1|2|3} size="sm" color={mod.color} />
                  <span className="text-xs font-bold" style={{ ...sansFont, color: mod.color }}>→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* More activities */}
        <div className="mb-3">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ ...sansFont, color: '#71717A' }}>More Activities</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Story Reader', emoji: '📖', path: 'reader', desc: 'Read bilingual stories' },
              { label: 'Daily Story', emoji: '✨', path: 'daily-story', desc: 'AI-written story today' },
              { label: 'Speak with Lingo', emoji: '🗣️', path: 'speak', desc: 'Conversation practice' },
              { label: 'Listening Drill', emoji: '👂', path: 'listening', desc: 'Hear and choose' },
              { label: 'Sentence Builder', emoji: '🧩', path: 'sentence-build', desc: 'Arrange the words' },
              { label: 'Memory Game', emoji: '🃏', path: 'memory', desc: 'Flip and match pairs' },
              { label: 'AI Tutor', emoji: '🤖', path: 'tutor', desc: 'Ask anything' },
              { label: 'All Games', emoji: '🎮', path: 'games', desc: 'See every activity' },
            ].map(a => (
              <Link key={a.path} to={`/learn/${mod.id}/${a.path}`} style={{ textDecoration: 'none' }}>
                <div
                  className="flex items-center gap-3 rounded-2xl p-3 transition-all duration-150 hover:scale-[1.02]"
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
        </div>

        {/* Dashboard link */}
        <Link to="/learn/dashboard" style={{ textDecoration: 'none' }}>
          <div
            className="rounded-2xl p-4 text-center mb-10"
            style={{ background: `linear-gradient(135deg, #6366f118, #8b5cf610)`, border: '1.5px solid #6366f130' }}
          >
            <p className="text-2xl mb-1">🏆</p>
            <p className="font-bold text-sm mb-0.5" style={{ ...sansFont, color: '#18181B' }}>My Progress & Achievements</p>
            <p className="text-xs" style={{ ...sansFont, color: '#71717A' }}>XP, streaks, vocab mastery, and more</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
