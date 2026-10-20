import { useEffect, useRef, useState } from 'react'
import type { AdventureLesson, AdventureSeries } from './content'
import { useSpeech } from '../../state/SpeechProvider'
import './adventures.css'

const STEPS = ['Words', 'Story', 'Listen or read', 'Build', 'Say it', 'Check']
const rotate = <T,>(items: T[], offset: number) => [...items.slice(offset % items.length), ...items.slice(0, offset % items.length)]

function Choice({ question, choices, answer, onResult }: { question: string; choices: string[]; answer: number; onResult: (correct: boolean) => void }) {
  const [selected, setSelected] = useState<number | null>(null)
  const correct = selected === answer
  return <fieldset className="adventure-choice">
    <legend>{question}</legend>
    <div className="adventure-options">{rotate(choices.map((text, id) => ({ text, id })), question.length % choices.length).map(({ text, id }) =>
      <button key={id} type="button" aria-pressed={selected === id} className={selected === id ? correct ? 'is-correct' : 'try-again' : ''} onClick={() => { setSelected(id); onResult(id === answer) }}>{text}</button>)}</div>
    <p className="adventure-feedback" role="status">{selected === null ? 'Choose an answer. It’s okay to try again.' : correct ? 'That’s it! You found the clue.' : 'Not quite. Revisit the story or words, then try another answer.'}</p>
  </fieldset>
}

interface Props {
  series: AdventureSeries; lesson: AdventureLesson; preview?: boolean
  onExit: () => void; onNext: () => void
  onComplete: () => { saved: boolean; error?: string }
}

export default function LessonPlayer({ series, lesson, preview = false, onExit, onNext, onComplete }: Props) {
  const [step, setStep] = useState(0)
  const [translations, setTranslations] = useState(false)
  const [transcript, setTranscript] = useState(false)
  const [heard, setHeard] = useState(false)
  const [tokens, setTokens] = useState<number[]>([])
  const [built, setBuilt] = useState(false)
  const [buildChecked, setBuildChecked] = useState(false)
  const [triedSpeaking, setTriedSpeaking] = useState(false)
  const [checks, setChecks] = useState<boolean[]>([false, false])
  const [finished, setFinished] = useState(false)
  const [saveError, setSaveError] = useState('')
  const heading = useRef<HTMLHeadingElement>(null)
  const previousStage = useRef('0:false')
  const { speak, stop, supported } = useSpeech()
  const listenLine = lesson.story[1]
  const buildLine = lesson.story[0]
  const tiles = buildLine.es.split(' ')
  const words = lesson.newWords.length ? lesson.newWords : lesson.reviewWords
  const wordCheck = words[0]
  const ready = step === 2 ? heard : step === 3 ? built : step === 4 ? triedSpeaking : step === 5 ? checks.every(Boolean) : true
  useEffect(() => {
    const stage = `${step}:${finished}`
    if (previousStage.current === stage) return
    previousStage.current = stage
    heading.current?.focus({ preventScroll: true })
    heading.current?.scrollIntoView({ block: 'start' })
  }, [step, finished])
  useEffect(() => () => stop(), [stop])

  function finish() {
    if (!checks.every(Boolean) || !heard || !built || !triedSpeaking) return
    if (preview) { setFinished(true); return }
    const result = onComplete()
    setSaveError(result.saved ? '' : result.error ?? 'Lesson finished, but progress could not be saved. Try saving again.')
    setFinished(true)
  }

  return <main className="adventure-shell" style={{ '--adventure-color': series.color } as React.CSSProperties}>
    <header className="adventure-top"><button type="button" onClick={onExit}>← Lesson map</button><span>{preview ? 'Free first-lesson preview' : 'Spanish adventure'}</span></header>
    <div className="adventure-content">
      <p className="adventure-eyebrow">{series.emoji} {series.title} · Lesson {lesson.number} of {series.lessons.length}</p>
      <h1>{lesson.title}</h1><p className="adventure-goal">{lesson.goal}</p>
      {!finished && <><p className="adventure-meta">About {lesson.minutes} minutes · Go at your own pace</p><ol className="adventure-steps" aria-label="Lesson stages">{STEPS.map((label, i) => <li key={label} aria-current={step === i ? 'step' : undefined} className={i < step ? 'step-done' : ''}><span>{i < step ? '✓' : i + 1}</span><small>{label}</small></li>)}</ol></>}
      {finished ? <section className="adventure-card">
        <h2 ref={heading} tabIndex={-1}>You finished this lesson! 🎉</h2>
        <p>{lesson.goal.replace('I can', 'You practiced how to')}</p>
        <p>Two review questions answered, a sentence built, and speaking practice tried. This is practice progress, not a fluency score.</p>
        {saveError ? <><p role="alert">{saveError}</p><button className="adventure-primary" onClick={finish}>Try saving again</button></> : <p role="status">{preview ? 'Preview complete. No progress was saved.' : 'Saved for this account on this device.'}</p>}
        <button className="adventure-primary" onClick={onNext}>{preview ? 'Explore the full series' : lesson.number === series.lessons.length ? 'Back to your lesson map' : 'Next lesson →'}</button>
        <button onClick={onExit}>Return to lesson map</button>
      </section> : <section className="adventure-card">
        <h2 ref={heading} tabIndex={-1}>{STEPS[step]}</h2>
        {step === 0 && <>
          <p>{lesson.newWords.length ? 'A few new words for today. Tap to hear Spanish.' : 'Final mission! Reuse the words you have been learning.'}</p>
          <div className="adventure-words">{words.map(word => <div key={word.es}><strong lang="es">{word.es}</strong><span>{word.en}</span>{supported && <button onClick={() => speak(word.es, 'es')} aria-label={`Hear ${word.es}`}>🔊 Hear</button>}</div>)}</div>
          {lesson.reviewWords.length > 0 && lesson.newWords.length > 0 && <aside className="adventure-recap"><strong>Bring these back</strong><p>{lesson.reviewWords.map(w => `${w.es} (${w.en})`).join(' · ')}</p><p>These words come from earlier lessons. You’ll meet familiar language again in today’s story.</p></aside>}
        </>}
        {step === 1 && <>
          <p>Read this little story. English help is here whenever you need it.</p>
          <button aria-pressed={translations} onClick={() => setTranslations(v => !v)}>{translations ? 'Hide English help' : 'Show English help'}</button>
          <div className="adventure-story">{lesson.story.map(line => <div key={line.es}><p lang="es">{line.es}</p>{translations && <p className="adventure-translation">{line.en}</p>}{supported && <button onClick={() => speak(line.es, 'es')} aria-label={`Hear ${line.es}`}>🔊 Hear this line</button>}</div>)}</div>
        </>}
        {step === 2 && <>
          <p>Listen to one line, or read it with help. Match it to its meaning.</p>
          {supported ? <button className="adventure-primary" onClick={() => speak(listenLine.es, 'es')}>🔊 Play Spanish</button> : <p>Audio playback is unavailable in this browser. Read the Spanish line aloud together instead.</p>}
          {supported && <button aria-expanded={transcript} onClick={() => setTranscript(v => !v)}>{transcript ? 'Hide Spanish line' : 'Show Spanish line'}</button>}
          {(transcript || !supported) && <p lang="es" className="adventure-spanish">{listenLine.es}</p>}
          <Choice question="What does that line mean?" choices={[listenLine.en, lesson.story[0].en, lesson.story[2].en]} answer={0} onResult={setHeard} />
        </>}
        {step === 3 && <>
          <p>Build this sentence: <strong>{buildLine.en}</strong></p>
          <div className="adventure-answer" aria-label="Your Spanish sentence" lang="es" aria-live="polite">{tokens.length ? tokens.map(id => tiles[id]).join(' ') : 'Tap the words below in order.'}</div>
          <div className="adventure-tiles">{rotate(tiles.map((text, id) => ({ text, id })), Math.max(1, Math.floor(tiles.length / 2))).map(({ text, id }) => <button lang="es" key={id} disabled={tokens.includes(id)} onClick={() => { setTokens(t => [...t, id]); setBuilt(false) }}>{text}</button>)}</div>
          <div className="adventure-row"><button disabled={!tokens.length} onClick={() => { setTokens(t => t.slice(0, -1)); setBuilt(false) }}>Undo word</button><button disabled={!tokens.length} onClick={() => { setTokens([]); setBuilt(false) }}>Start sentence again</button></div>
          <button className="adventure-primary" disabled={tokens.length !== tiles.length} onClick={() => { setBuildChecked(true); setBuilt(tokens.map(id => tiles[id]).join(' ') === buildLine.es) }}>Check sentence</button>
          <p role="status">{built ? 'You built it! Say the sentence aloud if you can.' : buildChecked && tokens.length === tiles.length ? 'Not yet. Check the word order. Use Undo or start again.' : tokens.length === tiles.length ? 'Check your sentence. Use Undo or start again if it needs a change.' : 'Every word has a place. You can undo a choice.'}</p>
        </>}
        {step === 4 && <>
          <p className="adventure-spanish">Your mini mission</p><p>{lesson.practice}</p>
          <details><summary>Need a Spanish starting point?</summary><p lang="es">{buildLine.es}</p>{supported && <button onClick={() => speak(buildLine.es, 'es')}>🔊 Hear the model</button>}</details>
          <details><summary>Try a bigger challenge</summary><p>{lesson.stretch}</p></details>
          <p>No microphone or recording needed. Speak to yourself or a trusted grown-up. You can also whisper or rehearse the words silently.</p>
          <button aria-pressed={triedSpeaking} className={triedSpeaking ? 'is-correct' : 'adventure-primary'} onClick={() => setTriedSpeaking(true)}>{triedSpeaking ? '✓ I tried my mini mission' : 'I tried my mini mission'}</button>
        </>}
        {step === 5 && <>
          <p>Bring it together. You can look back at the story or words before trying again.</p>
          <Choice question={`Which Spanish word or phrase means “${wordCheck.en}”?`} choices={words.map(w => w.es)} answer={0} onResult={correct => setChecks(v => [correct, v[1]])} />
          <Choice question={lesson.question} choices={lesson.options} answer={lesson.answer} onResult={correct => setChecks(v => [v[0], correct])} />
          <details><summary>Look back at today’s story</summary>{lesson.story.map(line => <p key={line.es}><span lang="es">{line.es}</span><br />{line.en}</p>)}</details>
        </>}
      </section>}
    </div>
    {!finished && <footer className="adventure-footer"><button disabled={step === 0} onClick={() => { stop(); setStep(s => s - 1) }}>← Back</button><span>{step + 1} / {STEPS.length}</span><button className="adventure-primary" disabled={!ready} onClick={() => { stop(); if (step === 5) finish(); else setStep(s => s + 1) }}>{step === 5 ? 'Finish lesson' : 'Continue →'}</button></footer>}
  </main>
}
