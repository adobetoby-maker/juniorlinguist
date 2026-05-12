import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import SplashLoader from './components/learn/SplashLoader'

const ModulePicker      = lazy(() => import('./pages/learn/ModulePicker'))
const ModuleHub         = lazy(() => import('./pages/learn/ModuleHub'))
const GamesHub          = lazy(() => import('./pages/learn/GamesHub'))
const FlashcardGame     = lazy(() => import('./pages/learn/FlashcardGame'))
const WordMatchGame     = lazy(() => import('./pages/learn/WordMatchGame'))
const QuizGame          = lazy(() => import('./pages/learn/QuizGame'))
const TutorChat         = lazy(() => import('./pages/learn/TutorChat'))
const KidsReader        = lazy(() => import('./pages/learn/KidsReader'))
const SpeakLearn        = lazy(() => import('./pages/learn/SpeakLearn'))
const ListeningDrill    = lazy(() => import('./pages/learn/ListeningDrill'))
const SentenceBuild     = lazy(() => import('./pages/learn/SentenceBuild'))
const MemoryGame        = lazy(() => import('./pages/learn/MemoryGame'))
const DailyStory        = lazy(() => import('./pages/learn/DailyStory'))
const VocabIntelligence = lazy(() => import('./pages/learn/VocabIntelligence'))
const Dashboard         = lazy(() => import('./pages/learn/Dashboard'))
const PenPal            = lazy(() => import('./pages/learn/PenPal'))

export default function App() {
  return (
    <Routes>
      {/* /learn/* — game app, no marketing nav/footer */}
      <Route
        path="/learn/*"
        element={
          <Suspense fallback={<SplashLoader />}>
            <Routes>
              <Route index element={<ModulePicker />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path=":moduleId/vocab" element={<VocabIntelligence />} />
              <Route path=":moduleId" element={<ModuleHub />} />
              <Route path=":moduleId/games" element={<GamesHub />} />
              <Route path=":moduleId/flashcards" element={<FlashcardGame />} />
              <Route path=":moduleId/match" element={<WordMatchGame />} />
              <Route path=":moduleId/quiz" element={<QuizGame />} />
              <Route path=":moduleId/tutor" element={<TutorChat />} />
              <Route path=":moduleId/reader" element={<KidsReader />} />
              <Route path=":moduleId/speak" element={<SpeakLearn />} />
              <Route path=":moduleId/listening" element={<ListeningDrill />} />
              <Route path=":moduleId/sentence-build" element={<SentenceBuild />} />
              <Route path=":moduleId/memory" element={<MemoryGame />} />
              <Route path=":moduleId/daily-story" element={<DailyStory />} />
              <Route path=":moduleId/penpal" element={<PenPal />} />
            </Routes>
          </Suspense>
        }
      />
      {/* Marketing site */}
      <Route
        path="*"
        element={
          <>
            <Nav />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Footer />
          </>
        }
      />
    </Routes>
  )
}
