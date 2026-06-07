import { Link } from 'react-router-dom'
import { sansFont, displayFont, PURPLE, MUTED } from '../constants'

export default function Terms() {
  return (
    <main className="min-h-screen py-20 px-6" style={{ backgroundColor: '#FDFCF9' }}>
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="text-xs mb-8 inline-block hover:opacity-70" style={{ ...sansFont, color: '#71717A' }}>
          ← Back to Junior Linguist
        </Link>

        <h1 className="text-3xl font-bold mb-2" style={{ ...displayFont, color: '#18181B' }}>Terms of Service</h1>
        <p className="text-sm mb-10" style={{ ...sansFont, color: MUTED }}>
          Last updated: June 2026 · Junior Linguist is part of the Language Threshold family.
        </p>

        <div className="space-y-8" style={{ ...sansFont, color: '#3F3F46', lineHeight: 1.7 }}>
          <section>
            <h2 className="text-lg font-bold mb-3" style={{ ...displayFont, color: '#18181B' }}>1. Acceptance</h2>
            <p className="text-sm">
              By accessing or using Junior Linguist ("the Service"), you agree to these Terms. If you are using the Service on behalf of a child, you represent that you are that child's parent or legal guardian and accept these Terms on their behalf.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3" style={{ ...displayFont, color: '#18181B' }}>2. Free trial and subscription</h2>
            <p className="text-sm mb-3">
              The Service offers a <strong>7-day free trial</strong>. At the end of the trial period, your subscription will automatically convert to a paid plan unless you cancel before the trial ends.
            </p>
            <p className="text-sm mb-3">
              Pricing is displayed at{' '}
              <Link to="/pricing" style={{ color: PURPLE }}>juniorlinguist.com/pricing</Link>.
              All prices are in USD. Subscriptions renew automatically (monthly or annually, per your selection) until cancelled.
            </p>
            <p className="text-sm">
              To cancel, email{' '}
              <a href="mailto:support@languagethreshold.com" style={{ color: PURPLE }}>support@languagethreshold.com</a>{' '}
              or use the cancellation link in your Stripe billing portal. Cancellation takes effect at the end of the current billing period.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3" style={{ ...displayFont, color: '#18181B' }}>3. Refunds</h2>
            <p className="text-sm">
              We offer a full refund within 7 days of your first paid charge if you are unsatisfied. Requests after that window are evaluated on a case-by-case basis. Contact{' '}
              <a href="mailto:support@languagethreshold.com" style={{ color: PURPLE }}>support@languagethreshold.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3" style={{ ...displayFont, color: '#18181B' }}>4. Permitted use</h2>
            <p className="text-sm mb-3">
              The Service is licensed for personal, non-commercial educational use. You may not redistribute, resell, or use the Service content in other products or curricula without written permission.
            </p>
            <p className="text-sm">
              You agree not to attempt to circumvent subscription restrictions, reverse engineer the application, or access the AI services directly outside of the provided interface.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3" style={{ ...displayFont, color: '#18181B' }}>5. Content and AI</h2>
            <p className="text-sm">
              The AI tutor conversations are generated automatically and may occasionally contain errors. The Service is intended as a practice aid, not a substitute for professional language instruction. We do not guarantee any specific learning outcome.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3" style={{ ...displayFont, color: '#18181B' }}>6. Disclaimer and limitation of liability</h2>
            <p className="text-sm">
              The Service is provided "as is" without warranties of any kind. To the maximum extent permitted by law, Language Threshold LLC is not liable for indirect, incidental, or consequential damages arising from use of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3" style={{ ...displayFont, color: '#18181B' }}>7. Governing law</h2>
            <p className="text-sm">
              These Terms are governed by the laws of the State of Idaho, United States, without regard to conflict of law principles.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3" style={{ ...displayFont, color: '#18181B' }}>8. Contact</h2>
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
