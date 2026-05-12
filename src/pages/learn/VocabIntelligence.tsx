import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import GameShell from '../../components/learn/GameShell'
import { useAppState, VOCAB_MASTERY, type VocabItem } from '../../state/AppState'
import { KIDS_MODULES } from '../../data/kidsModules'

const ALL_COLOR = '#6366f1'

type SortKey = 'recent' | 'mastery' | 'module'
type FilterKey = 'all' | 'learning' | 'mastered'

export default function VocabIntelligence() {
  const { state, dispatch } = useAppState()
  const navigate = useNavigate()
  const [sort, setSort] = useState<SortKey>('recent')
  const [filter, setFilter] = useState<FilterKey>('all')
  const [search, setSearch] = useState('')

  const vocab = state.vocab

  function getModuleColor(moduleId: string) {
    return KIDS_MODULES.find(m => m.id === moduleId)?.color ?? ALL_COLOR
  }

  function filtered(): VocabItem[] {
    let items = [...vocab]
    if (filter === 'learning') items = items.filter(v => v.correctCount < VOCAB_MASTERY)
    if (filter === 'mastered') items = items.filter(v => v.correctCount >= VOCAB_MASTERY)
    if (search) {
      const q = search.toLowerCase()
      items = items.filter(v => v.word.toLowerCase().includes(q) || v.english.toLowerCase().includes(q))
    }
    if (sort === 'recent') items.sort((a, b) => b.addedAt.localeCompare(a.addedAt))
    if (sort === 'mastery') items.sort((a, b) => b.correctCount - a.correctCount)
    if (sort === 'module') items.sort((a, b) => a.moduleId.localeCompare(b.moduleId))
    return items
  }

  const items = filtered()
  const mastered = vocab.filter(v => v.correctCount >= VOCAB_MASTERY).length
  const learning = vocab.length - mastered

  return (
    <GameShell title="My Vocabulary" moduleId="general">
      <div className="max-w-lg mx-auto px-4 pb-12">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Total Words', value: vocab.length, icon: '📖', color: ALL_COLOR },
            { label: 'Mastered', value: mastered, icon: '⭐', color: '#16a34a' },
            { label: 'Learning', value: learning, icon: '🔄', color: '#d97706' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl p-3 text-center shadow-sm border border-gray-100">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>

        {vocab.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📚</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No words yet!</h3>
            <p className="text-gray-500 text-sm mb-4">
              Tap any Spanish word in stories or the reader to save it here.
            </p>
            <button
              onClick={() => navigate('/learn')}
              className="px-6 py-3 rounded-full text-white font-semibold"
              style={{ background: ALL_COLOR }}
            >
              Start Learning
            </button>
          </div>
        ) : (
          <>
            {/* Search */}
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search words…"
              className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 text-sm mb-4 outline-none focus:border-indigo-300"
            />

            {/* Filter + Sort */}
            <div className="flex justify-between gap-2 mb-4">
              <div className="flex gap-1">
                {(['all', 'learning', 'mastered'] as FilterKey[]).map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className="px-3 py-1 rounded-full text-xs font-semibold border-2 transition-all"
                    style={{
                      borderColor: filter === f ? ALL_COLOR : '#e5e7eb',
                      background: filter === f ? ALL_COLOR : 'white',
                      color: filter === f ? 'white' : '#6b7280',
                    }}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
              <select
                value={sort}
                onChange={e => setSort(e.target.value as SortKey)}
                className="text-xs border border-gray-200 rounded-xl px-2 py-1 outline-none"
              >
                <option value="recent">Recent</option>
                <option value="mastery">Mastery</option>
                <option value="module">Module</option>
              </select>
            </div>

            {/* Word list */}
            <div className="space-y-2">
              {items.map((item, i) => {
                const color = getModuleColor(item.moduleId)
                const pct = Math.round((item.correctCount / VOCAB_MASTERY) * 100)
                const isMastered = item.correctCount >= VOCAB_MASTERY
                return (
                  <div key={i} className="bg-white rounded-2xl p-3.5 shadow-sm border border-gray-100">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-baseline gap-2">
                          <span className="font-bold text-gray-800">{item.word}</span>
                          <span className="text-gray-400 text-sm">= {item.english}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1.5">
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{ width: `${Math.min(pct, 100)}%`, background: isMastered ? '#16a34a' : color }}
                            />
                          </div>
                          <span className="text-xs text-gray-400">{item.correctCount}/{VOCAB_MASTERY}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {isMastered && <span className="text-lg">⭐</span>}
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{ background: `${color}18`, color }}
                        >
                          {item.moduleId}
                        </span>
                        <button
                          onClick={() => dispatch({ type: 'INCREMENT_VOCAB', word: item.word })}
                          className="text-xs px-2 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                          title="Mark as practiced"
                        >
                          +1
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {items.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <p>No words match your filter.</p>
              </div>
            )}
          </>
        )}
      </div>
    </GameShell>
  )
}
