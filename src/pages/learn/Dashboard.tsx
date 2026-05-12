import { useNavigate } from 'react-router-dom'
import GameShell from '../../components/learn/GameShell'
import { useAppState, getTier, xpForNextTier, VOCAB_MASTERY } from '../../state/AppState'
import { getAllProgress } from '../../state/progress'
import { KIDS_MODULES } from '../../data/kidsModules'

const PRIMARY = '#6366f1'

export default function Dashboard() {
  const { state } = useAppState()
  const navigate = useNavigate()
  const tier = getTier(state.xp)
  const xpInfo = xpForNextTier(state.xp)
  const allProgress = getAllProgress()
  const mastered = state.vocab.filter(v => v.correctCount >= VOCAB_MASTERY).length

  const moduleActivity = KIDS_MODULES.map(m => {
    const p = allProgress[m.id]
    const played = !!(p?.flashBestStars || p?.matchBestStars || p?.quizBestScore)
    return { ...m, played, bestStars: Math.max(p?.flashBestStars ?? 0, p?.matchBestStars ?? 0, p?.quizBestStars ?? 0) }
  })

  const achievements = [
    { name: 'First Word', emoji: '🔤', earned: state.vocab.length >= 1, desc: 'Looked up your first word' },
    { name: 'Word Collector', emoji: '📚', earned: state.vocab.length >= 10, desc: 'Saved 10 vocabulary words' },
    { name: 'Word Scholar', emoji: '🎓', earned: state.vocab.length >= 50, desc: 'Saved 50 vocabulary words' },
    { name: 'First Star', emoji: '⭐', earned: state.xp >= 10, desc: 'Earned your first XP' },
    { name: 'Adventurer', emoji: '🚀', earned: state.xp >= 100, desc: 'Reached Adventurer tier' },
    { name: 'Hero', emoji: '🦸', earned: state.xp >= 300, desc: 'Reached Hero tier' },
    { name: 'Story Reader', emoji: '📖', earned: state.achievements.includes('read_story'), desc: 'Read your first story' },
    { name: 'Streak Starter', emoji: '🔥', earned: state.streak >= 3, desc: '3-day learning streak' },
    { name: 'Master', emoji: '🌟', earned: mastered >= 5, desc: 'Mastered 5 vocabulary words' },
  ]

  const earned = achievements.filter(a => a.earned)

  return (
    <GameShell title="My Progress" moduleId="general">
      <div className="max-w-lg mx-auto px-4 pb-12 space-y-6">

        {/* Tier card */}
        <div
          className="rounded-3xl p-6 text-white text-center shadow-lg"
          style={{ background: `linear-gradient(135deg, ${PRIMARY}, #8b5cf6)` }}
        >
          <div className="text-5xl mb-2">{tier.emoji}</div>
          <h2 className="text-2xl font-bold">{tier.label}</h2>
          <p className="text-white/80 text-sm mt-1">{state.xp} XP earned</p>

          {xpInfo.pct < 100 && (
            <div className="mt-4">
              <div className="h-2.5 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all"
                  style={{ width: `${xpInfo.pct}%` }}
                />
              </div>
              <p className="text-white/70 text-xs mt-1">{xpInfo.needed} XP to {xpInfo.label}</p>
            </div>
          )}

          <div className="grid grid-cols-3 gap-3 mt-5">
            {[
              { label: 'Streak', value: `${state.streak}🔥`, desc: 'days' },
              { label: 'Words', value: String(state.vocab.length), desc: 'saved' },
              { label: 'Mastered', value: String(mastered), desc: 'words' },
            ].map(s => (
              <div key={s.label} className="bg-white/15 rounded-2xl py-2.5">
                <div className="text-xl font-bold">{s.value}</div>
                <div className="text-white/70 text-xs">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div>
          <h3 className="font-bold text-gray-800 mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'My Words', emoji: '📚', path: '/learn/general/vocab' },
              { label: 'Daily Story', emoji: '✨', path: '/learn/animals/daily-story' },
              { label: 'Speak', emoji: '🗣️', path: '/learn/general/speak' },
              { label: 'All Topics', emoji: '🗺️', path: '/learn' },
            ].map(a => (
              <button
                key={a.label}
                onClick={() => navigate(a.path)}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3 hover:shadow transition-shadow text-left"
              >
                <span className="text-2xl">{a.emoji}</span>
                <span className="font-semibold text-gray-700 text-sm">{a.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Module progress */}
        <div>
          <h3 className="font-bold text-gray-800 mb-3">Topics Explored</h3>
          <div className="grid grid-cols-3 gap-2">
            {moduleActivity.map(m => (
              <button
                key={m.id}
                onClick={() => navigate(`/learn/${m.id}`)}
                className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 text-center hover:shadow transition-shadow"
              >
                <div className="text-2xl mb-1">{m.emoji}</div>
                <div className="text-xs font-medium text-gray-700 leading-tight">{m.title.split(' ')[0]}</div>
                {m.bestStars > 0 ? (
                  <div className="text-yellow-400 text-xs mt-1">{'★'.repeat(m.bestStars)}{'☆'.repeat(3 - m.bestStars)}</div>
                ) : (
                  <div className="text-gray-300 text-xs mt-1">Not started</div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div>
          <h3 className="font-bold text-gray-800 mb-1">
            Achievements <span className="text-gray-400 font-normal text-sm">({earned.length}/{achievements.length})</span>
          </h3>
          <p className="text-xs text-gray-400 mb-3">Earn achievements by learning and exploring!</p>
          <div className="grid grid-cols-3 gap-2">
            {achievements.map(a => (
              <div
                key={a.name}
                className={`rounded-2xl p-3 text-center transition-all ${a.earned ? 'bg-white shadow-sm border border-gray-100' : 'bg-gray-50 opacity-50'}`}
              >
                <div className={`text-2xl mb-1 ${!a.earned ? 'grayscale' : ''}`}>{a.emoji}</div>
                <div className="text-xs font-semibold text-gray-700 leading-tight">{a.name}</div>
                <div className="text-xs text-gray-400 leading-tight mt-0.5">{a.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </GameShell>
  )
}
