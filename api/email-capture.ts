import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Resend } from 'resend'

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]!)
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { email, name } = req.body ?? {}
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' })
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return res.status(503).json({ ok: false, error: 'Email is temporarily unavailable' })
  const resend = new Resend(apiKey)

  const displayName = (name && typeof name === 'string' && name.trim()) ? escapeHtml(name.trim()) : 'there'

  const htmlBody = `
<h2 style="font-family:sans-serif;color:#18181B">Welcome to Junior Linguist!</h2>
<p style="font-family:sans-serif;color:#4B5563">Hi ${displayName},</p>
<p style="font-family:sans-serif;color:#4B5563">Here are 9 Spanish starter phrases every kid loves — print them, put them on the fridge, and start today.</p>
<div style="background:#F9F7F4;border-radius:12px;padding:20px;margin:20px 0">
  <table style="font-family:sans-serif;font-size:14px;width:100%;border-collapse:collapse">
    <tr><td style="padding:6px 0;color:#18181B;font-weight:600">What is your name?</td><td style="padding:6px 0;color:#7C3AED;font-weight:600">¿Cómo te llamas?</td></tr>
    <tr><td style="padding:6px 0;color:#18181B;font-weight:600">I am hungry.</td><td style="padding:6px 0;color:#7C3AED;font-weight:600">Tengo hambre.</td></tr>
    <tr><td style="padding:6px 0;color:#18181B;font-weight:600">I like dogs.</td><td style="padding:6px 0;color:#7C3AED;font-weight:600">Me gustan los perros.</td></tr>
    <tr><td style="padding:6px 0;color:#18181B;font-weight:600">Let's play!</td><td style="padding:6px 0;color:#7C3AED;font-weight:600">¡Vamos a jugar!</td></tr>
    <tr><td style="padding:6px 0;color:#18181B;font-weight:600">That is really cool!</td><td style="padding:6px 0;color:#7C3AED;font-weight:600">¡Qué chévere!</td></tr>
    <tr><td style="padding:6px 0;color:#18181B;font-weight:600">Can I go to the bathroom?</td><td style="padding:6px 0;color:#7C3AED;font-weight:600">¿Puedo ir al baño?</td></tr>
    <tr><td style="padding:6px 0;color:#18181B;font-weight:600">I do not understand.</td><td style="padding:6px 0;color:#7C3AED;font-weight:600">No entiendo.</td></tr>
    <tr><td style="padding:6px 0;color:#18181B;font-weight:600">How do you say...?</td><td style="padding:6px 0;color:#7C3AED;font-weight:600">¿Cómo se dice...?</td></tr>
    <tr><td style="padding:6px 0;color:#18181B;font-weight:600">My favorite color is blue.</td><td style="padding:6px 0;color:#7C3AED;font-weight:600">Mi color favorito es el azul.</td></tr>
  </table>
</div>
<p style="text-align:center;margin:28px 0">
  <a href="https://juniorlinguist.com" style="background:#7C3AED;color:#fff;padding:14px 28px;border-radius:9999px;text-decoration:none;font-family:sans-serif;font-weight:700;font-size:15px">Explore Junior Linguist →</a>
</p>
<p style="font-family:sans-serif;color:#6B7280;font-size:13px">25 Spanish topics, plus 10 topics each in French, Japanese, Italian, and Portuguese. Topic previews are free; practice requires a subscription.</p>
<hr style="border:none;border-top:1px solid #E5E7EB;margin:24px 0">
<p style="font-family:sans-serif;color:#9CA3AF;font-size:12px">Junior Linguist · Language learning for ages 7–14</p>
`

  try {
    const { data, error } = await resend.emails.send({
      from: 'Junior Linguist <hello@languagethreshold.com>',
      to: [email],
      subject: "Your child's first Spanish lesson — free",
      html: htmlBody,
    })

    if (error || !data?.id) {
      console.error('Junior Linguist email was not accepted by the email provider')
      return res.status(502).json({ ok: false, error: 'Failed to send email' })
    }

    return res.status(200).json({ ok: true })
  } catch {
    console.error('Junior Linguist email request did not complete')
    return res.status(500).json({ ok: false, error: 'Failed to send email' })
  }
}
