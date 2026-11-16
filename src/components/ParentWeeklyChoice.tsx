import { Link } from 'react-router-dom'
import { PURPLE, sansFont } from '../constants'

export default function ParentWeeklyChoice() {
  return <section aria-label="Optional weekly practice for adults" className="mt-6 rounded-2xl border p-5 text-left" style={{ ...sansFont, borderColor: '#D8CBEF', background: '#FFFFFF', color: '#26232E' }}>
    <h2 className="text-base font-bold mb-2">Keep practicing once a week (optional)</h2>
    <p className="text-sm leading-relaxed mb-3">Parents and adult learners can choose one weekly lesson series. Emails start only after you request and confirm a separate invitation. Creating an account does not subscribe you.</p>
    <Link to="/free-downloads" className="inline-block text-sm font-bold underline" style={{ color: PURPLE }}>Choose weekly practice →</Link>
  </section>
}
