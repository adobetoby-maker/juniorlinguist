import { Link } from 'react-router-dom'
import { APP_URL, ADULT_URL, sansFont, PURPLE, MUTED } from '../constants'

export default function Footer() {
  return (
    <footer className="border-t" style={{ borderColor: 'rgba(124,58,237,0.12)', backgroundColor: '#F0EDE6' }}>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="font-bold text-lg mb-1" style={{ fontFamily: '"Playfair Display", serif', color: '#18181B' }}>
              Junior Linguist
            </div>
            <p className="text-sm" style={{ ...sansFont, color: MUTED }}>
              Language learning for curious kids and homeschool families.
            </p>
          </div>

          <div className="flex flex-wrap gap-6 text-sm font-semibold" style={{ ...sansFont }}>
            <a href={ADULT_URL} target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-70" style={{ color: MUTED }}>
              Language Threshold (Adult)
            </a>
            <a href={APP_URL} target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-70" style={{ color: MUTED }}>
              Start Learning
            </a>
            <Link to="/about" className="transition-opacity hover:opacity-70" style={{ color: MUTED }}>
              About
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t text-xs" style={{ borderColor: 'rgba(124,58,237,0.1)', ...sansFont, color: MUTED }}>
          © {new Date().getFullYear()} Junior Linguist · Part of the{' '}
          <a href={ADULT_URL} target="_blank" rel="noopener noreferrer" style={{ color: PURPLE }}>Language Threshold</a> family.
        </div>
      </div>
    </footer>
  )
}
