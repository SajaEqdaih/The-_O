# MADA Oman — v10 "Center FAB & Smart Draft" Build

## Start here
Open `index.html`. Data still persists to `localStorage` (`mada_db_v1` for
data, `mada_user_session`/`mada_user_role`/`mada_registered` for auth state).
`MadaDB.resetDb()` in the console reseeds demo data at any time.

## 1) Smart Offer Creation & AI Description Assistant
`create-offer.html`'s description field now has a small emerald capsule
button ("✨ صياغة ذكية") on the same line as its label, opposite side per RTL.
Clicking it: shows a 1s spin/pulse loading state, looks up the signed-in
business's registered category via `MadaDB.getUserProfile()`, fills the
description with category-matched copy, auto-fills Rules/Deliverables/Seats/
Followers **only if they're currently empty**, glows each newly-filled field,
and shows the "تمت الصياغة!" confirmation badge. Arriving from onboarding
(`?from=onboarding`) now auto-triggers this once, half a second after load,
so the first-offer draft is genuinely "ready" rather than requiring an extra
click. All fields autosave (debounced 500ms) to `mada_draft_offer` and
restore with a toast on next visit; the draft is cleared on successful
publish.

## 2) "Style 06" Center FAB bottom dock + chatbot reposition
Replaced the plain bottom-nav bar from the previous round with the
requested detached, floating dock: `rgba(255,255,255,.95)` + blur, rounded
20px, sitting 12px off the screen edges, with a raised 56px indigo FAB in
the middle whose destination and icon change by role (business → `+` create
offer, creator → `✨` explore, guest → `🚀` join). Tab sets on either side of
the FAB match the spec exactly for each role. Still hidden entirely at
`≥768px` in favor of the normal header nav. Body spacer bumped to 96px.
Chatbot launcher shrunk to 44px, floats at `calc(92px + safe-area)` above
the dock, solid emerald. It now hides on **any** active scroll (not just
heavy-form pages) and restores ~500ms after scrolling stops, in addition to
hiding whenever a text field has focus (mobile keyboard).

## 3) Business onboarding & dashboard state machine
Carried forward unchanged from the previous round (already matched this
round's spec closely): register → interactive 3-step checklist
(`business-onboarding.html`, driven by live `MadaDB` state) → `create-offer.html`
(now with the Smart Draft auto-triggered) → `business-dashboard.html` empty
state when zero offers exist.

## 4) Core architectural utilities
- **Auth route guarding** — new in `app.js`. An explicit whitelist (not
  prefix-guessing, so marketing pages like `business-plans.html` stay open)
  of business/influencer dashboard pages now redirects unauthenticated
  visitors to `login.html?return=<page>`. "Authenticated" means an explicit
  registration or login happened in this browser (`mada_user_session` or
  `mada_registered`), never the page's own `data-role` attribute — that
  attribute is a display fallback only and must not be able to satisfy the
  guard. `login.html` was rewritten to actually honor `?return=`: since this
  prototype has no real backend, a fresh login infers role from whichever
  protected page you were trying to reach (or resumes your own role/uid if
  you've registered before in this browser), sets the session, and sends
  you back.
- **Toast engine** — `window.showToast(message, type)` added as a stable
  entry point; it delegates to `MadaUI.toast` (unchanged).
- **Mobile modal history trap** — `ui-kit.js`'s `confirm()` and
  `openDialog()` now push a history entry on open and listen for
  `popstate`, so the hardware/gesture back button closes the modal instead
  of leaving the page. A real dismiss (button/overlay/Escape) calls
  `history.back()` first to consume that entry cleanly, so back doesn't
  need pressing twice afterward.
- **Confirmation bottom sheet** — no new component needed: the existing
  `MadaUI.confirm()` modal now renders as a native-like bottom sheet
  (slides up, rounded top corners, drag handle) under 640px via CSS only,
  and stays a centered dialog above that.
- **Skeleton loaders** — already existed from earlier rounds (`MadaUI.skeleton`);
  no changes needed.
- **Offline awareness** — new slate top banner in `app.js`/`ui-kit.css`
  listening to `online`/`offline`, with a "تم استعادة الاتصال" toast on
  reconnect.

## Design tokens
`--accent` (CTA / FAB) updated to `#5465FF` per this round's brief (was
`#4F46E5` last round — both were offered as acceptable; this round named
`#5465FF` first against "CTA & Floating Actions" specifically, and since the
Center FAB is the marquee element this round, that's the one now live).
Emerald brand, soft slate canvas, and IBM Plex Sans Arabic are unchanged
from the previous round.

## Files touched this round
`assets/css/ui-kit.css`, `assets/js/app.js` (full rewrite), `assets/js/ui-kit.js`
(modal history trap — not in the requested file list, but the change lives
where the modal implementation already is), `create-offer.html`,
`business-register.html` / `influencer-register.html` (small `mada_last_uid`
addition so login can restore a real registrant's own uid, not just the
demo one), `login.html` (rewritten to support `?return=`).
`business-onboarding.html` was reviewed and needed no changes this round.

## Known trade-offs / what to test first
- Route guarding means opening a business/creator dashboard page in a
  fresh/incognito browser now bounces to `login.html` — register via
  `business-register.html` or `influencer-register.html` first, or log in
  once you've already registered in that browser.
- There's still no real backend or password check; `login.html`'s role
  inference is an honest, documented stand-in for that, not a security
  boundary.
- Admin/owner pages remain unguarded and without a bottom dock, unchanged
  from prior rounds (out of scope for this pass).
