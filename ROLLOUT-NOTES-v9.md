# MADA Oman — v9 "Soft Slate & Emerald" Build

## Start here
Open `index.html` in a browser. Everything still persists to `localStorage`
(`mada_db_v1` for data, `mada_user_session` for the signed-in role/uid).
Run `MadaDB.resetDb()` in the console to reseed demo data at any time.

## A) Bottom nav + chatbot collision — root cause & fix

**Root cause found:** the old bottom nav was only ever injected for
`influencer-`-prefixed pages (`mada-mobile-ui.js`), so `index.html` (guest)
and every business page never got one. Separately, **two competing floating
chat widgets** were loading on every single page: a crude one built inline
in the old `app.js` (`#assistOpen` / `.assistbtn`), and the real, richer one
in `mada-chatbot.js` (`.mada-chat-launcher`). That's the "collision."

**Fix:**
- `app.js` rewritten from scratch: the duplicate legacy chatbot is gone
  entirely. Added `MadaSession` (reads `mada_user_session`, falls back to
  the legacy `mada_user_role` key, then `data-role`) and a role-aware
  `injectBottomNav()` covering **guest / influencer(creator) / business**
  with the exact destinations requested. Admin/owner keep their sidebar
  dashboard shell and intentionally get no bottom bar.
- Removed the now-redundant nav-building block from `mada-mobile-ui.js` and
  stripped the old static `<nav class="mobile">` markup from the 6 pages
  that still had it (`influencer-calendar/my-offers/notifications/offer/
  profile.html`, `saved-offers.html`) — one source of truth now.
- `ui-kit.css`: real shell — `position:fixed;bottom:0;z-index:50`, safe-area
  padding, `88px` body spacer via `body.has-mada-bottom-nav`, hidden
  `≥768px` via `@media (min-width:768px){ .mada-bottom-nav{display:none!important} }`.
- Chatbot resized to 46px, floats at `calc(84px + env(safe-area-inset-bottom))`
  above the bar, re-themed to the emerald/indigo gradient, and gets a
  `.mada-chat-hidden` class from new focus/blur listeners in `app.js`
  (any focused `input/textarea/select` hides it) plus a scroll-triggered
  reveal on the three heavy-form pages (`create-offer.html`,
  `business-register.html`, `influencer-register.html`).

## B) Business onboarding flow — traced & rebuilt

**Root cause found:** `business-register.html` redirected to
`business-welcome.html`, whose only CTA was "complete your profile" →
straight into empty settings with no path to publishing anything. That's
exactly the reported break.

**Fix:**
- `business-register.html` now captures Trade Name, Category, Governorate,
  and Contact, writes `onboardingStatus: 'pending_first_offer'` onto the
  business's `MadaDB` user record, sets `mada_user_session`, and redirects
  **directly** to `business-onboarding.html` (no intermediate screen).
- `business-onboarding.html` rebuilt as the exact 3-step checklist:
  1. توثيق بيانات المنشأة — always shown complete right after registration.
  2. إضافة أول تجربة ضيافة — prominent CTA to `create-offer.html`; flips to
     "complete" live once `MadaDB.getOffers()` returns anything for this uid.
  3. استقبال حجوزات المؤثرين — flips to "complete" once an applicant exists;
     shows a live applicant count instead of static copy.
  Packages moved to an optional, non-blocking card below the checklist.
- `create-offer.html` gained three one-click templates (dinner / coffee /
  stay) that pre-fill the whole form, plus a "this is your first offer"
  banner when arrived at via `?from=onboarding`.
- `business-dashboard.html` now checks real offer count for the signed-in
  business and swaps the demo stats grid for a high-conversion empty state
  ("أنشئ أول عرض لك الآن") when there are zero offers, and shows a success
  toast on arrival via `?first_offer=1`.
- `business-welcome.html` is now unreachable from the registration flow and
  left in place but orphaned — candidate for deletion or repurposing later.

**Side fix required for the above to actually work:** several business
pages (`applicants.html`, `business-my-offers.html`, `business-analytics.html`,
`business-notifications.html`, `create-offer.html`) had the demo business uid
`"biz_luna"` hardcoded rather than reading the signed-in session, so a newly
registered business's own offers/applicants would never have shown up
anywhere. All five now resolve the uid via a new `MadaSession.currentBusinessUid()`
helper (falls back to `biz_luna` when no one has registered in this browser,
so the existing seeded demo keeps working exactly as before).

## Design system — "Soft Slate & Emerald"

Re-pointed the CSS custom properties the codebase already used everywhere
(`--dark` → indigo `#4F46E5`, `--violet` → emerald `#0E7C66`) rather than
rewriting every component selector — this alone re-themes `.btn.primary`,
`.mark`, `.eyebrow`, badges, and package borders site-wide with minimal risk,
since the whole codebase was already built variable-first. Layered explicit
overrides on top for the selectors that hardcoded hex instead of variables
(hero/sidebar/footer/rule-number backgrounds, filter-chip active state, city
gradients, status pips, chat bubbles). Canvas is now `#F8FAFC`, cards are
white with a soft diffuse shadow, inputs are 50px/14px-radius with an
emerald focus ring, buttons are 48px/14px-radius with a subtle active-scale.
Font is IBM Plex Sans Arabic (Google Fonts, `@import`ed at the top of
`ui-kit.css` — required by the CSS spec to be the first rule in the file).

**Known trade-off:** a handful of very low-traffic literal hex values buried
in `style.css` (e.g. a few one-off inline `style="..."` attributes elsewhere
in the codebase, if any exist beyond the one already patched in `index.html`)
may not have been swept — the token remap covers everything driven by
`var(--dark)`/`var(--violet)` plus every hardcoded selector found during
this pass, but a full pixel-by-pixel repaint of all 39 pages' occasional
inline styles was out of scope for this round.

## Files touched this round
`assets/css/ui-kit.css`, `assets/js/app.js`, `assets/js/mada-mobile-ui.js`,
`business-register.html`, `business-onboarding.html`, `business-dashboard.html`,
`create-offer.html`, `index.html` (inline dark-panel fix), plus the 5 business
pages' uid fix and the 6 pages that had their static bottom nav removed.

## Still open (not touched this round)
Admin sub-pages (cities/staff/content/activity), calendars, auth/onboarding
pages beyond the business flow above — see the v8 `ROLLOUT-NOTES.md` for
what was already wired in the prior round. `business-welcome.html` is now
dead code. A full inline-style sweep for stray old hex values would be the
next polish pass if you want pixel-perfect consistency everywhere.
