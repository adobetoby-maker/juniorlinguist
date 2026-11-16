# Optional weekly signup choice

Junior Linguist frontend-only change based on 773a32d.

Adult signup confirmation and immediate-success screens offer an optional, identity-free link to https://juniorlinguist.com/free-downloads. Creating an account does not subscribe anyone. The separate weekly form requires adult identity, explicit unchecked weekly consent, a chosen track, anti-abuse verification and email confirmation. Password-reset messages do not show the invitation. No signup payload, billing route, webhook, secret or API handler changes.

Junior child login/signup flows are unchanged and exclude this invitation. Parent signin/OAuth entry offers the choice. Weekly form copy says useful practice guides, allowing the released HTML format without promising held PDFs.

Production build passed.

Shared independent browser verification lives under learning-products-2026-11-16/renderer/validation/check-signup-choice-ui.mjs and signup-choice-ui/report.json in the parent workspace. Thirteen production-built mocked browser cases passed across both products, desktop/mobile, with no provider traffic or browser errors. Tests preserve auth payloads and primary learning navigation, exclude reset/child flows, and check light/dark account-card readability. No production promotion or emails were performed by this change.
