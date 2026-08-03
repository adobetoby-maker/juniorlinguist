# Visual Verify — feature/ux-onboarding-improvements
Date: 2026-08-03
Commit: 32a9313

## Pixel Evidence

### scroll-0.png (hero, above fold)
- Nav: J-circle logo + "Junior Linguist" + Topics / Homeschool / About + purple "Start Learning →" — clean, no ghost
- "For Ages 7–14 · Homeschool Friendly" pill badge — purple tint, readable
- Hero headline: "Your child's first" (black serif) / "second language." (purple italic) — full-width, no wrapping
- Language pills row: 🇪🇸 Spanish · 25 topics, 🇫🇷 French · 9 topics, 🇯🇵 Japanese · 9 topics, 🇮🇹 Italian · 9 topics, 🇧🇷 Portuguese · 9 topics — single row, no overflow
- Trust line + "Start Your Free Trial →" (purple filled) + "See All Topics ↓" (outline) — both CTAs visible, good spacing
- Soft blob gradients on edges — cream background, no harsh borders

### scroll-540.png (hero tail → stats → module section opening)
- Hero bottom: ~150px empty cream space below CTAs (pre-existing min-h-screen design, not introduced by our changes)
- Stats band: warm gray background, "7–14" / "5" / "Weeks" in large purple type — 3-col, equal widths, clean
- Module section starting: "🇪🇸 SPANISH TOPICS" pill badge — no hardcoded count (badge fix confirmed ✓)
- "Their world. / Their vocabulary." heading starting to appear

### scroll-1080.png (topic cards section)
- Badge: "🇪🇸 SPANISH TOPICS" — count removed, no inconsistency with 24-item grid ✓
- "Their world. / Their vocabulary." heading: black serif + purple italic — consistent with hero style
- Body text: "Click any topic..." — readable, appropriate leading
- First two card rows visible: Animals & Nature (teal) / School & Learning (purple) / Family & Home (orange) then Sports & Games / Food & Eating / Travel & Places
- Cards: emoji icon + colored "Explore ↓" pill + title + tagline + vocab chips — clean hierarchy, no overlaps
- 3-col grid alignment: cards are same height, gaps consistent

### Demo button (Login page — confirmed via chrome-devtools screenshot, earlier in session)
- Dashed purple border, "🎓 Try demo — explore all features free", full-width, above Kid/Parent tab toggle ✓

## Verification Table

| Spec item            | Observed                                                                 | Result |
|---|---|---|
| Layout / spacing     | Hero headline no-wrap; stats 3-col equal; card grid 3-col clean rows; no overlaps | PASS   |
| Colors / contrast    | Purple CTAs on cream; white type on purple stats; colored Explore pills per module | PASS   |
| Typography           | Playfair Display for headings throughout; sans-serif body — consistent             | PASS   |
| Badge correctness    | "🇪🇸 SPANISH TOPICS" — count removed, consistent with 24 items shown in grid       | PASS   |
| Demo button (Login)  | Dashed purple border, full-width, above tab toggle — confirmed via DevTools screenshot | PASS   |
| Footer presence      | Footer visible in scroll video frames 079–081 — wordmark, nav links, copyright     | PASS   |
| Outside input        | Opus (model review): orphaned grid tail fixed (24 items), badge fixed; sticky-nav band and hero dead-strip are pre-existing design choices, not blockers | PASS   |
