const WORD = /^\p{L}+(?:['’]\p{L}+)*$/u
const WORD_PARTS = /(\p{L}+(?:['’]\p{L}+)*)/gu

function normalized(value: string) {
  return value.normalize('NFC').toLocaleLowerCase('und')
}

export function BookletWords({
  sentence,
  sentenceId,
  color,
  onWord,
}: {
  sentence: string
  sentenceId: string
  color: string
  onWord: (
    word: string,
    sentence: string,
    sentenceId: string,
    occurrenceIndex: number,
    origin: HTMLButtonElement,
  ) => void
}) {
  const occurrences = new Map<string, number>()
  return sentence.split(WORD_PARTS).map((part, index) => {
    if (!WORD.test(part)) return <span key={`${sentenceId}-text-${index}`}>{part}</span>
    const key = normalized(part)
    const occurrenceIndex = occurrences.get(key) ?? 0
    occurrences.set(key, occurrenceIndex + 1)
    return (
      <button
        key={`${sentenceId}-word-${index}`}
        type="button"
        className="booklet-word rounded px-0.5 font-extrabold underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        style={{ color, outlineColor: '#1D4ED8' }}
        onClick={(event) =>
          onWord(part, sentence, sentenceId, occurrenceIndex, event.currentTarget)
        }
        aria-label={`${part}, word ${occurrenceIndex + 1} in this sentence`}
        data-sentence-id={sentenceId}
        data-occurrence-index={occurrenceIndex}
      >
        {part}
      </button>
    )
  })
}

export function HighlightedOccurrence({
  sentence,
  word,
  occurrenceIndex,
}: {
  sentence: string
  word: string
  occurrenceIndex: number
}) {
  let seen = 0
  const selected = normalized(word)
  return sentence.split(WORD_PARTS).map((part, index) => {
    if (!WORD.test(part) || normalized(part) !== selected) {
      return <span key={`context-${index}`}>{part}</span>
    }
    const isSelected = seen === occurrenceIndex
    seen += 1
    return isSelected ? (
      <mark
        key={`context-${index}`}
        className="rounded bg-amber-200 px-0.5 font-black underline decoration-2"
      >
        {part}
      </mark>
    ) : (
      <span key={`context-${index}`}>{part}</span>
    )
  })
}
