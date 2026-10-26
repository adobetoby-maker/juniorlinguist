import { useEffect, useRef } from 'react'
import type { BookletVocabulary } from '../../data/booklets'
import { useSpeech } from '../../state/SpeechProvider'
import { HighlightedOccurrence } from './BookletWords'

interface Selection {
  word: string
  sentence: string
  sentenceId: string
  occurrenceIndex: number
}

function normalized(value: string) {
  return value.normalize('NFC').toLocaleLowerCase('und')
}

export default function BookletWordCard({
  selection,
  englishSentence,
  vocabulary,
  onClose,
}: {
  selection: Selection
  englishSentence: string
  vocabulary: BookletVocabulary[]
  onClose: () => void
}) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const { speak } = useSpeech()
  const entry = vocabulary.find(
    (candidate) => normalized(candidate.term.target) === normalized(selection.word),
  )

  useEffect(() => {
    closeRef.current?.focus()
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab' || !dialogRef.current) return
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
        ),
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <>
      <div className="fixed inset-0 z-50 bg-slate-950/35" aria-hidden="true" />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booklet-word-title"
        className="fixed inset-x-2 bottom-2 z-[60] mx-auto max-h-[calc(100dvh-1rem)] max-w-md overflow-y-auto rounded-3xl border-2 border-violet-200 bg-white shadow-2xl sm:inset-x-auto sm:right-4 sm:w-[24rem]"
      >
        <div className="flex items-start justify-between gap-4 rounded-t-[1.35rem] bg-violet-700 px-5 py-4 text-white">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-violet-100">Spanish word</p>
            <h2 id="booklet-word-title" lang="es" className="text-3xl font-black">{selection.word}</h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            aria-label={`Close ${selection.word} word card`}
          >
            ×
          </button>
        </div>
        <div className="space-y-5 p-5">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-600">In this sentence</p>
            <p
              lang="es"
              data-booklet-context-sentence
              className="text-xl font-bold leading-relaxed text-slate-950"
            >
              <HighlightedOccurrence
                sentence={selection.sentence}
                word={selection.word}
                occurrenceIndex={selection.occurrenceIndex}
              />
            </p>
            <p lang="en" className="mt-2 text-base text-slate-700">{englishSentence}</p>
          </div>
          <div className="rounded-2xl bg-violet-50 p-4">
            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-violet-800">What it means</p>
            <p className="text-base font-bold leading-relaxed text-slate-950">
              {entry?.gloss.source ?? `On this page, it is part of “${englishSentence}”`}
            </p>
          </div>
          <button
            type="button"
            onClick={() => speak(selection.word, 'es')}
            className="flex min-h-11 w-full items-center justify-center gap-2 rounded-full border-2 border-violet-700 px-5 py-3 font-extrabold text-violet-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            <span aria-hidden="true">🔊</span>
            Hear the word
          </button>
        </div>
      </div>
    </>
  )
}
