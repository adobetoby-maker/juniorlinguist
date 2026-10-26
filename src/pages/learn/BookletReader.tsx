import { useCallback, useEffect, useRef, useState } from 'react'
import BookletHeader from '../../components/learn/BookletHeader'
import { BookletWords } from '../../components/learn/BookletWords'
import BookletWordCard from '../../components/learn/BookletWordCard'
import { HELLO_LITTLE_ONE } from '../../data/booklets'
import { useAppState } from '../../state/AppState'
import { saveBookletRead } from '../../state/progress'

interface Selection {
  word: string
  sentence: string
  sentenceId: string
  occurrenceIndex: number
  origin: HTMLButtonElement
}

export default function BookletReader() {
  const [pageIndex, setPageIndex] = useState(0)
  const [selection, setSelection] = useState<Selection | null>(null)
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'error'>('loading')
  const [completionAwarded, setCompletionAwarded] = useState(false)
  const { dispatch } = useAppState()
  const page = HELLO_LITTLE_ONE.pages[pageIndex]
  const isLastPage = pageIndex === HELLO_LITTLE_ONE.pages.length - 1
  const liveRegionRef = useRef<HTMLParagraphElement>(null)

  const goToPage = useCallback((next: number) => {
    const clamped = Math.max(0, Math.min(next, HELLO_LITTLE_ONE.pages.length - 1))
    setPageIndex(clamped)
    setSelection(null)
    setImageState('loading')
  }, [])

  useEffect(() => {
    if (!isLastPage) return
    if (saveBookletRead(HELLO_LITTLE_ONE.bookId)) {
      setCompletionAwarded(true)
      dispatch({ type: 'ADD_XP', amount: 10 })
      dispatch({ type: 'EARN_ACHIEVEMENT', name: 'read_story' })
    }
  }, [dispatch, isLastPage])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (selection) return
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        goToPage(pageIndex - 1)
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        goToPage(pageIndex + 1)
      } else if (event.key === 'Home') {
        event.preventDefault()
        goToPage(0)
      } else if (event.key === 'End') {
        event.preventDefault()
        goToPage(HELLO_LITTLE_ONE.pages.length - 1)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goToPage, pageIndex, selection])

  function closeWordCard() {
    const origin = selection?.origin
    setSelection(null)
    requestAnimationFrame(() => origin?.focus())
  }

  const selectedEnglish =
    page.sentences.find((sentence) => sentence.sentenceId === selection?.sentenceId)?.en ?? ''

  return (
    <div className="min-h-screen bg-[#FDFCF9]">
      <a
        href="#booklet-page"
        className="fixed left-3 top-3 z-[80] -translate-y-24 rounded bg-white px-4 py-2 font-bold text-violet-800 shadow focus:translate-y-0"
      >
        Skip to book page
      </a>
      <BookletHeader backTo="/learn/books" backLabel="Back to picture books" title={HELLO_LITTLE_ONE.title} />
      <main
        id="booklet-page"
        tabIndex={-1}
        className="mx-auto max-w-[1100px] pb-8"
        style={{ paddingTop: 'calc(78px + env(safe-area-inset-top, 0px))' }}
      >
        <h1 className="sr-only">{HELLO_LITTLE_ONE.title}</h1>
        <section
          aria-label={`${HELLO_LITTLE_ONE.title}, ${page.sourceLabel}`}
          data-page-id={page.pageId}
          data-source-label={page.sourceLabel}
          className="lg:grid lg:min-h-[calc(100dvh-9rem)] lg:grid-cols-[minmax(0,1.05fr)_minmax(20rem,0.95fr)] lg:items-center lg:gap-10 lg:px-8"
        >
          <div className="relative aspect-square w-full overflow-hidden bg-violet-50 lg:rounded-3xl lg:border-2 lg:border-violet-100">
            {imageState === 'loading' && (
              <div
                role="status"
                aria-busy="true"
                className="absolute inset-0 z-10 flex items-center justify-center bg-violet-100 text-sm font-bold text-violet-900"
              >
                Loading illustration…
              </div>
            )}
            {imageState !== 'error' && (
              <img
                key={page.image.assetId}
                src={page.image.url}
                alt={page.image.altText.target}
                aria-describedby={`${page.pageId}-alt-en`}
                data-page-id={page.pageId}
                data-source-label={page.sourceLabel}
                data-asset-id={page.image.assetId}
                width={2048}
                height={2048}
                className="h-full w-full object-contain"
                onLoad={() => setImageState('loaded')}
                onError={() => setImageState('error')}
              />
            )}
            {imageState === 'error' && (
              <div
                role="img"
                aria-label={page.image.altText.target}
                className="flex h-full flex-col items-center justify-center gap-3 border-2 border-dashed border-violet-300 p-6 text-center"
              >
                <span aria-hidden="true" className="text-4xl">🖼️</span>
                <p lang="es" className="font-bold text-slate-900">{page.image.altText.target}</p>
                <p lang="en" className="text-sm text-slate-700">{page.image.altText.source}</p>
              </div>
            )}
            <p id={`${page.pageId}-alt-en`} lang="en" className="sr-only">
              {page.image.altText.source}
            </p>
          </div>

          <div className="px-5 py-6 sm:px-8 lg:px-0">
            <div className="space-y-3">
              <div
                lang="en"
                data-booklet-language="en"
                className="space-y-2 text-lg font-semibold leading-relaxed text-slate-700"
              >
                {page.sentences.map((sentence) => (
                  <p key={sentence.sentenceId}>{sentence.en}</p>
                ))}
              </div>
              <div
                lang="es"
                data-booklet-language="es"
                className="space-y-2 text-[1.75rem] font-black leading-[1.6] text-slate-950"
              >
                {page.sentences.map((sentence) => (
                  <p key={sentence.sentenceId}>
                    <BookletWords
                      sentence={sentence.es}
                      sentenceId={sentence.sentenceId}
                      color="#5B21B6"
                      onWord={(word, tappedSentence, sentenceId, occurrenceIndex, origin) =>
                        setSelection({
                          word,
                          sentence: tappedSentence,
                          sentenceId,
                          occurrenceIndex,
                          origin,
                        })
                      }
                    />
                  </p>
                ))}
              </div>
            </div>
            <p className="mt-4 text-sm font-semibold text-slate-600">
              Tap any Spanish word to hear it and see what it means.
            </p>
            {isLastPage && (
              <div className="mt-5 rounded-2xl bg-emerald-100 p-4 text-center text-emerald-950">
                <p className="text-xl font-black">You read the whole book!</p>
                <p className="mt-1 text-sm font-semibold">
                  {completionAwarded ? 'Wonderful reading together. +10 XP' : 'Wonderful reading together.'}
                </p>
              </div>
            )}
            <nav aria-label="Book pages" className="mt-6 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => goToPage(pageIndex - 1)}
                disabled={pageIndex === 0}
                className="flex h-12 min-w-12 items-center justify-center rounded-full border-2 border-violet-700 px-4 text-xl font-black text-violet-800 disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                aria-label="Previous page"
              >
                ←
              </button>
              <p ref={liveRegionRef} aria-live="polite" className="font-black text-slate-700">
                {pageIndex + 1} / {HELLO_LITTLE_ONE.pages.length}
              </p>
              <button
                type="button"
                onClick={() => goToPage(pageIndex + 1)}
                disabled={isLastPage}
                className="flex h-12 min-w-12 items-center justify-center rounded-full border-2 border-violet-700 px-4 text-xl font-black text-violet-800 disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                aria-label="Next page"
              >
                →
              </button>
            </nav>
          </div>
        </section>
      </main>
      {selection && (
        <BookletWordCard
          selection={selection}
          englishSentence={selectedEnglish}
          vocabulary={HELLO_LITTLE_ONE.vocabulary}
          onClose={closeWordCard}
        />
      )}
    </div>
  )
}
