import { Link } from 'react-router-dom'
import { sansFont, displayFont, PURPLE, MUTED } from '../constants'

export default function Privacy() {
  return (
    <main className="min-h-screen py-20 px-6" style={{ backgroundColor: '#FDFCF9' }}>
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="text-xs mb-8 inline-block hover:opacity-70" style={{ ...sansFont, color: '#71717A' }}>
          ← Back to Junior Linguist
        </Link>

        <h1 className="text-3xl font-bold mb-2" style={{ ...displayFont, color: '#18181B' }}>Privacy Policy</h1>
        <p className="text-sm mb-10" style={{ ...sansFont, color: MUTED }}>
          Last updated: June 2026 · Junior Linguist is part of the Language Threshold family.
        </p>

        <div className="space-y-8" style={{ ...sansFont, color: '#3F3F46', lineHeight: 1.7 }}>
          <section>
            <h2 className="text-lg font-bold mb-3" style={{ ...displayFont, color: '#18181B' }}>1. What we collect</h2>
            <p className="text-sm mb-3">
              <strong>Email address</strong> — collected when you sign up for our phrase newsletter or create an account. Used only to send the content you requested and occasional language tips.
            </p>
            <p className="text-sm mb-3">
              <strong>Subscription data</strong> — when you subscribe via Stripe, Stripe collects your payment information directly. We receive only your email address and subscription status. We never see your card number.
            </p>
            <p className="text-sm">
              <strong>Usage data</strong> — anonymous learning progress (topics explored, stars earned) is stored in your browser's local storage only. It does not leave your device unless you create an account.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3" style={{ ...displayFont, color: '#18181B' }}>2. Children's privacy (COPPA)</h2>
            <p className="text-sm mb-3">
              Junior Linguist is designed for children ages 7–14 but is intended to be used with parental supervision. We do not knowingly collect personal information directly from children under 13. All account creation and email signup must be completed by a parent or guardian.
            </p>
            <p className="text-sm">
              If you believe a child has provided personal information without parental consent, contact us at{' '}
              <a href="mailto:support@languagethreshold.com" style={{ color: PURPLE }}>support@languagethreshold.com</a>{' '}
              and we will delete it promptly.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3" style={{ ...displayFont, color: '#18181B' }}>3. How we use your information</h2>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>To deliver the phrase sheet or newsletter you requested</li>
              <li>To manage your subscription and send receipts</li>
              <li>To send infrequent product updates (you may unsubscribe anytime)</li>
              <li>We do not sell, rent, or share your email with third parties for marketing</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3" style={{ ...displayFont, color: '#18181B' }}>4. Third-party services</h2>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li><strong>Stripe</strong> — payment processing. Subject to{' '}
                <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: PURPLE }}>Stripe's Privacy Policy</a>.
              </li>
              <li><strong>Vercel</strong> — hosting. Collects standard server logs (IP address, user agent) per{' '}
                <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: PURPLE }}>Vercel's Privacy Policy</a>.
              </li>
              <li><strong>Google Analytics</strong> — anonymous usage metrics. No personally identifiable data is sent.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3" style={{ ...displayFont, color: '#18181B' }}>5. Your rights</h2>
            <p className="text-sm">
              You may request access to, correction of, or deletion of your personal data at any time by emailing{' '}
              <a href="mailto:support@languagethreshold.com" style={{ color: PURPLE }}>support@languagethreshold.com</a>.
              We will respond within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3" style={{ ...displayFont, color: '#18181B' }}>6. Contact</h2>
            <p className="text-sm">
              Language Threshold LLC · Idaho, United States ·{' '}
              <a href="mailto:support@languagethreshold.com" style={{ color: PURPLE }}>support@languagethreshold.com</a>
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
