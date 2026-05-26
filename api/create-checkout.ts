import type { VercelRequest, VercelResponse } from '@vercel/node'
import Stripe from 'stripe'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  if (!process.env.STRIPE_SECRET_KEY) return res.status(503).json({ error: 'Stripe not configured' })

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2026-04-22.dahlia' as never })
  const { priceId, userId, userEmail } = req.body as { priceId: string; userId: string; userEmail?: string }

  const origin = req.headers.origin ?? 'https://juniorlinguist.vercel.app'
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    subscription_data: { trial_period_days: 7, metadata: { userId } },
    client_reference_id: userId,
    customer_email: userEmail,
    success_url: `${origin}/subscribe/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/pricing`,
  })

  res.status(200).json({ url: session.url })
}
