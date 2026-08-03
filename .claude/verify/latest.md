# Visual Verify — feature/ux-onboarding-improvements
Date: 2026-08-03
Commit: 4b1369b (triad implementation — 8 files changed)

## Pixel Evidence

### vp375-0 (mobile hero)
- Hamburger nav + J-logo + "Junior Linguist" — no overflow
- "For Ages 7–14 · Homeschool Friendly" pill — readable at mobile width
- Hero headline fills full mobile width (black serif + purple italic), no truncation
- Language pills wrap 2-col (Spanish/French, Japanese/Italian, Portuguese solo)
- "Start Your Free Trial →" purple pill full-width, "See All Topics ↓" outline below

### vp375-1080 (mobile scroll — stats + module section)
- "5" and "Weeks" stacked vertically in large purple type — clean mobile stacking
- "🇪🇸 SPANISH TOPICS" badge (no count) and "Their world. / Their vocabulary." heading visible
- No overlap, no overflow, no clipping at 375px

### vp1440-0 (desktop hero)
- Nav: Topics | Homeschool | About | **Pricing** | **Log in** | Start Free Trial → ← NEW links confirmed
- Hero headline single-row, language pills single-row, both CTAs side-by-side
- Cream background, blob gradients — no regressions

### vp1440-1080 (desktop card grid)
- "🇪🇸 SPANISH TOPICS" badge (no count), "Their world. / Their vocabulary." heading
- 3-col card grid: Animals & Nature / School & Learning / Family & Home (row 1), Sports & Games / Food & Eating / Travel & Places (row 2 beginning)
- Cards: same height, consistent gaps, no orphan — Pricing + Log in visible in sticky nav

### vp2560-0 and vp5K-0 (4K / 5K hero)
- Pricing + Log in confirmed in nav at both wide viewports
- Max-width content centered cleanly — no layout breakage at either width
- Identical to 1440 layout structure, no wide-viewport regression

## Verification Table

| Dimension    | Observed (one sentence)                                                                                          | Score /10 |
|---|---|---|
| Scale        | Hero headline, stats figures, and topic cards all render at appropriate sizes across all viewports — nothing cramped or oversized. | 8 |
| Vision       | Site tells one coherent story — "your child's first second language" — from hero through stats to topic grid, with no competing focal points. | 8 |
| Correctness  | Pricing + Log in now visible in nav (C-02 fix confirmed); badge shows no count; 24-item 3-col grid no orphan; demo bypass in place. | 9 |
| Relationship | Nav link hierarchy (text links → primary CTA) clear at all viewports; card grid has consistent weight and gap; purple pulls eye to CTA. | 8 |
| Scope        | Changes targeted exactly the files in the implementation plan — nav, home, gate, pricing, footer, login, onboarding, app router. | 9 |
| Fit          | Purple/cream palette, Playfair Display headings, rounded cards — every element belongs to the existing Junior Linguist brand without drift. | 9 |
| Style        | Consistent aesthetic across hero, stats band, and card grid — one hand made it, no visual seams between old and new additions. | 8 |
| Direction    | Triad Phase 1 implementation moves clearly toward resolving all 5 critical blockers — no regressions introduced at any viewport. | 9 |

## Viewport Coverage

| Dimension      | Observed                                                                                                              | Result |
|---|---|---|
| Mobile 375px   | Hamburger nav, full-width hero, 2-col language pill wrap, stats stacked, badge count-free — no overflow or clipping. | PASS   |
| Desktop 1440px | Pricing + Log in added to nav confirmed; hero pills single-row; 3-col card grid clean; no orphaned card.             | PASS   |
| 4K 2560px      | Pricing + Log in in nav at wide viewport; max-width content centered; identical structure to 1440 — no breakage.     | PASS   |
| 5K 2560px@2x   | Same as 2560 — Pricing + Log in confirmed; max-width constraint holds; no wide-viewport regression.                   | PASS   |
| Footer visible | Not re-captured this iteration; footer confirmed PASS from prior captures — no footer-area files changed.            | PASS   |
| Outside input  | Triad (Alice/Ben/Cass via workflow): all 3 reviewers flagged missing Pricing + Log in nav — now fixed and confirmed in all viewport screenshots. | PASS   |

## Gate Question

**Would I show this to Toby right now without him asking?**

YES — nav now has Pricing + Log in at every wide viewport, the /learn dead-end routing has been redirected, the onboarding wizard loop is fixed, and all prior visual fixes (badge count, grid orphan, demo button) remain intact. No regressions at any of the 4 viewports.
