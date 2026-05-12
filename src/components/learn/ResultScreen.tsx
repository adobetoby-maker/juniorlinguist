import { useState } from 'react'
import { Link } from 'react-router-dom'
import StarDisplay from './StarDisplay'

const HEADLINES: Record<1 | 2 | 3, string[]> = {
  3: ['Perfect! 🎉', 'Amazing work! ✨', 'You crushed it! 🏆'],
  2: ['Great job! 👏', 'Well done! 💪', 'Nice work! 🌟'],
  1: ['You finished! 🎊', 'Good effort! 🙌', 'Keep it up! 🚀'],
}

function pick(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)]
}

export default function ResultScreen({
  stars,
  subline,
  moduleId,
  color,
  onPlayAgain,
  got,
  total,
  lang,
}: {
  stars: 1 | 2 | 3
  subline: string
  moduleId: string
  color: string
  onPlayAgain: () => void
  got?: number
  total?: number
  lang?: string
}) {
  const [copied, setCopied] = useState(false)
  const snapshotUrl = (got !== undefined && total !== undefined && lang)
    ? `${window.location.origin}/snapshot?m=${moduleId}&got=${got}&total=${total}&lang=${lang}`
    : null

  function handleShare() {
    if (!snapshotUrl) return
    navigator.clipboard.writeText(snapshotUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16 text-center" style={{ backgroundColor: '#FDFCF9' }}>
      <div className="text-6xl mb-6">{stars === 3 ? '🏆' : stars === 2 ? '🌟' : '🎊'}</div>
      <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: '"Nunito", sans-serif', color: '#18181B' }}>
        {pick(HEADLINES[stars])}
      </h2>
      <p className="text-base mb-6" style={{ fontFamily: '"Nunito", sans-serif', color: '#71717A' }}>
        {subline}
      </p>
      <StarDisplay stars={stars} size="lg" color={color} />

      <div className="flex flex-col gap-3 mt-10 w-full max-w-xs">
        <button
          onClick={onPlayAgain}
          className="w-full py-4 rounded-full font-bold text-base transition-opacity hover:opacity-90"
          style={{ backgroundColor: color, color: '#fff', fontFamily: '"Nunito", sans-serif', border: 'none', cursor: 'pointer' }}
        >
          Play Again
        </button>
        {snapshotUrl && (
          <button
            onClick={handleShare}
            className="w-full py-4 rounded-full font-bold text-base transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#F5F3FF', color: '#7C3AED', fontFamily: '"Nunito", sans-serif', border: 'none', cursor: 'pointer' }}
          >
            {copied ? '✓ Link copied!' : '📤 Share your progress'}
          </button>
        )}
        <Link
          to={`/learn/${moduleId}`}
          className="w-full py-4 rounded-full font-bold text-base text-center transition-opacity hover:opacity-80"
          style={{ border: `2px solid ${color}`, color: color, fontFamily: '"Nunito", sans-serif', textDecoration: 'none', display: 'block' }}
        >
          Try Another Game
        </Link>
        <Link
          to="/learn"
          className="text-sm font-semibold transition-opacity hover:opacity-70"
          style={{ color: '#71717A', fontFamily: '"Nunito", sans-serif', textDecoration: 'none', marginTop: 4 }}
        >
          Back to All Topics
        </Link>
      </div>
    </div>
  )
}
