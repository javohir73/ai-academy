# Dashboard / Overview IA Merge — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `/` a progress-aware home (marketing for new visitors, dashboard for returning), redirect `/dashboard` to `/`, and demote the Overview catalog to a browse-only `/learn` route.

**Architecture:** The URL stays the single source of navigation truth. `viewFromPath(pathname)` returns a *base* view; for `/` the final view is resolved in the App body from `pathname + progress.completedCount + auth.user + syncState` (a `deciding` shell covers the signed-in-but-still-fetching race). `/dashboard` redirects to `/` via an effect. `Overview.jsx` is renamed `Catalog.jsx` with its rival-home hero removed. A new `retrySync()` on `useProgress` powers the marketing-error Retry banner (Decision A).

**Tech Stack:** React 18, react-router-dom 6, Vite, Vitest + @testing-library/react.

**Spec:** `docs/superpowers/specs/2026-06-02-dashboard-overview-merge-design.md`

**Standing constraints:** No Supabase schema changes. Lesson IDs unchanged. No new dependencies. Uzbek = Latin script, modifier apostrophe `’` (U+2019), never `‘`/Cyrillic. EN + UZ strings always added in pairs.

---

## File Structure

- `src/hooks/useProgress.js` — MODIFY: add `retrySync()` + a `syncNonce` that re-arms the cloud merge.
- `src/components/Catalog.jsx` — CREATE (renamed from `Overview.jsx`), rival-home hero stripped.
- `src/components/Overview.jsx` — DELETE (replaced by Catalog).
- `src/components/HomeError.jsx` — CREATE: the quiet marketing Retry banner (Decision A).
- `src/components/HomePage.jsx` — MODIFY: accept + render an optional `errorSlot`.
- `src/components/Dashboard.jsx` — MODIFY: drop `onHome` prop + "Back to home"; keep one "Browse the curriculum" → `/learn`.
- `src/components/Sidebar.jsx` — MODIFY: Home + Curriculum active states (`view==='dashboard'` / `view==='catalog'`).
- `src/App.jsx` — MODIFY: progress-aware home, `deciding` shell, `/dashboard`→`/` redirect, `Overview`→`Catalog`, `goOverview`→`goCatalog`, lesson `onBack`→`/learn`, marketing error banner wiring.
- `src/i18n/strings.js` — MODIFY: new `nav.home`-as-label / `nav.curriculum`, `catalog.*` heading, `home.retry.*` (EN + UZ).
- `src/App.routing.test.jsx` — MODIFY: update `/learn` view class + add progress-aware/redirect/deciding/error tests.
- `src/components/Catalog.test.jsx` — CREATE: catalog renders cards, no resume hero.

---

## Task 1: Add `retrySync()` to useProgress

The cloud merge runs once per `userId` (guarded by `mergedForUser.current === userId`) and there is no way to re-trigger it after a failure. Decision A's Retry banner needs one. Add a `syncNonce` counter to the merge effect's deps and a `retrySync()` that clears the guard and bumps the nonce.

**Files:**
- Modify: `src/hooks/useProgress.js`
- Test: `src/hooks/useProgress.retry.test.jsx` (Create)

- [ ] **Step 1: Write the failing test**

Create `src/hooks/useProgress.retry.test.jsx`:

```jsx
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useProgress } from './useProgress.js'
import * as cloud from '../utils/cloudProgressService.js'

const USER = { id: 'u1', email: 'a@b.co' }

beforeEach(() => {
  localStorage.clear()
  vi.restoreAllMocks()
  vi.spyOn(cloud, 'isConfigured').mockReturnValue(true)
})

describe('useProgress retrySync', () => {
  it('re-runs the cloud merge after a failure when retrySync() is called', async () => {
    const fetchSpy = vi
      .spyOn(cloud, 'fetchProgress')
      .mockRejectedValueOnce(new Error('network'))
      .mockResolvedValueOnce({ onboarded: true, completed: {}, streak: { current: 0, longest: 0, lastDay: null }, updatedAt: null })
    vi.spyOn(cloud, 'saveProgress').mockResolvedValue()

    const { result } = renderHook(() => useProgress(USER))

    await waitFor(() => expect(result.current.syncState).toBe('error'))
    expect(fetchSpy).toHaveBeenCalledTimes(1)

    act(() => result.current.retrySync())

    await waitFor(() => expect(fetchSpy).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(result.current.syncState).toBe('saved'))
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/hooks/useProgress.retry.test.jsx`
Expected: FAIL — `result.current.retrySync is not a function`.

- [ ] **Step 3: Implement `retrySync` + `syncNonce`**

In `src/hooks/useProgress.js`:

Add a nonce state near the other state (after the `syncState` line, ~line 66):

```js
  const [syncNonce, setSyncNonce] = useState(0) // bump to force a cloud re-merge (manual retry)
```

In the sign-in merge effect, change the early guard so a retry can re-arm it, and add `syncNonce` to the dependency array. Replace the guard block at the top of the effect body (the `if (mergedForUser.current === userId) return` line, ~line 88) with:

```js
    // A retry (syncNonce bump) clears the guard so the same user re-merges.
    if (mergedForUser.current === userId) return
    mergedForUser.current = userId
```

(unchanged in body) and change the effect's dependency array (~line 115) from:

```js
  }, [userId])
```

to:

```js
  }, [userId, syncNonce])
```

Add the `retrySync` callback near the other callbacks (after `setOnboarded`, ~line 166):

```js
  // Manual retry for a failed cloud merge (used by the marketing-error banner).
  // Clears the per-user merge guard and bumps the nonce so the merge effect re-runs.
  const retrySync = useCallback(() => {
    if (!userId) return
    mergedForUser.current = null
    setSyncNonce((n) => n + 1)
  }, [userId])
```

Add `retrySync` to the returned object (in the final `return {...}`, after `syncState`):

```js
    retrySync,
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/hooks/useProgress.retry.test.jsx`
Expected: PASS.

- [ ] **Step 5: Run the full hook suite to confirm no regression**

Run: `npx vitest run src/hooks/`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/hooks/useProgress.js src/hooks/useProgress.retry.test.jsx
git commit -m "feat(progress): add retrySync() to re-run a failed cloud merge"
```

---

## Task 2: i18n strings (EN + UZ)

Add the new nav/catalog/retry strings. Existing `nav.overview` / `nav.dashboard` stay (still referenced until App+Sidebar are updated); we ADD new keys so nothing breaks mid-refactor.

**Files:**
- Modify: `src/i18n/strings.js`
- Test: `src/i18n/strings.test.js` (existing — guards key parity + empties)

- [ ] **Step 1: Add EN strings**

In `src/i18n/strings.js`, in the `en` block near the `nav.*` keys (~line 18), add:

```js
    'nav.curriculum': 'Curriculum',
    'catalog.title': 'Curriculum',
    'home.retry.message': 'Couldn’t load your progress.',
    'home.retry.action': 'Retry',
    'home.retry.aria': 'Retry loading your saved progress',
```

In the `en` block near `dash.foot.*` (~line 95), change the browse label and remove reliance on `dash.foot.home` (leave the key in place to avoid a parity break — it is simply no longer used):

```js
    'dash.foot.browse': 'Browse the curriculum',
```

- [ ] **Step 2: Add the matching UZ strings**

In the `uz` block near its `nav.*` keys (~line 509), add (Latin script, U+2019 apostrophes only):

```js
    'nav.curriculum': 'O’quv dasturi',
    'catalog.title': 'O’quv dasturi',
    'home.retry.message': 'Yutuqlaringizni yuklab bo’lmadi.',
    'home.retry.action': 'Qayta urinish',
    'home.retry.aria': 'Saqlangan yutuqlaringizni qayta yuklash',
```

In the `uz` block near `dash.foot.*` (~line 587), change:

```js
    'dash.foot.browse': 'O’quv dasturini ko’rish',
```

- [ ] **Step 3: Run the strings test**

Run: `npx vitest run src/i18n/strings.test.js`
Expected: PASS (EN/UZ key parity holds; no empty values; no `‘` U+2018).

- [ ] **Step 4: Commit**

```bash
git add src/i18n/strings.js
git commit -m "i18n: add nav.curriculum, catalog.title, home.retry.* (en + uz)"
```

---

## Task 3: Create Catalog.jsx (demoted Overview)

Copy `Overview.jsx` to `Catalog.jsx`, remove the rival-home hero (eyebrow/title/lead + Start/Continue/Review `btn-row`), and replace it with a light "Curriculum" heading + the existing curriculum note. Keep everything from the first `tracksWithOffsets.map` onward verbatim.

**Files:**
- Create: `src/components/Catalog.jsx`
- Test: `src/components/Catalog.test.jsx` (Create)

- [ ] **Step 1: Write the failing test**

Create `src/components/Catalog.test.jsx`:

```jsx
import { describe, it, expect, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithLang } from '../test/renderWithLang.jsx'
import Catalog from './Catalog.jsx'
import { LEVELS } from '../data/tracks.js'

const progressStub = {
  completedCount: 0,
  completed: {},
  isUnlocked: (i) => i === 0,
  starsFor: () => 0,
}

beforeEach(() => localStorage.clear())

describe('Catalog', () => {
  it('renders the curriculum heading and lesson cards', () => {
    renderWithLang(<Catalog progress={progressStub} currentIndex={0} onOpenLevel={() => {}} />)
    expect(screen.getByText('Curriculum')).toBeInTheDocument()
    // First lesson title shows as a browsable card.
    expect(screen.getByText(LEVELS[0].title)).toBeInTheDocument()
  })

  it('does NOT render the old resume hero CTA', () => {
    renderWithLang(<Catalog progress={progressStub} currentIndex={0} onOpenLevel={() => {}} />)
    // The Start/Continue/Review hero buttons are gone (those strings only lived in the hero).
    expect(screen.queryByText('Start the course')).not.toBeInTheDocument()
    expect(screen.queryByText('Continue learning')).not.toBeInTheDocument()
    expect(screen.queryByText('Review from the start')).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/components/Catalog.test.jsx`
Expected: FAIL — cannot find module `./Catalog.jsx`.

- [ ] **Step 3: Create `src/components/Catalog.jsx`**

Full file (header hero replaced; track/module mapping identical to Overview):

```jsx
import { ChevronRight, Lock } from 'lucide-react'
import { useLanguage } from '../i18n/useLanguage.js'
import { useLocalizedTracks } from '../i18n/useLocalizedTracks.js'
import { iconForLevel } from './levelIcons.js'
import Stars from './Stars.jsx'

/*
 * Catalog — the course's browse-and-discover view (App view 'catalog', URL
 * /learn). Demoted from the former Overview: the welcome eyebrow/title/lead and
 * the Start/Continue/Review hero were removed because the progress-aware home
 * (Dashboard) now owns "resume" and "welcome". This view is purely the lesson
 * grid — every track and lesson with concept text, lock/done state, and the
 * "unlock as you go" cue — so a learner can scan and pick what to open.
 */
export default function Catalog({ progress, currentIndex, onOpenLevel }) {
  const { t } = useLanguage()
  const { tracksWithOffsets } = useLocalizedTracks()

  return (
    <div>
      <header className="hero hero--catalog">
        <h1>{t('catalog.title')}</h1>
        <p className="muted" style={{ marginTop: 'var(--s2)' }}>
          {t('overview.curriculumNote.pre')}{' '}
          <span className="code-badge">Code</span>{t('overview.curriculumNote.post')}
        </p>
      </header>

      {tracksWithOffsets.map((track, ti) => {
        const trackLocked = !progress.isUnlocked(track.levels[0].index)
        const prevTrack = tracksWithOffsets[ti - 1]
        const lvl = Math.min(5, Math.max(0, parseInt(String(track.tag).replace(/\D/g, ''), 10) || ti))
        return (
          <section className="track-section" key={track.id} data-lvl={lvl} style={{ '--lvl-accent': `var(--lvl-${lvl})`, '--lvl-grad': `var(--lvl-${lvl}-grad)`, '--lvl-soft': `var(--lvl-${lvl}-soft)` }}>
            <div className="track-section__head">
              <span className={`track-chip${track.pro ? ' track-chip--pro' : ''}`}>
                {track.tag}
              </span>
              <h2>{track.title}</h2>
              <p className="muted" style={{ margin: 0 }}>
                {track.blurb}
              </p>
              <p className="track-count">
                {track.levels.length}{' '}
                {track.levels.length === 1 ? t('home.lesson.one') : t('home.lesson.many')}
                {' · '}
                {t('overview.unlockAsYouGo')}
              </p>
              {track.comingSoon && (
                <p className="track-comingsoon">{track.comingSoon}</p>
              )}
              {trackLocked && prevTrack && (
                <p className="track-locked track-locked--inline">
                  <Lock size={14} /> {t('overview.unlock.pre')}{prevTrack.tag}{t('overview.unlock.post')}
                </p>
              )}
            </div>

            <div className="module-list">
              {track.levels.map(({ level, index }, mapIndex) => {
                const Icon = iconForLevel(level.id)
                const locked = !progress.isUnlocked(index)
                const completed = Boolean(progress.completed[level.id])
                const isCurrent = !locked && !completed && index === currentIndex
                const cls = [
                  'module-card',
                  locked && 'module-card--locked',
                  completed && 'module-card--done',
                  isCurrent && 'module-card--current',
                ]
                  .filter(Boolean)
                  .join(' ')
                return (
                  <button
                    key={level.id}
                    className={cls}
                    style={{ '--i': mapIndex }}
                    disabled={locked}
                    onClick={() => onOpenLevel(index)}
                    aria-label={
                      locked
                        ? `${level.title}. ${t('overview.aria.locked')}`
                        : `${level.title}. ${
                            completed
                              ? `${t('overview.aria.completedPre')}${progress.starsFor(level.id)}${t('overview.aria.completedPost')}`
                              : t('overview.aria.open')
                          }`
                    }
                  >
                    <span className="module-icon" aria-hidden="true">
                      <Icon size={22} />
                    </span>
                    <span className="module-card__body">
                      <span className="module-card__index">{t('lesson.crumb')} {index + 1}</span>
                      <span className="module-card__title">
                        {level.title}
                        {level.kind === 'code' && <span className="code-badge">Code</span>}
                      </span>
                      <span className="module-card__concept">{level.concept}</span>
                    </span>
                    <span className="module-card__status">
                      {completed ? (
                        <Stars value={progress.starsFor(level.id)} size={15} />
                      ) : locked ? (
                        <Lock size={18} />
                      ) : (
                        <ChevronRight size={20} />
                      )}
                    </span>
                  </button>
                )
              })}
            </div>
          </section>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/components/Catalog.test.jsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/Catalog.jsx src/components/Catalog.test.jsx
git commit -m "feat(catalog): add demoted browse-only Catalog (Overview minus resume hero)"
```

---

## Task 4: HomeError banner + HomePage errorSlot

Create the quiet Retry banner and let HomePage render it.

**Files:**
- Create: `src/components/HomeError.jsx`
- Modify: `src/components/HomePage.jsx`

- [ ] **Step 1: Create `src/components/HomeError.jsx`**

```jsx
import { AlertCircle, RotateCcw } from 'lucide-react'
import { useLanguage } from '../i18n/useLanguage.js'

/*
 * HomeError — a quiet inline banner shown on the marketing home ONLY when a
 * signed-in, locally-empty user's cloud progress failed to load (Decision A in
 * the IA-merge spec). It does not block the page; it offers a single Retry that
 * re-triggers the cloud merge (progress.retrySync). When the fetch succeeds the
 * home re-resolves to the dashboard automatically.
 */
export default function HomeError({ onRetry }) {
  const { t } = useLanguage()
  return (
    <div className="home-error" role="status">
      <AlertCircle size={16} aria-hidden="true" />
      <span className="home-error__msg">{t('home.retry.message')}</span>
      <button className="home-error__retry" onClick={onRetry} aria-label={t('home.retry.aria')}>
        <RotateCcw size={14} aria-hidden="true" /> {t('home.retry.action')}
      </button>
    </div>
  )
}
```

- [ ] **Step 2: Add the `errorSlot` prop to HomePage**

In `src/components/HomePage.jsx`, change the signature (line 182) from:

```jsx
export default function HomePage({ onStart, onExplore, accountSlot }) {
```

to:

```jsx
export default function HomePage({ onStart, onExplore, accountSlot, errorSlot = null }) {
```

Then render `errorSlot` at the very top of the returned markup. Find the outermost returned element's opening (the first JSX node after `return (`) and insert `{errorSlot}` as its first child. Locate it:

Run: `grep -n "return (" src/components/HomePage.jsx | head -1`

Insert `{errorSlot}` immediately inside that top wrapper element so the banner sits above the marketing nav/hero.

- [ ] **Step 3: Add minimal banner styles**

In `src/styles/global.css`, append:

```css
/* Marketing-home progress-load error banner (IA merge, Decision A). */
.home-error {
  display: flex;
  align-items: center;
  gap: var(--s2, 8px);
  max-width: 1100px;
  margin: var(--s3, 12px) auto 0;
  padding: 10px 14px;
  border: 1px solid var(--orange, #f97316);
  border-radius: var(--r-md, 12px);
  background: var(--orange-soft, #fef0e6);
  color: var(--text, #1f2937);
  font-size: 0.9rem;
}
.home-error__msg { flex: 1; }
.home-error__retry {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 44px;
  padding: 6px 12px;
  border: 1px solid var(--orange, #f97316);
  border-radius: var(--r-pill, 999px);
  background: transparent;
  color: var(--orange-strong, #ea580c);
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}
```

- [ ] **Step 4: Verify build + existing HomePage usage compiles**

Run: `npx vitest run src/components/`
Expected: PASS (HomePage tests, if any, still pass with the new optional prop defaulting to null).

- [ ] **Step 5: Commit**

```bash
git add src/components/HomeError.jsx src/components/HomePage.jsx src/styles/global.css
git commit -m "feat(home): quiet Retry banner slot for failed cloud progress load"
```

---

## Task 5: Dashboard footer dedup

Drop "Back to home" (the dashboard is home). Keep one primary "Browse the curriculum" → `/learn`. Remove the `onHome` prop.

**Files:**
- Modify: `src/components/Dashboard.jsx`

- [ ] **Step 1: Remove `onHome` from the prop list + doc comment**

In `src/components/Dashboard.jsx`, remove the `onHome,` line from the destructured props (line 48) and delete the `*   onHome()     — go to the marketing home` doc line (line 39).

- [ ] **Step 2: Replace the footer**

Replace the footer block (lines 239–247):

```jsx
      {/* ---- Footer CTA -------------------------------------------------- */}
      <div className="dash-foot">
        <button className="btn btn--secondary" onClick={onHome}>
          {t('dash.foot.home')}
        </button>
        <button className="btn btn--primary" onClick={onOverview}>
          {t('dash.foot.browse')} <ArrowRight size={18} aria-hidden="true" />
        </button>
      </div>
```

with:

```jsx
      {/* ---- Footer CTA — the dashboard IS home, so one action: browse. -- */}
      <div className="dash-foot">
        <button className="btn btn--primary" onClick={onOverview}>
          {t('dash.foot.browse')} <ArrowRight size={18} aria-hidden="true" />
        </button>
      </div>
```

(`onOverview` is repointed to `/learn` by the App-side `goCatalog` rename in Task 6; the prop name on Dashboard stays `onOverview`.)

- [ ] **Step 3: Run the dashboard suite**

Run: `npx vitest run src/components/`
Expected: PASS. If a dashboard test asserts on the "Back to home" button, update it to assert the button is absent.

- [ ] **Step 4: Commit**

```bash
git add src/components/Dashboard.jsx
git commit -m "feat(dashboard): drop redundant Back-to-home; single Browse CTA (dashboard is home)"
```

---

## Task 6: App.jsx — progress-aware home, deciding shell, redirect, Catalog wiring

The core change. `viewFromPath` keeps returning a base view; the App body resolves the final `view` for `/` using progress + auth + syncState, renders a `deciding` shell, redirects `/dashboard`→`/`, swaps Overview→Catalog, renames `goOverview`→`goCatalog`, points the lesson `onBack` at the catalog, and wires the marketing error banner.

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Swap the import**

Change line 9 from:

```jsx
import Overview from './components/Overview.jsx'
```

to:

```jsx
import Catalog from './components/Catalog.jsx'
import HomeError from './components/HomeError.jsx'
```

- [ ] **Step 2: Update `viewFromPath` (base views only)**

Replace the function (lines 38–51) with:

```jsx
// Map a URL pathname to a BASE view + lesson index. The URL is the single
// source of navigation truth (deep-linkable, bookmarkable, back/forward-safe).
//   /                  → 'home'    (resolved to dashboard/home/deciding in the body)
//   /dashboard         → 'home'    (legacy; redirected to / by an effect)
//   /learn             → 'catalog' (the browse view)
//   /learn/:lessonId   → 'lesson'  (lessonId is the STABLE lesson id)
// An unknown lessonId falls back to the catalog so a bad link never crashes.
function viewFromPath(pathname) {
  if (pathname === '/dashboard') return { view: 'home', levelIndex: 0 }
  if (pathname === '/learn' || pathname === '/learn/') {
    return { view: 'catalog', levelIndex: 0 }
  }
  const lessonMatch = pathname.match(/^\/learn\/([^/]+)\/?$/)
  if (lessonMatch) {
    const lessonId = decodeURIComponent(lessonMatch[1])
    const idx = LEVELS.findIndex((l) => l.id === lessonId)
    if (idx >= 0) return { view: 'lesson', levelIndex: idx }
    return { view: 'catalog', levelIndex: 0 } // unknown id → the catalog
  }
  return { view: 'home', levelIndex: 0 }
}
```

- [ ] **Step 3: Resolve the progress-aware home in the body**

After `const { view, levelIndex } = viewFromPath(location.pathname)` (line 62), add the home resolution. `baseView` is what the path says; `view` is what we render:

```jsx
  // Progress-aware home: '/' shows the dashboard for returning learners and the
  // marketing page for new visitors. The one race is a signed-in user whose
  // local store is empty while the cloud fetch is in flight (or has errored):
  //   - syncing → 'deciding' (neutral shell, NOT marketing) until it resolves;
  //   - error   → marketing + a quiet Retry banner (spec Decision A).
  const { view: baseView, levelIndex } = viewFromPath(location.pathname)
  const hasProgress = progress.completedCount > 0
  const cloudPending =
    Boolean(auth.user) && progress.completedCount === 0 && progress.syncState === 'syncing'
  const cloudErrored =
    Boolean(auth.user) && progress.completedCount === 0 && progress.syncState === 'error'

  let view = baseView
  if (baseView === 'home') {
    if (hasProgress) view = 'dashboard'
    else if (cloudPending) view = 'deciding'
    else view = 'home'
  }
```

Then DELETE the now-duplicate original line 62 (`const { view, levelIndex } = viewFromPath(location.pathname)`).

- [ ] **Step 4: Redirect `/dashboard` → `/`**

Add an effect after the scroll-reset effect (after line 78):

```jsx
  // /dashboard is a legacy URL — the home (/) is now progress-aware and shows the
  // dashboard to returning learners. Keep old bookmarks working without creating
  // a second canonical URL for the same surface.
  useEffect(() => {
    if (location.pathname === '/dashboard') navigate('/', { replace: true })
  }, [location.pathname, navigate])
```

- [ ] **Step 5: Rename `goOverview` → `goCatalog`**

Replace the function (lines 143–146):

```jsx
  function goOverview() {
    setSidebarOpen(false)
    navigate('/learn')
  }
```

with:

```jsx
  function goCatalog() {
    setSidebarOpen(false)
    navigate('/learn')
  }
```

Update the THREE call sites (verified by grep — Sidebar `onOverview`, Dashboard `onOverview`, lesson `onBack`): change `onOverview={goOverview}` (lines 245 and 288) to `onOverview={goCatalog}`, and `onBack={goOverview}` (line 299) to `onBack={goCatalog}` (Decision: lesson Back → catalog).

- [ ] **Step 6: Point `goDashboard` at `/`**

Replace the function (lines 148–152):

```jsx
  function goDashboard() {
    progress.setOnboarded()
    setSidebarOpen(false)
    navigate('/dashboard')
  }
```

with:

```jsx
  function goDashboard() {
    progress.setOnboarded()
    setSidebarOpen(false)
    navigate('/')
  }
```

- [ ] **Step 7: Remove the now-dead `onHome` prop on Dashboard**

In the Dashboard render (lines 282–290), delete the `onHome={goHome}` line. Leave `goHome` itself (still used by the brand button and Sidebar) untouched.

- [ ] **Step 8: Render deciding shell + Catalog + marketing error banner**

Replace the `home` early-return block (lines 224–232):

```jsx
  // Home is a standalone full-bleed page (no sidebar chrome).
  if (view === 'home') {
    return (
      <main className="fade-in">
        <HomePage onStart={enterCourse} onExplore={exploreCurriculum} accountSlot={accountMenu} />
        {authChrome}
      </main>
    )
  }
```

with:

```jsx
  // Neutral "deciding" shell: a signed-in user with empty local progress while
  // the cloud merge is in flight. Show brand + a quiet spinner, never marketing
  // (which would flash before their dashboard resolves).
  if (view === 'deciding') {
    return (
      <main className="fade-in deciding">
        <div className="deciding__brand">AI Academy</div>
        <div className="deciding__spinner" aria-label={t('sync.syncing')} role="status" />
        {authChrome}
      </main>
    )
  }

  // Home is a standalone full-bleed page (no sidebar chrome). On a cloud-load
  // failure for a signed-in, locally-empty user, the marketing page also shows a
  // quiet Retry banner (Decision A) that re-triggers the merge.
  if (view === 'home') {
    return (
      <main className="fade-in">
        <HomePage
          onStart={enterCourse}
          onExplore={exploreCurriculum}
          accountSlot={accountMenu}
          errorSlot={cloudErrored ? <HomeError onRetry={progress.retrySync} /> : null}
        />
        {authChrome}
      </main>
    )
  }
```

- [ ] **Step 9: Swap the Overview render for Catalog**

In the content switch (lines 291–292), change:

```jsx
          ) : view === 'overview' ? (
            <Overview progress={progress} currentIndex={currentIndex} onOpenLevel={openLevel} />
```

to:

```jsx
          ) : view === 'catalog' ? (
            <Catalog progress={progress} currentIndex={currentIndex} onOpenLevel={openLevel} />
```

- [ ] **Step 10: Add the deciding-shell styles**

In `src/styles/global.css`, append:

```css
/* Neutral home shell while a signed-in user's cloud progress is resolving. */
.deciding {
  min-height: 100vh;
  display: grid;
  place-content: center;
  gap: var(--s4, 16px);
  justify-items: center;
}
.deciding__brand { font-weight: 700; font-size: 1.25rem; letter-spacing: -0.01em; }
.deciding__spinner {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 3px solid var(--surface-2, rgba(0, 0, 0, 0.1));
  border-top-color: var(--accent, #6366f1);
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) {
  .deciding__spinner { animation: none; }
}
```

- [ ] **Step 11: Run the routing + app suites**

Run: `npx vitest run src/App.routing.test.jsx`
Expected: the `/learn` test currently asserts `.layout` is present — still true. The `/` test asserts `.home__nav` present — still true for a fresh (no-progress) learner. Some may need the Task 7 updates; if they fail there, fix in Task 7.

- [ ] **Step 12: Commit**

```bash
git add src/App.jsx src/styles/global.css
git commit -m "feat(app): progress-aware home, deciding shell, /dashboard→/ redirect, Catalog wiring"
```

---

## Task 7: Sidebar active states + Curriculum label

The sidebar's two nav items map to the new views: Dashboard item is the Home entry (active on `view==='dashboard'`); the Overview item becomes "Curriculum" (active on `view==='catalog'`).

**Files:**
- Modify: `src/components/Sidebar.jsx`

- [ ] **Step 1: Update the catalog nav item active state + label**

In `src/components/Sidebar.jsx`, change the second nav button (lines 95–106): the active class condition from `view === 'overview'` to `view === 'catalog'`, and the label from `t('nav.overview')` to `t('nav.curriculum')`:

```jsx
      <button
        className={`nav__item${view === 'catalog' ? ' nav__item--active' : ''}`}
        onClick={onOverview}
        style={{ marginBottom: 'var(--s3)' }}
      >
        <span className="nav__status">
          <GraduationCap size={18} />
        </span>
        <span className="nav__body">
          <span className="nav__title">{t('nav.curriculum')}</span>
        </span>
      </button>
```

(The Dashboard nav item at lines 81–93 already keys off `view === 'dashboard'`, which is correct — no change.)

- [ ] **Step 2: Commit**

```bash
git add src/components/Sidebar.jsx
git commit -m "feat(sidebar): Curriculum label + catalog active state"
```

---

## Task 8: Delete Overview.jsx + update routing tests

Remove the dead component and update tests for the new view names and behaviors.

**Files:**
- Delete: `src/components/Overview.jsx`
- Delete: `src/components/Overview.test.jsx` (if it exists)
- Modify: `src/App.routing.test.jsx`

- [ ] **Step 1: Confirm Overview has no remaining importers**

Run: `grep -rn "components/Overview" src/`
Expected: no matches (Task 6 swapped the only importer). If any remain, fix them before deleting.

- [ ] **Step 2: Delete the files**

```bash
git rm src/components/Overview.jsx
git rm src/components/Overview.test.jsx 2>/dev/null || true
```

- [ ] **Step 3: Update + extend `src/App.routing.test.jsx`**

Replace the whole `describe('URL routing', ...)` block with the following (keeps the existing deep-link/locked/unknown tests, updates wording, and adds progress-aware/redirect/deciding/error coverage). The helper `renderAt` and `beforeEach` above it stay as-is:

```jsx
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App.jsx'
import { LanguageProvider, LANG_STORAGE_KEY } from './i18n/LanguageProvider.jsx'
import { LEVELS } from './data/tracks.js'

const PROGRESS_KEY = 'ai-academy:progress.v1'

beforeEach(() => {
  localStorage.clear()
  localStorage.setItem(LANG_STORAGE_KEY, 'en')
})

function renderAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </MemoryRouter>,
  )
}

function seedProgress() {
  // One completed lesson → hasProgress is true on first paint (synchronous read).
  localStorage.setItem(
    PROGRESS_KEY,
    JSON.stringify({ onboarded: true, completed: { [LEVELS[0].id]: 3 }, streak: { current: 1, longest: 1, lastDay: null } }),
  )
}

describe('URL routing', () => {
  it('/ renders marketing Home for a new visitor (no progress)', () => {
    renderAt('/')
    expect(document.querySelector('.home__nav')).toBeInTheDocument()
  })

  it('/ renders the Dashboard for a returning learner (has progress)', () => {
    seedProgress()
    renderAt('/')
    expect(document.querySelector('.home__nav')).not.toBeInTheDocument()
    expect(document.querySelector('.dash')).toBeInTheDocument()
  })

  it('/dashboard redirects to / (no second canonical URL)', async () => {
    seedProgress()
    renderAt('/dashboard')
    // Redirect lands on / which (with progress) shows the dashboard.
    await waitFor(() => expect(document.querySelector('.dash')).toBeInTheDocument())
  })

  it('/learn renders the Catalog (browse view), not Home', () => {
    renderAt('/learn')
    expect(document.querySelector('.home__nav')).not.toBeInTheDocument()
    expect(document.querySelector('.layout')).toBeInTheDocument()
    expect(screen.getByText('Curriculum')).toBeInTheDocument()
  })

  it('/learn/:lessonId deep-links straight into that lesson', () => {
    const first = LEVELS[0].id
    renderAt(`/learn/${first}`)
    expect(document.querySelector('.home__nav')).not.toBeInTheDocument()
    expect(document.querySelector('.lesson-head__crumb')).toBeInTheDocument()
  })

  it('a deep link to a LOCKED lesson redirects to the catalog', () => {
    const locked = LEVELS[LEVELS.length - 1].id
    renderAt(`/learn/${locked}`)
    expect(document.querySelector('.home__nav')).not.toBeInTheDocument()
    expect(document.querySelector('.layout')).toBeInTheDocument()
  })

  it('an unknown lesson id falls back to the catalog, never crashes', () => {
    renderAt('/learn/this-lesson-does-not-exist')
    expect(document.querySelector('.layout')).toBeInTheDocument()
  })
})
```

- [ ] **Step 4: Run the routing suite**

Run: `npx vitest run src/App.routing.test.jsx`
Expected: PASS (all 7 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/Overview.jsx src/components/Overview.test.jsx src/App.routing.test.jsx
git commit -m "test+chore: delete Overview, route tests for progress-aware home + catalog"
```

---

## Task 9: Full suite, build, manual smoke

**Files:** none (verification only).

- [ ] **Step 1: Full test suite**

Run: `npx vitest run`
Expected: PASS. Fix any test that referenced `view === 'overview'`, the old `Overview` component, or the removed "Back to home" button.

- [ ] **Step 2: Production build**

Run: `npm run build`
Expected: build succeeds; no missing-import errors for `Overview`.

- [ ] **Step 3: Manual smoke (dev server)**

Run: `npm run dev`, then verify in the browser:
- `/` fresh (clear localStorage) → marketing home.
- Complete a lesson, return to `/` → dashboard.
- `/dashboard` → URL becomes `/`, dashboard shows.
- `/learn` → catalog (cards + concepts, no resume hero); sidebar "Curriculum" active.
- Open a lesson, click Back → lands on `/learn`.
- Switch to Uzbek → "Curriculum" reads "O’quv dasturi"; no English leaks in the catalog heading or retry strings.

- [ ] **Step 4: Final commit (if any smoke fixes)**

```bash
git add -A
git commit -m "fix: IA merge smoke-test adjustments"
```

---

## Self-Review Notes (author)

- **Spec coverage:** Section 1 (progress-aware `/`, deciding, `/dashboard`→`/` redirect, `/learn`→catalog) → Tasks 6, 8. Decision A (marketing + Retry banner) → Tasks 1, 4, 6. Decision B (demote, not delete) → Tasks 3, 8. Section 2 component changes → Tasks 3 (Catalog), 5 (Dashboard footer), 4 (HomePage slot), 7 (Sidebar), 6 (App). i18n → Task 2.
- **Fourth `goOverview` site:** Task 6 Step 5 explicitly updates all three call sites of the renamed function including the lesson `onBack` (→ catalog, the spec decision).
- **`onHome` prop vs `goHome` function:** Task 5 + Task 6 Step 7 remove only the Dashboard *prop*; `goHome` stays for the brand button + Sidebar.
- **Retry reality:** `useProgress` had no retry path; Task 1 adds `retrySync()` (the spec's Retry banner depends on it). This was discovered by reading the hook and is the one addition beyond the spec's component list.
- **Type/name consistency:** view string `'catalog'` used identically across App `viewFromPath`, App render switch, and Sidebar active state. `goCatalog` replaces `goOverview` everywhere. `errorSlot` prop name matches between HomePage and App.
