import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import SplashLoader from './components/learn/SplashLoader'

const ModulePicker  = lazy(() => import('./pages/learn/ModulePicker'))
const ModuleHub     = lazy(() => import('./pages/learn/ModuleHub'))
const FlashcardGame = lazy(() => import('./pages/learn/FlashcardGame'))
const WordMatchGame = lazy(() => import('./pages/learn/WordMatchGame'))
const QuizGame      = lazy(() => import('./pages/learn/QuizGame'))
const TutorChat     = lazy(() => import('./pages/learn/TutorChat'))

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
              <Route path=":moduleId" element={<ModuleHub />} />
              <Route path=":moduleId/flashcards" element={<FlashcardGame />} />
              <Route path=":moduleId/match" element={<WordMatchGame />} />
              <Route path=":moduleId/quiz" element={<QuizGame />} />
              <Route path=":moduleId/tutor" element={<TutorChat />} />
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
