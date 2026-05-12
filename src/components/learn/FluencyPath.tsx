import { useNavigate } from 'react-router-dom'
import { getFluencySteps, fluencyPct, type ModuleProgress, emptyProgress } from '../../state/progress'

export default function FluencyPath({
  moduleId,
  color,
  progress,
}: {
  moduleId: string
  color: string
  progress?: ModuleProgress
}) {
  const navigate = useNavigate()
  const p = progress ?? emptyProgress(moduleId)
  const steps = getFluencySteps(p, moduleId)
  const pct = fluencyPct(p, moduleId)
  const isFluent = pct === 100

  // First undone step = the recommended next action
  const nextIdx = steps.findIndex(s => !s.done)

  return (
    <div className="mb-6">
      {/* Fluency header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="font-bold text-sm" style={{ fontFamily: '"Nunito", sans-serif', color: '#18181B' }}>
            Your Learning Journey
          </p>
          <p className="text-xs" style={{ fontFamily: '"Nunito", sans-serif', color: '#71717A' }}>
            {isFluent ? '🌟 You\'re fluent in this topic!' : `${pct}% fluent — keep going!`}
          </p>
        </div>
        {isFluent && (
          <div
            className="px-3 py-1 rounded-full text-white text-xs font-bold"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)', fontFamily: '"Nunito", sans-serif' }}
          >
            ⭐ FLUENT
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-gray-100 rounded-full mb-5 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: isFluent
              ? 'linear-gradient(90deg, #f59e0b, #f97316)'
              : `linear-gradient(90deg, ${color}, ${color}99)`,
          }}
        />
      </div>

      {/* Step nodes */}
      <div className="relative">
        {/* Connecting line behind nodes */}
        <div
          className="absolute top-5 left-5 right-5 h-0.5 z-0"
          style={{ background: '#e5e7eb' }}
        />

        <div className="relative z-10 flex justify-between items-start">
          {steps.map((step, i) => {
            const isNext = i === nextIdx
            const isDone = step.done

            return (
              <button
                key={step.id}
                onClick={() => navigate(step.paths[0])}
                className="flex flex-col items-center gap-1.5 flex-1"
                style={{ maxWidth: 72 }}
              >
                {/* Node circle */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all"
                  style={{
                    background: isDone
                      ? color
                      : isNext
                      ? 'white'
                      : '#f3f4f6',
                    border: isDone
                      ? `2.5px solid ${color}`
                      : isNext
                      ? `2.5px solid ${color}`
                      : '2.5px solid #e5e7eb',
                    boxShadow: isNext
                      ? `0 0 0 4px ${color}28, 0 0 12px ${color}40`
                      : isDone
                      ? `0 0 8px ${color}40`
                      : 'none',
                    animation: isNext ? 'pulse-ring 2s infinite' : 'none',
                  }}
                >
                  {isDone ? '✓' : step.emoji}
                </div>

                {/* Label */}
                <div className="text-center">
                  <p
                    className="text-xs font-semibold leading-tight"
                    style={{
                      fontFamily: '"Nunito", sans-serif',
                      color: isDone ? color : isNext ? '#18181B' : '#9ca3af',
                    }}
                  >
                    {step.label}
                  </p>
                  {isNext && (
                    <p
                      className="text-xs mt-0.5 font-bold"
                      style={{ color, fontFamily: '"Nunito", sans-serif' }}
                    >
                      Next up!
                    </p>
                  )}
                  {isDone && (
                    <p className="text-xs mt-0.5" style={{ color: '#9ca3af', fontFamily: '"Nunito", sans-serif' }}>
                      Done ✓
                    </p>
                  )}
                </div>
              </button>
            )
          })}

          {/* Fluent trophy node */}
          <button
            onClick={() => navigate(`/learn/dashboard`)}
            className="flex flex-col items-center gap-1.5 flex-1"
            style={{ maxWidth: 72 }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all"
              style={{
                background: isFluent ? 'linear-gradient(135deg, #f59e0b, #f97316)' : '#f3f4f6',
                border: isFluent ? '2.5px solid #f59e0b' : '2.5px solid #e5e7eb',
                boxShadow: isFluent ? '0 0 12px #f59e0b60' : 'none',
              }}
            >
              {isFluent ? '🌟' : '⭐'}
            </div>
            <p
              className="text-xs font-bold text-center leading-tight"
              style={{
                fontFamily: '"Nunito", sans-serif',
                color: isFluent ? '#f59e0b' : '#9ca3af',
              }}
            >
              Fluent!
            </p>
          </button>
        </div>
      </div>

      {/* Next action CTA */}
      {!isFluent && nextIdx >= 0 && (
        <button
          onClick={() => navigate(steps[nextIdx].paths[0])}
          className="w-full mt-5 py-3.5 rounded-2xl font-bold text-white text-base transition-transform active:scale-[0.98]"
          style={{
            background: `linear-gradient(135deg, ${color}, ${color}cc)`,
            fontFamily: '"Nunito", sans-serif',
            boxShadow: `0 4px 16px ${color}40`,
          }}
        >
          {steps[nextIdx].emoji} {steps[nextIdx].label} — Let's go!
        </button>
      )}

      {isFluent && (
        <div
          className="w-full mt-5 py-4 rounded-2xl text-center font-bold text-white text-base"
          style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)', fontFamily: '"Nunito", sans-serif' }}
        >
          🌟 Topic complete! Try the daily story or another module.
        </div>
      )}
    </div>
  )
}
