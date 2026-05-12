// Splits Spanish text into clickable word spans.
// Strips leading/trailing punctuation before passing the clean word to the callback.

const PUNCT_RE = /^[¿¡"'«»()\[\]{},;:!?.]+|[¿¡"'«»()\[\]{},;:!?.]+$/g

export default function ClickableWord({
  text,
  color,
  onWord,
}: {
  text: string
  color: string
  onWord: (word: string, sentence: string, x: number, y: number) => void
}) {
  const tokens = text.split(/(\s+)/)

  return (
    <span>
      {tokens.map((token, i) => {
        if (/^\s+$/.test(token)) return <span key={i}>{token}</span>
        const clean = token.replace(PUNCT_RE, '')
        if (!clean) return <span key={i}>{token}</span>

        return (
          <span
            key={i}
            onClick={e => {
              e.stopPropagation()
              const rect = (e.target as HTMLElement).getBoundingClientRect()
              onWord(clean, text, rect.left + rect.width / 2, rect.bottom)
            }}
            style={{
              cursor: 'pointer',
              borderRadius: 3,
              padding: '0 1px',
              transition: 'background-color 0.12s',
            }}
            className="hover:bg-opacity-20"
            onMouseEnter={e => { (e.target as HTMLElement).style.backgroundColor = `${color}28` }}
            onMouseLeave={e => { (e.target as HTMLElement).style.backgroundColor = 'transparent' }}
          >
            {token}
          </span>
        )
      })}
    </span>
  )
}
