import { useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { useSubscription } from '../../state/subscription-state'
import { ADVENTURES, type AdventureLesson, type AdventureSeries } from './content'
import { adventureStorage, completeAdventureLesson, readAdventureProgress } from './progress'
import LessonPlayer from './LessonPlayer'
import './adventures.css'

export function AdventureLibrary({ preview = false }: { preview?: boolean }) {
  return <main className="adventure-library"><div className="adventure-library-inner">
    <Link to={preview ? '/' : '/learn'}>← {preview ? 'Junior Linguist' : 'All topics'}</Link>
    <p className="adventure-eyebrow">Spanish adventures · Ages 7–14</p><h1>One little adventure at a time.</h1>
    <p>Three connected series. Eight lessons each. New words turn into stories, sentences, and a mini mission.</p>
    <p>Start at lesson one, or revisit any lesson. About seven minutes each, with English help and an optional bigger challenge.</p>
    <div className="adventure-grid">{ADVENTURES.map(series => <article className="adventure-series" key={series.id} style={{ '--adventure-color': series.color } as React.CSSProperties}>
      <span aria-hidden="true" className="adventure-icon">{series.emoji}</span><h2>{series.title}</h2><p>{series.description}</p><p>8 lessons · Spanish</p>
      <Link className="adventure-link adventure-primary" to={`${preview ? '/adventures' : '/learn/series'}/${series.id}`}>Explore {series.title} →</Link>
    </article>)}</div>
    <aside className="adventure-notice">{preview ? 'Try the first lesson of each series free. The full series uses your Junior Linguist subscription.' : 'Finished lessons are saved for this account on this device. They do not change your game stars or fluency score.'} Listening uses your device’s Spanish voice when available; every audio activity also has a reading option.</aside>
  </div></main>
}

export function AdventureOverview({ preview = false }: { preview?: boolean }) {
  const { seriesId } = useParams()
  const { userId, loading } = useSubscription()
  const series = ADVENTURES.find(item => item.id === seriesId)
  if (!series) return <Navigate to={preview ? '/adventures' : '/learn/series'} replace />
  if (!preview && loading) return <main className="adventure-library"><p role="status">Loading your lesson map…</p></main>
  return <SeriesMap key={`${preview}:${userId}:${seriesId}`} series={series} preview={preview} actor={userId ? `account:${userId}` : 'guest'} />
}

function SeriesMap({ series, preview, actor }: { series: AdventureSeries; preview: boolean; actor: string }) {
  const [{ progress, error }] = useState(() => preview ? { progress: { completed: [] as string[] }, error: undefined } : readAdventureProgress(adventureStorage(), actor))
  const completed = series.lessons.filter(lesson => progress.completed.includes(lesson.id)).length
  const next = series.lessons.find(lesson => !progress.completed.includes(lesson.id)) ?? series.lessons[0]
  return <main className="adventure-library" style={{ '--adventure-color': series.color } as React.CSSProperties}><div className="adventure-library-inner">
    <Link to={preview ? '/adventures' : '/learn/series'}>← All adventures</Link>
    <p className="adventure-eyebrow">{series.emoji} Spanish · 8 connected lessons</p><h1>{series.title}</h1><p>{series.description}</p>
    <aside className="adventure-notice">{preview ? 'Try lesson one free. Lessons 2–8 are part of the full subscription.' : `${completed} of 8 lessons finished on this device for this account.`} Each lesson reuses earlier words. English translations and bigger challenges are optional.</aside>
    {error && <p role="alert">{error}</p>}
    <Link className="adventure-link adventure-primary" to={preview ? `/adventures/${series.id}/preview` : `/learn/series/${series.id}/${next.number}`}>{preview ? 'Try lesson one free →' : completed === 8 ? 'Review lesson one →' : `Continue with lesson ${next.number} →`}</Link>
    <ol className="adventure-lesson-list">{series.lessons.map(lesson => <li key={lesson.id}>
      <h2>{lesson.number}. {lesson.title} {progress.completed.includes(lesson.id) && <span aria-label="Finished">✓</span>}</h2><p>{lesson.goal}</p>
      <p>{lesson.newWords.length ? `${lesson.newWords.length} new words or phrases · Review + story + practice` : 'Final mission · Bring earlier lessons together'}</p>
      <Link className="adventure-link" to={preview ? lesson.number === 1 ? `/adventures/${series.id}/preview` : `/learn/series/${series.id}/${lesson.number}` : `/learn/series/${series.id}/${lesson.number}`}>{preview && lesson.number > 1 ? 'Open with your subscription →' : progress.completed.includes(lesson.id) ? 'Review lesson →' : 'Start lesson →'}</Link>
    </li>)}</ol>
    <p>Speaking is a self-reported practice activity. Completing lessons is not a proficiency certificate.</p>
  </div></main>
}

export function AdventureLessonPage({ preview = false }: { preview?: boolean }) {
  const { seriesId, lessonNumber } = useParams()
  const { userId, loading } = useSubscription()
  const series = ADVENTURES.find(item => item.id === seriesId)
  const number = preview ? 1 : Number(lessonNumber)
  const lesson = series?.lessons.find(item => item.number === number)
  if (!series || !lesson) return <Navigate to={preview ? '/adventures' : '/learn/series'} replace />
  if (!preview && loading) return <main className="adventure-library"><p role="status">Loading your lesson…</p></main>
  const actor = userId ? `account:${userId}` : 'guest'
  return <LessonSession key={`${preview}:${actor}:${lesson.id}`} series={series} lesson={lesson} actor={actor} preview={preview} />
}

function LessonSession({ series, lesson, actor, preview }: { series: AdventureSeries; lesson: AdventureLesson; actor: string; preview: boolean }) {
  const navigate = useNavigate()
  const exit = () => navigate(`${preview ? '/adventures' : '/learn/series'}/${series.id}`)
  return <LessonPlayer series={series} lesson={lesson} preview={preview} onExit={exit}
    onComplete={() => completeAdventureLesson(adventureStorage(), actor, lesson.id)}
    onNext={() => { if (preview) navigate(`/learn/series/${series.id}`); else if (lesson.number < series.lessons.length) navigate(`/learn/series/${series.id}/${lesson.number + 1}`); else exit() }} />
}
