import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { APP_URL, sansFont, PURPLE } from '../constants'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMobile = () => setMobileOpen(false)

  return (
    <nav
      className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled || mobileOpen ? 'rgba(253,252,249,0.97)' : 'transparent',
        backdropFilter: scrolled || mobileOpen ? 'blur(8px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(124,58,237,0.12)' : 'none',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 no-underline" onClick={closeMobile}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <circle cx="14" cy="14" r="12" stroke={PURPLE} strokeWidth="2" />
            <text x="14" y="19" textAnchor="middle" fontSize="13" fontFamily="Playfair Display, serif" fill={PURPLE} fontWeight="700">J</text>
          </svg>
          <span className="font-bold text-lg tracking-tight" style={{ fontFamily: '"Playfair Display", serif', color: '#18181B' }}>
            Junior Linguist
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <a href="/#modules" className="text-sm font-semibold transition-opacity hover:opacity-70" style={{ ...sansFont, color: '#71717A' }}>
            Topics
          </a>
          <a href="/#homeschool" className="text-sm font-semibold transition-opacity hover:opacity-70" style={{ ...sansFont, color: '#71717A' }}>
            Homeschool
          </a>
          <Link to="/about" className="text-sm font-semibold transition-opacity hover:opacity-70" style={{ ...sansFont, color: '#71717A' }}>
            About
          </Link>
          <a
            href={APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 rounded-full font-bold text-sm transition-opacity hover:opacity-90"
            style={{ ...sansFont, backgroundColor: PURPLE, color: '#fff' }}
          >
            Start Learning →
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col justify-center items-center gap-1.5 w-10 h-10"
          onClick={() => setMobileOpen(o => !o)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          <span style={{ width: 22, height: 2, backgroundColor: '#18181B', display: 'block', borderRadius: 2, transition: 'transform 0.2s', transform: mobileOpen ? 'rotate(45deg) translate(2px, 6px)' : 'none' }} />
          <span style={{ width: 22, height: 2, backgroundColor: '#18181B', display: 'block', borderRadius: 2, transition: 'opacity 0.2s', opacity: mobileOpen ? 0 : 1 }} />
          <span style={{ width: 22, height: 2, backgroundColor: '#18181B', display: 'block', borderRadius: 2, transition: 'transform 0.2s', transform: mobileOpen ? 'rotate(-45deg) translate(2px, -6px)' : 'none' }} />
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden flex flex-col gap-0 px-6 pb-6" style={{ borderTop: '1px solid rgba(124,58,237,0.1)', backgroundColor: 'rgba(253,252,249,0.97)' }}>
          <a href="/#modules" className="py-3.5 text-base font-semibold" style={{ ...sansFont, color: '#71717A', borderBottom: '1px solid rgba(0,0,0,0.05)' }} onClick={closeMobile}>Topics</a>
          <a href="/#homeschool" className="py-3.5 text-base font-semibold" style={{ ...sansFont, color: '#71717A', borderBottom: '1px solid rgba(0,0,0,0.05)' }} onClick={closeMobile}>Homeschool</a>
          <Link to="/about" className="py-3.5 text-base font-semibold" style={{ ...sansFont, color: '#71717A', borderBottom: '1px solid rgba(0,0,0,0.05)' }} onClick={closeMobile}>About</Link>
          <a href={APP_URL} target="_blank" rel="noopener noreferrer" className="mt-5 py-3.5 rounded-full font-bold text-base text-center" style={{ ...sansFont, backgroundColor: PURPLE, color: '#fff' }} onClick={closeMobile}>
            Start Learning →
          </a>
        </div>
      )}
    </nav>
  )
}
