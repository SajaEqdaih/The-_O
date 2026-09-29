# MADA Oman — v8 Data-Driven Build

## Start here
Open `index.html` in a browser (or serve the folder locally — no build step needed).
Everything persists to `localStorage`; open dev tools → Application → Local Storage
to inspect the `mada_db_v1` record, or run `MadaDB.resetDb()` in the console to
reseed demo data at any time.

## New shared architecture (loaded on all 39 pages)
- `assets/js/data-service.js` — `window.MadaDB`. Firestore-shaped collections
  (`offers`, `applications`, `users`, `notifications`) with full CRUD. Swapping
  the body of each method for real Firebase calls later needs **zero HTML changes**.
- `assets/js/ui-kit.js` — `window.MadaUI`. Toasts, promise-based confirm modals,
  a generic dialog builder, skeleton loaders, number-counter animation, ripple
  feedback, image-upload preview, star ratings. Also adds a site-wide
  confirmation guard: any `data-logout` link or `data-confirm-danger="..."`
  button automatically gets a confirmation modal — no extra JS needed per page.
- `assets/css/ui-kit.css` — safe-area insets, 44px touch targets, 16px form
  inputs (avoids iOS zoom-on-focus), skeletons, modals, dark-mode coverage.

## Fully wired end-to-end (real data, not mock text)
- **Discover (`index.html`)** — live city/category filter chips on the offer grid.
- **Influencer apply (`influencer-offer.html`)** — proposal-note modal → `createApplication`.
- **Influencer tracking (`influencer-my-offers.html`)** — status pipeline, filter
  chips with live counts, proof-of-delivery modal, star-rating modal — all
  rendered from `MadaDB`, nothing hardcoded.
- **Create offer (`create-offer.html`)** — real form → `createOffer`, with
  image-upload preview.
- **Applicants (`applicants.html`)** — accept / reject / negotiate / review-proof,
  each behind a confirm modal, each persisted via `MadaDB`.
- **Business offers (`business-my-offers.html`)** — live list with applicant
  counts and a close-offer action.
- **Notifications** (both roles) and **`business-analytics.html`** — live data
  with animated counters.
- **Admin** — verifications "موافقة", disputes "حل النزاع / تصعيد", and users
  "تعليق" all run through the same confirm-modal + toast pattern; the overview
  stat blends in real offer counts.
- **Site-wide** — every "تسجيل الخروج" (logout) link now confirms first.

## Still static mockups (by design, left for a follow-up pass)
`admin-cities.html`, `admin-staff.html`, `admin-content.html`, `admin-activity.html`,
`business-calendar.html`, `influencer-calendar.html`, `relationship-details.html`,
`platform-guide.html`, the auth/register/onboarding pages, and `search.html`
(admin global search) are unchanged content-wise — they already get the new
CSS/toast/modal/ripple kit for free, but their data isn't pulled from `MadaDB`.
They follow the exact same pattern as `applicants.html` if you want them wired next.

## Known trade-offs
- Demo data assumes a single logged-in influencer (`inf_sara`) and business
  (`biz_luna`) — there's no real auth, matching the rest of the prototype.
- `index.html`'s offer cards are still authored HTML (for the hand-tuned photo
  hero treatment) with filtering layered on top via data attributes, rather than
  being rendered from `MadaDB` — intentional, to preserve the visual design.
