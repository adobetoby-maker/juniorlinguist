# Visual Verify — feature/ux-onboarding-improvements
Date: 2026-08-03
Commit: 163f5e8

## Pixel Evidence

### frame_002 (0:00)
Blank/white frame — page pre-load. No content visible yet.

### frame_042 (mid-scroll — topics section)
- Nav: "Junior Linguist" logo + Topics / Homeschool / About links + purple "Start Learning →" CTA
- Topic cards in 3-col grid: store/shop, firefighter/police/paramedic, big/small/fast/slow vocabulary tags; "+6 more" chips
- "Rock Climbing" card: rope/harness/carabiner/helmet tags
- "FREE PHRASES" pill badge (purple outlined), "Start with 9 phrases. We'll send them to your inbox." heading in bold/italic
- Email capture: Your name (optional) + Your email address inputs + "Send me the phrases →" purple button
- Cream/off-white (#FDFCF9) background throughout; no layout breaks, no overlaps

### frame_079–081 (footer zone)
- Full-bleed purple CTA band: "Curious kids learn the fastest." (bold) + "the fastest." (italic) — white type on deep purple
- "Start Your Free Trial →" white oval outlined button — centered, appropriate scale
- "7-day free trial. No credit card required during trial." small white copy below button
- Decorative animal illustrations at left/right edges
- Footer: cream background, "Junior Linguist" wordmark + "Language learning for curious kids and homeschool families." tagline
- Footer nav: Language Threshold (Adult) / Start Your Free Trial → / About / Privacy / Terms
- © 2026 Junior Linguist · Part of the Language Threshold family (with link)
- Footer fully visible in final 3 frames — scroll harness gate: PASS

### Demo button (chrome-devtools screenshot, Login page)
- Dashed purple border, purple text "🎓 Try demo — explore all features free"
- Full-width, above Kid/Parent tab toggle
- Background tint: PURPLE at ~3% opacity — subtle, non-distracting
- Hover: opacity-70 transition wired

## Verification Table

| Spec item            | Observed                                                                 | Result |
|---|---|---|
| Layout / spacing     | 3-col topic cards, centered email form, full-bleed CTA band — no overlaps at any scroll position | PASS   |
| Colors / contrast    | Purple CTAs and pill on cream background; white type on purple band — contrast sufficient | PASS   |
| Typography           | Bold/italic display heading in CTA band; sans-serif body; tag chips readable at small size | PASS   |
| Demo button (Login)  | Dashed purple border, full-width, above tab toggle — confirmed via chrome-devtools screenshot | PASS   |
| Footer presence      | Footer fully visible in frames 079–081 — wordmark, all nav links, copyright line | PASS   |
| Outside input        | Opus (model review): orphaned last topic-grid card (~400px dead space), ghost white rect behind sticky-nav logo, blank strip above purple CTA — fixes queued on branch | FAIL → fix queued |
