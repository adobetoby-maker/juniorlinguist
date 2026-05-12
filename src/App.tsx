import { Routes, Route, Navigate } from 'react-router-dom'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'

export default function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </>
  )
}
