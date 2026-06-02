# Dashboard / Overview IA Merge — Design

**Date:** 2026-06-02
**Status:** Approved (design phase)

## Problem

The app has three top-level surfaces that overlap in role:

- **HomePage** (`/`) — marketing landing for new visitors.
- **Dashboard** (`/dashboard`) — resume hero, stats, per-level rollup for returning learners.
- **Overview** (`/learn`) — a full browsable catalog that *also* carried a welcome
  eyebrow/title/lead hero and a Start/Continue/Review CTA, making it read as a second
  "home" competing with the Dashboard.

Two things behaved like the home (Dashboard and Overview) and the canonical entry
point (`/`) ignored returning users entirely — they always landed on marketing. The
goal: **one home** that adapts to the visitor, with the catalog kept but demoted to a
pure browse view.

## Confirmed code facts (verified against source, not assumed)

1. **Progress is synchronous on first paint.** `useProgress` reads localStorage via
   `useState(loadInitial)` (synchronous initializer), so `progress.completedCount` is
   correct on the first render for the common case. No flash-of-marketing for returning
   local users.
2. **The one real race** is a signed-in user whose local store is empty while the cloud
   fetch is in flight (`syncState === 'syncing'`). For them `completedCount === 0`
   momentarily even though they have remote progress.
3. **Dashboard `LevelCard` is a per-level rollup only** — it has no per-lesson detail
   and no `concept` text. It cannot replace the catalog's browse affordance, so the
   catalog must survive as its own route.
4. **The Sidebar is navigation, not a catalog.** It lists all lessons as a nav list
   (an affordance to *jump*), not a browse-and-discover surface with concepts/blurbs.
5. **`HomePage` `onExplore` scrolls to a `#curriculum` section on the marketing page
   itself** — it is NOT an Overview entry point and is unaffected by this change.

## Section 1 — Routing & progress-aware home (LOCKED)

`viewFromPath(pathname)` becomes progress-aware for `/`:

- `/` → `hasProgress ? 'dashboard' : 'home'`, where
  `hasProgress = progress.completedCount > 0` (synchronous; see fact 1).
- **Deciding state:** when `user && completedCount === 0 && syncState === 'syncing'`
  (fact 2), render a neutral home shell — the app layout with brand + a quiet spinner,
  **not** marketing — so a signed-in user with remote-only progress doesn't flash the
  marketing page before the dashboard resolves. Derived from state, not stored.
- `/dashboard` → `<Navigate to="/" replace />`. No second canonical URL for the home;
  legacy bookmarks still work; `replace` keeps the redirect out of history.
- `/learn` → `'catalog'` (renamed from `'overview'`).
- `/learn/:lessonId` → `'lesson'` (locked/unknown lesson redirect to `/learn`
  unchanged from the existing router work).

### Decision A — cloud-load FAILURE state (signed-in, locally empty, `syncState === 'error'`)

**Marketing + quiet Retry banner.** Render the marketing home normally (the safe,
non-broken default), PLUS a subtle inline Retry banner shown only when
`user && completedCount === 0 && syncState === 'error'`. The banner reads "Couldn't load
your progress" with a Retry action that re-triggers the cloud fetch. This avoids both a
blank error screen and silently hiding a returning user's progress behind marketing with
no recourse.

### Decision B — keep the catalog, demoted (not deleted)

`catalog` is the existing Overview component **renamed `Catalog`** and stripped of its
rival-home framing (see Section 2). This is a conscious shift from an earlier "delete
Overview" idea to "demote Overview to a non-home catalog route" — justified by facts 3
and 4 (neither the Dashboard rollup nor the Sidebar nav provides a browse surface).

## Section 2 — Component changes (APPROVED)

### `Catalog.jsx` (rename of `Overview.jsx`, demoted)

- **Remove** the rival-home hero: the `overview.eyebrow` / `overview.title` /
  `overview.lead` block and the Start/Continue/Review `btn-row`. These duplicate the
  Dashboard's resume hero.
- **Keep:** a lighter page heading (a simple "Curriculum" title + the curriculum note
  about Code badges), the per-track sections, the lesson-card grid with `concept`, the
  "N lessons · unlock as you go" cue, lock/done state, and `onOpenLevel`.
- Net effect: stops competing as a home; reads as a browse view.

### `Dashboard.jsx` (now the home at `/`)

- **Footer:** drop "Back to home" (the dashboard *is* home). Keep one primary
  **"Browse the curriculum" → `/learn`**.
- The "Full course overview" link on the levels section → repoint to `/learn`.
- Remove the `onHome` prop (no longer meaningful from the home itself).

### `HomePage.jsx` (marketing, shown at `/` only to new visitors)

- Content unchanged. `onStart` (enter course) and `onExplore` (scroll within the page)
  stay. Add wiring for the Decision A Retry banner (rendered when the
  marketing-error condition holds).

### `Sidebar.jsx`

- "Dashboard" nav item → it points to the home (`/`); treat as the **Home** entry.
- "Course overview" nav item → repoint to `/learn`; rename label to **Curriculum**.
- Active state: `view === 'dashboard'` highlights Home; `view === 'catalog'`
  highlights Curriculum.

### `App.jsx`

- `viewFromPath` per Section 1; render `home` / `dashboard` / `catalog` / `lesson` /
  the deciding shell.
- `goOverview` → renamed `goCatalog`, `navigate('/learn')`.
- `goDashboard` → `navigate('/')`.
- `enterCourse` logic unchanged (new → first lesson; returning → `/`).
- Add the deciding-shell render and the marketing-error Retry banner wiring.

### i18n strings

- New/renamed `nav` labels: **Home**, **Curriculum**.
- Catalog heading string (reuse/repurpose `nav.overview` → a "Curriculum" title).
- Retry banner strings (message + Retry action), en + uz.

## Out of scope

- No Supabase schema changes.
- Lesson IDs unchanged (deep links stable).
- No new dependencies.

## Testing

- Routing tests (extend `App.routing.test.jsx`): `/` with progress → dashboard view;
  `/` without progress → marketing; `/dashboard` → redirect to `/`; `/learn` → catalog;
  deciding state renders the neutral shell (not marketing) when
  signed-in + empty + syncing; marketing-error renders the Retry banner.
- Catalog renders lesson cards with concepts and no resume hero.
- i18n: new strings present in both locales (existing strings test guards empties).
