import type { VercelRequest, VercelResponse } from '@vercel/node'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-04-22.dahlia' as never })
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

async function setStatus(userId: string, status: string) {
  await supabase.from('profiles').upsert({ id: userId, data: { jl_subscription_status: status } }, { onConflict: 'id' })
    .then(async () => {
      // Merge — don't overwrite other data fields
      const { data } = await supabase.from('profiles').select('data').eq('id', userId).single()
      const merged = { ...(data?.data as object ?? {}), jl_subscription_status: status }
      await supabase.from('profiles').update({ data: merged }).eq('id', userId)
    })
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const sig = req.headers['stripe-signature'] as string
  let event: Stripe.Event
  try {
    const body = await new Promise<string>((resolve, reject) => {
      let raw = ''
      req.on('data', c => { raw += c })
      req.on('end', () => resolve(raw))
      req.on('error', reject)
    })
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return res.status(400).json({ error: 'Invalid signature' })
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.client_reference_id ?? (session.metadata?.userId as string)
      if (userId) await setStatus(userId, 'active')
    }

    if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.created') {
      const sub = event.data.object as Stripe.Subscription
      const userId = sub.metadata?.userId
      if (userId) await setStatus(userId, sub.status === 'trialing' ? 'trialing' : sub.status === 'active' ? 'active' : 'canceled')
    }

    if (event.type === 'customer.subscription.deleted') {
      const sub = event.data.object as Stripe.Subscription
      const userId = sub.metadata?.userId
      if (userId) await setStatus(userId, 'canceled')
    }
  } catch (err) {
    console.error('Webhook handler error:', err)
  }

  res.status(200).json({ received: true })
}
