import { useNavigate, useParams } from 'react-router-dom'
import GameShell from '../../components/learn/GameShell'
import { KIDS_MODULES } from '../../data/kidsModules'
import { getModuleProgress } from '../../state/progress'

interface GameDef {
  id: string
  emoji: string
  label: string
  desc: string
  path: (moduleId: string) => string
  xp: string
  tag?: string
}

const GAMES: GameDef[] = [
  {
    id: 'flashcards',
    emoji: '🃏',
    label: 'Flashcards',
    desc: 'Learn words with flip cards',
    path: id => `/learn/${id}/flashcards`,
    xp: '+3 XP/card',
  },
  {
    id: 'match',
    emoji: '🔗',
    label: 'Word Match',
    desc: 'Connect words to meanings',
    path: id => `/learn/${id}/match`,
    xp: '+5 XP/round',
  },
  {
    id: 'quiz',
    emoji: '❓',
    label: 'Quick Quiz',
    desc: '10 multiple-choice questions',
    path: id => `/learn/${id}/quiz`,
    xp: '+8 XP/correct',
  },
  {
    id: 'memory',
    emoji: '🃏',
    label: 'Memory Game',
    desc: 'Flip and match word pairs',
    path: id => `/learn/${id}/memory`,
    xp: '+15 XP',
    tag: 'Fun',
  },
  {
    id: 'listening',
    emoji: '👂',
    label: 'Listening Drill',
    desc: 'Hear Spanish and choose the right phrase',
    path: id => `/learn/${id}/listening`,
    xp: '+8 XP/correct',
    tag: 'Audio',
  },
  {
    id: 'sentence-build',
    emoji: '🧩',
    label: 'Sentence Builder',
    desc: 'Rearrange words to form sentences',
    path: id => `/learn/${id}/sentence-build`,
    xp: '+10 XP/correct',
  },
  {
    id: 'reader',
    emoji: '📖',
    label: 'Story Reader',
    desc: 'Read bilingual stories aloud',
    path: id => `/learn/${id}/reader`,
    xp: '+10 XP/answer',
    tag: 'Stories',
  },
  {
    id: 'daily-story',
    emoji: '✨',
    label: 'Daily Story',
    desc: 'AI-written story just for today',
    path: id => `/learn/${id}/daily-story`,
    xp: '+15 XP',
    tag: 'AI',
  },
  {
    id: 'speak',
    emoji: '🗣️',
    label: 'Speak with Lingo',
    desc: 'Chat in Spanish with your AI friend',
    path: id => `/learn/${id}/speak`,
    xp: '+5 XP/reply',
    tag: 'AI',
  },
  {
    id: 'tutor',
    emoji: '🤖',
    label: 'AI Tutor',
    desc: 'Ask questions, get explanations',
    path: id => `/learn/${id}/tutor`,
    xp: '+2 XP/message',
    tag: 'AI',
  },
  {
    id: 'penpal',
    emoji: '✉️',
    label: 'Pen Pal',
    desc: 'Exchange letters with a Spanish kid',
    path: id => `/learn/${id}/penpal`,
    xp: '+15 XP/letter',
    tag: 'AI',
  },
]

export default function GamesHub() {
  const { moduleId = 'animals' } = useParams<{ moduleId: string }>()
  const module = KIDS_MODULES.find(m => m.id === moduleId) ?? KIDS_MODULES[0]
  const navigate = useNavigate()
  const progress = getModuleProgress(moduleId)

  const tagColor: Record<string, string> = {
    AI: '#8b5cf6',
    Audio: '#0891b2',
    Stories: '#059669',
    Fun: '#dc2626',
  }

  return (
    <GameShell title="All Games" moduleId={moduleId}>
      <div className="max-w-lg mx-auto px-4 pb-12">

        {/* Module info */}
        <div
          className="rounded-2xl p-4 mb-6 flex items-center gap-3"
          style={{ background: `${module.color}12` }}
        >
          <div className="text-3xl">{module.emoji}</div>
          <div>
            <p className="font-bold text-gray-800">{module.title}</p>
            <p className="text-xs text-gray-500">{module.vocab.length} vocabulary words</p>
          </div>
          <div className="ml-auto text-right">
            {progress?.quizBestStars ? (
              <div className="text-yellow-400 text-sm">{'★'.repeat(progress.quizBestStars)}</div>
            ) : null}
          </div>
        </div>

        {/* Games grid */}
        <div className="space-y-2">
          {GAMES.map(game => (
            <button
              key={game.id}
              onClick={() => navigate(game.path(moduleId))}
              className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow transition-shadow text-left active:scale-[0.98]"
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: `${module.color}15` }}
              >
                {game.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-800 text-sm">{game.label}</span>
                  {game.tag && (
                    <span
                      className="text-xs px-1.5 py-0.5 rounded-full font-semibold text-white"
                      style={{ background: tagColor[game.tag] ?? '#6b7280' }}
                    >
                      {game.tag}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{game.desc}</p>
              </div>
              <div className="text-xs text-gray-400 flex-shrink-0">{game.xp}</div>
            </button>
          ))}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate(`/learn/${moduleId}`)}
            className="text-sm text-gray-400 hover:text-gray-600"
          >
            ← Back to {module.title}
          </button>
        </div>
      </div>
    </GameShell>
  )
}
