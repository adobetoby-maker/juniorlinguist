# Spanish adventures — 20 October 2026

Three series of eight authored lessons: Animals, Space, and Food & Cooking. Each series introduces three words/phrases per lesson for lessons 1–7, revisits prior vocabulary, then combines it in lesson 8. Each lesson has words, a story, listening/reading, sentence building, a self-reported speaking mission, and two checks.

## Verification

- Twelve Node tests passed: seven content/progress tests and five existing email-capture tests. Application TypeScript/Vite build passed; existing large-chunk warning remains.
- All 24 lessons completed through the production LessonPlayer in an isolated local component harness at 375×812. Wrong listening answers and wrong review selections blocked continuation/completion. No horizontal overflow at completion.
- Local harness account A completed all 24; B and guest each saw zero; A returned to 24 after reload. This uses production progress functions with test actor labels; it is not an authenticated subscriber test.
- All three actual public first-lesson routes completed at 390×844. Preview reports no progress saved. Direct full lesson route displayed the existing subscription gate for an unsigned visitor.
- Mobile Home menu → Adventures worked at 390px. Viewport override restored. Temporary harness removed before publication.

## Boundaries

Completion is local to the signed-in account and device; it does not change existing XP/stars or certify proficiency. Listening has an explicit text alternative. No microphone/recording is required. Browser speech depends on installed Spanish voices. Physical iPhone Safari playback remains a manual check. Signed-in acceptance with owner-approved temporary trial access passed afterward, as detailed below; Stripe billing was not tested. Curriculum is authored practice, without claimed external curriculum or fluent-speaker approval. Existing topic catalog counts are unchanged; 24 new lessons are separately described.

## Hosted signed-in acceptance follow-up

The shared Supabase project was missing the current Junior Linguist domains in its auth redirect allowlist. The user observed Google sign-in returning to Language Threshold. With explicit approval, added only `/learn` and `/login` on `https://juniorlinguist.com` and `https://juniorlinguist-f0li8hhx9-adobetoby-5572s-projects.vercel.app`. Kept the Language Threshold Site URL and all six existing redirects. The dashboard confirmed four saved entries; normal Google OAuth then returned to the Junior Linguist preview.

No existing profiles had Junior Linguist active/trialing status. The owner explicitly authorized temporarily enabling trial access on their account and restoring it afterward. All 24 hosted full lessons completed at 390×844 with actual authenticated identity and saved confirmations. Each map showed eight of eight after reload. Replaying Animals lesson one left the count at eight. Next-lesson navigation passed. Removed only the temporary status field afterward; SQL confirmed its original absence and browser refresh displayed the subscription gate. No payment, Stripe subscription, or other entitlement was created. Completion remains device-only practice data.

See `spanish-adventures-signed-in-2026-10-20.json`. Temporary viewport override was reset. The physical iPhone Safari audio checklist is the remaining acceptance item before release. New preview deployments need their own exact auth redirect entries; no broad wildcard was added.

### iPhone audio checklist

Open the hosted `/adventures` page in Safari. For lesson one in each series:

1. Tap **Hear** for a word and **Hear this line** in Story. Confirm clear Spanish.
2. Tap **Play Spanish**, then replay. Confirm no overlapping voices.
3. Tap **Continue** during playback. Confirm audio stops.
4. Open **Show Spanish line** and finish with reading help if audio is unavailable. Confirm all controls remain reachable.

Report the series/lesson and iPhone/iOS version for any failure. Passing this checklist is not inferred from a phone-sized desktop browser.
